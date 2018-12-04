import {
  Auth
} from 'utils/auth.js'
var auth = new Auth()
let ext = wx.getExtConfigSync()
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch(options) {
    if (wx.getExtConfig) {
      this.getMiniAppsId()
    }
    let that = this;
    this.globalData.scene = options.scene
    wx.getSystemInfo({ //  获取页面的有关信息
      success: function(res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    });
  },
  //获取商户id
  getMiniAppsId() {
    let _self = this
    wx.getExtConfig({
      success: function(res) {
        let config = res.extConfig
        let miniAppsId = '3448703498688943123' //config.MiniAppsID // '3583475337759031296' // config.MiniAppsID //'3504456223506300928' //config.MiniAppsID
        //'3534917029020565504''3571207309373734912' '3448703498688943123' '3504456223506300928'
        //获取用户id
        _self.globalData.miniAppsId = miniAppsId
        if (miniAppsId) {
          wx.setStorageSync('miniAppsId', miniAppsId) //miniAppsId
          auth.getUserAuth(miniAppsId, (res) => {
            wx.setStorageSync('userId', res.OpenUserID)

            // 添加回调返回用户id
            if (_self.userIdBack) {
              _self.userIdBack(res.OpenUserID)
            }
          })
        }
      }
    })
  },
  getOpenUserInfo() {
    let _self = this
    wx.getUserInfo({
      success: (res) => {
        _self.globalData.userInfo = res.userInfo
        if (_self.userBack) {
          _self.userBack(res)
        }
      },
      fail: () => {
        wx.openSetting({
          success: (res) => {
            wx.getUserInfo({
              success: (res) => {
                _self.globalData.userInfo = res.userInfo
                if (this.userBack) {
                  this.userBack(res)
                }
              }
            })
          }
        })
      }
    })
  },
  bezier: function(pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
      points = pots.slice(0);
      lines = [];
      while (pot = points.shift()) {
        if (points.length) {
          lines.push(pointLine([pot, points[0]], i / amount));
        } else if (lines.length > 1) {
          points = lines;
          lines = [];
        } else {
          break;
        }
      }
      ret.push(lines[0]);
    }

    function pointLine(points, rate) {
      var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
      var ret = [];
      pointA = points[0]; //点击
      pointB = points[1]; //中间
      xDistance = pointB.x - pointA.x;
      yDistance = pointB.y - pointA.y;
      pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
      tan = yDistance / xDistance;
      radian = Math.atan(tan);
      tmpPointDistance = pointDistance * rate;
      ret = {
        x: pointA.x + tmpPointDistance * Math.cos(radian),
        y: pointA.y + tmpPointDistance * Math.sin(radian)
      };
      return ret;
    }
    return {
      'bezier_points': ret
    };
  },
  onShow() {
    //this.getOpenUserInfo()
  },
  globalData: {
    scene: 0,
    userInfo: null, //用户信息
    couponInfo: null, //
    couponId: '', //买单使用优惠券id
    miniAppsId: '', //商户id
    couponType: '', //买单使用优惠券类型
    useCouponInfo: null, //使用优惠券信息
    webUrl: '',
    isUseCoupon: true,
    imgUrl: 'https://xcx.mblsoft.com' //所有图片地址 //http://mblsj.iok.la https://xcx.mblsoft.com ext.request
  }
})