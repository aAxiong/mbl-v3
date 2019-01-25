import {
  Base
} from '../../../utils/base.js'

class Ordering extends Base {
  constructor() {
    super()
  }

  getGoodsData(seatNumber, userId, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 5,
        OpenUserID: userId,
        SeatNumber: seatNumber
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  getOfferData(couponId, totalPrice, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 12,
        DisCouponID: couponId,
        SumCommodityMoney: totalPrice
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  getPayParams(openUserId, code, seatNumber, couponId, userNumber, IntegralOffsetMoney, integralInput, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 7,
        OpenUserID: openUserId,
        Code: code,
        SeatNumber: seatNumber,
        DisCouponID: couponId,
        UsersNumber: userNumber,
        IntegralOffsetMoney: IntegralOffsetMoney,
        Integral: integralInput
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
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
  Ordering
}