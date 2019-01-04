import {
  Base
} from '../../../utils/base.js'

class Myintegral extends Base {
  constructor() {
    super()
  }

  getShopMallData(callback) { //获取积分商城数据
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 4,
        OpenUserID: userId,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getIntDetails(pageIndex, callback) { //获取积分明细数据
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 5,
        OpenUserID: userId,
        PageIndex: pageIndex
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  optExchange(CommodityID, callback) { //兑换
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 11,
        OpenUserID: userId,
        CommodityID: CommodityID
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {
  Myintegral
}