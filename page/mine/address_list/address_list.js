import {
  AddList
} from 'address_list_model.js'
var addList = new AddList()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    addListArr: [],
    addListArr1: [], //从Mine模块进来
    noList: [],
    type: 0
  },
  loadData: function() {
    wx.showLoading({
      title: '正在加载中...',
      mask: true
    })
    if (this.data.type == 0) { //如果type=0 就是从下单页面进入地址列表的
      addList.getAddListh((res) => {
        if (res.Status === 0) {
          wx.hideLoading()
          this.setData({
            addListArr: res.Datas.AddressList
          })
          let nl = [];
          let l = [];
          for (var i = 0; i < this.data.addListArr.length; i++) {
            if (this.data.addListArr[i].isDistance == 1) {
              nl.push(this.data.addListArr[i])
            } else {
              l.push(this.data.addListArr[i])
            }
          }
          this.setData({
            noList: nl,
            addListArr: l
          })
        } else {
          wx.showToast({
            title: '加载失败',
            mask: true
          })
        }
      })
    } else {
      addList.getAddListh1((res) => {
        if (res.Status === 0) {
          wx.hideLoading()
          this.setData({
            addListArr1: res.Datas.AddressList
          })
        } else {
          wx.showToast({
            title: '加载失败',
            mask: true
          })
        }
      })
    }
  },

  switchDefault: function(e) {
    if (this.data.type == 1) return
    this.setData({
      active: e.currentTarget.dataset.id
    })
    let id = e.currentTarget.dataset.addid
    addList.optDef(id, (res) => {
      if (res.Status === 0) {
        wx.showToast({
          title: '设置成功',
          mask: true
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/page/home/suborder/suborder'
          })
        }, 1000)
      } else {
        wx.showToast({
          title: '设置失败',
          mask: true
        })
      }

    })

  },

  interNewAdd: function(e) { //进入新增收货地址页面
    wx.navigateTo({
      url: '/page/mine/add_address/add_address'
    })
  },
  jumpEdit: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/page/mine/edit_addres/edit_addres?id=' + id
    })
  },
  delAddress: function(e) {
    let id = e.currentTarget.dataset.id;
    let types = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.idx;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否要删除这个地址',
      success: function(res) {
        if (res.confirm) {
          addList.delAddListh(id, (res) => {
            if (res.Status === 0) {
              if (types == 1) {
                let list = that.data.addListArr;
                list.splice(index, 1)
                that.setData({
                  addListArr: list
                })
              } else {
                let list = that.data.noList;
                list.splice(index, 1)
                that.setData({
                  noList: list
                })
              }
              wx.showToast({
                title: '删除成功',
                mask: true
              })
              setTimeout(() => {
                that.loadData();
              }, 1000)
            } else {
              wx.showToast({
                title: '删除失败',
                mask: true
              })
            }

          })
        } else if (res.cancel) {}
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type
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
    this.loadData();
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