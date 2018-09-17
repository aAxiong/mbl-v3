import {
  Base
} from '../../../utils/base.js'

class UseCoupon extends Base {
  constructor() {
    super()
  }

  getUseCoupon(callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 14,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {
  UseCoupon
}