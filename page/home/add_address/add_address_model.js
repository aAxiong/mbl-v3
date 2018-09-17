import {
  Base
} from '../../../utils/base.js'

class AddAddress extends Base {
  constructor() {
    super()
  }
  //插入地址
  insertAdd(name, sex, phone, lonlat, address, address1, def, callback) {
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'Waimai.ashx',
      data: {
        Type: 6,
        OpenUserID: userid,
        UserName: name,
        Sex: sex,
        Phone: phone,
        LonLat: lonlat,
        RoughlyAddress: address,
        Address: address1,
        IsDefault: def
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }


}

export {
  AddAddress
}