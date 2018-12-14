// page/mine/all_order/all_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  onLoad: function(options) {
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