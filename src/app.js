App({
  globalData: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    host: 'http://hechuangdd.vaiwan.com/',
    corpId: ''
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
