
import {Base} from '../../../utils/base.js'


class Coupon extends Base{
  constructor(){
    super()
  }

  //获取优惠券数据
  getCouponData(pageSize,pageIndex,callback){
    //用户id
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'HomePage.ashx',
      data:{
        Type:4,
        DisCouponType:'1',
        OpenUserID:userId,
        PageSize: pageSize,
        PageIndex: pageIndex
      },
      sCallback:function(data){
        if (data.Status == '0'){
          //回调返回数据
          callback && callback(data.Datas)
        }
      }
    }
    //请求数据
    this.request(params)
  }

  //获取活动数据
  getActivityData(pageSize,pageIndex,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 4,
        DisCouponType: '2',
        OpenUserID: userId,
        PageSize: pageSize,
        PageIndex: pageIndex
      },
      sCallback: function (data) {
        if (data.Status == '0') {
          callback && callback(data.Datas)
        }
      }
    }
    this.request(params)
  }

  //领取优惠券
  reivceCoupon(couponId,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'HomePage.ashx',
      data:{
        Type: 6,
        ID: couponId,
        OpenUserID: userId,
      },
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {Coupon}