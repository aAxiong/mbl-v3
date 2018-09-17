
import {Base} from '../../../utils/base.js'

class UseCoupon extends Base{
  constructor(){
    super()
  }

  getUseCoupon(size,index,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'HomePage.ashx',
      data:{
        Type:8,
        OpenUserID: userId,
        PageSize: size,
        PageIndex: index,
        IsUsed: '0'
      },
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { UseCoupon }
