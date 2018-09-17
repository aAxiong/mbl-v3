import {
  Ordering
} from 'ordering_model.js'
var ordering = new Ordering()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    totalNum: '',
    totalPrice: '', //总价
    priceIsCoupon: '', //优惠后的总价
    couponInfo: null,
    numberVal: 2,
    isUsedCoupon: 0,
    isShowDisCoupon: '',
    isShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadGoodsData()
  },
  //商品列表
  loadGoodsData() {
    wx.showLoading({
      title: '加载中...'
    })
    let userId = wx.getStorageSync('userId')
    let deskNumber = wx.getStorageSync('deskNumber')
    ordering.getGoodsData(deskNumber, userId, (res) => {
      wx.hideLoading()
      if (res.Status === 0) {
        this.setData({
          goodsList: res.Datas.ShoppingCartList,
          totalNum: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice,
          priceIsCoupon: res.Datas.SumCommodityPrice,
          isUsedCoupon: res.Datas.AvailableCouponsNum,
          isShowDisCoupon: res.Datas.IsShowDisCoupon,
          isShow: false
        })
      } else {
        this.setData({
          isShow: false
        })
      }
    })
  },
  //优惠券数据
  getOfferData(couponId, totalPrice) {
    ordering.getOfferData(couponId, totalPrice, (res) => {
      if (res.Status === 0) {
        this.setData({
          priceIsCoupon: res.Datas.PayMoney
        })
      }
    })
  },
  selectCouponTap() {
    wx.navigateTo({
      url: '/page/home/new_coupon/new_coupon?money=' + this.data.totalPrice,
    })
  },
  orderNumber(e) {
    let num = e.detail.value
    this.setData({
      numberVal: num
    })
  },
  paymentTap() {
    if (this.data.numberVal >= 1) {
      this.getUserPayParams(this.data.numberVal)
    } else {
      wx.showToast({
        title: '请填写用餐人数',
        icon: 'none',
        mask: true
      })
    }
  },
  //获取支付参数
  getUserPayParams(uNumber) {
    let self = this
    wx.login({
      success: function(res) {
        if (res.code) {
          let userId = wx.getStorageSync('userId')
          let couponId = self.data.couponInfo ? self.data.couponInfo.id : ''
          let code = res.code
          let seatNumber = wx.getStorageSync('deskNumber')
          let userNumber = uNumber

          wx.showLoading({
            title: '加载中',
            mask: true
          })

          ordering.getPayParams(userId, code, seatNumber, couponId, userNumber, (res) => {
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
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        wx.navigateTo({
          url: '/page/home/ordering_complete/ordering_complete?id=' + orderId,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //使用优惠券获取实际支付金额
    if (app.globalData.useCouponInfo) {
      this.getOfferData(app.globalData.useCouponInfo.id, this.data.totalPrice)
      this.setData({
        couponInfo: app.globalData.useCouponInfo
      })
    } else {
      this.setData({
        couponInfo: null
      })
      this.getOfferData(-1, this.data.totalPrice)
    }
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