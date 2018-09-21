let app = getApp();
Page({
  data: {  
    visits:[{
      location:'东方希望天祥广场',
      creationTimeFormat:'2018-09-21 18:21'
    }, 
    {
        location: '东方希望天祥广场 A座',
        creationTimeFormat: '2018-09-20 18:21'
      }],
  },
  onLoad(query) {
    // 页面加载
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拜访详情',
      desc: '拜访详情页',
      path: 'pages/task/visit/visit',
    };
  },
});
