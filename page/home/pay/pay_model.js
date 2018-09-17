import {
  Base
} from '../../../utils/base.js'

class Pay extends Base {
  constructor() {
    super()
  }

  getPayParams(userId, money, couponId, code, callback) {
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 9,
        OpenUserID: userId,
        SumMoney: money,
        DisCouponID: couponId,
        Code: code
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

}

export {
  Pay
}