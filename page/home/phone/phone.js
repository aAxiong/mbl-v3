
import { Phone } from 'phone_model.js'
var phone = new Phone()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeMins:false,
    sendRest:false,
    codefirst:true,
    min:60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '完善信息',
    })
  },
  //提交信息
  formsubmit(e) {
    let uname = e.detail.value.userName,
      uphone = e.detail.value.userPhone,
      ucode = e.detail.value.userCode

    let rname = new RegExp('^[\u4e00-\u9fa5]|[a-zA-Z]')
    let rphone = /^1(3|4|5|7|8)\d{9}$/
    let rcode = new RegExp('^[0-9]{6}')

    if (!rname.test(uname)) {
      this.faileToast('请输入正确姓名')
    } else if (!rphone.test(uphone)) {
      this.faileToast('请输入正确手机号')
    } else if (!rcode.test(ucode)) {
      this.faileToast('请输入正确验证码')
    } else {
      wx.showLoading({
        title: '正在提交...',
      })
      phone.submitUserInfo(uname, uphone, ucode, (res) => {
        if (res.Status == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            mask: true,
            success:function(){
              wx.navigateBack({
                delta:1
              })
            }
          })
        }
      })
    }
  },
  //获取输入的手机号码
  userPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //发送验证码
  sendCode(e) {
    let rphone = /^1(3|4|5|7|8)\d{9}$/
    let vphone = this.data.phone
    if (!rphone.test(vphone)) {
      this.faileToast('请输入正确手机号')
    } else {
      let codeTime = null;
      this.setData({
        codefirst: false,
        codeMins: true,
        sendRest: false,
        min: 60
      })
      codeTime = setInterval(() => {
        let min = this.data.min -= 1
        if (min === 0) {
          clearInterval(codeTime)
          this.setData({
            codeMins: false,
            sendRest: true
          })
        }
        this.setData({
          min: min
        })
      }, 1000)
      phone.sendPhone(vphone, (res) => {
        if (res.Status == 0) {
          this.mesToast('验证码发送成功', 'success')
        } else {
          this.mesToast('发送失败', 'none')
          this.setData({
            codeMins: false,
            sendRest: true
          })
        }
      })
    }
  },
  //错误提示
  faileToast(tips) {
    wx.showToast({
      title: tips,
      icon: 'none'
    })
  },
  //提交提示
  mesToast(tips, status) {
    wx.showToast({
      title: tips,
      icon: status,
      mask: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})