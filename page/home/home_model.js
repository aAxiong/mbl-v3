import {
  Base
} from '../../utils/base.js'

class Home extends Base {
  constructor() {
    super()
  }

  getHomeData(deskNumber, callback) {
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 2,
        param: deskNumber
      },
      sCallback: function(data) {
        if (data.Status == '0') {
          data = data.Datas
          callback && callback(data)
        } else {
          wx.showToast({
            title: data.Msg,
            icon: "none"
          })
        }
      }
    }
    this.request(params)
  }
  getTsData(callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'HomePage.ashx',
      data: {
        Type: 18,
        OpenUserID: userId
      },
      sCallback: function(data) {
        if (data.Status == '0') {
          data = data.Datas
          callback && callback(data)
        } else {
          wx.showToast({
            title: data.Msg,
            icon: "none"
          })
        }
      }
    }
    this.request(params)
  }

  isSeatNumber(seatNumber, callback) {
    let params = {
      url: 'QRCodeOrderDishes.ashx',
      data: {
        Type: 14,
        param: seatNumber
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {
  Home
}