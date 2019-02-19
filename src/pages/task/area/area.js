let app = getApp();

Page({
  data: {
    scheduleDetailId: '',
    imgPaths: [],
    host: '',
    longitude: '',
    latitude: '',
    location: '',
    area: null,
    remark: '',
    growerName: ''
  },
  onLoad(query) {
    this.setData({ scheduleDetailId: query.id, growerName: query.name, host: app.globalData.host, imgPaths: [] });
    this.getLocation();
  },
  bindTextAreaBlur: function(e) {
    //console.log('描述是：',e.detail.value)
    this.setData({ area: e.detail.value });
  },
  bindTextRemarkBlur: function(e) {
    this.setData({ remark: e.detail.value });
  },
  getImgPaths(imgs, type) {
    if (type == 1) {
      let imgstrs = '';
      for (var i in imgs) {
        imgstrs += imgs[i];
        if (i != imgs.length - 1) {
          imgstrs += ',';
        }
      }
      return imgstrs;
    } else {
      let imgarr = [];
      for (var i in imgs) {
        imgarr.push(app.globalData.host + imgs[i]);
      }
      return imgarr;
    }
  },
  chooseImage() {
    var that = this;
    const imgpaths = that.data.imgPaths;
    if (imgpaths.length >= 3) {
      dd.alert({ title: `亲`, content: `采集照片已经超过3张`, buttonText: '确定' });
      return;
    }
    dd.showLoading();
    dd.chooseImage({
      sourceType: ['camera'],
      count: 1,
      success: res => {
        const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
        dd.uploadFile({
          url: that.data.host + 'GYISMSFile/FilesPostsAsync',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          success: (res) => {
            dd.hideLoading();
            const data = JSON.parse(res.data);
            const imgpaths = that.data.imgPaths;
            imgpaths.push(data.result);
            that.setData({
              imgPaths: imgpaths
            });
          },
          fail: function(res) {
            dd.hideLoading();
            dd.alert({ title: `上传失败：${JSON.stringify(res)}`, buttonText: '确定' });
          },
        });
      },
      fail: () => {
        dd.hideLoading();
        dd.showToast({
          content: '调用拍照异常', // 文字内容
        });
      }
    })
  },
  previewImage() {
    var that = this;
    const imgurls = that.getImgPaths(that.data.imgPaths, 2)
    dd.previewImage({
      current: 0,
      urls: imgurls,
    });
  },
  getLocation() {
    var that = this;
    dd.getLocation({
      type: 1,
      success(res) {
        dd.hideLoading();
        that.setData({
          location: res.address,
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败', buttonText: '确定' });
      },
    })
  },
  onShow() {

  },
  saveArea() {
    //验证
    if (!this.data.location) {
      dd.alert({ title: '请获取位置信息', buttonText: '确定' });
      return;
    }

    if (this.data.imgPaths.length == 0) {
      dd.alert({ title: '请上传拍照', buttonText: '确定' });
      return;
    }

    if (!this.data.area) {
      dd.alert({ title: '请输入面积', buttonText: '确定' });
      return;
    }

    var jsonData = JSON.stringify(this.data);
    var that = this;

    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/GrowerAreaRecord/SaveGrowerAreaRecordAsync',
      method: 'Post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8', "Accept": 'application/json' },
      data: jsonData,
      dataType: 'json',
      success: (res) => {
        dd.hideLoading();
        //console.info(res.data.result);
        var result = res.data;
        if (result.success == true) {
          //dd.alert({ content: "采集数据成功", buttonText: '确定' });
          dd.showToast({
            type: 'success',
            content: '采集成功',
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
        console.info(res);
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '面积落实',
      desc: '面积落实列表',
      path: 'pages/task/area/area',
    };
  }
});