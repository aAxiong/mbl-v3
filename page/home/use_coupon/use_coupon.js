
import {UseCoupon} from 'coupon_model.js'
var useCoupon = new UseCoupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    payMoney:'',
    pageSize:7,
    pageIndex:1,
    loadFlag:false,
    mask:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageSize = this.data.pageSize
    let pageIndex = this.data.pageIndex
    wx.setNavigationBarTitle({
      title: '可用优惠券',
    })
    this.setData({
      payMoney:options.money
    })
    this.getUseCoupon(pageSize,pageIndex)
  },
  //加载优惠券
  getUseCoupon(pageSize,pageIndex){
    wx.showLoading({
      title: '加载中...',
    })
    useCoupon.getUseCoupon(pageSize,pageIndex,(res)=>{
      if(res.Status == '0'){
        let couponListData = this.data.couponList
        if (res.Datas.length == 0 ){
          this.setData({
            loadFlag: true,
            mask:false
          })
          wx.hideLoading()
        }else{
          couponListData = couponListData.concat(res.Datas)
          this.setData({
            couponList: couponListData,
            mask: false
          })
          wx.hideLoading()
        }
      }
    })
  },
  useCouponTap(e){
    let couponId = e.currentTarget.dataset.id
    let couponType = e.currentTarget.dataset.type
    app.globalData.couponId = couponId
    app.globalData.couponType = couponType
    wx.navigateBack({
      delta:1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.loadFlag){
      let size = this.data.pageSize
      let index = this.data.pageIndex += 1
      this.getUseCoupon(size, index)
    }
  },
})