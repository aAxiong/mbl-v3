import {
  EditAddress
} from 'edit_address_model.js'
var editAddress = new EditAddress()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tphone: "", //手机号
    name: "", //姓名
    sex: 1, //性别
    local: "", //具体地址
    dfl: 0, //是否默认地址
    lng: "",
    lat: "",
    address: "", //微信返回地址
    addressid: ''
  },
  selectAdd: function() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          lng: res.longitude,
          lat: res.latitude,
          address: res.name
        })
      },
    })
  },
  swtichSex: function(e) {
    this.setData({
      sex: e.currentTarget.dataset.sex
    })
  },

  swtichDfl: function(e) {
    if (this.data.dfl == 0) {
      this.setData({
        dfl: 1
      })
    } else {
      this.setData({
        dfl: 0
      })
    }
  },

  insertAdd: function() {
    let phone = this.data.tphone;
    let name = this.data.name;
    let sex = this.data.sex;
    let local = this.data.local;
    let dfl = this.data.dfl;
    let lonlat = this.data.lng + "," + this.data.lat;
    let address = this.data.address;
    let id = this.data.addressid;
    if (phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        mask: true
      })
      return
    } else if (name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        mask: true
      })
      return
    } else if (local == "") {
      wx.showToast({
        title: '具体收货地址不能为空',
        icon: 'none',
        mask: true
      })
      return
    } else if (address == "") {
      wx.showToast({
        title: '收货地址不能为空',
        icon: 'none',
        mask: true
      })
      return
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })

    editAddress.insertAdd(name, sex, phone, lonlat, address, local, dfl, id, (res) => {
      if (res.Status === 0) {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
          mask: true
        })
        setTimeout(() => {
          wx.navigateBack();
          // wx.redirectTo({
          //   url: '/page/home/address_list/address_list'
          // })
        }, 1000)

      } else {
        wx.showToast({
          title: '保存失败',
          mask: true
        })
      }
    })
  },

  loadData: function(id) {
    editAddress.getAddress(id, (res) => {
      if (res.Status == 0) {
        let data = res.Datas.AddressList[0]
        console.log(data);
        this.setData({
          addressid: id,
          tphone: data.Phone,
          name: data.UserName,
          sex: data.Sex,
          local: data.Address,
          dfl: data.IsDefault,
          lng: data.LonLat.split(',')[0] || "",
          lat: data.LonLat.split(',')[1] || "",
          address: data.RoughlyAddress
        })
      }

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData(options.id)
  },


  getPhone: function(e) {
    this.setData({
      tphone: e.detail.value
    })

  },
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getlocal: function(e) {
    this.setData({
      local: e.detail.value
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