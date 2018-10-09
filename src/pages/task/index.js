let app = getApp();

Page({
  data: {
    userInfo: { id: '', name: '', position: '', avatar: '' },
    items: [],
    chartItems: [{ name: '完成', num: 700, percent: 0.7, a: '1' },
    { name: '进行中', num: 200, percent: 0.2, a: '1' },
    { name: '逾期', num: 100, percent: 0.1, a: '1' }],
    chart: null,
  },
  onLoad(query) {
    //console.info(`app.globalData: ${JSON.stringify(app.globalData)}`);
    this.loginSys();
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    //dd.alert({ content: "onLoad" });
  },
  loginSys() {
    if (app.globalData.userInfo.id == '') {
      dd.showLoading();
      //免登陆
      //dd.getAuthCode({
      //success: (res) => {
      //  console.log('My authCode', res.authCode);
      dd.httpRequest({
        url: app.globalData.host + 'api/services/app/Employee/GetDingDingUserByCodeAsync',
        method: 'Get',
        data: {
          code: '',//res.authCode,
        },
        dataType: 'json',
        success: (res) => {
          //console.log('res', res);
          app.globalData.userInfo = res.data.result;
          //console.log('app user info', app.userInfo);
          this.setData({ userInfo: app.globalData.userInfo });

          this.getScheduleTasks();

          this.onDraw(this.data.chart);
          //this.userInfo = res.data.result;
          //dd.alert({ content: 'success' });
        },
        fail: function(res) {
          dd.alert({ content: '获取用户信息异常' });
        },
        complete: function(res) {
          dd.hideLoading();
          //dd.alert({ content: 'complete' });
        }
      });
      //},
      //fail: function(err) {
      //  dd.alert({ content: '授权出错' });
      //  dd.hideLoading();
      //}
      //});
    } else {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getScheduleTasks();

      this.onDraw(this.data.chart);
    }
  },
  getScheduleTasks() {
    if (this.data.userInfo.id) {
      //dd.showLoading();
      dd.httpRequest({
        url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingScheduleTaskListAsync',
        method: 'Get',
        data: {
          userId: this.data.userInfo.id,
        },
        dataType: 'json',
        success: (res) => {
          this.setData({ items: res.data.result });
        },
        fail: function(res) {
          dd.alert({ content: '获取任务异常' });
        },
        complete: function(res) {
          dd.hideLoading();
        }
      });
    }
  },
  goDetalil(data) {
    //console.info(`dd data: ${JSON.stringify(data)}`);
    dd.navigateTo({
      url: "./task-detail/task-detail?id=" + this.data.items[data.index].id,
    });
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    //dd.alert({ content: "显示了"});
    // 页面显示
    this.getScheduleTasks();
    if (this.data.chart){
      this.onDraw(this.data.chart);
    }
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onDraw(ddChart) {
    //dd-charts组件内部会回调此方法，返回图表实例ddChart
    //提示：可以把异步获取数据及渲染图表逻辑放onDraw回调里面
    if (this.data.userInfo.id && ddChart) {
      ddChart.clear()
      dd.showLoading();
      dd.httpRequest({
        url: app.globalData.host + 'api/services/app/Chart/GetUserScheduleSummaryAsync',
        method: 'Get',
        data: {
          userId: this.data.userInfo.id,
        },
        dataType: 'json',
        success: (res) => {
          this.setData({ chartItems: res.data.result });
          var map = {};
          const chartDataNew = this.data.chartItems;
          chartDataNew.map(function(obj) {
            map[obj.name] = obj.num + '（' + obj.percent * 100 + '%）';
          });
          ddChart.source(chartDataNew, {
            percent: {
              formatter: function formatter(val) {
                return val * 100 + '%';
              }
            }
          })
          ddChart.legend({
            position: 'right',
            marker: 'square',
            align: 'center',
            itemFormatter: function itemFormatter(val) {
              return val + '    ' + map[val];
            }
          })
          ddChart.tooltip(false)
          ddChart.coord('polar', {
            transposed: true,
            radius: 1,
            innerRadius: 0.85
          })
          ddChart.axis(false);
          ddChart.interval().position('a*percent').color('name', ['#1890FF', '#13C2C2', '#FE5D4D']).adjust('stack').style({
            lineWidth: 0.5,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
          });
          //ddChart.guide().html({
          //  position: ['50%', '45%'],
          //  html: '<div style="width: 250px;height: 40px;text-align: center;">' + '<div style="font-size: 16px">计划总数</div>' + '<div style="font-size: 24px">120</div>' + '</div>'
          //});
          let total = 0;
          for (var i in chartDataNew) {
            total += chartDataNew[i].num;
          }
          ddChart.guide().text({
            position: ['50%', '50%'],
            content: total,
            style: {
              fontSize: 15
            }
          });
          ddChart.render();
          this.data.chart = ddChart;
        },
        fail: function(res) {
          dd.alert({ content: '获取数据异常' });
        },
        complete: function(res) {
          dd.hideLoading();
        }
      });
    } else {
      this.data.chart = ddChart;
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '当前任务',
      desc: '当前任务列表',
      path: 'pages/task/index',
    };
  },
});
