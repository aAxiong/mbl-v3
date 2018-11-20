import {
  Groupon
} from 'groupon-model.js'
var groupon = new Groupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuIndex: 0,
    menuList: [],
    goodsList: [],
    pageIndex: 1,
    typeId: -1,
    imgUrl: app.globalData.imgUrl,
    isShow: true,
    isNoneCoupon: true,
    isBottom: true //是否下拉加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadGrouponType()
    this.loadGoodsData(-1, 1)
  },
  loadGrouponType() {
    groupon.getGrouponType((res) => {
      if (res.Status === 0) {
        if (res.Datas.CategoryList.length > 0) {
          let categoryList = res.Datas.CategoryList
          categoryList.unshift({
            CategoryID: -1,
            CategoryName: '全部'
          })
          this.setData({
            menuList: categoryList
          })
        }
      }
    })
  },
  loadGoodsData(categoryId, pageIndex) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    groupon.getGoodsData(categoryId, pageIndex, (res) => {
      setTimeout(() => {
        wx.hideLoading()
        //停止刷新
        wx.stopPullDownRefresh()
      }, 500)
      if (res.Status === 0) {
        if (res.Datas.length === 0) {
          this.setData({
            isBottom: false,
            isShow: false,
            isNoneCoupon: false
          })
        } else {
          if (pageIndex == 1) {
            this.setData({
              goodsList: res.Datas,
              isShow: false,
              isNoneCoupon: true
            })
            return
          }
          this.setData({
            goodsList: this.data.goodsList.concat(res.Datas),
            isShow: false,
            isNoneCoupon: true
          })
        }

      }
    })
  },
  menuTap(e) {
    let index = e.currentTarget.dataset.idx
    let typeId = e.currentTarget.dataset.id
    this.setData({
      isBottom: true,
      pageIndex: 1,
      goodsList: [],
      isNoneCoupon: true,
      menuIndex: index,
      typeId: typeId
    })
    this.loadGoodsData(typeId, 1)
  },
  goodsDetailTap(e) {
    let comId = e.currentTarget.dataset.comid
    wx.navigateTo({
      url: '/page/home/groupon_detail/groupon_detail?commodityId=' + comId,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isBottom) {
      let pageIndex = this.data.pageIndex += 1
      let typeId = this.data.typeId
      this.loadGoodsData(typeId, pageIndex)
    }
  },
  onPullDownRefresh() {

    this.onLoad()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})