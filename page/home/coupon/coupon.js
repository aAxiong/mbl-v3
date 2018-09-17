
import {Coupon} from 'coupon_model.js'
var coupon = new Coupon()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couIndex:0,
    couponList:[],
    activityList:[],
    couponSize:8,
    couponIndex:1,
    couponFlag:false,
    actiSize:8,
    actiIndex:1,
    actiFlag:false,
    isPhone:true,
    mask:true,
    isClick:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '优惠活动',
    })
    this.couponData(this.data.couponSize,this.data.couponIndex)
    this.activityData(this.data.actiSize, this.data.actiIndex)
  },
  //优惠券
  couponData(pageSize,pageIndex){
    let _self = this
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    coupon.getCouponData(pageSize,pageIndex,(res)=>{
      if (res.DisCouponList.length === 0){
        //是否下拉加载
        this.setData({
          couponFlag:true,
          mask:false
        })
        wx.hideLoading()
      }else{
        let couponListLen = this.data.couponList
        couponListLen = couponListLen.concat(res.DisCouponList)
        this.setData({
          couponList: couponListLen,
          mask:false
        })
        //领取优惠券改变状态值
        _self.couponNewList = couponListLen
        wx.hideLoading()
      }
    })
  },
  //活动
  activityData(pageSize,pageIndex){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    coupon.getActivityData(pageSize, pageIndex,(res)=>{
      if(res.DisCouponList.length === 0){
        this.setData({
          actiFlag:true
        })
        wx.hideLoading()
      }else{
        let activityListLen = this.data.activityList
        activityListLen = activityListLen.concat(res.DisCouponList)
        this.setData({
          activityList: activityListLen
        })
        wx.hideLoading()
      }
    })
  },
  //切换
  couponTap(e){
    let id = e.target.dataset.id
    this.setData({
      couIndex:id
    })
  },
  //领取优惠券
  getCoupon(e){
    wx.showLoading({
      title: '领取中...',
      mask: true
    })

    let couponId = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index
 
    coupon.reivceCoupon(couponId,(res)=>{
      if(res.Status == 0){
        wx.hideLoading()
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
        this.couponNewList[index].IsGet = 1 //改变当前点击优惠券状态
        this.setData({
          couponList: this.couponNewList
        })
      }else if(res.Status == 5){
        if(res.Datas == 3){
          wx.hideLoading()
          wx.showToast({
            title: '请先完善信息',
            icon: 'none',
            mask:true,
            duration: 1000
          })
          setTimeout(()=>{
            wx.navigateTo({
              url: '/page/home/phone/phone',
            })
          },1000)
          
        }else if(res.Datas == 2){
          wx.hideLoading()
          wx.showToast({
            title: '优惠券已领完',
            icon: 'none',
            duration: 1000
          })
        }
      }else if(res.Status == 1){
        wx.hideLoading()
        wx.showToast({
          title: '领取出错',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  activityTap(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/home/activ_detail/activ_detail?id='+id,
    })
  },
  //下拉加载
  onReachBottom: function () {
    //优惠券下拉加载 
    //couIndex 当前所在tab选项，加载优惠券还是活动
    if (!this.data.couponFlag && this.data.couIndex==0){
      let cIndex = this.data.couponIndex += 1
      this.couponData(this.data.couponSize, cIndex)
    }
    //活动下拉加载
    if (!this.data.actiFlag && this.data.couIndex==1){
      let aIndex = this.data.actiIndex += 1
      this.activityData(this.data.actiSize, aIndex)
    }
    
  }
})