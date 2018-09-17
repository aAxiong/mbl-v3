import {
  UseCoupon
} from 'usecoupon_model.js'
var useCoupon = new UseCoupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    payMoney: 0,
    isUseCoupon: false,
    isBottom: true,
    isShow: true,
    yesAct: 0,
    noAct: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUseCoupon()
    this.setData({
      payMoney: options.money,
      isUseCoupon: app.globalData.isUseCoupon
    })
  },
  //加载优惠券
  getUseCoupon() {
    wx.showLoading({
      title: '加载中...',
    })
    useCoupon.getUseCoupon((res) => {
      if (res.Status == '0') {
        let couponListData = this.data.couponList
        if (res.Datas.length === 0) {
          this.setData({
            isBottom: false,
            isShow: false
          })
          wx.hideLoading()
        } else {
          couponListData = couponListData.concat(res.Datas)
          this.setData({
            couponList: couponListData,
            isShow: false
          })
          wx.hideLoading()
        }
      }
    })
  },
  //是否使用优惠券
  isUseTap() {
    app.globalData.isUseCoupon = true
    this.setData({
      isUseCoupon: app.globalData.isUseCoupon
    })

    app.globalData.useCouponInfo = null
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      })
    }, 500)

  },
  //使用优惠券
  couponUsedTap(e) {
    // if (!this.data.isUseCoupon) {
    //   return false
    // } else {
    let id = e.currentTarget.dataset.id
    let discount = e.currentTarget.dataset.discount
    let diType = e.currentTarget.dataset.type
    let Name = e.currentTarget.dataset.name;
    app.globalData.useCouponInfo = {
      id: id,
      discount: discount,
      couponType: diType,
      disCouponName: Name
    }
    app.globalData.isUseCoupon = false
    wx.navigateBack({
      delta: 1
    })
    // }
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