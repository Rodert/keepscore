// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    recentGames: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadRecentGames();
    // 分享朋友圈设置
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadRecentGames();
  },

  // 加载最近游戏记录
  loadRecentGames: function() {
    const app = getApp();
    const records = app.globalData.records || [];
    
    // 只显示最近的3个游戏
    const recentGames = records.slice(0, 3).map(record => {
      return {
        id: record.id,
        title: record.title || '麻将游戏',
        date: record.date,
        status: record.status || '已结束'
      };
    });
    
    this.setData({
      recentGames: recentGames
    });
  },

  // 导航到多人计分模式
  navigateToMultiPlayer: function() {
    this.createNewGame('multi');
  },

  // 导航到单人计分模式
  navigateToSinglePlayer: function() {
    this.createNewGame('single');
  },

  // 导航到分数池模式
  navigateToPoolMode: function() {
    this.createNewGame('pool');
  },

  // 创建新游戏并跳转到游戏设置页面
  createNewGame: function(mode) {
    wx.navigateTo({
      url: '/pages/game/setup/setup?mode=' + mode
    });
  },

  // 继续未完成的游戏
  continueGame: function(e) {
    const gameId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/game/game?id=' + gameId
    });
  }
})