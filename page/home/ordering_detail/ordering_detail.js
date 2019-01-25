import {
  Ordering
} from 'ordering_model.js'
var ordering = new Ordering()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowSelect: true,
    goodsData: null,
    commodityId: '',
    goodsCustom: [],
    totalMoney: 0.00,
    isShowSales: 1,
    isShow: true,
    imgUrl: app.globalData.imgUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadGoodsDetail(options.id)
    this.setData({
      commodityId: options.id
    })
  },
  loadGoodsDetail(id) {
    wx.showLoading({
      title: '加载中...',
    })
    ordering.getGoodsDetail(id, (res) => {
      wx.hideLoading()
      if (res.Status === 0) {
        this.setData({
          goodsData: res.Datas.CommodityList,
          goodsCustom: res.Datas.CustomInfoList,
          isShowSales: res.Datas.IsShowSales,
          isShow: false
        })
        wx.setNavigationBarTitle({
          title: res.Datas.CommodityList.CommodityName,
        })
      }
    })
  },
  //下单
  ordersPayTap() {
    wx.navigateTo({
      url: '/page/home/ordering_pay/ordering_pay',
    })
  },
  //显示规格口味
  goodsSizeTap() {
    let ll = this.data.goodsData.LableList.length;
    let sl = this.data.goodsData.SpecificationList.length;
    if (ll === 0 && sl === 0) {
      this.selectData("");
      return
    } else {
      this.setData({
        isShowSelect: false,
        goodsData: this.data.goodsData
      })
    }

  },
  //修改金额
  moneyData(e) {
    let data = e.detail
    // let Money = this.data.goodsData.SpecificationList[data.index].SpecificationPrice || this.data.goodsData.Money
    let Money = this.data.goodsData.Money
    this.setData({
      totalMoney: Money
    })
  },
  //选择,加入购物车 
  selectData(e) {
    let data = e.detail || ""
    let size = data.size || "";
    let taste = data.taste || "";
    if (data != "") {
      this.setData({
        isShowSelect: data.orderSelect
      })
      if (data.type == 1) { //点了取消
        return
      }
    }
    wx.showLoading({
      title: '正在加入购物车...',
      mask: true
    })
    let deskNumber = wx.getStorageSync('deskNumber')
    ordering.addCart(this.data.commodityId, size, taste, deskNumber, 1, (res) => {
      if (res.Status === 0) {
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          mask: true
        })
      } else {
        wx.showToast({
          title: '添加失败',
          mask: true
        })
      }
    })
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