const lgPreset = {
  httpParser: [
    {
      from: 'http://www.lg.gov.cn/header/header.html',
      to: `<!--#include virtual="/header/header.html"-->`,
    },
    {
      from: 'http://www.lg.gov.cn/resource/resource.html',
      to: '<!--#include virtual="/resource/resource.html"-->',
    },

    {
      from: 'http://www.lg.gov.cn/footer/footer.html',
      to: '<!--#include virtual="/footer/footer.html"-->',
    },
  ],
  strParser: [
    {
      from: `<meta name="ColumnName" content="信息公开" >
<meta name="ColumnDescription" content="龙岗区公开发布的信息公开等内容">
<meta name="ColumnKeywords" content="信息公开,龙岗政府在线">
<meta name="ColumnType" content="信息公开">
<meta name="ColumnId" content="19370">
<link id="canonical" rel="canonical" href="http://www.lg.gov.cn/xxgk/index.html" />
<meta name="filing" mark='0' content="0">`,
      to: '<NFC_INCLUDE id="127589" />',
    },
  ],
  textInterpolation: {
    NFC_CATEGORY: {
      id: '105862',
      name: '项目内容',
    },
  },
}

export default {
  lg: lgPreset,
  cmsPro: cmsProPreset,
}
