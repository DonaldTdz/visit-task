let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    items: [
      {
        title: '备耕（技术服务）',
        thumb: '../../image/warn.png',
        brief: '已拜访1次共2次',
        brief2: '截止时间：2018-09-19',
        extra:'剩余1天',
        arrow: true,
      },
      {
        title: '田管（技术服务）',
        thumb: '../../image/warn_y.png',
        brief: '已拜访0次共2次',
        brief2: '截止时间：2018-09-19',
        extra: '剩余5天',
        arrow: true,
      },
      {
        title: '物资发放（生产管理）',
        thumb: '../../image/icon-tasknor.png',
        brief: '已拜访0次共2次',
        brief2: '截止时间：2018-09-19',
        extra: '剩余10天',
        arrow: true,
      },
    ],

  },
  onLoad(query) {
    console.info(`app.globalData: ${JSON.stringify(app.globalData)}`);
    if (app.globalData.userInfo.id == ''){
      dd.showLoading();
      //免登陆
      dd.getAuthCode({
        success: (res) => {
          console.log('My authCode', res.authCode);
          dd.httpRequest({
            url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
            method: 'Get',
            data: {
              code: res.authCode,
            },
            dataType: 'json',
            success: (res) => {
              //console.log('res', res);
              app.globalData.userInfo = res.data.result;
              //console.log('app user info', app.userInfo);
              this.setData({ userInfo: app.globalData.userInfo });
              //this.userInfo = res.data.result;
              //dd.alert({ content: 'success' });
            },
            fail: function(res) {
              dd.alert({ content: 'fail' });
            },
            complete: function(res) {
              dd.hideLoading();
              //dd.alert({ content: 'complete' });
            }
          });
        },
        fail: function(err) {
        }
      });
    } else{
      this.setData({ userInfo: app.globalData.userInfo });
    }
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
