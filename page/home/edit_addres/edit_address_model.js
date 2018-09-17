import {
  Base
} from '../../../utils/base.js'

class EditAddress extends Base {
  constructor() {
    super()
  }
  getAddress(id, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 8,
        OpenUserID: userid,
        AddressID: id

      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  //插入地址
  insertAdd(name, sex, phone, lonlat, address, address1, def, id, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 9,
        OpenUserID: userid,
        UserName: name,
        Sex: sex,
        Phone: phone,
        LonLat: lonlat,
        RoughlyAddress: address,
        Address: address1,
        IsDefault: def,
        AddressID: id
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }


}

export {
  EditAddress
}