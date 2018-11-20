import {
  Config
} from 'config.js'
var app = getApp()

class Base {
  constructor() {
    this.baseUrl = Config.restUrl
  }

  request(params) {
    let storeId = wx.getStorageSync('miniAppsId')
    //缓存没有id就到第三方配置里面去取
    if (!storeId) {
      let storeId = wx.getExtConfigSync().MiniAppsID
      this.request_s(params, storeId)
    } else {
      this.request_s(params, storeId)
    }
  }

  request_s(params, storeId) {
    let url = this.baseUrl + params.url
    //添加商户ID
    params.data['StoreID'] = storeId
    wx.request({
      url: url,
      data: params.data,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        let code = res.statusCode.toString()
        let startChar = code.charAt(0)
        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data) //返回回调
        }
      },
      fail(res) {
        wx.showToast({
          title: '请求超时',
          icon: 'none'
        })
        wx.hideLoading();
      }
    })
  }

}

export {
  Base
}