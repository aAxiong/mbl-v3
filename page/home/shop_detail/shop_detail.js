
import {ShopDetail} from 'shop_model.js'
var shop = new ShopDetail()

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.globalData.imgUrl,
    shopDetail:{},
    mask:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '详情',
    })
    let shopid = options.id
    this.shopData(shopid)
  },
  shopData(id){
    wx.showLoading({
      title: '加载中...',
    })
    shop.getShopData(id,(res)=>{
      this.setData({
        shopDetail:res[0],
        mask:false
      })
      wx.hideLoading()
    })
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