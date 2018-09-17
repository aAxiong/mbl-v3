import { Pay } from 'order_model.js'
var pay = new Pay()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: '',
    payMoney:'',
    orderId: '',
    isShow:true,
    imgUrl: app.globalData.imgUrl,
    orderInfo: {},     //订单信息
    couponInfo:null     //优惠券信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPaymentData(options.orderId)
    //let goodsInfo = wx.getStorageSync('goodsInfo')
    this.setData({
      orderId: options.orderId
    })
  },
  loadPaymentData(orderId){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    pay.getOrderData(orderId,(res)=>{
      if(res.Status === 0){
        wx.hideLoading()
        let data = res.Datas
        wx.setNavigationBarTitle({
          title: data.CommodityName,
        })
        this.setData({
          isShow:false,
          orderInfo: data,
          totalPrice: data.SumMoney,
          payMoney: data.PayMoney,
        })
        if (data.DisCouponID && data.IsDisCouponExpired == '0'){
          this.setData({
            couponInfo:{
              id: data.DisCouponID,
              discount: data.DisMoney
            }
          })
        }
      }
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
          payMoney: res.Datas.PayMoney,
          couponInfo:{
            id: disCouponId,
            discount: res.Datas.DisMoney
          }
        })
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
      success: function (res) {
        if (res.code) {
          let orderData = self.data.orderInfo

          let userId = wx.getStorageSync('userId')
          let commodityMoney = parseFloat(orderData.CommodityMoney)
          let count = orderData.CommodityNum
          let couponId = self.data.couponInfo ? self.data.couponInfo.id : ''
          let code = res.code
          let orderId = self.data.orderId

          wx.showLoading({
            title: '加载中',
            mask: true
          })

          pay.getPayParams(userId, commodityMoney, count, couponId, code, orderId, (res) => {
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
    let couponType = this.data.couponType
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        wx.navigateTo({
          url: '/page/home/groupon_paycomplete/groupon_paycomplete?orderId=' + orderId + '&couponType=' + couponType,
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
  selectCouponTap() {
    wx.navigateTo({
      url: '/page/home/new_coupon/new_coupon?money=' + this.data.totalPrice,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.useCouponInfo) {
      this.setData({
        couponInfo: app.globalData.useCouponInfo
      })
      this.loadCouponData(app.globalData.useCouponInfo.id, this.data.orderInfo.CommodityID, this.data.orderInfo.CommodityNum)
    } else if (this.data.couponInfo) {
      this.setData({
        couponInfo: null
      })
      //console.log(this.data.orderInfo)
      this.loadCouponData(-1, this.data.orderInfo.CommodityID, this.data.orderInfo.CommodityNum)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
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