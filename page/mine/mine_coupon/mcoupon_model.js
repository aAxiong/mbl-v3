
import {Base} from '../../../utils/base.js'

class MyCoupon extends Base{
  constructor(){
    super()
  }

  getMyCoupon(pageSize,pageIndex,isUsed,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'MyCenter.ashx',
      data:{
        Type: 2,
        OpenUserID: userId,
        PageSize:pageSize,
        PageIndex:pageIndex,
        IsUsed: isUsed
      },
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { MyCoupon }