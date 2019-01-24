let app = getApp();
Page({
  data: {
    id: '',
    vgDetail: {},
    isGetPosition: false,
    longitude: 0,
    latitude: 0,
    host: '',
    colNum: null,
    showPosition: false
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
        if (res.data.result.growerInfo.collectNum < 3) {
          this.setData({ showPosition: true, colNum: 3 - res.data.result.growerInfo.collectNum });
        }
      },
      fail: function (res) {
        dd.alert({ content: '获取烟农详情异常', buttonText: '确定' });
      },
      complete: function (res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  goVisit() {
    //验证
    var that = this;
    var date = new Date();
    var beginTime = new Date(this.data.vgDetail.beginTimeFormat + ' 00:00:00');
    console.info('data:' + date + ' beginTime:' + beginTime);
    if (date < beginTime) {
      dd.alert({ content: '计划还未开始', buttonText: '确定' });
      return;
    }
    //dd.navigateTo({
    //   url: "../go-visit/go-visit?id=" + that.data.id,
    //}); return;
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
            //console.info(res.data.result);
            dd.hideLoading();
            var result = res.data.result;
            if (result.code == 0) {
              //dd.alert({ content: result.msg });
              dd.navigateTo({
                url: "../go-visit/go-visit?id=" + that.data.id,
              });
            } else {
              var butText = colNum > 3 ? '' : '重新定位'
              dd.confirm({
                content: reslocation + result.msg,
                confirmButtonText: '重新定位',
                cancelButtonText: '取消',
                success({ confirm }) {
                  console.log(confirm);
                  if (colNum < 3) {
                    this.getPosition();
                  }else{

                  }
                }
              })
              // dd.alert({ content: result.msg, cancelText: '确定', buttonText: '重新定位' });
            }
          },
          fail: function (res) {
            dd.alert({ content: '验证位置异常', buttonText: '确定' });
            dd.hideLoading();
            //console.info(res);
          },
          complete: function (res) {
            dd.hideLoading();
            //dd.alert({ content: 'complete' });
          }
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败', buttonText: '确定' });
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
          content: reslocation + '（注：最多能采集3次）',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          success({ confirm }) {
            //console.log(`用户点击了 ${confirm ? '「确定」' : '「取消」'}`);
            console.log(confirm);
            if (confirm) {
              dd.showLoading();
              dd.httpRequest({
                url: app.globalData.host + 'api/services/app/Grower/SavePositionAsync?id=' + that.data.vgDetail.growerInfo.id + '&longitude=' + res.longitude + '&latitude=' + res.latitude
                  + '&userId=' + app.globalData.userInfo.id,
                method: 'Post',
                headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
                data: {},//JSON.stringify(postjson),
                dataType: 'json',
                success: (res2) => {
                  console.info(res2.data.result);
                  var result = res2.data.result;
                  if (result.code == 0) {
                    dd.alert({ content: result.msg, buttonText: '确定' });
                    that.setData({ isGetPosition: true, longitude: result.data.lon, latitude: result.data.lat });
                    that.setData({ showPosition: result.data.colNum < 3 ? true : false, colNum: 3 - colNum })
                  } else {
                    dd.alert({ content: result.msg, buttonText: '确定' });
                  }
                },
                fail: function (res) {
                  dd.alert({ content: '提交数据异常', buttonText: '确定' });
                  //console.info(res);
                },
                complete: function (res) {
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
        dd.alert({ title: '定位失败', buttonText: '确定' });
      },
    });
  },
  goDetail(data) {
    dd.navigateTo({
      url: "../visit-detail/visit-detail?id=" + this.data.vgDetail.visitRecords[data.index].id,
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
