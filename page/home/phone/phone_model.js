
import { Base } from '../../../utils/base.js'

class Phone extends Base {
  constructor() {
    super()
  }

  submitUserInfo(name, phone, code, callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 7,
        OpenUserID: userId,
        Phone: phone,
        UserName: name,
        SMSCode: code
      },
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  sendPhone(phone, callback) {
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 11,
        Phone: phone
      },
      sCallback: function (data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { Phone }