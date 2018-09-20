Page({
  data:{
    id:''
  },
  onLoad(query) {
    this.setData({id: query.id});
    // 页面加载
    console.info(`task-detail Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '任务详情',
      desc: '任务详情页',
      path: 'pages/task/task-detail/task-detail',
    };
  },
});
