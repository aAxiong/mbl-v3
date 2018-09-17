import {
  Pay
} from 'order_model.js'
var pay = new Pay()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: '',
    count: '',
    payMoney: '',
    goodsInfo: {}, //商品信息
    couponInfo: null, //优惠券信息
    isUsedCoupon: 0, //0无可用优惠券 1有可用优惠券
    imgUrl: app.globalData.imgUrl,
    isLoad: true //加载后显示页面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let goodsInfo = wx.getStorageSync('goodsInfo')
    // this.loadCouponData(-1, goodsInfo.CommodityID, options.count)
    this.setData({
      goodsInfo: goodsInfo,
      totalPrice: options.totalPrice,
      count: options.count
    })

  },
  //加载优惠券是否可用
  loadCouponData(disCouponId, commodityId, commodityNum) {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId')
    pay.getCouponIsUsed(userId, disCouponId, commodityId, commodityNum, (res) => {
      if (res.Status === 0) {
        wx.hideLoading()
        this.setData({
          isUsedCoupon: res.Datas.AvailableCouponsNum,
          payMoney: res.Datas.PayMoney,
          isLoad: false
        })
      } else {

      }
    })


  },
  paymentTap() {
    this.getUserPayParams()
  },
  //获取支付参数
  getUserPayParams() {
    let self = this
    wx.login({
      success: function(res) {
        if (res.code) {
          let userId = wx.getStorageSync('userId')
          let money = parseFloat(self.data.goodsInfo.Money)
          let count = self.data.count
          let couponId = self.data.couponInfo ? self.data.couponInfo.id : ''
          let code = res.code
          let commodityId = self.data.goodsInfo.CommodityID
          let commodityName = self.data.goodsInfo.CommodityName
          let categoryId = self.data.goodsInfo.CategoryID

          wx.showLoading({
            title: '加载中',
            mask: true
          })

          pay.getPayParams(userId, money, count, couponId, code, commodityId, commodityName, categoryId, (res) => {
            wx.hideLoading()
            if (res.Status == '0') {
              let data = res.Datas
              self.userPayment(data)
            } else {
              wx.showToast({
                title: '取消支付',
                icon: 'none'
              })
            }
          })

        } else {
          wx.showToast({
            title: '取消支付',
            icon: 'none'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '取消支付',
          icon: 'none'
        })
      }
    })
  },
  //支付
  userPayment(data) {
    let orderId = data.OrderID
    let couponType = this.data.couponType
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        wx.navigateTo({
          url: '/page/home/groupon_paycomplete/groupon_paycomplete?orderId=' + orderId + '&couponType=' + couponType,
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  selectCouponTap() {
    wx.navigateTo({
      url: '/page/home/new_coupon/new_coupon?money=' + this.data.totalPrice,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.useCouponInfo) {
      console.log(app.globalData.useCouponInfo)
      this.setData({
        couponInfo: app.globalData.useCouponInfo
      })
      this.loadCouponData(app.globalData.useCouponInfo.id, this.data.goodsInfo.CommodityID, this.data.count)
    } else {
      //取消使用优惠券时
      this.setData({
        couponInfo: null
      })
      this.loadCouponData(-1, this.data.goodsInfo.CommodityID, this.data.count)
    }
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
    app.globalData.useCouponInfo = null
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