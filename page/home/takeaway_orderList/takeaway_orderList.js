// page/home/takeaway_orderList/takeaway_orderList.js
import {
  TOrderList
} from 'takeaway_orderList_model.js'
var tOrderList = new TOrderList()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    dropStatus: false,
    imgUrl: 'https://xcx.mblsoft.com'
  },
  loadData: function() {
    tOrderList.getOrderData((res) => {
      wx.hideLoading()
      if (res.Status === 0) {
        let os = [];
        for (var i = 0; i < res.Datas.OrderList.length; i++) {
          res.Datas.OrderList[i].check = false;
        }
        this.setData({
          orderList: res.Datas
        })
        //停止刷新
        wx.stopPullDownRefresh()
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  dropUp: function(e) {
    let idx = e.currentTarget.dataset.index;
    this.data.orderList.OrderList[idx].check = false;
    let list = this.data.orderList;
    this.setData({
      orderList: list
    })
  },
  dropDown: function(e) {
    let idx = e.currentTarget.dataset.index;
    this.data.orderList.OrderList[idx].check = true;
    let list = this.data.orderList;
    this.setData({
      orderList: list
    })
  },
  Navigation: function() {
    let latitude = parseFloat(this.data.orderList.StoreAddress.receiver_lat);
    let longitude = parseFloat(this.data.orderList.StoreAddress.receiver_lng);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  DateMinus(sDate) {　　
    var sdate = new Date(sDate.replace(/-/g, "/"));　　
    var now = new Date();　　
    var days = now.getTime() - sdate.getTime();　　
    var day = parseInt(days / (1000 * 60));　　
    return day;
  },
  Reminder: function(e) { //催单
    let idx = e.currentTarget.dataset.index;
    let index = e.currentTarget.dataset.idx;
    var time = this.DateMinus(this.data.orderList.OrderList[index].CreateTime)
    if (time < 15) {
      wx.showToast({
        title: '还不到催单时间哦~',
        mask: true
      })
    }
    tOrderList.reminder(idx, (res) => {
      console.log(res);
      if (res.Status == 0) {
        wx.showToast({
          title: '催单成功',
          mask: true
        })
      } else {
        wx.showToast({
          title: '催单失败',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  jumpInfoPage: function(e) {
    wx.navigateTo({
      url: '/page/home/takeaway_orderInfo/takeaway_orderInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  jumpHome: function() {
    wx.navigateTo({
      url: '/page/home/takeaway/takeaway'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.loadData();
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.loadData();
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