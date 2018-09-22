let app = getApp();
Page({
  data: {
    visit: {
      //imgPath: 'http://hechuangdd.vaiwan.com/visit/3554c3ee-983c-4c79-90fd-0b4fb7db40e6.jpg',
      imgPath: '',
      scheduleDetailId: '',
      location: '',
      longitude: 0.0,
      latitude: 0.0,
      desc: '',
      growerName: '唐全华',
      taskDesc: '备耕（技术服务）协助烟农检查备耕注意事项，并对备耕技术进行指导和监控。',
    }
  },
  onLoad() { },
  chooseImage() {
    var that = this;
    dd.chooseImage({
      sourceType: ['camera'],
      count: 1,
      success: (res) => {
        //console.log(res);
        const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
        dd.alert({ content: `内容：${path}` });
        //console.log(app.globalData.host + 'GYISMSFile/FilesPostsAsync');
        dd.uploadFile({
          url: app.globalData.host + 'GYISMSFile/FilesPostsAsync',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          success: (res) => {
            //dd.alert({ title: `上传成功：${JSON.stringify(res)}` });
            const data = JSON.parse(res.data);
            //console.log(data);
            const vdata = that.data.visit;
            vdata.imgPath = app.globalData.host + data.result;
            //console.log(vdata);
            that.setData({
              visit: vdata
            });
          },
          fail: function(res) {
            dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            console.log(res);
          },
        });
      },
      fail: () => {
        dd.showToast({
          content: '调用拍照异常', // 文字内容
        });
      }
    })
  },
  previewImage() {
    var that = this;
    dd.previewImage({
      current: 0,
      urls: [
        //'http://hechuangdd.vaiwan.com/visit/3554c3ee-983c-4c79-90fd-0b4fb7db40e6.jpg'
        that.data.visit.imgPath
      ],
    });
  },
  getLocation() {
    var that = this;
    dd.showLoading();
    dd.getLocation({
      type: 2,
      success(res) {
        dd.hideLoading();
        console.log(res)
        const vdata = that.data.visit;
        vdata.location = (res.province ? res.province : '') + res.city + (res.district ? res.district : '') + (res.streetNumber ? res.streetNumber.street:'');
        vdata.longitude = res.longitude;
        vdata.latitude = res.latitude;
        that.setData({
          visit: vdata
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败' });
      },
    })
  }
});
