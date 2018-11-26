// page/store_new/store.js
import {
  Store
} from 'store_model.js'
var store = new Store()
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbarActive: 1,
    storeImgs: [],
    storeInfo: {},
    prevImgsList: [],
    mask: true,
    imgUrl: app.globalData.imgUrl,
    activeList: [] //门店动态列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadStore()
  },
  chageNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navbarActive: index
    })
    if (index == 0) {
      this.page = 1
      this.loadActive();
    }
  },

  //门店照片图片预览
  prevImgsTap(e) {
    let currentImg = e.currentTarget.dataset.url
    wx.previewImage({
      current: this.data.imgUrl + currentImg,
      urls: this.data.prevImgsList,
    })
  },
  //最新动态图片预览
  activeImgsTap(e) {
    let index = e.currentTarget.dataset.index
    let currentImg = e.currentTarget.dataset.url
    let imglist = this.data.activeList[index].ImgPathList
    let showlist = []
    for (var i = 0, length = imglist.length; i < length; i++) {
      showlist.push(this.data.imgUrl + imglist[i].ImgPath)
    }
    wx.previewImage({
      current: this.data.imgUrl + currentImg,
      urls: showlist
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  //加载门店信息
  loadStore() {
    wx.showLoading({
      title: '加载中...',
    })
    store.getStoreData((res) => {
      if (res.Status == '0') {
        let data = res.Datas
        this.setData({
          storeImgs: data.StoreImgList,
          storeInfo: data.StoreInfo,
          mask: false
        })
        //设置标题
        wx.setNavigationBarTitle({
          title: data.StoreInfo.StoreName,
        })
        //图片预览
        let imgs = data.StoreImgList,
          pevImgsPath = []
        imgs.forEach((item, index) => {
          pevImgsPath.push(this.data.imgUrl + item.Path)
        })
        this.setData({
          prevImgsList: pevImgsPath
        })
        //停止刷新
        setTimeout(() => {
          wx.stopPullDownRefresh()
          wx.hideLoading();
        }, 500)
      }
    })
  },
  loadActive() { //加载门店动态
    wx.showLoading({
      title: '加载中...',
    })
    store.getStoreActive(this.page, (res) => {
      if (res.Status == '0') {
        let data = res.Datas
        this.setData({
          activeList: data
        })
        //停止刷新
        setTimeout(() => {
          wx.stopPullDownRefresh()
          wx.hideLoading();
        }, 500)
      }
    })
  },
  goodTap(e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let activeList = this.data.activeList
    let opt = index == 0 ? "+" : "-"
    store.optGoodsTap(id, opt, (res) => {
      if (res.Status == '0') {
        console.log(res)
        for (var i = 0, length = activeList.length; i < length; i++) {
          if (activeList[i].DynamicInfoID == id) {
            if (index == 0) {
              activeList[i].GiveALikeNumber++
                activeList[i].IsGiveALike = 1
            } else {
              activeList[i].GiveALikeNumber--
                activeList[i].IsGiveALike = 0
            }
          }
        }
        this.setData({
          activeList: activeList
        })
        //   let data = res.Datas
        // wx.hideLoading()
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let active = this.data.navbarActive;
    if (active == 1) {
      this.loadStore();
    } else {
      this.page = 1;
      this.loadActive();
    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (active == 0) {
      this.page++;
      this.loadActive();
    }
  },

})