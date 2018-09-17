import { OrderingDetail } from 'order_model.js'
var ordering = new OrderingDetail()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: '',
    orderId: '',
    isShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderDetail(options.id)
    this.setData({
      orderId: options.id
    })
  },
  loadOrderDetail(orderId) {
    wx.showLoading({
      title: '加载中...',
    })
    ordering.getOrderDetailData(orderId, (res) => {
      if (res.Status === 0) {
        wx.hideLoading()
        this.setData({
          orderInfo: res.Datas,
          isShow: false
        })
      }
    })
  },
  orderComplete(){
    wx.switchTab({
      url: '/page/home/home',
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