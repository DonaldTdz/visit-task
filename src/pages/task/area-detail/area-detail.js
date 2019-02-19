let app = getApp();
Page({
  data: {
    id: '',
    host: '',
    visit: {},
  },
  onLoad(query) {
    this.setData({ id: query.id, host: app.globalData.host });
    console.info(`visit-detail Page onLoad with query: ${JSON.stringify(query)}`);
    this.getVisitRecord();
  },
  previewImage() {
    var that = this;
    dd.previewImage({
      current: 0,
      urls: [
        this.data.host + this.data.visit.imgTop
      ],
    });
  },
  previewImages() {
    //var that = this;
    let imgarr = [];
    for (var i in this.data.visit.imgPaths) {
      imgarr.push(app.globalData.host + this.data.visit.imgPaths[i]);
    }
    dd.previewImage({
      current: 0,
      urls: imgarr,// [
      //  this.data.host + this.data.visit.imgPath
      //],
    });
  },
  onCardClick() {
    dd.openLocation({
      longitude: this.data.visit.longitude,
      latitude: this.data.visit.latitude,
      name: '烟农-' + this.data.visit.growerName,
      address: this.data.visit.location,
    });
  },
  delete() {
    var that = this;
    dd.confirm({
      title: '确认',
      content: '确定删除该记录',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          dd.showLoading();
          dd.httpRequest({
            url: app.globalData.host + 'api/services/app/GrowerAreaRecord/PostDeleteAsync?id=' + that.data.id,
            method: 'Post',
            headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
            data: { },
            dataType: 'json',
            success: (res) => {
              dd.hideLoading();
              //console.info(res.data.result);
              var result = res.data;
              if (result.success == true) {
                dd.showToast({
                  type: 'success',
                  content: '删除成功',
                  duration: 3000,
                  success: () => {
                    dd.navigateBack();
                  },
                });
              } else {
                dd.alert({ content: result.error.message, buttonText: '确定' });
              }
            },
            fail: function(res) {
              dd.hideLoading();
              dd.alert({ content: '提交数据异常', buttonText: '确定' });
              //dd.alert({ content: JSON.stringify(res), buttonText: '确定' });
              //console.info(res);
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
  getVisitRecord() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/VisitRecord/GetDingDingAreaRecordAsync',
      method: 'Get',
      data: {
        id: this.data.id,
      },
      dataType: 'json',
      success: (res) => {
        const result = res.data.result;
        if (result.employeeImg == '') {
          result.employeeImg = '../../../image/logo.jpeg';
        }
        this.setData({ visit: result });
      },
      fail: function(res) {
        dd.alert({ content: '获取数据异常', buttonText: '确定' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
});
