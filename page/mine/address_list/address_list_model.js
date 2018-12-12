import {
  Base
} from '../../../utils/base.js'

class AddList extends Base {
  constructor() {
    super()
  }

  getAddListh(callback) { //地址内容
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 7,
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
  delAddListh(id, callback) { //删除
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 20,
        OpenUserID: userid,
        AddressID: id

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
  optDef(id, callback) { //设置默认
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 21,
        OpenUserID: userid,
        AddressID: id

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
  AddList
}