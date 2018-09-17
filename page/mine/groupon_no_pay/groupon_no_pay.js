import { OrderDetail } from '../groupon_order_model.js'
var orderDetail = new OrderDetail()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.id
    let orderDetailId = options.detailId
    this.loadOrderDetail(orderId, orderDetailId)
  },
  loadOrderDetail(orderId, orderDetailId) {
    wx.showLoading({
      title: '加载中...',
    })
    orderDetail.getOrderDetail(orderId, orderDetailId,(res) => {
      if (res.Status === 0) {
        this.setData({
          order: res.Datas.OrderDetail[0],
          isShow:false
        })
        wx.hideLoading()
      }
    })
  },
  userPayment(e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/mine/groupon_payment/groupon_payment?orderId=' + orderId,
    })
  },
  cancelPayment(e){
    let orderId = e.currentTarget.dataset.id
    orderDetail.orderCancel(orderId,(res)=>{
      if (res.Status === 0) {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        wx.showToast({
          title: '订单已取消',
          icon:'none',
          mask:true
        })
        prevPage.setData({
          cancelPaymentLoad:true
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }else{
        wx.showToast({
          title: '订单取消失败',
          icon: 'none',
          mask: true
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