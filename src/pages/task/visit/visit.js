let app = getApp();
Page({
  data: {
    id: '',
    vgDetail: {},
    isGetPosition: false,
    longitude: 0,
    latitude: 0,
    host: '',
    lastNum: null,
    showPosition: false,
    limitNum: 0,
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
        var num = res.data.result.growerInfo.limitNum - res.data.result.growerInfo.collectNum >= 0 ? res.data.result.growerInfo.limitNum - res.data.result.growerInfo.collectNum : 0;
        this.setData({ vgDetail: res.data.result, limitNum: res.data.result.growerInfo.limitNum, lastNum: num });
        if (res.data.result.growerInfo.longitude && res.data.result.growerInfo.latitude) {
          this.setData({ isGetPosition: true, longitude: res.data.result.growerInfo.longitude, latitude: res.data.result.growerInfo.latitude });
        };
        if (res.data.result.growerInfo.collectNum < res.data.result.growerInfo.limitNum || !res.data.result.growerInfo.longitude || !res.data.result.growerInfo.latitude) {
          this.setData({ showPosition: true });
        }

      },
      fail: function(res) {
        dd.alert({ content: '获取烟农详情异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  goArea() {//面积落实
    var that = this;
    var date = new Date();
    var beginTime = new Date(this.data.vgDetail.beginTimeFormat + ' 00:00:00');
    //console.info('data:' + date + ' beginTime:' + beginTime);
    if (date < beginTime) {
      dd.alert({ content: '计划还未开始', buttonText: '确定' });
      return;
    }
    console.log("this.data.vgDetail.taskType:" + this.data.vgDetail.taskType);
    if (this.data.vgDetail.taskType == 5) {//如果是面积落实
      dd.navigateTo({
        url: "../area/area?id=" + that.data.id + "&name=" + that.data.vgDetail.growerInfo.name,
      });
      return;
    }
  },
  goVisit() {
    //验证
    var that = this;
    var date = new Date();
    var beginTime = new Date(this.data.vgDetail.beginTimeFormat + ' 00:00:00');
    //console.info('data:' + date + ' beginTime:' + beginTime);
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
        console.log(res);
        /*const postjson = {
          id: that.data.vgDetail.growerInfo.id,
          longitude: res.longitude,
          latitude: res.latitude
        };*/
        dd.httpRequest({
          url: app.globalData.host + 'api/services/app/VisitRecord/ValidateLocationAsync?lat=' + res.latitude + '&lon=' + res.longitude
            + '&latGrower=' + that.data.latitude + '&lonGrower=' + that.data.longitude+ '&empId=' + app.globalData.userInfo.id,
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
              var butText = that.data.lastNum == 0 ? '确定' : '重新定位';
              dd.confirm({
                title: '确认',
                content: result.msg,
                confirmButtonText: butText,
                cancelButtonText: '取消',
                success({ confirm }) {
                  //console.log(`用户点击了 ${confirm ? '「确定」' : '「取消」'}`);
                  if (confirm) {
                    if (that.data.lastNum > 0) {
                      that.getPosition();
                    } else {
                      //书写申请代码
                    }
                  }
                },
                fail() {
                  dd.hideLoading();
                },
                complete() {
                },
              });
            }
          },
          fail: function(res) {
            dd.alert({ content: '验证位置异常', buttonText: '确定' });
            dd.hideLoading();
            //console.info(res);
          },
          complete: function(res) {
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
              // dd.navigateTo({
              //   url: "../go-visit/go-visit?id=" + that.data.id,
              // });
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
          content: reslocation + '（注：每年最多能采集' + that.data.limitNum + '次）',
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
                  //console.info(res2.data.result);
                  var result = res2.data.result;
                  if (result.code == 0) {
                    //dd.alert({ content: result.msg, buttonText: '确定' });
                    dd.showToast({
                      type: 'success',
                      content: result.msg,
                      duration: 3000,
                      success: () => {
                        
                      },
                    });
                    that.setData(
                      {
                        isGetPosition: true,
                        longitude: result.data.lon,
                        latitude: result.data.lat,
                        showPosition: result.data.colNum < that.data.limitNum ? true : false,
                        lastNum: that.data.limitNum - result.data.colNum > 0 ? that.data.limitNum - result.data.colNum : 0
                      });
                  } else {
                    dd.alert({ content: result.msg, buttonText: '确定' });
                  }
                },
                fail: function(res) {
                  dd.alert({ content: '提交数据异常', buttonText: '确定' });
                  //console.info(res);
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
        dd.alert({ title: '定位失败', buttonText: '确定' });
      },
    });
  },
  submitArea() {
    var that = this;
     var jsonData = JSON.stringify({ id: that.data.id });
    dd.confirm({
      title: '确认',
      content: '确定提交面积采落实数据，提交后将不可修改',
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading();
          dd.httpRequest({
            url: app.globalData.host + 'api/services/app/GrowerAreaRecord/SubmitGrowerAreaAsync',
            method: 'Post',
            headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
            data: jsonData,
            dataType: 'json',
            success: (res) => {
              dd.hideLoading();
              //console.info(res.data.result);
              var result = res.data;
              if (result.success == true) {
                dd.showToast({
                  type: 'success',
                  content: '提交成功',
                  duration: 3000,
                  success: () => {
                    that.getVisitGrowerDetail();
                  },
                });
              } else {
                dd.alert({ content: result.error.message, buttonText: '确定' });
              }
            },
            fail: function(res) {
              dd.hideLoading();
              dd.alert({ content: '提交数据异常', buttonText: '确定' });
              console.info(res);
            },
            complete: function(res) {
              dd.hideLoading();
              //dd.alert({ content: 'complete' });
            }
          });
        }
      },
    });
  },
  goDetail(data) {
    dd.navigateTo({
      url: "../visit-detail/visit-detail?id=" + this.data.vgDetail.visitRecords[data.index].id,
    });
  },
  goAreaDetail(data) {
    dd.navigateTo({
      url: "../area-detail/area-detail?id=" + this.data.vgDetail.visitRecords[data.index].id,
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
