import { OrderingDetail } from 'ordering_model.js'
var ordering = new OrderingDetail()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: '',
    orderId: '',
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderDetail(options.id)
    this.setData({
      orderId: options.id,
      index: options.index
    }) 
  },
  loadOrderDetail(orderId) {
    ordering.getOrderDetailData(orderId, (res) => {
      if (res.Status === 0) {
        this.setData({
          orderInfo: res.Datas
        })
      }
    })
  },
  paymentTap(){
    wx.navigateTo({
      url: '/page/mine/ordering_payment/ordering_payment?id='+ this.data.orderId
    })
  },
  //取消订单
  orderCancleTap(){
    let userId = wx.getStorageSync('userId')
    ordering.orderCancle(this.data.orderId,userId,(res)=>{
      if (res.Status === 0) {
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        wx.showToast({
          title: '订单已取消',
          icon: 'none',
          mask: true
        })
        prevPage.setData({
          spliceIndex: this.data.index
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      } else {
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