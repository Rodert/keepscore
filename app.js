// app.js
App({
  onLaunch: function () {
    // 获取本地存储的游戏记录
    const records = wx.getStorageSync('mahjongRecords') || [];
    this.globalData.records = records;
    
    // 获取字体大小设置
    const fontSize = wx.getStorageSync('fontSize') || 'medium';
    this.globalData.fontSize = fontSize;
    
    // 应用字体大小设置
    this.applyFontSize(fontSize);
  },
  
  // 应用字体大小设置
  applyFontSize: function(size) {
    // 实际应用中可以通过动态设置全局样式或者动态加载不同的wxss文件
    // 这里只是示例，实际实现可能需要更复杂的逻辑
    let rootFontSize = '14px';
    
    switch(size) {
      case 'small':
        rootFontSize = '12px';
        break;
      case 'medium':
        rootFontSize = '14px';
        break;
      case 'large':
        rootFontSize = '16px';
        break;
    }
    
    // 在真实实现中，可以通过动态设置样式或者其他方式来实现
    // wx.setStorageSync('rootFontSize', rootFontSize);
  },
  
  globalData: {
    userInfo: null,
    records: [],
    fontSize: 'medium', // 默认字体大小
    // 添加新记录
    addRecord: function(record) {
      this.records.unshift(record);
      wx.setStorageSync('mahjongRecords', this.records);
    },
    // 删除记录
    deleteRecord: function(index) {
      this.records.splice(index, 1);
      wx.setStorageSync('mahjongRecords', this.records);
    },
    // 清空所有记录
    clearRecords: function() {
      this.records = [];
      wx.setStorageSync('mahjongRecords', []);
    }
  }
})
