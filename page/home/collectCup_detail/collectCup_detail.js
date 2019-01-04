import {
  CollectCup
} from 'collectCup_model.js'
var collectCup = new CollectCup()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {
      title: 'aa',
      DisContent: '通过小程序下单，集满8杯饮品即可活动经典奶茶团购兑换券一张，通过兑换券到店即可兑换经典奶茶杯，活动不限量，集满一次还可以继续集。',
      StartTime: 'bbb',
      EndTime: 'aaa',
    },
    mask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.loadActivity(id)
  },
  loadActivity(id) {
    wx.showLoading({
      title: '加载中...',
    })
    collectCup.getActivity(id, (res) => {
      if (res.Status == '0') {
        this.setData({
          activity: res.Datas[0],
          mask: false
        })

      } else {
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 1500
        })
      }
      wx.hideLoading()
    })
  },
  optExchange: function() { //兑换
    wx.showLoading({
      title: '加载中...',
    })

    collectCup.optExchange(this.data.activity.ID, this.data.activity.Condition, (res) => {
      if (res.Status == '0') {
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: res.Msg,
          icon: 'none',
          duration: 1500
        })
      }
      wx.hideLoading()
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