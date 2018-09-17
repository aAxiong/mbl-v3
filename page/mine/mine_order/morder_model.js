
import {Base} from '../../../utils/base.js'

class Order extends Base{
  constructor(){
    super()
  }

  getOrder(pageSize,pageIndex,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'MyCenter.ashx',
      data:{
        Type:3,
        OpenUserID:userId,
        PageSize:pageSize,
        PageIndex:pageIndex
      },
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {Order}