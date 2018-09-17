
import {Base} from 'base.js'

class Auth extends Base{
  constructor(){
    super()
  }

  getUserAuth (MinAppsId,callback){
    let _self = this
    wx.login({
      success:function(res){
        if(res.code){
          let params = {
            url:'HomePage.ashx',
            data:{
              Type:1,
              StoreID: MinAppsId,
              Code:res.code
            },
            sCallback:function(data){
              if(data.Status == '0'){
                callback && callback(data.Datas)
              }
            }
          }
          _self.request(params)
        }
      }
    })
  }
}

export { Auth }
