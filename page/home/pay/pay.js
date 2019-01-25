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
    inputValue: "",
    integral: [],
    IntegralOffsetMoney: 0,
    integralInput: '',
    SumCommodityPrice: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '买单',
    })
    app.globalData.useCouponInfo = null;
    this.getinter();
  },
  getinter() { //获取积分
    pay.getintegral((res) => {
      if (res.Status === 0) {
        this.setData({
          integral: res.Datas
        })
      } else {
        wx.showToast({
          title: '积分获取失败',
          mask: true,
          icon: 'none'
        })
      }
    })
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
    let re = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/
    let money = this.data.money
    let IntegralOffsetMoney = this.data.IntegralOffsetMoney;
    let MinUseRestrictions = this.data.integral.MinUseRestrictions
    let SumCommodityPrice = this.data.SumCommodityPrice;
    let integralInput = this.data.integralInput == "" ? 0 : this.data.integralInput;
    if (integralInput > 0 && integralInput < MinUseRestrictions) {
      wx.showToast({
        title: '至少使用' + MinUseRestrictions + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    }
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

            pay.getPayParams(userId, money, couponId, code, IntegralOffsetMoney, integralInput, (res) => {
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
  getIntegral(e) { //积分判断
    let integral = this.data.integral
    let MaxUseRestrictions = this.data.integral.MaxUseRestrictions
    let MyIntegral = this.data.integral.MyIntegral
    let length = (e.detail.value + "").length;
    let IntegralOffsetMoney = (e.detail.value * integral.Deductible_Amount) / integral.Deductible_Integral
    let money = this.data.inputValue; //商品配送金额
    let maxDixian = money * integral.Deductible_Integral
    let SumCommodityPrice = this.data.SumCommodityPrice
    let invalue = this.data.inputValue;
    if (invalue == "" || invalue <= 0) {
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: "请先输入买单金额",
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (e.detail.value > this.data.integral.MaxUseRestrictions) {
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: '最多能使用' + MaxUseRestrictions + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    } else if (e.detail.value > MyIntegral) {
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: '你只有' + MyIntegral + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    }
    if (parseFloat(money) - IntegralOffsetMoney < 0) { //价格比较
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: '此金额最大抵现为' + maxDixian + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.setData({
      integralInput: e.detail.value,
      IntegralOffsetMoney: parseFloat(IntegralOffsetMoney).toFixed(2),
    })
    this.setData({
      SumCommodityPrice: parseFloat(this.data.money - IntegralOffsetMoney).toFixed(2)
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