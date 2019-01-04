// page/mine/my_integral/my_integral.js
import {
  Myintegral
} from 'my_integral_model.js'
const app = getApp()
var myintegral = new Myintegral()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNav: 1,
    tipsText: '兑换成功，请到团购订单列表查看兑换券',
    alertShow: false,
    DetailList: [], //明细数组
    shopMallList: [], //积分商城数组
    MyIntegral: '',
    imgUrl: app.globalData.imgUrl,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.tips = this.selectComponent("#tips");
    this.page = 1; //积分明细页数
    this.getShopMallData();
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
  getShopMallData() { //获取积分明细数据
    wx.showLoading({
      title: '加载中...',
    })
    myintegral.getShopMallData((res) => {
      wx.hideLoading();
      if (res.Status == '0') {
        this.setData({
          shopMallList: res.Datas.CommodityList,
          MyIntegral: res.Datas.MyIntegral
        })
      } else {
        wx.showToast({
          title: '加载失败',
          mask: true
        })
      }
      wx.stopPullDownRefresh()
    })
  },
  getInfoData() { //获取积分明细数据
    wx.showLoading({
      title: '加载中...',
    })
    myintegral.getIntDetails(this.page, (res) => {
      wx.hideLoading();
      if (res.Status == '0') {
        if (res.Datas.DetailList.length > 0) {
          this.page++
        }
        if (this.page == 1) {
          this.setData({
            DetailList: res.Datas.DetailList
          })
        } else {
          this.setData({
            DetailList: this.data.DetailList.concat(res.Datas.DetailList)
          })
        }
      } else {
        wx.showToast({
          title: '加载失败',
          mask: true
        })
      }
      wx.stopPullDownRefresh()
    })
  },
  changNav: function(e) { //导航条切换
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.page = 1
      this.getInfoData();
    } else {
      this.getShopMallData();
    }
    this.setData({
      activeNav: index
    })
  },

  optExchange: function(e) { //兑换
    let id = e.currentTarget.dataset.id;
    let shopMallList = this.data.shopMallList;
    wx.showLoading({
      title: '加载中...',
    })
    myintegral.optExchange(id, (res) => {
      wx.hideLoading();
      if (res.Status == '0') {
        this.showWindowSucc();
        for (var i = 0, length = shopMallList.length; i < length; i++) {
          if (shopMallList[i].CommodityID == id) {
            shopMallList[i].InventoryNumber = shopMallList[i].InventoryNumber - 1;
          }
        }
        this.setData({
          shopMallList: shopMallList
        })
        console.log(this.data.shopMallList);
      } else {
        this.showWindowFail();
      }
    })
  },
  showWindowFail: function() { //兑换失败弹窗
    this.tips.showAlert();
    this.setData({
      tipsText: '兑换失败，风里雨里，攒够积分等你~'
    })
  },
  showWindowSucc: function() { //兑换成功弹窗
    this.tips.showAlert();
    this.setData({
      tipsText: '兑换成功，请到团购订单列表查看兑换券'
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.activeNav == 0) {
      this.page = 1
      this.getInfoData();
    } else {
      this.getShopMallData();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.activeNav == 0) {
      // this.page++;
      this.getInfoData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})