import {
  Base
} from '../../../utils/base.js'

class CollectCup extends Base {
  constructor() {
    super()
  }

  getActivity(id, callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 5,
        ID: id,
        OpenUserID: userId
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  optExchange(id, condition, callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 17,
        DisCouponID: id,
        Condition: condition,
        OpenUserID: userId
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {
  CollectCup
}