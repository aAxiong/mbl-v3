
import {Store} from 'store_model.js'
var store = new Store()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeImgs:[],
    storeInfo:{},
    prevImgsList:[],
    mask:true,
    imgUrl:app.globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '店铺'
    })
    this.loadStore()
  },
  //加载门店信息
  loadStore(){
    wx.showLoading({
      title: '加载中...',
    })
    store.getStoreData((res)=>{
      if(res.Status == '0'){
        let data = res.Datas
        this.setData({
          storeImgs: data.StoreImgList,
          storeInfo: data.StoreInfo,
          mask:false
        })
        wx.hideLoading()
        
        //设置标题
        wx.setNavigationBarTitle({
          title: data.StoreInfo.StoreName,
        })

        //图片预览
        let imgs = data.StoreImgList,pevImgsPath = []
        imgs.forEach((item,index)=>{
          pevImgsPath.push(this.data.imgUrl+item.Path)
        })
        this.setData({
          prevImgsList: pevImgsPath
        })
      }
    })
  },
  //打开店铺位置
  locationTap() {
    let locationInfo = this.data.storeInfo
    let [long, lat] = locationInfo.Location.split(',')
    let storeName = locationInfo.StoreName,
      storeAddress = locationInfo.Address
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      name: storeName,
      address: storeAddress
    })
  },
  //联系电话
  telTap() {
    let tel = this.data.storeInfo.Phone
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  //图片预览
  prevImgsTap(e){
    let currentImg = e.currentTarget.dataset.url
    wx.previewImage({
      current:this.data.imgUrl+currentImg,
      urls: this.data.prevImgsList,
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