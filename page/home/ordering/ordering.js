import {
  Ordering
} from 'ordering_model.js'
var ordering = new Ordering()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuIndex: 0,
    sizeIndex: 0,
    tasteIndex: 0,
    isShowSelect: true, //规格口味选项
    isShowCart: true, //购物车
    menuList: [{
      ID: -1,
      CategoryName: '全部'
    }], //菜单列表
    menuId: -1, //分类id
    goodsList: [], //商品列表
    goodsSizeTaste: null,
    currentGoodsId: '', //所选商品ID
    goodsCartList: null, //购物车列表
    goodsCartTotalNum: 0, //购物车总数量
    goodsCartTotalPrice: 0, //购物车总价
    deskNumber: '',
    pageIndex: 1,
    isShow: true,
    isLoad: true,
    imgUrl: app.globalData.imgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadOrderingMenu()
    this.loadOrderingGoods(-1, 1)

    let deskNumber = wx.getStorageSync('deskNumber')
    if (deskNumber) {
      this.setData({
        deskNumber: deskNumber
      })
    }
    //this.loadCartData()
  },
  loadOrderingMenu() {
    ordering.getOrderingMenu((res) => {
      if (res.Status === 0) {
        let menulist = [{
          ID: -1,
          CategoryName: '全部'
        }]
        this.setData({
          menuList: menulist.concat(res.Datas.CategoryList)
        })
      }
    })
  },
  //商品列表
  loadOrderingGoods(menuId, pageIndex) {
    wx.showLoading({
      title: '加载中...',
    })
    ordering.getOrderingGoods(menuId, pageIndex, (res) => {
      setTimeout(() => {
        wx.hideLoading()
        //停止刷新
        wx.stopPullDownRefresh()
      }, 500)
      if (res.Status === 0) {
        if (res.Datas.CommodityList.length === 0) {
          this.setData({
            isLoad: false,
            isShowCart: false
          })
        }
        if (pageIndex === 1) {
          this.setData({
            goodsList: res.Datas.CommodityList,
            isShow: false
          })
        } else {
          this.setData({
            goodsList: this.data.goodsList.concat(res.Datas.CommodityList)
          })
        }
        if (this.data.goodsList.length === 0) {
          this.setData({
            isShow: true
          })
        }
      }

    })
  },
  menuTap(e) {
    let index = e.currentTarget.dataset.idx
    let menuId = e.currentTarget.dataset.id
    this.loadOrderingGoods(menuId, 1) //切换商品列表
    this.setData({
      menuIndex: index,
      pageIndex: 1,
      isLoad: true,
      menuId: menuId
    })
  },
  //商品详情
  goodsDetailTap(e) {
    let goodsId = e.currentTarget.dataset.id
    let inv = e.currentTarget.dataset.inv
    if (inv === 0) {
      return
    } else {
      wx.navigateTo({
        url: '/page/home/ordering_detail/ordering_detail?id=' + goodsId,
      })
    }

  },
  //购物车
  goodsCartTap() {
    if (this.data.goodsCartTotalNum <= 0 && this.data.isShowCart) {
      wx.showToast({
        title: '您还没选任何商品',
        icon: 'none',
        mask: true
      })
      return
    }
    this.setData({
      isShowCart: !this.data.isShowCart
    })
  },
  //下单
  orderTap() {
    wx.navigateTo({
      url: '/page/home/ordering_pay/ordering_pay',
    })
    this.setData({
      isShowCart: !this.data.isShowCart
    })
  },
  //显示规格口味
  goodsSizeTap(e) {
    let index = e.currentTarget.dataset.idx
    let sizeTaste = this.data.goodsList[index]
    let currentGoodsId = this.data.goodsList[index].CommodityID
    this.setData({
      isShowSelect: false,
      goodsSizeTaste: sizeTaste,
      currentGoodsId: currentGoodsId
    })
  },
  //规格选择
  selectData(e) {
    let data = e.detail
    this.setData({
      isShowSelect: data.orderSelect
    })
    if (data.size) {
      wx.showToast({
        title: '正在加入购物车',
        icon: 'loading',
        mask: 'true',
        duration: 600
      })
      ordering.addCart(this.data.currentGoodsId, data.size, data.taste, this.data.deskNumber, 1, (res) => {
        if (res.Status === 0) {
          //wx.hideLoading()
          // this.setData({
          //   goodsCartTotalNum: res.Datas.SumCommodityNum
          // })
          this.loadCartData()
        } else {
          wx.showToast({
            title: '添加失败',
            mask: true
          })
        }
      })
    }
  },
  //购物车数据
  loadCartData() {
    ordering.getCartData(this.data.deskNumber, (res) => {
      //停止刷新
      wx.stopPullDownRefresh()
      if (res.Status === 0) {
        this.setData({
          goodsCartList: res.Datas.ShoppingCartList,
          goodsCartTotalNum: res.Datas.SumCommodityNum,
          goodsCartTotalPrice: res.Datas.SumCommodityPrice
        })
      }
    })
  },
  //购物车增加商品
  incrementTap(e) {
    let goodsId = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.idx
    let goodsList = this.data.goodsCartList
    goodsList[index].CommodityPrice = (parseFloat(goodsList[index].Price) + parseFloat(goodsList[index].CommodityPrice)).toFixed(2)
    goodsList[index].CommodityNum += 1
    let totalPrice = (parseFloat(goodsList[index].Price) + parseFloat(this.data.goodsCartTotalPrice)).toFixed(2)
    let totalNum = this.data.goodsCartTotalNum += 1
    this.setData({
      goodsCartList: goodsList, //商品列表
      goodsCartTotalPrice: totalPrice, //总价格
      goodsCartTotalNum: totalNum //总数量
    })
    ordering.cartNumerical(goodsId, 'add', this.data.deskNumber, (res) => {
      if (res.Status === 0) {
        //console.log(res)
      }
    })
  },
  //购物车减少商品
  decrementTap(e) {
    let goodsId = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.idx
    let goodsList = this.data.goodsCartList
    goodsList[index].CommodityPrice = (parseFloat(goodsList[index].CommodityPrice) - parseFloat(goodsList[index].Price)).toFixed(2)
    goodsList[index].CommodityNum -= 1
    let totalPrice = (parseFloat(this.data.goodsCartTotalPrice) - parseFloat(goodsList[index].Price)).toFixed(2)
    let totalNum = this.data.goodsCartTotalNum -= 1
    //如果为0则删除
    if (goodsList[index].CommodityNum <= 0) {
      goodsList.splice(index, 1)
    }
    this.setData({
      goodsCartList: goodsList, //商品列表
      goodsCartTotalPrice: totalPrice, //总价格
      goodsCartTotalNum: totalNum //总数量
    })
    ordering.cartNumerical(goodsId, 'del', this.data.deskNumber, (res) => {
      if (res.Status === 0) {
        //console.log(res)
      }
    })
  },
  clearAllGoods() {
    ordering.cartNumerical(-1, 'empty', this.data.deskNumber, (res) => {
      if (res.Status === 0) {
        this.setData({
          goodsCartList: [], //商品列表
          goodsCartTotalPrice: '0.00', //总价格
          goodsCartTotalNum: 0 //总数量
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadCartData()
  },
  onPullDownRefresh() {
    this.onLoad()
    this.onShow()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isLoad) {
      let pageIndex = this.data.pageIndex += 1
      this.loadOrderingGoods(this.data.menuId, pageIndex)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})