import { Base } from '../../../utils/base.js'

class Groupon extends Base{
  constructor(){
    super()
  }

  getOrdersData(orderStatus,pageIndex,callback){
    let userId = wx.getStorageSync('userId')
    let params = {
      url:'SpellGroup.ashx',
      data:{
        Type:5,
        OrderStatus: orderStatus,
        PageIndex:pageIndex,
        OpenUserID:userId,
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { Groupon}