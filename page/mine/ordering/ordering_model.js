import {Base} from '../../../utils/base.js'

class OrderingMine extends Base{
  constructor(){
    super()
  }

  getOrderData(userId,pageIndex,status,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:9,
        OpenUserID:userId,
        PageIndex:pageIndex,
        OrderStatus:status
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {OrderingMine}