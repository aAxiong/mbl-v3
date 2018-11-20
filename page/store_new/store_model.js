import {
  Base
} from '../../utils/base.js'

class Store extends Base {
  constructor() {
    super()
  }

  getStoreData(callback) {
    let params = {
      url: 'StoreDisplay.ashx',
      data: {
        Type: 1,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getStoreActive(PageIndex, callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'StoreDisplay.ashx',
      data: {
        Type: 2,
        PageIndex: PageIndex,
        OpenUserID: userId,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  optGoodsTap(id, opt, callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'StoreDisplay.ashx',
      data: {
        Type: 3,
        OpenUserID: userId,
        DynamicInfoID: id,
        AddOrRbtract: opt
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {
  Store
}