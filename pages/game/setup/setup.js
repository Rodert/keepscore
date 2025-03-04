// pages/game/setup/setup.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode: '', // 游戏模式：multi, single, pool
    userInfo: {},
    hasUserInfo: false,
    nickname: '',
    agreeTerms: false,
    gameSettings: {
      playerCount: 4,
      initialPoints: 1000,
      pointsUnit: '分'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取传递的游戏模式
    if (options.mode) {
      this.setData({
        mode: options.mode
      });
    }
    
    // 获取本地存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
        nickname: userInfo.nickName || ''
      });
    }
  },

  /**
   * 返回上一页
   */
  navigateBack: function() {
    wx.navigateBack();
  },

  /**
   * 选择头像
   */
  chooseAvatar: function() {
    // 由于微信小程序的限制，这里只是模拟选择头像
    wx.showActionSheet({
      itemList: ['从相册选择', '使用默认头像'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 实际应用中应该使用wx.chooseImage
          wx.showToast({
            title: '模拟选择头像',
            icon: 'none'
          });
        } else if (res.tapIndex === 1) {
          const userInfo = this.data.userInfo || {};
          userInfo.avatarUrl = '/images/default_avatar.png';
          
          this.setData({
            userInfo: userInfo
          });
        }
      }
    });
  },

  /**
   * 昵称输入事件
   */
  onNicknameInput: function(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  /**
   * 切换协议同意状态
   */
  toggleAgreement: function() {
    this.setData({
      agreeTerms: !this.data.agreeTerms
    });
  },

  /**
   * 显示用户协议
   */
  showUserTerms: function() {
    wx.showModal({
      title: '用户使用协议',
      content: '这是用户使用协议的内容...',
      showCancel: false
    });
  },

  /**
   * 显示隐私政策
   */
  showPrivacyPolicy: function() {
    wx.showModal({
      title: '隐私协议',
      content: '这是隐私协议的内容...',
      showCancel: false
    });
  },

  /**
   * 注册用户
   */
  registerUser: function() {
    if (!this.data.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.agreeTerms) {
      wx.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }
    
    // 保存用户信息
    const userInfo = this.data.userInfo || {};
    userInfo.nickName = this.data.nickname;
    
    wx.setStorageSync('userInfo', userInfo);
    
    // 根据游戏模式进行跳转
    if (this.data.mode === 'multi') {
      wx.navigateTo({
        url: '/pages/game/multi/multi'
      });
    } else if (this.data.mode === 'single') {
      wx.navigateTo({
        url: '/pages/game/single/single'
      });
    } else if (this.data.mode === 'pool') {
      wx.navigateTo({
        url: '/pages/game/pool/pool'
      });
    } else {
      // 默认返回首页
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  }
})
