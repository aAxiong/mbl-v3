
import {Base} from '../../../utils/base.js'

class Groupon extends Base{
  constructor(){
    super()
  }

  getGrouponType(callback){
    let params = {
      url: 'SpellGroup.ashx',
      data:{
        Type:1
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

  getGoodsData(categoryId,pageIndex,callback){
    let params = {
      url: 'SpellGroup.ashx',
      data:{
        Type:2,
        CommodityType:1,
        CategoryID:categoryId,
        PageIndex:pageIndex
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }

}

export {Groupon}