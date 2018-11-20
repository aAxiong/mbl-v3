import {
  Order
} from 'morder_model.js'
var order = new Order()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    storeName: '',
    pageSize: 10,
    pageIndex: 1,
    mineFlag: false,
    mask: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '线下订单',
    })
    let pageSize = this.data.pageSize,
      pageIndex = this.data.pageIndex
    this.loadOrder(pageSize, pageIndex)
    let storeName = wx.getStorageSync('storeName')
    this.setData({
      storeName: storeName
    })
  },
  loadOrder(pageSize, pageIndex) {
    wx.showLoading({
      title: '加载中...',
    })
    order.getOrder(pageSize, pageIndex, (res) => {
      if (res.Status == 0) {
        let newOrderList = res.Datas.OrderList
        if (newOrderList.length === 0) {
          this.setData({
            mineFlag: true,
            mask: false
          })
        } else {
          newOrderList = this.data.orderList.concat(newOrderList)
          this.setData({
            orderList: newOrderList,
            mask: false
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
  loadOrder1(pageSize, pageIndex) {
    wx.showLoading({
      title: '加载中...',
    })
    order.getOrder(pageSize, pageIndex, (res) => {
      if (res.Status == 0) {
        let newOrderList = res.Datas.OrderList
        if (newOrderList.length === 0) {
          this.setData({
            mineFlag: true,
            mask: false
          })
        } else {
          this.setData({
            orderList: newOrderList,
            mask: false
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
  orderDetail(e) {
    let index = e.currentTarget.dataset.idx
    let order = this.data.orderList[index]
    wx.navigateTo({
      url: '/page/mine/order_detail/order_detail?disMoney=' + order.DisMoney + '&payMoney=' + order.PayMoney + '&payTime=' + order.PayTime +
        '&total=' + order.Total_fee,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.mineFlag) {
      let pageIndex = this.data.pageIndex += 1
      this.loadOrder(this.data.pageSize, pageIndex)
    }

  },
  onPullDownRefresh() {
    this.loadOrder1(10, 1)
  }

})