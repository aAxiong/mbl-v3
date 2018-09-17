
import {Base} from '../../../utils/base.js'

class ShopDetail extends Base {
  constructor(){
    super()
  }

  getShopData(id,callback){
    let params = {
      url: 'HomePage.ashx',
      data:{
        Type:10,
        ProductID:id
      },
      sCallback:function(data){
        if (data.Status == '0' && data.Datas[0]){
          callback && callback(data.Datas)
        }
      }
    }
    this.request(params)
  }
}

export {ShopDetail}

