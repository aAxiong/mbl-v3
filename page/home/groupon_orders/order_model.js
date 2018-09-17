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

  getPayParams(openUserId, money, count, couponId, code, commodityId, commodityName, categoryId, callback) {
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
        CategoryID: categoryId
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

}

export {
  Pay
}