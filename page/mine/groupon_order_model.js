
import {Base} from '../../utils/base.js'

class OrderDetail extends Base{
  constructor(){
    super()
  }

  getOrderDetail(orderId,orderDetailId,callback){
    let params = {
      url:'SpellGroup.ashx',
      data:{
        Type:6,
        OrderID:orderId,
        OrderDetailID:orderDetailId
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

  orderCancel(orderId,callback) {
    let userId = wx.getStorageSync('userId')
    let params = {
      url: 'SpellGroup.ashx',
      data: {
        Type: 9,
        OrderID: orderId,
        OpenUserID:userId
      },
      sCallback(data) {
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {OrderDetail}