import axios from 'axios'
import Preset from './presets.js'
const NFCCommentRegex = /\{#[\w\W]+?#\}/gm

/* 在link 、 script 、img 标签中添加 remote 属性 将加入/_src/，然后进行单独代理 */
function transiformSrc(html) {
  let reg = /<.*?remote.*?(?:src|href)="(.*?)".*?>/g
  let res
  while ((res = reg.exec(html))) {
    let url = res[1]
    html = html.replace(url, '/_src/' + url)
  }

  return html
}

// const cmsProTagReg = /<((?=cmspro_)\w+)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gim
/*
 将全部cmsPro标签替换成空
 */

function transformcmsProTagToEmpty(html) {
  const cmsProTagReg = /<(?=cmspro_)\w+\b[^<]*>|<\/(?=cmspro_)\w+\b[^<]*?>/gim
  return html.replace(cmsProTagReg, '')
}

export default function (config) {
  if (typeof config === 'object') return transform(config)
  else if (typeof config === 'string' && Preset[config])
    return transform(Preset[config])
  else throw new Error('Invalid preset')
}

function transform(config = {}) {
  const {
    httpParser = [],
    strParser = [],
    removeNfcComment = true,
    textInterpolation = {},
  } = config
  return {
    name: 'template-transformer',
    async transformIndexHtml(html, ctx) {
      if (!ctx?.server?.config?.env?.DEV) return html

      /* 公共处理 */
      /* 在link 、 script 、img 标签中添加 remote 属性 将加入/_src/，然后进行单独代理 */
      html = transiformSrc(html)

      // 替换通过链接<!--#include virtual="/header/header.html"-->的内容，httpParser属性 ，请求from的内容，并将内容替换掉to的字符
      for (let i = 0; i < httpParser.length; i++) {
        const { from, to } = httpParser[i]
        let res = await axios.get(from).catch(console.error)
        if (res) html = html.replace(to, res.data)
      }

      /* 南方网模板处理 */
      // 替换注释 nfc 注释 {# ... #}
      if (removeNfcComment) {
        html = html.replace(NFCCommentRegex, '')
      }

      // 替换通过<nfc_include>标签的内容 strParser 属性添加替换目标 from 替换成 to的内容
      for (let i = 0; i < strParser.length; i++) {
        const { from, to } = strParser[i]
        html = html.replace(to, from)
      }

      // 插值替换
      Object.entries(textInterpolation).forEach(([key, value]) => {
        //key ： NFC_CATEGORY
        //value ： {id: '127589', name: '信息公开'}

        Object.entries(value).forEach(([key2, value2]) => {
          //key2 ： id
          //value2 ： '127589'
          let reg = new RegExp(`\\{\\{${key}\\.${key2}\\}\\}`, 'g')
          html = html.replace(reg, value2)
        })
      })

      /* 南方网中 {{...}} 清空 */
      html = html.replace(/\{\{[\w\W]*?\}\}/gm, '')

      /* 将全部cmsPro标签替换成空 */
      html = transformcmsProTagToEmpty(html)
      return html
    },
  }
}
