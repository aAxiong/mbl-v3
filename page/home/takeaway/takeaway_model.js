import {
  Base
} from '../../../utils/base.js'

class Takeaway extends Base {
  constructor() {
    super()
  }


  getactivityData(callback) { //门店所有活动
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 1
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

  getproductData(LonLat, callback) { //商品列表
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 2,
        OpenUserID: userid,
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
  //搜索
  getSearchPro(con, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 5,
        SearchKey: con
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getHotSearch(callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 17,
        OpenUserID: userid,
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {
  Takeaway
}