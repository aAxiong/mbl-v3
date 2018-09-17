import {
  Base
} from '../../../utils/base.js'

class TOrderInfo extends Base {
  constructor() {
    super()
  }
  getOrderData(id, callback) { //订单列表
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 16,
        OrderID: id
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
  reminder(orderid, callback) { //催单
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

  canelOrder(orderid, callback) { //取消
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 18,
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
  TOrderInfo
}