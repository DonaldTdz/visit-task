App({
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    //host: 'http://gy.intcov.com/',
    //host: 'http://127.0.0.1:21021/',
    host: 'http://www.scgyyc.com/',
    corpId: '',
    appId: 7
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
    console.log('corpId', this.globalData.corpId);
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
