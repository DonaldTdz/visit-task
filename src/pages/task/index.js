Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' }
  },
  onLoad(query) {
    dd.getAuthCode({
      success: (res) => {
        console.log('My authCode', res.authCode);
        dd.httpRequest({
          url: 'http://localhost:21021/api/services/app/Employee/GetDingDingUserByCodeAsync',
          method: 'Get',
          data: {
            code: res.authCode,
          },
          dataType: 'json',
          success: (res) => {
            //console.log('res', res);
            var app = getApp();
            app.userInfo = res.data.result;
            console.log('app user info', app.userInfo);
            this.setData({ userInfo: app.userInfo });
            //this.userInfo = res.data.result;
            //dd.alert({ content: 'success' });
          },
          fail: function(res) {
            dd.alert({ content: 'fail' });
          },
          complete: function(res) {
            dd.hideLoading();
            dd.alert({ content: 'complete' });
          }
        });
      },
      fail: function(err) {
      }
    });
    console.info(`app userinfo: ${JSON.stringify(this.userInfo)}`);
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
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
