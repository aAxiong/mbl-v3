import {
  Wifi
} from 'wifi_model.js'
var wifi = new Wifi()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wifiList: [],
    sucimg: null,
    isWifi: null,
    mask: true,
    platform: '',
    system: '',
    wifiName: '',
    isFirst: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '一键WIFI',
    })
    //检测系统型号
    let platform = wx.getSystemInfoSync().platform
    let system = wx.getSystemInfoSync().system
    this.setData({
      platform: platform,
      system: system
    })
    this._loadWifi()
    //监测网络变化
    wx.startWifi({
      success: (res) => {
        //监测wifi变化
        wx.onWifiConnected((res) => {
          let ssid = res.wifi.SSID
          if (ssid != this.data.wifiName) {
            this.setData({
              sucimg: null
            })
          }
          this.data.wifiList.forEach((item, index) => {
            if (ssid == item.WiFiName) {
              this.setData({
                sucimg: index
              })
            }
          })
        })
      }
    })
    wx.onNetworkStatusChange((res) => {
      if (res.networkType != 'wifi') {
        this.setData({
          sucimg: null
        })
      }
    })
  },
  //加载wifi数据
  _loadWifi() {
    wx.showLoading({
      title: '加载中...',
    })
    wifi.getWifiData((res) => {
      this.setData({
        wifiList: res.WifiList,
        mask: false
      })
      wx.hideLoading()
      this.isWfiConnect()
      //连接只有一个wifi和是否已经连接的wifi,已连接就不在连接
      if (this.data.wifiList.length === 1 && this.data.isFirst) {
        this.wifiConnect(0)
      }

    })
  },
  //检测已连接的wifi是否在列表中
  isWfiConnect() {
    wx.startWifi({
      success: (res) => {
        wx.getConnectedWifi({
          success: (res) => {
            this.data.wifiList.forEach((item, index) => {
              if (item.WiFiName == res.wifi.SSID) {
                this.setData({
                  sucimg: index,
                  isFirst: false
                })
              }
            })
          },
          fail: (res) => {
            if (this.data.platform == 'android') {
              if (res.errCode == '12004') {
                this.wifiTipTap()
              } else if (res.errCode == '12005') {
                this.wifiTipTap()
              }

            }
          }
        })
      }
    })
  },
  //检查是否为wifi
  isWifiType() {
    wx.getNetworkType({
      success: (res) => {
        let networkType = res.networkType
        if (networkType != 'wifi') {
          this.setData({
            isWifi: false
          })
          wx.showToast({
            title: '请先确保wifi开关',
            icon: 'none',
            duration: 1500
          })
        } else {
          if (this.data.wifiList.length === 1) {
            this.wifiConnect(0)
          }
          this.setData({
            isWifi: true
          })
        }
      }
    })
  },
  //检测连接wifi
  startConnectWifi(e) {
    let tapIndex = e.currentTarget.dataset.idx
    if (wx.startWifi) {
      this.wifiConnect(tapIndex)
    } else {
      wx.showModal({
        title: '提示',
        content: '微信版本过低或手机版本不支持'
      })
    }
  },
  //连接wifi
  wifiConnect(e) {
    let _self = this
    let wifi = this.data.wifiList
    let tapIndex = e
    wx.startWifi({
      success: function(res) {
        //ios系统仅支持11及以上版本
        let iosSystem = parseInt(_self.data.system.substr(4))
        if (_self.data.platform == 'ios' && iosSystem >= 11) {
          wx.showLoading({
            title: '连接中...',
          })
        } else if (iosSystem < 10) {
          _self.msgToast('适用于系统版本为10.0.0以上')
          return
        }
        //android系统不支持版本4以下
        let androidSystem = parseInt(_self.data.system.substr(8))
        console.log(_self.data.system, androidSystem)
        if (_self.data.platform == 'android' && androidSystem < 4) {
          _self.msgToast('适用于系统版本为4.0.0以上')
          return
        }
        _self.setData({
          wifiName: wifi[tapIndex].WiFiName
        })
        wx.connectWifi({
          SSID: wifi[tapIndex].WiFiName,
          BSSID: wifi[tapIndex].bssid,
          password: wifi[tapIndex].WiFiPassWord,
          success: function(res) {
            //android
            if (_self.data.platform == 'android') {
              if (res.errCode == 0) {
                wx.showToast({
                  title: 'wifi连接成功',
                })
                //unshift
                _self.setData({
                  sucimg: tapIndex
                })
              } else {
                _self.msgToast('wifi未能连接')
              }
            }
            //ios
            if (_self.data.platform == 'ios') {
              if (res.errMsg == 'connectWifi:ok') {
                _self.setData({
                  sucimg: tapIndex
                })
                //当前wifi是否为设备连接的wifi
                wx.getConnectedWifi({
                  success: (res) => {
                    if (res.wifi.SSID != wifi[tapIndex].WiFiName) {
                      _self.setData({
                        sucimg: null
                      })
                    }
                  }
                })
              } else {
                _self.msgToast('wifi未能连接')
              }
            }
          },
          faile: function(res) {
            if (res.errCode == 12002) {
              _self.msgToast('Wi-Fi密码错误')
            } else if (res.errCode == 12003) {
              _self.msgToast('Wi-Fi连接超时')
            } else {
              _self.msgToast('连接失败')

            }
            if (_self.data.platform == 'ios') {
              _self.msgToast('连接失败')
              wx.hideLoading()
            }
          },
          complete: function(res) {
            if (_self.data.platform == 'android') {
              if (res.errCode == 0) {
                return
              } else if (res.errCode == 12002) {
                _self.msgToast('Wi-Fi密码错误')
              } else if (res.errCode == 12003) {
                _self.msgToast('Wi-Fi连接超时')
              } else if (res.errCode == 12004) {
                _self.msgToast('重复连接Wi-Fi')
              } else {
                _self.msgToast('连接失败')
              }
            }
            if (_self.data.platform == 'ios') {
              wx.hideLoading()
            }
          }
        })
      },
      fail: function(res) {
        if (res.errCode == 12001) {
          _self.msgToast('当前系统不支持相关能力')
        } else if (res.errCode == 12005) {
          _self.msgToast('未打开Wi-Fi开关')
        } else {
          _self.msgToast('连接失败')
        }
      }
    })
  },
  //信息提示
  msgToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },
  //andriod wifi提示
  wifiTipTap() {
    let _self = this
    wx.showModal({
      title: 'WIFI提示',
      content: '请确保打开wifi开关和定位开关，若没有打开，小程序wifi信息将无法与系统wifi信息同步',
      success: (res) => {
        if (res.confirm) {
          _self.isWfiConnect()
        }
      }
    })
  }
})