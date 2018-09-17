
import {Base} from '../../../utils/base.js'

class Activity extends Base{
  constructor(){
    super()
  }

  getActivity(id,callback){
    let params = {
      url:'HomePage.ashx',
      data:{
        Type:5,
        ID:id
      },
      sCallback:function(data){
        callback && callback(data)
      }
    }
    this.request(params)
  }
}

export {Activity}
