
import {Base} from '../../../utils/base.js'

class Wifi extends Base{
  constructor(){
    super()
  }

  getWifiData(callback){
    let params = {
      url:'HomePage.ashx',
      data:{
        Type:3
      },
      sCallback:function(data){
        if (data.Status == '0'){
          //console.log(data.Datas)
          callback && callback(data.Datas)
        }
      }
    }
    this.request(params)
  }

}

export {Wifi}