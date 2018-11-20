import {
  TOrderInfo
} from 'takeaway_orderInfo_model.js'
var QRCode = require('../../../utils/qrcode.js');
var qrcode;
var tOrderInfo = new TOrderInfo()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    OrderDetailInfo: [],
    OrderDiscouponInfo: [],
    OrderProductList: [],
    opId: '',
    imgUrl: 'https://xcx.mblsoft.com'
  },
  Navigation: function() {
    let latitude = parseFloat(this.data.OrderDetailInfo.receiver_lat);
    let longitude = parseFloat(this.data.OrderDetailInfo.receiver_lng);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  callshop: function() {
    let tel = this.data.OrderDetailInfo.ContactWay;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  callman: function() {
    let tel = this.data.OrderDetailInfo.DeliveryManPhone;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  DateMinus(sDate) {
    var sdate = new Date(sDate.replace(/-/g, "/"));
    var now = new Date();
    var days = now.getTime() - sdate.getTime();
    var day = parseInt(days / (1000 * 60));
    return day;
  },
  Reminder: function(e) { //催单
    let idx = this.data.OrderDetailInfo.OrderID;
    var time = this.DateMinus(this.data.OrderDetailInfo.CreateTime)
    if (time < 15) {
      wx.showToast({
        title: '还不到催单时间哦~',
        mask: true
      })
      return
    }
    tOrderInfo.reminder(idx, (res) => {
      if (res.Status == 0) {
        wx.showToast({
          title: '催单成功',
          mask: true
        })
      } else {
        wx.showToast({
          title: '催单失败',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  jumpHome() {
    wx.navigateTo({
      url: '/page/home/takeaway/takeaway'
    })
  },
  canelOrder: function() {
    let that = this;
    let idx = this.data.OrderDetailInfo.OrderID;
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function(res) {
        if (res.confirm) {
          tOrderInfo.canelOrder(idx, (res) => {
            if (res.Status == 0) {
              wx.showToast({
                title: '取消成功',
                mask: true
              })

              that.onLoad()
            } else {
              wx.showToast({
                title: res.Msg,
                icon: 'none',
                mask: true
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })


  },
  loadData: function(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    tOrderInfo.getOrderData(id, (res) => {
      wx.hideLoading()
      if (res.Status === 0) {
        let os = [];
        this.setData({
          orderList: res.Datas,
          OrderDetailInfo: res.Datas.OrderDetailInfo[0],
          OrderDiscouponInfo: res.Datas.OrderDiscouponInfo,
          OrderProductList: res.Datas.OrderProductList
        })
        let a = 'a'
        if (this.data.OrderDetailInfo.OrderStatus == 3 && this.data.OrderDetailInfo.DeliveryType == 2) {
          qrcode = new QRCode('canvas', {
            text: this.data.OrderDetailInfo.QrCodeContent,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
        }
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          mask: true
        })
      }
      //停止刷新
      wx.stopPullDownRefresh()
    })

  },
  tapHandler: function(e) {
    qrcode.makeCode(e.target.dataset.code); //用元素对应的code更新二维码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options != undefined) {
      this.setData({
        opId: options.id
      })
      this.loadData(options.id);
    } else {
      this.loadData(this.data.opId);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onPullDownRefresh: function(option) {
    this.loadData(this.data.opId);
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