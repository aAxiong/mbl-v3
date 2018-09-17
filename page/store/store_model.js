
import {Base} from '../../utils/base.js'

class Store extends Base{
  constructor(){
    super()
  }

  getStoreData(callback){
    let params = {
      url:'StoreDisplay.ashx',
      data:{
        Type:1,   
      },
      sCallback:function(data){ 
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {Store}

