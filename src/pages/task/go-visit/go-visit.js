let app = getApp();
Page({
  data: {
    desc: '',
    employeeId: '',
    examines: [],
    growerId: 0,
    growerName: '',
    imgPath: '',
    location: '',
    latitude: 0.0,
    longitude: '',
    taskDesc: '',
    host: '',
    scheduleDetailId: '',
  },
  onLoad(query) {
    this.setData({ scheduleDetailId: query.id });
    this.setData({ host: app.globalData.host });
    this.getInitInfo();
    this.getLocation();
   },
   getInitInfo(){
     dd.showLoading();
     dd.httpRequest({
       url: app.globalData.host + 'api/services/app/VisitRecord/GetCreateDingDingVisitRecordAsync',
       method: 'Get',
       data: {
         scheduleDetailId: this.data.scheduleDetailId,
       },
       dataType: 'json',
       success: (res) => {
         //console.info(res.data.result);
         //console.info(`visit record: ${JSON.stringify(res.data.result)}`);
         const visit = res.data.result;
         this.setData({ taskDesc: visit.taskDesc });
         this.setData({ growerName: visit.growerName });
         this.setData({ growerId: visit.growerId });
         this.setData({ employeeId: visit.employeeId });
         this.setData({ examines: visit.examines });
       },
       fail: function(res) {
         dd.alert({ content: '初始化信息异常' });
       },
       complete: function(res) {
         dd.hideLoading();
         //dd.alert({ content: 'complete' });
       }
     });
   },
  bindTextAreaBlur: function(e) {
    //console.log('描述是：',e.detail.value)
    this.setData({ desc: e.detail.value });
  },
  radioChange: function(e) {
    const changeExamines = this.data.examines;
    //console.log('你选择的是：', e);
    const selected = e.detail.value.split('-');
    //console.log('数组是：', selected);
    const { value } = e.target.dataset;
    const list = this.data.examines.concat();
    //console.log('list:', list);
    const index = parseInt(selected[0]); //list.indexOf(value);
    //console.log('index:', index);
    value.score = selected[1];
    if (index !== -1) {
      list.splice(index, 1, value);
      this.setData({ examines: list });
    }
    //console.log('数组：', this.data.examines);
  },
  chooseImage() {
    var that = this;
    dd.chooseImage({
      sourceType: ['camera'],
      count: 1,
      success: res => {
        //console.log(res);
        const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
        //dd.alert({ content: `内容：${path}` });
        console.log(that.data.host + 'GYISMSFile/FilesPostsAsync');
        dd.uploadFile({
          url: that.data.host + 'GYISMSFile/FilesPostsAsync',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          success: (res) => {
            //dd.alert({ title: `上传成功：${JSON.stringify(res)}` });
            const data = JSON.parse(res.data);
            that.setData({
              imgPath: data.result
            });
          },
          fail: function(res) {
            dd.alert({ title: `上传失败：${JSON.stringify(res)}` });
            console.log(res);
          },
        });
        /*dd.uploadFile({
          url: 'http://httpbin.org/post',
          fileType: 'image',
          fileName: 'file',
          filePath: path,
          success: res => {
            dd.alert({ title: `上传成功` });
            console.log(res);
          },
          fail: function(res) {
            dd.alert({ title: `上传失败` });
            console.log(res);
          },
        });*/
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
        that.data.imgPath
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
        const reslocation = (res.province ? res.province : '') + res.city + (res.district ? res.district : '') + (res.streetNumber ? res.streetNumber.street:'');
        that.setData({
          location: reslocation,
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail() {
        dd.hideLoading();
        dd.alert({ title: '定位失败' });
      },
    })
  },
  saveVisit(){
    //验证
    if (this.data.location == ''){
      dd.alert({ title: '请获取位置信息' });
      return;
    }
    if (this.data.imgPath == '') {
      dd.alert({ title: '请上传拍照' });
      return;
    }
    //this.setData({ imgPath: '/visit/5bcc3232-7dba-476d-8355-fdd205d6f3cf.jpg'});
   // console.info(this.data);
   // var bo = false;
    for (var i in this.data.examines) {
      //console.info(item);
      if (this.data.examines[i].score == 0){
        //bo = true;
        dd.alert({ title: '请填写考核结果' });
        return;
      }
    }
    /*if (bo){
      dd.alert({ title: '请填写考核' });
      return;
    }*/
    var that = this;
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/VisitRecord/SaveDingDingVisitRecordAsync',
      method: 'Post',
      headers: { 'Content-Type': 'application/json;charset=UTF-8'},
      data: this.data,
      dataType: 'json',
      success: (res) => {
        //console.info(res.data.result);
        var result = res.data.result;
        if (result.code == 0){
          dd.alert({ content: result.msg });
          /*dd.redirectTo({
            url: "../visit/visit?id=" + that.data.scheduleDetailId,
          });*/
          dd.navigateBack();
        } else{
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

  },
});
