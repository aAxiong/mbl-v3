import { Base } from '../../../utils/base.js'

class OrderingDetail extends Base {
  constructor() {
    super()
  }

  getOrderDetailData(orderId, callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:8,
        OrderID:orderId
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export { OrderingDetail }