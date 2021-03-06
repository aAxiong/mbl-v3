import {
  Balance
} from 'balance_model.js'
const app = getApp()
var balance = new Balance()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navActive: 0,
    infoNavActive: 0,
    balanceMoney: '', //充值金额
    AchieveArray: [],
    RDArray: [], //详情数据
    nowTime: '',
    imgheader: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBalanceData();
    this.page = 1;
    let info = wx.getStorageSync('userInfo')
    this.setData({
      nowTime: this.getNowFormatDate(),
      imgheader: info.avatarUrl
    })
    this.rechargeDetails(this.data.nowTime, this.data.nowTime);
  },
  getBalanceData() {
    wx.showLoading({
      title: '加载中...',
    })
    balance.getBalanceData((res) => {
      if (res.Status == '0') {
        this.setData({
          AchieveArray: res.Datas
        })
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 1500
        })
      }
      wx.hideLoading();
      wx.stopPullDownRefresh()
    })
  },
  getMoney: function(e) {
    this.setData({
      balanceMoney: e.detail.value
    })
  },
  changNav: function(e) { //切换最大的nav
    let index = e.currentTarget.dataset.index;
    this.setData({
      navActive: index
    })
  },
  changinfoNav: function(e) { //切换余额明细里面的nav
    let index = e.currentTarget.dataset.index;
    this.setData({
      infoNavActive: index
    })
  },
  balance: function(e) {
    let TopupSetID = e.currentTarget.dataset.index;
    let Fee = TopupSetID == -1 ? this.data.balanceMoney : 0;
    let Money = this.data.AchieveArray[0].AchieveAmount
    if (TopupSetID == -1 && Fee < Money) {
      wx.showToast({
        title: '充值金额未达到' + Money + '元',
        icon: 'none',
        mask: true
      })
      return
    }
    let self = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          balance.orderPay(code, Fee, TopupSetID, (res) => {
            wx.hideLoading()
            console.log("成功")
            console.log("a" + res);
            console.log(res);
            if (res.Status == '0') {
              let data = res.Datas
              self.userPayment(data)
            } else {
              wx.showToast({
                title: '取消支付',
                icon: 'none',
                mask: true
              })
            }
          })
        } else {
          wx.showToast({
            title: '取消支付',
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function(err) {
        console.log("失败下");
        console.log(err);
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          mask: true
        })
      }
    })
  },
  //支付
  userPayment(data) {
    console.log('data查看')
    console.log(data);
    let orderId = data.OrderID
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          duration: 1500
        })
        this.getBalanceData();
      },
      fail: function(res) {
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  rechargeDetails(starTime, endTime) {
    balance.rechargeDetails(starTime, endTime, this.page, (res) => {
      if (res.Status == '0') {
        this.setData({
          RDArray: res.Datas.DetailList
        })
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none',
          duration: 1500
        })
      }
      wx.hideLoading();
      wx.stopPullDownRefresh()
    })
  },
  bindDateChange(e) { //时间监听
    this.setData({
      nowTime: e.detail.value,
    })
    this.page = 1;
    this.rechargeDetails(this.data.nowTime, this.data.nowTime);
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
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
  onPullDownRefresh: function() {
    if (this.data.navActive == 0) {
      this.getBalanceData();
    } else {
      this.page = 1;
      this.rechargeDetails(this.data.nowTime, this.data.nowTime);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.navActive == 1) {
      this.page++;
      this.rechargeDetails(this.data.nowTime, this.data.nowTime);
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})