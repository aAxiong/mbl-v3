import {
  Pay
} from 'pay_model.js'
var pay = new Pay()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    couponId: '',
    couponType: '',
    discount: '',
    disCouponName: '',
    couponList: [],
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '买单',
    })
    app.globalData.useCouponInfo = null;
  },
  useCouponTap() {
    let money = this.data.money
    wx.navigateTo({
      url: '/page/home/new_coupon/new_coupon?money=' + money + "&useStatus=" + this.data.couponType,
    })
  },
  getNumber: function(num) {
    return parseFloat(num) || 0
  },
  //获取买单金额
  userMoney(e) {
    let value = e.detail.value
    this.setData({
      inputValue: value
    })
    for (let i = 0; i < this.data.couponList.length; i++) {
      if (value >= this.getNumber(this.data.couponList[i].Condition) && value != "") {
        this.setData({
          couponType: 4
        })
        break
      } else {
        this.setData({
          couponType: 3
        })
      }

    }
    if (this.data.couponId) {
      this.setData({
        money: value,
        couponId: '', //金额修改后不使用优惠券
        discount: ''
      })
    } else {
      this.setData({
        money: value
      })
    }


  },
  //付款参数
  userPayTap() {
    let _self = this
    let money = this.data.money
    let re = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/
    if (!re.test(money)) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
      return
    }
    if (money == '' || money <= 0) {
      wx.showToast({
        title: '请输入正确金额',
        icon: 'none'
      })
    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            let userId = wx.getStorageSync('userId')
            let money = parseFloat(_self.data.money)
            let couponId = _self.data.couponId
            let code = res.code

            wx.showLoading({
              title: '加载中',
              mask: true
            })

            pay.getPayParams(userId, money, couponId, code, (res) => {
              wx.hideLoading()
              if (res.Status == '0') {
                let data = res.Datas
                //走公众号支付或者小程序支付
                if (data.url) {
                  app.globalData.webUrl = data.url
                  wx.navigateTo({
                    url: '/page/home/pay1/pay1',
                  })
                } else {
                  _self.userPayment(data)
                }
              } else {
                wx.showToast({
                  title: '取消支付',
                  icon: 'none'
                })
              }
            })

          } else {
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '取消支付',
            icon: 'none'
          })
        }
      })
    }
  },
  //支付
  userPayment(data) {
    let self = this
    let orderId = data.OrderID
    let couponType = this.data.couponType
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      'package': data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function(res) {
        wx.navigateTo({
          url: '/page/home/pay_complete/pay_complete?orderId=' + orderId + '&couponType=' + couponType,
        })
      },
      fail: function(res) {
        console.log(res)
        self.setData({
          res: res
        })
        wx.showToast({
          title: '取消支付',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.useCouponInfo) {
      let couponId = app.globalData.useCouponInfo.id
      let couponType = app.globalData.useCouponInfo.couponType
      let discount = app.globalData.useCouponInfo.discount
      let disname = app.globalData.useCouponInfo.disCouponName
      this.setData({
        couponId: couponId,
        discount: discount,
        couponType: couponType,
        disCouponName: disname
      })
    } else {
      this.setData({
        couponId: '',
        discount: '',
        couponType: ''
      })
      let value = this.data.inputValue
      for (let i = 0; i < this.data.couponList.length; i++) {
        if (value >= this.getNumber(this.data.couponList[i].Condition)) {
          this.setData({
            couponType: 4
          })
          break
        } else {
          this.setData({
            couponType: 3
          })
        }
      }
    }
    this.getUseCoupon()
    ''
  },
  getUseCoupon() {
    wx.showLoading({
      title: '加载中...',
    })
    pay.getUseCoupon((res) => {
      if (res.Status == '0') {
        this.setData({
          couponList: res.Datas
        })
        wx.hideLoading()
      }

    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    app.globalData.couponId = ''
  },
})