// pages/game/multi/multi.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playerCount: 4,
    initialPoints: 1000,
    unitIndex: 0,
    units: ['分', '元', '点'],
    players: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 初始化玩家列表
    this.initPlayers();
    
    // 获取用户信息，将当前用户设为第一个玩家
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      const players = this.data.players;
      players[0].name = userInfo.nickName;
      
      this.setData({
        players: players
      });
    }
  },

  /**
   * 初始化玩家列表
   */
  initPlayers: function() {
    const players = [];
    for (let i = 0; i < this.data.playerCount; i++) {
      players.push({
        id: this.generatePlayerId(),
        name: '',
        score: this.data.initialPoints
      });
    }
    
    this.setData({
      players: players
    });
  },

  /**
   * 生成玩家ID
   */
  generatePlayerId: function() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  },

  /**
   * 增加玩家人数
   */
  increasePlayerCount: function() {
    if (this.data.playerCount >= 8) return;
    
    const playerCount = this.data.playerCount + 1;
    const players = this.data.players;
    
    players.push({
      id: this.generatePlayerId(),
      name: '',
      score: this.data.initialPoints
    });
    
    this.setData({
      playerCount: playerCount,
      players: players
    });
  },

  /**
   * 减少玩家人数
   */
  decreasePlayerCount: function() {
    if (this.data.playerCount <= 2) return;
    
    const playerCount = this.data.playerCount - 1;
    const players = this.data.players.slice(0, playerCount);
    
    this.setData({
      playerCount: playerCount,
      players: players
    });
  },

  /**
   * 初始分数输入事件
   */
  onInitialPointsInput: function(e) {
    const value = parseInt(e.detail.value) || 0;
    
    this.setData({
      initialPoints: value
    });
    
    // 更新所有玩家的初始分数
    const players = this.data.players.map(player => {
      player.score = value;
      return player;
    });
    
    this.setData({
      players: players
    });
  },

  /**
   * 单位选择事件
   */
  onUnitChange: function(e) {
    this.setData({
      unitIndex: parseInt(e.detail.value)
    });
  },

  /**
   * 玩家名称输入事件
   */
  onPlayerNameInput: function(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const players = this.data.players;
    
    players[index].name = value;
    
    this.setData({
      players: players
    });
  },

  /**
   * 添加玩家
   */
  addPlayer: function() {
    if (this.data.players.length >= 8) return;
    
    const players = this.data.players;
    players.push({
      id: this.generatePlayerId(),
      name: '',
      score: this.data.initialPoints
    });
    
    this.setData({
      playerCount: players.length,
      players: players
    });
  },

  /**
   * 移除玩家
   */
  removePlayer: function(e) {
    const index = e.currentTarget.dataset.index;
    if (index === 0) return; // 不能删除第一个玩家（当前用户）
    
    const players = this.data.players;
    players.splice(index, 1);
    
    this.setData({
      playerCount: players.length,
      players: players
    });
  },

  /**
   * 取消设置
   */
  cancelSetup: function() {
    wx.navigateBack();
  },

  /**
   * 开始游戏
   */
  startGame: function() {
    // 验证玩家信息
    const players = this.data.players;
    let allValid = true;
    
    for (let i = 0; i < players.length; i++) {
      if (!players[i].name) {
        wx.showToast({
          title: `请输入玩家${i + 1}的昵称`,
          icon: 'none'
        });
        allValid = false;
        break;
      }
    }
    
    if (!allValid) return;
    
    // 创建游戏记录
    const gameId = 'game_' + Date.now();
    const gameRecord = {
      id: gameId,
      title: '多人计分桌',
      mode: 'multi',
      date: new Date().toLocaleDateString(),
      status: '进行中',
      initialPoints: this.data.initialPoints,
      unit: this.data.units[this.data.unitIndex],
      players: this.data.players,
      rounds: []
    };
    
    // 保存游戏记录
    const app = getApp();
    app.globalData.addRecord(gameRecord);
    
    // 跳转到游戏页面
    wx.navigateTo({
      url: '/pages/game/game?id=' + gameId
    });
  }
})
