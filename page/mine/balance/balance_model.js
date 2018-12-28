import {
  Base
} from '../../../utils/base.js'

class Balance extends Base {
  constructor() {
    super()
  }

  getBalanceData(callback) { //获取充值内容数据
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 8,
        OpenUserID: userId,
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
  orderPay(Code, Fee, TopupSetID, callback) { //支付接口
    let userid = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 10,
        OpenUserID: userid,
        Code: Code,
        Fee: Fee,
        TopupSetID: TopupSetID,
      },
      sCallback: function(data) {
        console.log(data);
        data = data
        callback && callback(data)
      }
    }
    this.request(params)
  }
  rechargeDetails(StartTime, EndTime, PageIndex, callback) { //获取充值详情数据
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'MyCenter.ashx',
      data: {
        Type: 9,
        OpenUserID: userId,
        PageIndex: PageIndex,
        StartTime: StartTime,
        EndTime: EndTime
      },
      sCallback: function(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {
  Balance
}