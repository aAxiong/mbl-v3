import {
  SubBorder
} from 'suborder_model.js'
var subBorder = new SubBorder()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    cactive: 0,
    tactive: 0,
    dayBox: ["今天", "明天", "后天"],
    tobox: ["尽快", "明天", "后天"],
    tocontent: "尽快",
    dayInfoBox: [],
    timebox: [],
    dayShow: "",
    timeShow: '',
    selectTimeShow: false,
    Phone: '15602979947',
    address: '宝运达物流中心z综合楼三 七楼迈宝乐实业有限公司',
    totalArr: [],
    Remark: "",
    imgUrl: 'https://xcx.mblsoft.com',
    integral: [],
    IntegralOffsetMoney: 0,
    integralInput: '',
    SumCommodityPrice: 0,
    Money: 0
  },
  jumpadd: function() {
    wx.navigateTo({
      url: '/page/mine/address_list/address_list?type=0',
    })
  },
  getRemark: function(e) {
    this.setData({
      Remark: e.detail.value
    })
  },
  opselectBox: function(e) {
    this.setData({
      selectTimeShow: true
    })
  },

  myCatchTouch() {
    return;
  },
  telTap() { //拨号
    let tel = this.data.totalArr.StoreList[0].Tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  Navigation: function() {
    let latitude = parseFloat(this.data.totalArr.StoreList[0].receiver_lat);
    let longitude = parseFloat(this.data.totalArr.StoreList[0].receiver_lng);
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  },
  colseSelectBox: function(e) {
    this.setData({
      selectTimeShow: false
    })
  },
  swtichMenu: function(e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  choseDay: function(e) {
    let day = e.currentTarget.dataset.date;
    let idx = e.currentTarget.dataset.idx
    this.setData({
      tactive: e.currentTarget.dataset.idx,
      dayShow: day,
      tocontent: this.data.tobox[idx]
    })
    this.getTimeBox(idx);

  },
  choseTime: function(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      cactive: idx,
      timeShow: this.data.timebox[idx],
      selectTimeShow: false
    })

  },
  getDay: function() {
    let dayArr = [];
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //获取明天
    //加一天的时间戳：
    var tomorrow_timetamp = timestamp + 24 * 60 * 60;
    //加一天的时间：
    var n_to = tomorrow_timetamp * 1000;
    var tomorrow_date = new Date(n_to);
    //加一天后的年份
    var Y_tomorrow = tomorrow_date.getFullYear();
    //加一天后的月份
    var M_tomorrow = (tomorrow_date.getMonth() + 1 < 10 ? '0' + (tomorrow_date.getMonth() + 1) : tomorrow_date.getMonth() + 1);
    //加一天后的日期
    var D_tomorrow = tomorrow_date.getDate() < 10 ? '0' + tomorrow_date.getDate() : tomorrow_date.getDate();

    //获取后天
    //加2天的时间戳：
    var atomorrow_timetamp = timestamp + 48 * 60 * 60;
    //加2天的时间：
    var n_to = atomorrow_timetamp * 1000;
    var atomorrow_date = new Date(n_to);
    //加2天后的年份
    var aY_tomorrow = atomorrow_date.getFullYear();
    //加2天后的月份
    var aM_tomorrow = (atomorrow_date.getMonth() + 1 < 10 ? '0' + (atomorrow_date.getMonth() + 1) : atomorrow_date.getMonth() + 1);
    //加2天后的日期
    var aD_tomorrow = atomorrow_date.getDate() < 10 ? '0' + atomorrow_date.getDate() : atomorrow_date.getDate();

    let today = Y + "-" + M + "-" + D;
    let tomorrow = Y_tomorrow + "-" + M_tomorrow + "-" + D_tomorrow;
    let atomorrow = aY_tomorrow + "-" + aM_tomorrow + "-" + aD_tomorrow;
    dayArr.push(today);
    dayArr.push(tomorrow);
    dayArr.push(atomorrow);
    this.setData({
      dayInfoBox: dayArr,
      dayShow: dayArr[0]
    })

  },
  getTimeBox: function(index) {
    let time = [];
    var Etimebox = this.data.totalArr.StoreList[0].StoreEndTime
    var Ehour = parseInt(Etimebox.split(':')[0]);
    var Emin = parseInt(Etimebox.split(':')[1]);
    if (index == 0) {
      let ProductionTime = parseFloat(this.data.totalArr.ProductionTime)
      let hours3 = 60 * 60 * ProductionTime * 1000
      var timestamp = Date.parse(new Date()) + hours3; //获取当前时间
      timestamp = timestamp / 1000;
      var n = timestamp * 1000;
      var date = new Date(n);
      // let date = new Date();
      var hour = parseInt(date.getHours());
      var min = date.getMinutes();
      var timebox = hour + ":" + min;
    } else {
      var timebox = this.data.totalArr.StoreList[0].StoreStartTime
      var hour = parseInt(timebox.split(':')[0]);
      var min = parseInt(timebox.split(':')[1]);
    }

    if (min >= 0 & min < 30) {
      min += 30
    } else {
      hour++
      min = min - 30
    }
    timebox = hour + ":" + (min < 10 ? "0" + min : min);
    time.push(timebox);
    if ((min + 30) >= 30 && (min + 30) < 45) { //把第二个凑整
      min = "30"
    } else if ((min + 30) >= 45 && (min + 30) < 60) {
      min = "45"
    } else if ((min + 30) >= 60 && (min + 30) < 75) {
      hour++;
      min = "00"
    } else if ((min + 30) >= 75 && (min + 30) < 90) {
      hour++;
      min = "15"
    } else {
      hour++;
      min = "30"
    }
    let c = hour + ":" + min;
    time.push(c);
    for (var i = 0; i < 100; i++) {
      let m1 = min == "00" ? 0 : min
      if (m1 == Emin && hour == Ehour) {
        break
      }
      if (min > 60) {
        hour++
        if (hour == 24) {
          hour = "00"
        }
        min = min - 30;
      } else if (min == 45) {
        hour++
        if (hour == 24) {
          hour = "00"
        }
        min = "00"
      } else {
        min = parseInt(min) + 15;
      }
      timebox = hour + ":" + min;
      time.push(timebox);
      if (hour == "") {
        hour = 0
      }
    }
    this.setData({
      timebox: time,
      timeShow: time[0]
    })
  },
  getData: function() {
    subBorder.getintegral((res) => {
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

    //ShoppingCartList
    subBorder.getOrderData((res) => {
      if (res.Status === 0) {
        this.setData({
          totalArr: res.Datas,
          SumCommodityPrice: res.Datas.SumCommodityPrice,
          Money: res.Datas.Money
        })
        let local = JSON.stringify(res.Datas.StoreList[0]);
        this.getDay();
        this.getTimeBox(0);
      } else {
        wx.showToast({
          title: '订单查询失败',
          mask: true,
          icon: 'none'
        })
      }
      wx.hideLoading()
    })

  },
  subOrder: function() {
    let ReceivingType = this.data.active;
    let AddressID = ReceivingType == 2 ? 0 : this.data.totalArr.AddressList[0].AddressID;
    let MealTime = this.data.dayShow + " " + this.data.timeShow;
    let Remark = this.data.Remark;
    let DeliverFee = this.data.totalArr.DeliverFee
    let self = this
    let MinUseRestrictions = this.data.integral.MinUseRestrictions
    let integralInput = this.data.integralInput == "" ? 0 : this.data.integralInput;
    let IntegralOffsetMoney = this.data.IntegralOffsetMoney;
    if (integralInput > 0 && integralInput < MinUseRestrictions) {
      wx.showToast({
        title: '至少使用' + MinUseRestrictions + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          // let m = self.data.active == 1 ? self.data.SumCommodityPrice : self.data.Money; //判断是自取还是商品配送
          subBorder.orderPay(code, ReceivingType, MealTime, AddressID, Remark, DeliverFee, IntegralOffsetMoney, integralInput, (res) => {
            wx.hideLoading()
            if (res.Status == '0') {
              let data = res.Datas
              self.userPayment(data)
            } else {
              wx.showToast({
                title: '支付失败',
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
        wx.redirectTo({
          url: '/page/home/takeaway_orderInfo/takeaway_orderInfo?id=' + orderId,
        })
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
  getIntegral(e) { //积分判断
    let integral = this.data.integral
    let MaxUseRestrictions = this.data.integral.MaxUseRestrictions
    let MyIntegral = this.data.integral.MyIntegral
    let length = (e.detail.value + "").length;
    let IntegralOffsetMoney = (e.detail.value * integral.Deductible_Amount) / integral.Deductible_Integral
    let money = this.data.Money; //商品配送金额
    let SumCommodityPrice = this.data.SumCommodityPrice
    let maxDixian = this.data.totalArr.Money * integral.Deductible_Integral
    let maxDixian1 = this.data.totalArr.SumCommodityPrice * integral.Deductible_Integral
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
    if (parseFloat(this.data.totalArr.Money) - IntegralOffsetMoney < 0 && this.data.active == 2) { //自取价格比较
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: '此金额最大抵现为' + maxDixian + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    } else if (parseFloat(this.data.totalArr.SumCommodityPrice) - IntegralOffsetMoney < 0 && this.data.active == 1) { //商品配送价格比较
      this.setData({
        integralInput: e.detail.value.slice(0, length - 1),
      })
      wx.showToast({
        title: '此金额最大抵现为' + maxDixian1 + "积分",
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.setData({
      integralInput: e.detail.value,
      IntegralOffsetMoney: parseFloat(IntegralOffsetMoney).toFixed(2),
    })
    if (this.data.active == 1) {
      this.setData({
        SumCommodityPrice: parseFloat(this.data.totalArr.SumCommodityPrice - IntegralOffsetMoney).toFixed(2)
      })
    } else {
      this.setData({
        Money: parseFloat(this.data.totalArr.Money - IntegralOffsetMoney).toFixed(2)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(option) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getData();
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