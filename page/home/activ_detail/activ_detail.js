import {
  Activity
} from 'activ_model.js'
var activity = new Activity()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    mask: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    // wx.setNavigationBarTitle({
    //   title: '活动详情',
    // })
    this.loadActivity(id)
  },
  loadActivity(id) {
    wx.showLoading({
      title: '加载中...',
    })
    activity.getActivity(id, (res) => {
      if (res.Status == '0') {
        this.setData({
          activity: res.Datas[0],
          mask: false
        })
        wx.hideLoading()
      }
    })
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