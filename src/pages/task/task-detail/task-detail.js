let app = getApp();
Page({
  data: {
    id: '',
    schedule: {},
    growers: [],
    tabs: [
      { title: '待完成' },
      { title: '已完成' },
    ],
    tabIndex: 1,
    status: 3,
    nodataStr: '没有需要拜访的烟农',
  },
  onLoad(query) {
    this.setData({ id: query.id });
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
    console.log(this.data.status)
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingTaskInfoAsync',
      method: 'Get',
      data: {
        scheduleTaskId: this.data.id,
        uid: app.globalData.userInfo.id,
        status: this.data.status,
      },
      dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        const gdata = res.data.result;
        this.setData({ schedule: gdata });
        //console.info("status:" + this.data.status);
        if(this.data.status == 3){
          this.setData({ growers: gdata.unCompleteGrowers });
        } else {
          this.setData({ growers: gdata.completeGrowers });
        }
      },
      fail: function (res) {
        dd.alert({ content: '获取任务详情异常', buttonText: '确定' });
      },
      complete: function (res) {
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
  handleTabClick({ index }) {
    this.data.status = index == 0 ? 3 : 2;
    var str = index == 0 ? '没有待完成数据' : '没有已完成数据';
    this.setData({ nodataStr: str });
    //this.getTaskDetail();
     if(this.data.status == 3){
          this.setData({ growers: this.data.schedule.unCompleteGrowers });
        } else {
          this.setData({ growers: this.data.schedule.completeGrowers });
        }
  }
});
