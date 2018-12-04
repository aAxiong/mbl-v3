let ext = wx.getExtConfigSync() //'https://xcx.mblsoft.com' //wx.getExtConfigSync()

class Config {
  constructor() {

  }
}

//Config.restUrl = 'https://xcx.mblsoft.com' + '/SmallRequest/' //ext.request
Config.restUrl = 'http://192.168.2.229:8014' + '/SmallRequest/'
export {
  Config
}