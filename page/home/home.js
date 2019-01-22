import {
  Home
} from 'home_model.js'
// var QRCode = require('../../utils/qrcode.js');
// var qrcode;
var home = new Home()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    versionList: [],
    storeInfo: {},
    imgUrl: app.globalData.imgUrl,
    videoSrc: '',
    sliderImg: [],
    iconList: [{
      icon: '/images/icon/icon-tuangou@2x.png',
      id: '4',
      hander: 'grouponTap',
      name: '团购',
    }, {
      icon: '/images/icon/icon-waimai@2x.png',
      id: '6',
      hander: 'takeawayTap',
      name: '配送'
    }, {
      icon: '/images/icon/icon-wifi@2x.png',
      id: '2',
      hander: 'wifiTap',
      name: '一键WIFI'
    }, {
      icon: '/images/icon/icon-youhui@2x.png',
      id: '1',
      hander: 'couponTap',
      name: '优惠活动'
    }, {
      icon: '/images/icon/icon-maidan@2x.png',
      id: '3',
      hander: 'payTap',
      name: '买单'
    }],
    ordering: {
      icon: '/images/icon/icon-diancan@2x.png',
      id: '5',
      hander: 'orderingTap',
      name: '点餐'
    },
    takeaway: {

    },
    deskNumber: '',
    isInfo: false,
    mask: true,
    isDeskMask: true,
    isShowPlaying: true,
    VersionType: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let deskNumber = options.query || '';
    // this.loadTs();
    this.loadHomeData(deskNumber)
    this.videoContext = wx.createVideoContext('storeVideo')
    // qrcode = new QRCode('canvas', {
    //   text: "code=0000000000000",
    //   width: 150,
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    } //   height: 150,
    //   colorDark: "#000000",
    //   colorLight: "#ffffff",
    //   correctLevel: QRCode.CorrectLevel.H,
    // });
  },
  tapHandler: function(e) {
    qrcode.makeCode(e.target.dataset.code); //用元素对应的code更新二维码
  },
  loadTs() {
    home.getTsData((res) => {
      this.setData({
        tsData: res.DisList
      })
    })
  },
  loadHomeData(deskNumber) {
    wx.showLoading({
      title: '加载中...',
    })
    home.getHomeData(deskNumber, (res) => {
      wx.setNavigationBarTitle({
        title: res.StoreInfo.StoreName,
      })

      //桌号是否正常
      let isSeat = res.IsSeat
      let list = [].concat(this.data.iconList)
      if (deskNumber && isSeat === 1) {
        list.unshift(this.data.ordering)
        wx.setStorage({
          key: 'deskNumber',
          data: deskNumber
        })
      } else if (deskNumber && isSeat === 0) {
        this.setData({
          isDeskMask: false
        })
        //   wx.hideTabBar({}) //记得上线的时候打开
      }
      // list.push(this.data.takeaway)
      wx.setStorageSync("VersionList", res.VersionList);
      //获取导航功能
      let iconList = []
      list.forEach((icon, idx) => {
        res.VersionList.forEach((item, index) => {
          if (icon.id == item.VersionID) {
            icon.name = item.VersionName
            icon.icon = item.LogoImgPath
            iconList.push(icon)
          }
        })
      })
      wx.hideLoading();
      this.setData({
        productList: res.ProductList,
        versionList: iconList,
        storeInfo: res.StoreInfo,
        sliderImg: res.LoopImgPahList,
        videoSrc: res.VideoPath,
        mask: false,
        VersionType: res.VersionType
      })
      //停止刷新
      wx.stopPullDownRefresh()
      wx.setStorage({
        key: 'storeName',
        data: res.StoreInfo.StoreName,
      })
    })
  },
  //打开店铺位置
  locationTap() {
    let locationInfo = this.data.storeInfo
    let [long, lat] = locationInfo.Location.split(',')
    let storeName = locationInfo.StoreName,
      storeAddress = locationInfo.Address
    wx.openLocation({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
      name: storeName,
      address: storeAddress,
      fail: (res) => {
        console.log(res)
      }
    })
  },
  //联系电话
  telTap() {
    let tel = this.data.storeInfo.Phone
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  //进入详情页
  shopdetail(e) {
    let shopId = e.currentTarget.dataset.id
    if (this.data.VersionType == 1) {
      wx.navigateTo({
        url: '/page/home/shop_detail/shop_detail?id=' + shopId,
      })
    } else {
      wx.navigateTo({
        url: '/page/home/takeaway_info/takeaway_info?id=' + shopId,
      })
    }

  },
  couponTap() {
    // wx.navigateTo({
    //   url: '/page/home/coupon/coupon',
    // })
    wx.navigateTo({
      url: '/page/home/my_active/my_active',
    })

  },
  takeawayTap() {
    wx.navigateTo({
      url: '/page/home/takeaway/takeaway',
    })
  },
  wifiTap() {
    wx.navigateTo({
      url: '/page/home/wifi/wifi',
    })
  },
  payTap() {
    wx.navigateTo({
      url: '/page/home/pay/pay',
    })
  },
  //团购
  grouponTap() {
    wx.navigateTo({
      url: '/page/home/groupon/groupon',
    })
  },
  //点餐
  orderingTap() {
    wx.navigateTo({
      url: '/page/home/ordering/ordering',
    })
  },
  //视频播放事件
  videoTap() {
    this.setData({
      isShowPlaying: false
    })
  },
  videoStopTap() {
    this.setData({
      isShowPlaying: true
    })
    this.videoContext.pause()
  },
  errorHander() {
    this.videoContext.pause()
    this.videoContext.exitFullScreen()
  },
  wating(e) {
    console.log(e)
  },
  stopVideoWrapper(e) {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.loadHomeData()
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