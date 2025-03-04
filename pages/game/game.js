// pages/game/game.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gameId: '',
    gameRecord: null,
    currentRound: 1,
    roundScores: [],
    showAddScoreModal: false,
    selectedPlayerIndex: -1,
    scoreInput: '',
    isNegative: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        gameId: options.id
      });
      
      this.loadGameRecord();
    } else {
      wx.showToast({
        title: '游戏ID无效',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 加载游戏记录
   */
  loadGameRecord: function() {
    const app = getApp();
    const records = app.globalData.records;
    
    const gameRecord = records.find(record => record.id === this.data.gameId);
    
    if (gameRecord) {
      // 初始化本轮分数
      const roundScores = gameRecord.players.map(() => 0);
      
      this.setData({
        gameRecord: gameRecord,
        currentRound: gameRecord.rounds.length + 1,
        roundScores: roundScores
      });
    } else {
      wx.showToast({
        title: '找不到游戏记录',
        icon: 'none'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 显示添加分数模态框
   */
  showAddScore: function(e) {
    const index = e.currentTarget.dataset.index;
    
    this.setData({
      showAddScoreModal: true,
      selectedPlayerIndex: index,
      scoreInput: '',
      isNegative: false
    });
  },

  /**
   * 隐藏添加分数模态框
   */
  hideAddScore: function() {
    this.setData({
      showAddScoreModal: false,
      selectedPlayerIndex: -1,
      scoreInput: '',
      isNegative: false
    });
  },

  /**
   * 分数输入事件
   */
  onScoreInput: function(e) {
    // 只允许输入数字和小数点
    const value = e.detail.value;
    // 只保留数字和小数点
    const filteredValue = value.replace(/[^\d.]/g, '');
    // 确保只有一个小数点
    let formattedValue = '';
    let hasDecimal = false;
    
    for (let i = 0; i < filteredValue.length; i++) {
      if (filteredValue[i] === '.' && !hasDecimal) {
        formattedValue += '.';
        hasDecimal = true;
      } else if (filteredValue[i] !== '.') {
        formattedValue += filteredValue[i];
      }
    }
    
    this.setData({
      scoreInput: formattedValue
    });
  },
  
  /**
   * 切换分数正负号
   */
  toggleScoreSign: function() {
    this.setData({
      isNegative: !this.data.isNegative
    });
  },

  /**
   * 确认添加分数
   */
  confirmAddScore: function() {
    // 解析分数并应用正负号
    const scoreInput = this.data.scoreInput;
    let score = parseFloat(scoreInput) || 0;
    
    // 如果是负数模式，将分数变为负数
    if (this.data.isNegative) {
      score = -Math.abs(score);
    } else {
      score = Math.abs(score);
    }
    
    const index = this.data.selectedPlayerIndex;
    
    if (index >= 0 && index < this.data.roundScores.length) {
      const roundScores = this.data.roundScores;
      roundScores[index] = score;
      
      this.setData({
        roundScores: roundScores,
        showAddScoreModal: false,
        selectedPlayerIndex: -1,
        scoreInput: '',
        isNegative: false
      });
    }
  },

  /**
   * 提交本轮分数
   */
  submitRound: function() {
    // 检查是否所有分数之和为0
    const sum = this.data.roundScores.reduce((a, b) => a + b, 0);
    
    if (sum !== 0) {
      wx.showModal({
        title: '分数不平衡',
        content: '本轮所有玩家分数之和应为0，是否继续？',
        success: (res) => {
          if (res.confirm) {
            this.saveRound();
          }
        }
      });
    } else {
      this.saveRound();
    }
  },

  /**
   * 保存本轮分数
   */
  saveRound: function() {
    const gameRecord = this.data.gameRecord;
    const roundScores = this.data.roundScores;
    
    // 更新玩家分数
    for (let i = 0; i < gameRecord.players.length; i++) {
      gameRecord.players[i].score += roundScores[i];
    }
    
    // 添加新的一轮记录
    gameRecord.rounds.push({
      roundNumber: this.data.currentRound,
      scores: [...roundScores]
    });
    
    // 更新游戏记录
    const app = getApp();
    const records = app.globalData.records;
    const index = records.findIndex(record => record.id === this.data.gameId);
    
    if (index >= 0) {
      records[index] = gameRecord;
      wx.setStorageSync('mahjongRecords', records);
      
      this.setData({
        gameRecord: gameRecord,
        currentRound: gameRecord.rounds.length + 1,
        roundScores: gameRecord.players.map(() => 0)
      });
      
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }
  },

  /**
   * 结束游戏
   */
  endGame: function() {
    wx.showModal({
      title: '结束游戏',
      content: '确定要结束本局游戏吗？',
      success: (res) => {
        if (res.confirm) {
          const gameRecord = this.data.gameRecord;
          gameRecord.status = '已结束';
          
          // 更新游戏记录
          const app = getApp();
          const records = app.globalData.records;
          const index = records.findIndex(record => record.id === this.data.gameId);
          
          if (index >= 0) {
            records[index] = gameRecord;
            wx.setStorageSync('mahjongRecords', records);
            
            wx.showToast({
              title: '游戏已结束',
              icon: 'success'
            });
            
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/records/records'
              });
            }, 1500);
          }
        }
      }
    });
  },

  /**
   * 返回首页
   */
  goHome: function() {
    wx.showModal({
      title: '返回首页',
      content: '确定要返回首页吗？当前游戏将保持进行中状态。',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
})
