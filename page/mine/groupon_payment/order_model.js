
import { Base } from '../../../utils/base.js'

class Pay extends Base {
  constructor() {
    super()
  }

  getOrderData(orderId,callback){
    let params = {
      url:'SpellGroup.ashx',
      data:{
        Type:8,
        OrderID:orderId
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
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

  getPayParams(openUserId, commodityMoney, count, couponId, code, orderId, callback) {
    let params = {
      url: 'SpellGroup.ashx',
      data: {
        Type: 10,
        OpenUserID: openUserId,
        CommodityMoney: commodityMoney,
        CommodityNum: count,
        DisCouponID: couponId,
        Code: code,
        OrderID:orderId
      },
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { Pay }