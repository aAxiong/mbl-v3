// page/mine/vipInfo_no/vipInfo_no.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    snapName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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