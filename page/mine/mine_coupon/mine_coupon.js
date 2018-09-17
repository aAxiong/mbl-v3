
import {MyCoupon} from 'mcoupon_model.js'
var myCoupon = new MyCoupon

Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentIndex:0,
      noneCoupon:[],    //未使用优惠券
      usedCoupon:[],    //已使用优惠券
      overCoupon:[],    //已过期优惠券
      noneCouponSize:6,    //加载个数
      noneCouponIndex:1,  //加载页数
      isNoneCoupon:false, //是否下拉加载
      usedCouponSize:6,
      usedCouponIndex:1,
      isUsedCoupon:false,
      overCouponSize:6,
      overCouponIndex:1,
      isOverCoupon:false,
      mask:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的优惠券',
    })

    let defaultSize = 6
    let defaultIndex = 1
    this.loadNoneCoupon(defaultSize,defaultIndex)
    this.loadUsedCoupon(defaultSize, defaultIndex)
    this.loadOverCoupon(defaultSize, defaultIndex)
  
  },
  //加载未使用优惠券
  loadNoneCoupon(pageSize,pageIndex){
    wx.showLoading({
      title: '加载中',
    })
    let isUsed = 0
    myCoupon.getMyCoupon(pageSize, pageIndex, isUsed,(res)=>{
        if(res.Status == '0'){
          //返回数据为空不再下拉加载
          if (res.Datas.length == 0) {
            this.setData({
              isNoneCoupon:true,
              mask: false
            })
            wx.hideLoading()
          }else{
            let noneCouponList = this.data.noneCoupon
                noneCouponList = noneCouponList.concat(res.Datas)
            this.setData({
              noneCoupon: noneCouponList,
              mask: false
            })
            wx.hideLoading()
          }
        }
    })
  },
  //加载已使用优惠券
  loadUsedCoupon(pageSize, pageIndex){
    let isUsed = 1
    myCoupon.getMyCoupon(pageSize, pageIndex, isUsed, (res) => {
      if (res.Status == '0') {
        if(res.Datas.lenght == 0){
          //返回数据为空不再下拉加载
          this.setData({
            isUsedCoupon: true
          })
        }else{
          //合并当前数据
          let usedCouponList = this.data.usedCoupon
              usedCouponList = usedCouponList.concat(res.Datas)
          this.setData({
            usedCoupon: usedCouponList
          })
        }
      }
    })
  },
  //加载已过期优惠券
  loadOverCoupon(pageSize, pageIndex){
    let isUsed = 2
    myCoupon.getMyCoupon(pageSize, pageIndex, isUsed, (res) => {
      if (res.Status == '0') {
        if(res.Datas.length == 0){
          //返回数据为空不再下拉加载
          this.setData({
            isOverCoupon: true
          })
        }else{
          //合并当前数据
          let overCouponList = this.data.overCoupon
              overCouponList = overCouponList.concat(res.Datas)
          this.setData({
            overCoupon: overCouponList
          })
        }
      }
    })
  },
  viewDetail(e){
    let index = e.currentTarget.dataset.idx
    let coupon = this.data.noneCoupon[index]
    wx.navigateTo({
      url: '/page/mine/coupon_detail/coupon_detail?condition='+coupon.Condition+'&discount='+coupon.Discount+'&stime='+coupon.StartTime+'&etime='+coupon.EndTime+'&code='+coupon.DisCouponCode+'&type='+coupon.DisType
    })
  },
  //切换
  couponTap(e){
    let idx = e.target.dataset.idx
    this.setData({
      currentIndex:idx
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let currentIndex = this.data.currentIndex
    //加载未使用优惠券，currentIndex在0时加载
    if(currentIndex == 0 && !this.data.isNoneCoupon){
      let index = this.data.noneCouponIndex += 1
      this.loadNoneCoupon(this.data.noneCouponSize, index)
    }
    //加载未使用优惠券，currentIndex在1时加载
    if (currentIndex == 1 && !this.data.isUsedCoupon) {
      let index = this.data.usedCouponIndex += 1
      this.loadUsedCoupon(this.data.usedCouponSize, index)
    }
    //加载未使用优惠券，currentIndex在2时加载
    if (currentIndex == 2 && !this.data.isOverCoupon) {
      let index = this.data.overCouponIndex += 1
      this.loadOverCoupon(this.data.overCouponSize, index)
    }
    
  },

})