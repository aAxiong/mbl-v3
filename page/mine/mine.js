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
    vipStatus: false,
    infoLIst: 0,
    MyVip: '',
    MyTopUpAmount: 0,
    MyIntegral: 0
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
        // mine.commitUserInfo(userId, res.userInfo, (data) => {
        //   if (data.Status == 0) {
        //   }
        // })
        mine.getintegralInfo((res) => {
          if (res.Status === 0) {
            this.setData({
              MyVip: res.Datas.MyVip || '无',
              MyTopUpAmount: res.Datas.MyTopUpAmount || 0,
              MyIntegral: res.Datas.MyIntegral || 0
            })
          } else {
            wx.showToast({
              title: '等级信息相关获取失败',
              mask: true,
              icon: 'none'
            })
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
  onShow: function() {
    let self = this
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
  jumpAllOrder: function(e) { //跳转到全部订单
    wx.navigateTo({
      url: '/page/mine/all_order/all_order',
    })
  },
  jumpAddressList: function(e) { //跳转到地址列表
    wx.navigateTo({
      url: '/page/mine/address_list/address_list?type=1',
    })
  },
  jumpVipPage: function(e) { //跳转到vip页面
    if (this.data.vipStatus == false) {
      wx.navigateTo({
        url: '/page/mine/vipInfo_no/vipInfo_no',
      })
    }
  },
  jumpBalance: function(e) { //跳转到积分商城
    if (this.data.vipStatus == false) {
      wx.navigateTo({
        url: '/page/mine/balance/balance',
      })
    }
  },
  jumpmy_integral: function(e) { //跳转到我的积分
    if (this.data.vipStatus == false) {
      wx.navigateTo({
        url: '/page/mine/my_integral/my_integral',
      })
    }
  },
  JumpGroupon() { //跳转到我的兑换券
    wx.navigateTo({
      url: '/page/mine/mine_groupon/mine_groupon',
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