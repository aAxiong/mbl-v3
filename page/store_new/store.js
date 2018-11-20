// page/store_new/store.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActive: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  chageNav(e) {
    this.setData({
      navbarActive: e.currentTarget.dataset.index
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

})