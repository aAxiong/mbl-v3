import {
  Base
} from '../../utils/base.js'

class Mine extends Base {
  constructor() {
    super()
  }

  MineInfo(callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 1,
        OpenUserID: userId
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

  commitUserInfo(userId, userObj, callback) {
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 13,
        OpenUserID: userId,
        WxUserName: userObj.nickName,
        Sex: userObj.gender,
        Birth: ""
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  getintegralInfo(callback) { //积分抵现
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 1,
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
}

export {
  Mine
}