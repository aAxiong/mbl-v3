import { Base } from '../../../utils/base.js'

class Ordering extends Base {
  constructor() {
    super()
  }

  getGoodsData(orderId, userId, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 10,
        OpenUserID: userId,
        OrderID: orderId
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

  getPayParams(orderId, openUserId, code, seatNumber, couponId, totalPrice, payMoney, disMoney, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 11,
        OrderID: orderId,
        OpenUserID: openUserId,
        Code: code,
        UsersNumber: seatNumber,
        DisCouponID: couponId,
        SumCommodityMoney: totalPrice,
        PayMoney: payMoney,
        DisMoney: disMoney
      },
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { Ordering }