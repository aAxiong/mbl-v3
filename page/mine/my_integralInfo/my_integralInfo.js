// page/mine/my_integralInfo/my_integralInfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sliderImg: [{
      ImgPaht: '/img/LoopLogo/3560735055573680128/20181126035611252.jpg'
    }, {
      ImgPaht: '/img/LoopLogo/3560735055573680128/20181126035624325.jpg'
    }, {
      ImgPaht: '/img/LoopLogo/3560735055573680128/20181126035648146.jpg'
    }],
    imgUrl: app.globalData.imgUrl,
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  handleChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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