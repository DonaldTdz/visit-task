let app = getApp();
Page({
  data: {
    id: '',
    vgDetail: {},
    isGetPosition: false,
    longitude: 0,
    latitude: 0,
    host: ''
  },
  onLoad(query) {
    this.setData({ id: query.id, host: app.globalData.host });
    //this.getVisitGrowerDetail();
    // 页面加载
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onShow() {
    //dd.alert({ content: "显示了"});
    // 页面显示
    this.getVisitGrowerDetail();
  },
  getVisitGrowerDetail() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingVisitGrowerDetailAsync',
      method: 'Get',
      data: {
        scheduleDetailId: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        this.setData({ vgDetail: res.data.result });
        if (res.data.result.growerInfo.longitude && res.data.result.growerInfo.latitude) {
          this.setData({ isGetPosition: true, longitude: res.data.result.growerInfo.longitude, latitude: res.data.result.growerInfo.latitude });
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取烟农详情异常' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  goVisit() {
    //验证
    var that = this;
    dd.showLoading();
    dd.getLocation({
      success(res) {
        /*const postjson = {
          id: that.data.vgDetail.growerInfo.id,
          longitude: res.longitude,
          latitude: res.latitude
        };*/
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/VisitRecord/ValidateLocationAsync?lat=' + res.latitude + '&lon=' + res.longitude 
            + '&latGrower=' + that.data.latitude + '&lonGrower=' + that.data.longitude,
          method: 'Post',
          headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
          data: {},//JSON.stringify(postjson),
          dataType: 'json',
          success: (res) => {
            console.info(res.data.result);
            var result = res.data.result;
            if (result.code == 0) {
              //dd.alert({ content: result.msg });
              dd.navigateTo({
                url: "../go-visit/go-visit?id=" + that.data.id,
              });
            } else {
              dd.alert({ content: result.msg });
            }
          },
          fail: function(res) {
            dd.alert({ content: '验证位置异常' });
            console.info(res);
          },
          complete: function(res) {
            dd.hideLoading();
            //dd.alert({ content: 'complete' });
          }
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败' });
      },
    });
   
  },
  getPosition() {
    var that = this;
    dd.showLoading();
    dd.getLocation({
      type: 2,
      success(res) {
        dd.hideLoading();
        console.log(res)
        const reslocation = (res.province ? res.province : '') + res.city + (res.district ? res.district : '') + (res.streetNumber ? res.streetNumber.street : '');
        /*const postjson = {
          id: that.data.vgDetail.growerInfo.id,
          longitude: res.longitude,
          latitude: res.latitude
        };*/
        dd.confirm({
          title: '当前地理位置为',
          content: reslocation + '（注：只能采集一次）',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          success({ confirm }) {
            //console.log(`用户点击了 ${confirm ? '「确定」' : '「取消」'}`);
            console.log(confirm);
            if (confirm) {
              dd.showLoading();
              dd.httpRequest({
                url: app.globalData.host + 'api/services/app/Grower/SavePositionAsync?id=' + that.data.vgDetail.growerInfo.id + '&longitude=' + res.longitude + '&latitude=' + res.latitude,
                method: 'Post',
                headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
                data: {},//JSON.stringify(postjson),
                dataType: 'json',
                success: (res2) => {
                  console.info(res2.data.result);
                  var result = res2.data.result;
                  if (result.code == 0) {
                    dd.alert({ content: result.msg });
                    that.setData({ isGetPosition: true, longitude: result.data.lon, latitude: result.data.lat });
                  } else {
                    dd.alert({ content: result.msg });
                  }
                },
                fail: function(res) {
                  dd.alert({ content: '提交数据异常' });
                  console.info(res);
                },
                complete: function(res) {
                  dd.hideLoading();
                  //dd.alert({ content: 'complete' });
                }
              });
            }
          },
          fail() {
            console.log('fail');
            dd.hideLoading();
          },
          complete() {
            console.log('complete');
          },
        });
        //longitude: res.longitude,
        //latitude: res.latitude
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败' });
      },
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拜访详情',
      desc: '拜访详情页',
      path: 'pages/task/visit/visit',
    };
  },
});
