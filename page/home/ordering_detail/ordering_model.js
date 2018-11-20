import { Base } from '../../../utils/base.js'

class Ordering extends Base {
  constructor() {
    super()
  }

  getGoodsDetail(id,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type: 16,
        CommodityID:id
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

  addCart(commodityId, size, taste,seatNumber,count,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:4,
        CommodityID: commodityId,
        SpecificationID: size,
        LabelName: taste,
        SeatNumber: seatNumber,
        BuyNum: count
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {Ordering}