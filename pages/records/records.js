// pages/records/records.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'all',
    records: [],
    filteredRecords: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadRecords();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadRecords();
  },

  // 加载记录
  loadRecords: function() {
    const app = getApp();
    const records = app.globalData.records || [];
    
    this.setData({
      records: records
    });
    
    this.filterRecords();
  },

  // 切换标签页
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    
    this.filterRecords();
  },

  // 根据当前标签过滤记录
  filterRecords: function() {
    const { records, currentTab } = this.data;
    let filteredRecords = [];
    
    if (currentTab === 'all') {
      filteredRecords = records;
    } else if (currentTab === 'ongoing') {
      filteredRecords = records.filter(record => record.status === '进行中');
    } else if (currentTab === 'completed') {
      filteredRecords = records.filter(record => record.status === '已结束');
    }
    
    this.setData({
      filteredRecords: filteredRecords
    });
  },

  // 显示筛选选项
  showFilterOptions: function() {
    wx.showActionSheet({
      itemList: ['按日期排序', '按模式筛选', '按玩家筛选'],
      success: (res) => {
        const index = res.tapIndex;
        if (index === 0) {
          this.sortByDate();
        } else if (index === 1) {
          this.filterByMode();
        } else if (index === 2) {
          this.filterByPlayer();
        }
      }
    });
  },

  // 按日期排序
  sortByDate: function() {
    // 实际应用中可以实现升序或降序排列
    wx.showToast({
      title: '排序功能开发中',
      icon: 'none'
    });
  },

  // 按模式筛选
  filterByMode: function() {
    wx.showActionSheet({
      itemList: ['多人计分模式', '单人计分模式', '分数池模式'],
      success: (res) => {
        // 实际应用中可以根据选择进行筛选
        wx.showToast({
          title: '筛选功能开发中',
          icon: 'none'
        });
      }
    });
  },

  // 按玩家筛选
  filterByPlayer: function() {
    wx.showToast({
      title: '筛选功能开发中',
      icon: 'none'
    });
  },

  // 显示删除选项
  showDeleteOptions: function() {
    wx.showActionSheet({
      itemList: ['删除选中记录', '删除已完成记录', '清空所有记录'],
      success: (res) => {
        const index = res.tapIndex;
        if (index === 0) {
          this.showSelectRecordsToDelete();
        } else if (index === 1) {
          this.deleteCompletedRecords();
        } else if (index === 2) {
          this.clearAllRecords();
        }
      }
    });
  },

  // 显示选择要删除的记录界面
  showSelectRecordsToDelete: function() {
    wx.showToast({
      title: '删除功能开发中',
      icon: 'none'
    });
  },

  // 删除已完成的记录
  deleteCompletedRecords: function() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除所有已完成的记录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          const newRecords = app.globalData.records.filter(record => record.status !== '已结束');
          app.globalData.records = newRecords;
          wx.setStorageSync('mahjongRecords', newRecords);
          
          this.loadRecords();
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 清空所有记录
  clearAllRecords: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有记录吗？此操作无法撤销！',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          app.globalData.clearRecords();
          
          this.setData({
            records: [],
            filteredRecords: []
          });
          
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看记录详情
  viewRecordDetail: function(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/game/game?id=' + recordId + '&view=true'
    });
  }
})