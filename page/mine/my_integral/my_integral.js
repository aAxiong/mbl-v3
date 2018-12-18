// page/mine/my_integral/my_integral.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNav: 0,
    tipsText: '兑换成功，请到团购订单列表查看兑换券',
    alertShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.tips = this.selectComponent("#tips");
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
  changNav: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      activeNav: index
    })
  },
  showWindowFail: function() {
    this.tips.showAlert();
    this.setData({
      tipsText: '兑换失败，风里雨里，攒够积分等你~'
    })
  },
  showWindowSucc: function() {
    this.tips.showAlert();
    this.setData({
      tipsText: '兑换成功，请到团购订单列表查看兑换券'
    })
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