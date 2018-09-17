
import {Base} from '../../../utils/base.js'

class Order extends Base{
  constructor(){
    super()
  }

  getOrder(orderId,callback){
    let params = {
      url:'HomePage.ashx',
      data:{
        Type:12,
        OrderID:orderId
      },
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export{Order}