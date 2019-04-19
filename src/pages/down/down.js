let app = getApp();
Page({
  data: {
    info: {},
    version:"",
    appName:""
  },

  onLoad() {
    this.getAppInfo();
  },
  goDownUrl(){
            window.location.href = "www.baidu.com";
  },
  getAppInfo() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/SystemData/GetAppInfoAsnyc',
      method: 'Get',
      dataType: 'json',
      data: {
        id:app.globalData.userInfo.id
      },
      success: (res) => {
        this.setData({ info: res.data.result });
      },
      fail: function(res) {
        dd.alert({ content: '获取数据失败，请重试' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  onShareAppMessage() {
    // 返回自定义分享信息
  },
});