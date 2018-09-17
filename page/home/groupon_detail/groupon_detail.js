
import {Groupon} from 'groupon_model.js'
let groupon = new Groupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsInfo:'',
    isShow:false,
    totalPrice:'',
    price:'',
    count:1,
    imgUrl: app.globalData.imgUrl,
    isLoad:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commodityId = options.commodityId
    this.loadGrouponDetail(commodityId)
  },
  loadGrouponDetail(commodityId){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    groupon.getGrouponDetail(commodityId,(res)=>{
      if(res.Status === 0){
        wx.setNavigationBarTitle({
          title: res.Datas.CommodityList.CommodityName,
        })
        this.setData({
          goodsInfo:res.Datas,
          price:res.Datas.CommodityList.Money,
          totalPrice: res.Datas.CommodityList.Money,
          isLoad:false
        })
        wx.hideLoading()
      }
    })
  },
  //下单显示
  ordersTap(){
    this.setData({
      isShow:true
    })
  },
  //下单取消
  ordersCancel(){
    this.setData({
      isShow: false
    })
  },
  //数量增加
  incrementTap(){
    let count = this.data.count += 1
    //let money = parseFloat(this.data.price * count)
    let money = (parseFloat(this.data.totalPrice) + parseFloat(this.data.price)).toFixed(2)
    this.setData({
      count: count,
      totalPrice:money
    })
  },
  decrementTap(){
    let count = this.data.count -= 1
    let money = (parseFloat(this.data.totalPrice) - parseFloat(this.data.price)).toFixed(2)
    if(count < 1){
      count = 1
      money = parseFloat(this.data.price).toFixed(2)
    }
    //let money = parseFloat(this.data.price * count)
    this.setData({
      count: count,
      totalPrice: money
    })
  },
  ordersPayTap(){
    wx.setStorage({
      key: 'goodsInfo',
      data: this.data.goodsInfo.CommodityList,
    })
    this.setData({
      isShow: false
    })
    wx.navigateTo({
      url: '/page/home/groupon_orders/groupon_orders?totalPrice='+this.data.totalPrice+'&count='+this.data.count,
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