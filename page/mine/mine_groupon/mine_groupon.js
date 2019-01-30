import {
  Groupon
} from 'groupon_model.js'
var groupon = new Groupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    currentIndex: 0,
    status: -1,
    pageIndex: 1,
    cancelPaymentLoad: false, //取消付款
    imgUrl: app.globalData.imgUrl,
    isShow: true,
    isLoad: true,
    isNone: true //加载时不显示没有数据图标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadOrdersData(this.data.status, this.data.pageIndex, 1)
  },
  //加载订单
  loadOrdersData(status, pageIndex, type1) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    groupon.getOrdersData(status, pageIndex, (res) => {
      if (res.Status === 0) {
        if (res.Datas.OrderList.length === 0) {
          this.setData({
            isLoad: false,
            isShow: false,
            isNone: false
          })
        } else {
          let newlist;
          if (type1 == 1) {
            newlist = this.data.orderList.concat(res.Datas.OrderList)
          } else {
            newlist = res.Datas.OrderList
          }
          this.setData({
            orderList: newlist,
            isShow: false,
            isNone: true
          })
        }
        setTimeout(() => {
          wx.hideLoading()
          //停止刷新
          wx.stopPullDownRefresh()
        }, 500)
      }
    })
  },
  navTap(e) {
    let status = parseInt(e.currentTarget.dataset.idx) - 1
    let index = e.currentTarget.dataset.idx
    this.setData({
      status: status,
      currentIndex: index,
      pageIndex: 1,
      isLoad: true,
      orderList: []
    })
    this.loadOrdersData(status, 1)
  },
  //进入不同详情
  orderDetailTap(e) {
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let detailId = e.currentTarget.dataset.detailid

    if (status == 2) {
      wx.navigateTo({
        url: '/page/mine/groupon_unused/groupon_unused?id=' + id + '&detailId=' + detailId,
      })
    } else if (status == 3) {
      wx.navigateTo({
        url: '/page/mine/groupon_used/groupon_used?id=' + id + '&detailId=' + detailId,
      })
    } else if (status == 4) {
      wx.navigateTo({
        url: '/page/mine/groupon_refund/groupon_refund?id=' + id + '&detailId=' + detailId,
      })
    } else if (status == 1) {
      wx.navigateTo({
        url: '/page/mine/groupon_no_pay/groupon_no_pay?id=' + id + '&detailId=' + detailId,
      })
    }
  },
  userPayment(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/mine/groupon_payment/groupon_payment?orderId=' + orderId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.cancelPaymentLoad) {
      this.setData({
        orderList: []
      })
      this.loadOrdersData(this.data.status, 1)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      cancelPaymentLoad: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      cancelPaymentLoad: false
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoad) {
      let pageIndex = this.data.pageIndex += 1
      this.loadOrdersData(this.data.status, pageIndex, 1)
    }
  },
  onPullDownRefresh() {
    this.setData({
      pageIndex: 1
    })
    this.loadOrdersData(this.data.status, this.data.pageIndex, 0)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})