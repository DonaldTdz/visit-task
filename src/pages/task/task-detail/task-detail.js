let app = getApp();
Page({
  data:{
    id:'',
    schedule: {},
  },
  onLoad(query) {
    this.setData({id: query.id});
    //this.getTaskDetail();
    // 页面加载
    //console.info(`task-detail Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onShow() {
    //dd.alert({ content: "显示了"});
    // 页面显示
    this.getTaskDetail();
  },
  getTaskDetail() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingTaskInfoAsync',
      method: 'Get',
      data: {
        scheduleTaskId: this.data.id,
        uid: app.globalData.userInfo.id,
      },
      dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        this.setData({ schedule : res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取任务详情异常', buttonText: '确定'});
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  goVisit(data) {
    dd.navigateTo({
      url: "../visit/visit?id=" + this.data.schedule.growers[data.index].id,
    });
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
