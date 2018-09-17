import {Base} from '../../../utils/base.js'

class Ordering extends Base{
  constructor(){
    super()
  }
  //获取菜单
  getOrderingMenu(callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:1
      },
      sCallback(data){
        callback && callback(data)
      }

    }
    this.request(params)
  }
  //获取商品列表
  getOrderingGoods(categoryId,pageIndex,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:2,
        CategoryID:categoryId,
        PageIndex:pageIndex
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
  //商品添加购物车
  addCart(id, size, taste, seatNumber, count, callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:4,
        CommodityID:id,
        SpecificationID:size,
        LabelName:taste,
        SeatNumber:seatNumber,
        BuyNum:count
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
  //购物车数据
  getCartData(seatNumber,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:5,
        SeatNumber: seatNumber
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

  //购物车增加 删除 清空
  cartNumerical(shoppingCartId, operationType, seatNumber,callback){
    let params = {
      url:'QRCodeOrderDishes.ashx',
      data:{
        Type:6,
        ShoppingCartID: shoppingCartId,
        OperationType: operationType,
        SeatNumber: seatNumber
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export{Ordering}
