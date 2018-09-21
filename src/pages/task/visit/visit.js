let app = getApp();
Page({
  data: {
    id:'', 
    vgDetail:{},
    visits:[{
      location:'东方希望天祥广场',
      creationTimeFormat:'09-21 18:21'
    }, 
    {
        location: '东方希望天祥广场 A座',
        creationTimeFormat: '09-20 18:21'
      }],
  },
  onLoad(query) {
    this.setData({id: query.id });
    this.getVisitGrowerDetail();
    // 页面加载
    console.info(`visit Page onLoad with query: ${JSON.stringify(query)}`);
  },
  getVisitGrowerDetail(){
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
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '拜访详情',
      desc: '拜访详情页',
      path: 'pages/task/visit/visit',
    };
  },
});
