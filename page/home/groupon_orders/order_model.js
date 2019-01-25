import {
  Base
} from '../../../utils/base.js'

class Pay extends Base {
  constructor() {
    super()
  }

  getCouponIsUsed(openUserId, disCouponId, commodityId, commodityNum, callback) {
    let params = {
      url: 'SpellGroup.ashx',
      data: {
        Type: 7,
        OpenUserID: openUserId,
        DisCouponID: disCouponId,
        CommodityID: commodityId,
        CommodityNum: commodityNum
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  getPayParams(openUserId, money, count, couponId, code, commodityId, commodityName, categoryId, IntegralOffsetMoney, integralInput, callback) {
    let params = {
      url: 'SpellGroup.ashx',
      data: {
        Type: 4,
        OpenUserID: openUserId,
        ProductNum: count,
        Money: money,
        DisCouponID: couponId,
        Code: code,
        CommodityID: commodityId,
        CommodityName: commodityName,
        CategoryID: categoryId,
        IntegralOffsetMoney: IntegralOffsetMoney,
        Integral: integralInput
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getUseCoupon() {
    wx.showLoading({
      title: '加载中...',
    })
    pay.getUseCoupon((res) => {
      if (res.Status == '0') {
        this.setData({
          couponList: res.Datas
        })
        wx.hideLoading()
      }
    })
  }
  getintegral(callback) { //积分抵现
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 19,
        OpenUserID: userid,
      },
      sCallback: function(data) {
        if (data.Status == '0') {
          data = data
          callback && callback(data)
        }
      }
    }
    this.request(params)
  }
}

export {
  Pay
}