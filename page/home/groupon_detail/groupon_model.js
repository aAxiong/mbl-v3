
import {Base} from '../../../utils/base.js'

class Groupon extends Base{
  constructor(){
    super()
  }

  getGrouponDetail(commodityId,callback){
    let params = {
      url:'SpellGroup.ashx',
      data:{
        Type:3,
        CommodityID: commodityId
      },
      sCallback(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {Groupon}