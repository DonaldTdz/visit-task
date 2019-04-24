let app = getApp();
Page({
  data: {
    info: {},
    version:"",
    appName:"",
    src :null
  },

  onLoad() {
    // var url = 'http://127.0.0.1:21021/GYISMSFile/AppDownloadIndex';
    var url = app.globalData.host + '/GYISMSFile/AppDownloadIndex?id='+app.globalData.userInfo.id;
    this.setData({src :url});
    // alert(this.data.src);
  },
  
  getAppInfo(e) {
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
       dd.alert({
      content:JSON.stringify(e.detail),
    });  
  },

  onShareAppMessage() {
    // 返回自定义分享信息
  },
});