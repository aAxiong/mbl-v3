import { Ordering } from 'ordering_model.js'
var ordering = new Ordering()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    orderId : '',
    totalNum: '',
    totalPrice: '',    //总价
    priceIsCoupon: '', //优惠后的总价
    diMoney:'',        //优惠金额
    couponInfo: null,
    isUsedCoupon: 0,
    isShowDisCoupon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadGoodsData(options.id)
    this.setData({
      orderId:options.id
    })
  },
  //商品列表
  loadGoodsData(orderId) {
    let userId = wx.getStorageSync('userId')
    ordering.getGoodsData(orderId, userId, (res) => {
      if (res.Status === 0) {
        let data = res.Datas
        this.setData({
          goodsList: data.CommodityList,
          totalNum: data.SumCommodityNum,
          totalPrice: data.SumCommodityMoney,
          priceIsCoupon: data.PayMoney,
          diMoney:data.DisMoney,
          isUsedCoupon: data.AvailableCouponsNum,
          isShowDisCoupon: data.IsShowDisCoupon
        })
        //订单是否已有优惠券
        if (data.DisCouponID != '-1' && data.IsDisCouponExpired == '0') {
          this.setData({
            couponInfo: {
              id: data.DisCouponID,
              discount: data.DisMoney
            }
          })
        }
      }
    })
  },
  //优惠券数据
  getOfferData(couponId, totalPrice) {
    ordering.getOfferData(couponId, totalPrice, (res) => {
      if (res.Status === 0) {
        this.setData({
          priceIsCoupon: res.Datas.PayMoney,
          diMoney: res.Datas.DisMoney,
          totalPrice: res.Datas.SumCommodityMoney
        })
      }
    })
  },
  selectCouponTap() {
    wx.navigateTo({
      url: '/page/home/new_coupon/new_coupon?money=' + this.data.totalPrice,
    })
  },
  paymentTap() {
    this.getUserPayParams()
  },
  //获取支付参数
  getUserPayParams(uNumber) {
    let self = this
    wx.login({
      success: function (res) {
        if (res.code) {
          let userId = wx.getStorageSync('userId')
          let couponId = self.data.couponInfo ? self.data.couponInfo.id : ''
          let code = res.code
          let orderId = self.data.orderId
          let totalPrice = self.data.totalPrice
          let priceIsCoupon = self.data.priceIsCoupon
          let diMoney = self.data.diMoney
          let seatNumber = wx.getStorageSync('deskNumber')

          wx.showLoading({
            title: '加载中',
            mask: true
          })

          ordering.getPayParams(orderId, userId, code, seatNumber, couponId, totalPrice, priceIsCoupon, diMoney, (res) => {
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
      fail: function () {
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
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        wx.navigateTo({
          url: '/page/home/ordering_complete/ordering_complete?id=' + orderId,
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //使用优惠券获取实际支付金额
    if (app.globalData.useCouponInfo) {
      this.getOfferData(app.globalData.useCouponInfo.id, this.data.totalPrice)
      this.setData({
        couponInfo: app.globalData.useCouponInfo
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.useCouponInfo = null
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})