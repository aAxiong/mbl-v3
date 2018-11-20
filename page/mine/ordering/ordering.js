import {
  OrderingMine
} from 'ordering_model.js'
var orderingMine = new OrderingMine()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    curIndex: 0,
    curStatus: -1, //订单状态
    pageIndex: 1,
    spliceIndex: '',
    isLoad: true,
    isShow: true,
    imgUrl: app.globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadOrderData(this.data.pageIndex, -1, 1)
  },
  //订单数据
  loadOrderData(pageIndex, statu, s) {
    wx.showLoading({
      title: '加载中...',
    })
    let userId = wx.getStorageSync('userId')
    orderingMine.getOrderData(userId, pageIndex, statu, (res) => {
      setTimeout(() => {
        wx.hideLoading()
        //停止刷新
        wx.stopPullDownRefresh()
      }, 500)
      if (res.Status === 0) {
        if (res.Datas.OrderList.length === 0) {
          this.setData({
            isLoad: false,
            isShow: false
          })
        } else if (pageIndex === 1) { //如第一页则覆盖否则合并
          this.setData({
            orderList: res.Datas.OrderList,
            isShow: false
          })
        } else {
          if (s == 1) {
            this.setData({
              orderList: res.Datas.OrderList,
              isShow: false
            })
            return
          }
          this.setData({
            orderList: this.data.orderList.concat(res.Datas.OrderList),
            isShow: false
          })
        }

      }
    })
  },
  //订单切换
  orderSwitchTap(e) {
    let index = e.currentTarget.dataset.idx
    this.setData({
      curIndex: index,
      curStatus: index - 1,
      isLoad: true,
      pageIndex: 1
    })
    this.loadOrderData(1, index - 1)
  },
  orderDetailTap(e) {
    let orderId = e.currentTarget.dataset.id
    let status = e.currentTarget.dataset.status
    let index = e.currentTarget.dataset.idx
    if (status == 1) {
      wx.navigateTo({
        url: '/page/mine/ordering_detail/ordering_detail?id=' + orderId,
      })
    } else if (status == 0) {
      wx.navigateTo({
        url: '/page/mine/ordering_pay/ordering_pay?id=' + orderId + '&index=' + index,
      })
    }

  },
  orderPayTap(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/mine/ordering_payment/ordering_payment?id=' + orderId
    })
  },
  onShow() {
    this.onLoad()
    // let spliceIndex = this.data.spliceIndex
    // if (spliceIndex) {
    //   this.data.orderList.splice(spliceIndex, 1)
    //   this.setData({
    //     orderList: this.data.orderList
    //   })
    // }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoad) {
      let pageIndex = this.data.pageIndex += 1
      this.loadOrderData(pageIndex, this.data.curStatus)
    }
  },

  onPullDownRefresh() {
    this.onLoad()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})