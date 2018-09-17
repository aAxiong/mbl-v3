import {
  UseCoupon
} from 'my_active_model.js'
var useCoupon = new UseCoupon()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUseCoupon()
  },
  //加载优惠券
  getUseCoupon(pageSize, pageIndex) {
    wx.showLoading({
      title: '加载中...',
    })
    useCoupon.getUseCoupon((res) => {
      setTimeout(() => {
        wx.hideLoading()
        //停止刷新
        wx.stopPullDownRefresh()
      }, 500)
      if (res.Status == '0') {
        let couponListData = res.Datas.DisCouponList
        if (couponListData.length === 0) {
          this.setData({
            isShow: true,
          })
        } else {
          this.setData({
            isShow: false,
            couponList: couponListData
          })
        }
      }
    })
  },
  jumpActive(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/home/activ_detail/activ_detail?id=' + id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

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