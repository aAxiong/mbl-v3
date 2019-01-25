import {
  Base
} from '../../../utils/base.js'

class Pay extends Base {
  constructor() {
    super()
  }

  getPayParams(userId, money, couponId, code, IntegralOffsetMoney, integralInput, callback) {
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 9,
        OpenUserID: userId,
        SumMoney: money,
        DisCouponID: couponId,
        Code: code,
        IntegralOffsetMoney: IntegralOffsetMoney,
        Integral: integralInput
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getUseCoupon(callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 15,
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
  Pay
}