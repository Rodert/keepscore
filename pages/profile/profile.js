// pages/profile/profile.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    userId: '',
    stats: {
      totalGames: 0,
      winRate: '0%',
      totalScore: 0
    },
    fontSize: 'medium' // 默认字体大小：小(small)、中(medium)、大(large)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    const fontSize = wx.getStorageSync('fontSize') || 'medium';
    
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        userId: this.generateUserId(userInfo.nickName),
        fontSize: fontSize
      });
    }
    
    // 加载用户统计信息
    this.loadUserStats();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 每次显示页面时重新加载统计信息
    this.loadUserStats();
  },

  // 生成用户ID
  generateUserId: function(nickname) {
    if (!nickname) return '888888';
    // 简单示例：生成一个6位数字ID
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // 加载用户统计信息
  loadUserStats: function() {
    const app = getApp();
    const records = app.globalData.records || [];
    
    if (records.length > 0) {
      // 计算总局数
      const totalGames = records.length;
      
      // 计算胜率（简化示例）
      const wins = records.filter(record => {
        // 假设有玩家列表且当前用户分数为正
        if (record.players && record.players.length > 0) {
          const currentUser = record.players.find(player => 
            player.name === this.data.userInfo.nickName);
          return currentUser && currentUser.score > 0;
        }
        return false;
      }).length;
      
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) + '%' : '0%';
      
      // 计算总分
      let totalScore = 0;
      records.forEach(record => {
        if (record.players && record.players.length > 0) {
          const currentUser = record.players.find(player => 
            player.name === this.data.userInfo.nickName);
          if (currentUser) {
            totalScore += currentUser.score || 0;
          }
        }
      });
      
      this.setData({
        stats: {
          totalGames: totalGames,
          winRate: winRate,
          totalScore: totalScore
        }
      });
    }
  },

  // 获取用户信息
  getUserProfile: function() {
    // 由于微信小程序的限制，这里只是模拟登录
    wx.showModal({
      title: '模拟登录',
      content: '实际应用中需要使用wx.getUserProfile获取用户信息，这里仅作演示',
      success: (res) => {
        if (res.confirm) {
          // 模拟用户信息
          const userInfo = {
            nickName: '麻将爱好者',
            avatarUrl: '/images/default_avatar.png'
          };
          
          wx.setStorageSync('userInfo', userInfo);
          
          this.setData({
            userInfo: userInfo,
            hasUserInfo: true,
            userId: this.generateUserId(userInfo.nickName)
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 转发分享
  shareToFriends: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    });
  },

  // 显示字体设置选项
  showFontSettings: function() {
    wx.showActionSheet({
      itemList: ['小号字体', '标准字体', '大号字体'],
      success: (res) => {
        let fontSize = 'medium';
        
        switch (res.tapIndex) {
          case 0:
            fontSize = 'small';
            break;
          case 1:
            fontSize = 'medium';
            break;
          case 2:
            fontSize = 'large';
            break;
        }
        
        // 保存字体设置
        wx.setStorageSync('fontSize', fontSize);
        
        this.setData({
          fontSize: fontSize
        });
        
        // 应用字体设置
        this.applyFontSize(fontSize);
        
        wx.showToast({
          title: '设置成功',
          icon: 'success'
        });
      }
    });
  },

  // 应用字体大小设置
  applyFontSize: function(size) {
    // 实际应用中需要全局设置字体大小
    // 这里只是演示，实际实现可以通过动态修改wxss或者全局变量
    const app = getApp();
    app.globalData.fontSize = size;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '麻将计分通 - 轻松记录每局分数',
      path: '/pages/index/index',
      imageUrl: '/images/share_image.png' // 分享图片，可以自定义
    };
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function() {
    return {
      title: '麻将计分通 - 轻松记录每局分数',
      query: '',
      imageUrl: '/images/share_image.png'
    };
  }
})