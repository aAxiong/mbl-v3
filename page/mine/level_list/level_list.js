// page/mine/vipInfo_no/vipInfo_no.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    snapName: '',
    toView: 'toView0',
    progress: 40,
    levelDiscount: [{
      level: '青铜',
      discount: '无折扣'
    }, {
      level: '白银',
      discount: '9.8折'
    }, {
      level: '黄金',
      discount: '9.5折'
    }, {
      level: '白金',
      discount: '9.3折'
    }, {
      level: '钻石',
      discount: '9折'
    }],
    levelnow: 0,
    levelTop: [{
      level: '青铜',
      starInt: 0,
      endInt: 100
    }, {
      level: '白银',
      starInt: 0,
      endInt: 100
    }, {
      level: '黄金',
      starInt: 0,
      endInt: 100
    }, {
      level: '白金',
      starInt: 0,
      endInt: 100
    }, {
      level: '钻石',
      starInt: 0,
      endInt: 100
    }],
    level_tiao: 0,
    level_k: -1


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.getUserInfoAuth()
  },
  //用户是否授权
  getUserInfoAuth() {
    let self = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          self.getUserInfo()
        } else {
          wx.navigateTo({
            url: '/page/mine/authorize/authorize',
          })
        }
      }
    })
  },
  //获取用户授权信息
  getUserInfo() {
    wx.getUserInfo({
      success: (res) => {
        let userId = wx.getStorageSync('userId')
        this.setData({
          userInfo: res.userInfo
        })
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let self = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          let userId = wx.getStorageSync('userId')
          self.setData({
            snapName: '用户:' + userId.substring(0, 11)
          })
        }
      }
    })
  },
  changeLevel: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      level_tiao: index,
      level_k: index,
      toView: 'toView' + index
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})