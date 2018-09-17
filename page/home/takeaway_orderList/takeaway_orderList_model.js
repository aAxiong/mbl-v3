import {
  Base
} from '../../../utils/base.js'

class TOrderList extends Base {
  constructor() {
    super()
  }
  getOrderData(callback) { //订单列表
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 15,
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
  reminder(orderid, callback) { //订单列表
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 19,
        OpenUserID: userid,
        OrderID: orderid
      },
      sCallback: function(data) {
        data = data
        callback && callback(data)
      }
    }
    this.request(params)
  }



}

export {
  TOrderList
}