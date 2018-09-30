let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    items: [],
  },
  onLoad(query) {
    //console.info(`app.globalData: ${JSON.stringify(app.globalData)}`);
    this.loginSys();
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    //dd.alert({ content: "onLoad" });
  },
  loginSys(){
    if (app.globalData.userInfo.id == '') {
      dd.showLoading();
      //免登陆
      //dd.getAuthCode({
        //success: (res) => {
        //  console.log('My authCode', res.authCode);
          dd.httpRequest({
            url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
            method: 'Get',
            data: {
              code: '',//res.authCode,
            },
            dataType: 'json',
            success: (res) => {
              //console.log('res', res);
              app.globalData.userInfo = res.data.result;
              //console.log('app user info', app.userInfo);
              this.setData({ userInfo: app.globalData.userInfo });

              this.getScheduleTasks();
              //this.userInfo = res.data.result;
              //dd.alert({ content: 'success' });
            },
            fail: function(res) {
              dd.alert({ content: '获取用户信息异常' });
            },
            complete: function(res) {
              dd.hideLoading();
              //dd.alert({ content: 'complete' });
            }
          });
        //},
        //fail: function(err) {
        //  dd.alert({ content: '授权出错' });
        //  dd.hideLoading();
        //}
      //});
    } else {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getScheduleTasks();
    }
  },
  getScheduleTasks(){
    //dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingScheduleTaskListAsync',
      method: 'Get',
      data: {
        userId: this.data.userInfo.id,
      },
      dataType: 'json',
      success: (res) => {
        this.setData({ items: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取任务异常' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },
  goDetalil(data){
    //console.info(`dd data: ${JSON.stringify(data)}`);
    dd.navigateTo({
      url: "./task-detail/task-detail?id=" + this.data.items[data.index].id,
    });
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    //dd.alert({ content: "显示了"});
    // 页面显示
    this.getScheduleTasks();
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '当前任务',
      desc: '当前任务列表',
      path: 'pages/task/index',
    };
  },
});
