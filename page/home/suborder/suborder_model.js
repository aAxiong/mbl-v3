import {
  Base
} from '../../../utils/base.js'

class SubBorder extends Base {
  constructor() {
    super()
  }
  getOrderData(callback) { //商品列表
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 13,
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
  orderPay(Code, ReceivingType, MealTime, AddressID, Remark, deliverFee, IntegralOffsetMoney, integralInput, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 14,
        OpenUserID: userid,
        Code: Code,
        ReceivingType: ReceivingType,
        MealTime: MealTime,
        AddressID: AddressID,
        Remark: Remark,
        DeliverFee: deliverFee,
        IntegralOffsetMoney: IntegralOffsetMoney,
        Integral: integralInput
      },
      sCallback: function(data) {
        console.log(data);
        data = data
        callback && callback(data)
      }
    }
    this.request(params)
  }


}

export {
  SubBorder
}