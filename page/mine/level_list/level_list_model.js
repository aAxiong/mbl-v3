import {
  Base
} from '../../../utils/base.js'

class LevelList extends Base {
  constructor() {
    super()
  }

  getLevelData(callback) { //获取等级页面数据
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 7,
        OpenUserID: userId,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {
  LevelList
}