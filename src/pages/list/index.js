import Dropdown from '../../components/dropdown';
let app = getApp();

Page({
  ...Dropdown,
  data: {
    status: -1,
    startDate: '',
    endDate: '',
    pageIndex: 0,
    items: [],
    dropdownSelectData: {
      active: false,
      selectedNav: 0,
      listData: [
        {
          nav: '选择状态 ',
          selectedItem: '',
          type: 'dropdown',
          data: [
            {
              thumb: '../../image/icon_status-dot-R1.png',
              title: '已逾期',
            },
            {
              thumb: '../../image/icon_status-dot-GR.png',
              title: '未开始'
            },
            {
              thumb: '../../image/icon_status-dot-Y.png',
              title: '进行中',
            },
            {
              thumb: '../../image/icon_status-dot-G.png',
              title: '已完成',
            },
          ]
        },
        {
          nav: '开始日期',
          selectedItem: '',
          type: 'button',
          data: []
        },
        {
          nav: '结束日期',
          selectedItem: '',
          type: 'button',
          data: []
        },
      ],
    },
  },
  onLoad(query) {
    this.cleanData();
    this.getTaskList();
  },
  onDropdownNavItemTap(e, index) {
    const { selectedNav, active } = this.data.dropdownSelectData;

    let nextactive = !active;
    if (selectedNav !== index) {
      nextactive = true;
    }

    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        active: nextactive,
        selectedNav: index
      }
    });
  },
  onButtonNavItemTap(e, index) {
    const { selectedNav, active } = this.data.dropdownSelectData;
    let nextactive = !active;
    if (selectedNav !== index) {
      nextactive = true;
    }

    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        active: nextactive,
        selectedNav: index,
      }
    });
    const alistData = this.data.dropdownSelectData.listData;
    //弹出日历
    dd.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: index == 1 ? this.data.startDate : this.data.endDate,
      startDate: index == 1 ? '' : this.data.startDate,
      endDate: index == 1 ? this.data.endDate : '', 
      success: (res) => {
        alistData[index].nav = res.date;
        if (index == 1) {
          this.data.startDate = res.date;
        } else {
          this.data.endDate = res.date;
        }
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false,
            listData: alistData
          }
        });
        this.cleanData();
        this.getTaskList();
      },
      fail: (res) => {
        this.setData({
          dropdownSelectData: {
            ...this.data.dropdownSelectData,
            active: false
          }
        })
      }
    });
  },
  catchDropdownNavItemTap(e, parentIndex, index, title) {
    const { listData } = this.data.dropdownSelectData;

    const data = listData[parentIndex];

    data.selectedItem = index;
    data.nav = title;
    this.data.status = index;
    /*dd.showToast({
      content: `你选中了第${parentIndex + 1}个tab的第${index + 1}个元素`, // 文字内容
      success: (res) => {

      },
    });*/
    this.setData({
      dropdownSelectData: {
        ...this.data.dropdownSelectData,
        active: false,
        listData
      }
    });
    this.cleanData();
    this.getTaskList();
  },
  catchDropdownBgTap(e) {
    this.setData({
      active: false
    });
  },
  cleanData() {
    this.setData({
      items: [],
      pageIndex: 0
    });
  },
  getTaskList() {
    var that = this;
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/ScheduleTask/GetDingDingScheduleTaskPagingAsync',
      method: 'Get',
      data: {
        userId: app.globalData.userInfo.id,
        status: that.data.status,
        startDate: that.data.startDate,
        endDate: that.data.endDate,
        pageIndex: that.data.pageIndex,
      },
      dataType: 'json',
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        const datas = res.data.result;
        if (datas.length < 15) {
          this.setData({ pageIndex: -1 });
        } else {
          var pindex = that.data.pageIndex + 15;
          this.setData({ pageIndex: pindex });
        }
        var tempItems = that.data.items;
        if (datas.length > 0) {
          for (var i in datas) {
            tempItems.push(datas[i]);
          }
          this.setData({ items: tempItems });
        }
      },
      fail: function(res) {
        dd.alert({ content: '获取任务列表异常' });
      },
      complete: function(res) {
        dd.hideLoading();
        //dd.alert({ content: 'complete' });
      }
    });
  },
  goVisit(data) {
    dd.navigateTo({
      url: "../task/visit/visit?id=" + this.data.items[data.index].id,
    });
  },
  onReachBottom() {
    if (this.data.pageIndex != -1) {
      // 页面被拉到底部
      this.getTaskList();
    }
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '任务列表',
      desc: '所有任务列表',
      path: 'pages/list/index',
    };
  }
});


