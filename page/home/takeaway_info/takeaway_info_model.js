import {
  Base
} from '../../../utils/base.js'

class TakeawayInfo extends Base {
  constructor() {
    super()
  }

  getFoodsDetail(id, LonLat, callback) { //商品详情
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 4,
        CommodityID: id,
        OpenUserID: userid,
        DeliveryFee: 0,
        LonLat: LonLat
      },
      sCallback: function(data) {
        if (data.Status == '0') {
          data = data.Datas
          callback && callback(data)
        }
      }
    }
    this.request(params)
  }
  //商品添加购物车
  addCart(id, size, taste, count, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 10,
        CommodityID: id,
        OpenUserID: userid,
        SpecificationID: size,
        LabelName: taste,
        BuyNum: count
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getCartData(callback) { //获取购物车数据
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 11,
        OpenUserID: userid,
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  operateCart(id, opt, callback) { //操作购物车产品
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 12,
        OpenUserID: userid,
        OperationType: opt,
        ShoppingCartID: id
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}



export {
  TakeawayInfo
}