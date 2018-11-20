import {
  Mine
} from 'mine_model.js'
const app = getApp()
var mine = new Mine()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    snapName: '',
    phone: '',
    isOrdering: '',
    mask: true,
    VersionList: [],
    iconList: [{
      icon: '/images/icon/m_groupon.png',
      id: '4',
      hander: 'mineGroupon',
      name: '团购订单'
    }, {
      icon: '/images/icon/m_order.png',
      id: '3',
      hander: 'mineOrder',
      name: '线下订单'
    }, {
      icon: '/images/icon/m_takeaway.png',
      id: '6',
      hander: 'mineTakeaway',
      name: '外卖订单'
    }, {
      icon: '/images/icon/m_ordering.png',
      id: '5',
      hander: 'mineOrdering',
      name: '点餐订单'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    this.getUserInfoAuth()
    this.loadPhone()
  },
  //用户是否授权
  getUserInfoAuth() {
    let self = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          self.getUserInfo()
        } else {
          wx.navigateTo({
            url: '/page/mine/authorize/authorize',
          })
        }
      }
    })
  },
  //获取用户授权信息
  getUserInfo() {
    wx.getUserInfo({
      success: (res) => {
        let userId = wx.getStorageSync('userId')
        this.setData({
          userInfo: res.userInfo
        })
        mine.commitUserInfo(userId, res.userInfo, (data) => {
          if (data.Status == 0) {

          }
        })
      }
    })
  },
  loadPhone() {
    wx.showLoading({
      title: '加载中...',
    })
    mine.MineInfo((res) => {
      if (res.Status == '0') {
        this.setData({
          phone: res.Datas.Phone,
          isOrdering: res.Datas.IsQrCodeOrder,
          mask: false
        })
        wx.hideLoading()
      }
    })
  },
  mineTakeaway() {
    wx.navigateTo({
      url: '/page/home/takeaway_orderList/takeaway_orderList',
    })
  },
  //我的优惠券
  mineCoupon() {
    wx.navigateTo({
      url: '/page/mine/mine_coupon/mine_coupon',
    })
  },
  //我的订单
  mineOrder() {
    wx.navigateTo({
      url: '/page/mine/mine_order/mine_order',
    })
  },
  mineGroupon() {
    wx.navigateTo({
      url: '/page/mine/mine_groupon/mine_groupon',
    })
  },
  mineOrdering() {
    wx.navigateTo({
      url: '/page/mine/ordering/ordering',
    })
  },
  onShow: function() {
    let self = this
    let vli = wx.getStorageSync('VersionList')
    let list = this.data.iconList
    let iconList = []
    list.forEach((icon, idx) => {
      vli.forEach((item, index) => {
        if (icon.id == item.VersionID) {
          iconList.push(icon)
        }
      })
    })
    this.setData({
      VersionList: iconList
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          let userId = wx.getStorageSync('userId')
          self.setData({
            snapName: '用户:' + userId.substring(0, 11)
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})