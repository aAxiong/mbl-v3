// const constants = require('../../../utils/constants.js')
const util = require('../../../utils/util.js')
import {
  TakeawayInfo
} from 'takeaway_info_model.js'
var takeawayInfo = new TakeawayInfo()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityId: "",
    productList: [],
    productyArr: [],
    customInfoList: [],
    sizeIndex: 0,
    sizeId: '',
    price: '',
    shopData: [],
    shopData1: [],
    foodCounts: 0,
    totalPrice: 0, // 总价格
    totalCount: 0, // 总商品数
    carArray: [], //购物车数组
    minPrice: 0, //起送價格
    payDesc: '',
    deliveryPrice: 4, //配送費
    fold: true,
    selectFoods: [{
      price: 20,
      count: 2
    }],
    animationData: {},
    cartShow: 'none',
    imgUrl: 'https://xcx.mblsoft.com',
    LonLat: '',
    payClass: 0,
    authShow: true,
    animationBall: {},
    Proportion: '',
    buttonClicked: true
  },
  optShopCart: function(e, opt, num) { //操作购物车+ - 清空
    if (this.data.buttonClicked == false) return
    this.setData({
      buttonClicked: false
    })
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.itemIndex;
    let cararr = this.data.carArray;
    let cvalue = this.data.productList;
    let ids = this.data.commodityId;
    for (var i = 0; i < cararr.length; i++) {
      if (cvalue.CommodityID == ids && opt == 'add') {
        if (cvalue.Inventory <= 0) {
          wx.showToast({
            title: '已经没有库存了~',
            icon: 'none',
            mask: true
          })
          return
        }
      }
    }
    if (cararr[index].CommodityNum == 1 && opt == 'del') {
      cararr.splice(index, 1)
    } else if (opt == 'del') {
      cararr[index].CommodityPrice = (parseFloat(cararr[index].CommodityPrice) - parseFloat(cararr[index].UnitPrice)).toFixed(2)
      cararr[index].CommodityNum += num
    } else {
      cararr[index].CommodityPrice = (parseFloat(cararr[index].UnitPrice) + parseFloat(cararr[index].CommodityPrice)).toFixed(2)
      cararr[index].CommodityNum += num
    }
    takeawayInfo.operateCart(id, opt, (res) => {
      if (res.Status === 0) {
        if (cararr.length <= 0) {
          this.cartShow(true);
        }
        this.setData({
          carArray: cararr,
          totalCount: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice
        })
        if (num == -1 && cararr.length > 0) {
          let length = this.data.carArray.length > 4 ? 4.4 : this.data.carArray.length
          this.setData({
            rectHeight: (this.data.Proportion * 92) + ((92 * this.data.Proportion) * length)
          })
          this.cartShow(false);
        }
        this.shopCarAddJStock(opt, num)
        this.setData({
          payDesc: this.payDesc()
        })

        // this.loadCartData()
      } else {
        wx.showToast({
          title: '操作失败',
          mask: true
        })
      }
      this.setData({
        buttonClicked: true
      })
    })
  },
  addShopCart: util.throttle(function(e) {
    //添加购物车 +号
    this.optShopCart(e, "add", 1);
  }, 700),
  decreaseShopCart: util.throttle(function(e) {
    //减少购物车产品 -号
    this.optShopCart(e, "del", -1);
  }, 700),
  emptyShopCart: function(e) { //清空购物车
    let id = "";
    let cararr = this.data.carArray;
    takeawayInfo.operateCart(id, "empty", (res) => {
      if (res.Status === 0) {
        this.shopCarAddJStock("empty", "")
        cararr = [];
        this.setData({
          carArray: cararr,
          totalCount: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice
        })
        wx.showToast({
          title: '清空成功',
          mask: true
        })
        this.cartShow(true);
        this.setData({
          payDesc: this.payDesc()
        })

        // this.loadCartData()
      } else {
        wx.showToast({
          title: '操作失败',
          mask: true
        })
      }
    })
  },
  //计算总价
  calTotalPrice: function() {
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;
      totalCount += carArray[i].num
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      //payDesc: this.payDesc()
    });
  },
  carHide() { //购物车缩下
    this.cartShow(true);
  },
  addProduct() { //添加进购物车
    if (this.data.productList.Inventory <= 0) {
      return
    }
    let that = this;
    let tasteName = '';
    let count = 0;
    let list = this.data.productList
    wx.showLoading({
      title: '正在加入购物车...',
      mask: true
    })
    var an = wx.createAnimation({
      duration: 300, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%'
    });

    for (var i = 0, length = list.LableList.length; i < length; i++) { //口味操作 xx | xx 格式
      for (var j = 0, jlength = list.LableList[i].OptionsValueList.length; j < jlength; j++) {
        if (list.LableList[i].OptionsValueList[j].check == true) {
          if (count == 0) {
            tasteName = list.LableList[i].OptionsValueList[j].OptonsValue
            count++
          } else {
            tasteName += " | " + list.LableList[i].OptionsValueList[j].OptonsValue
          }

        }
      }
    }
    takeawayInfo.addCart(this.data.commodityId, this.data.sizeId, tasteName, 1, (res) => {
      if (res.Status === 0) {
        wx.hideLoading()
        this.setData({
          totalCount: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice,
        })
        an.scale(1.15).step();
        an.scale(1).step();
        this.setData({
          payDesc: this.payDesc(),
          animationBall: an.export()
        })
        // this.loadCartData()
        this.addJStock();
      } else {
        wx.showToast({
          title: '添加失败',
          mask: true
        })
      }
    })
  },
  //差几元起送
  payDesc() {
    let totalPrice = parseFloat(this.data.totalPrice);
    let minPrice = parseFloat(this.data.minPrice);
    if (totalPrice === 0) {
      this.setData({
        payClass: 0
      })
      return `${minPrice}元起送`;
    } else if (totalPrice < minPrice) {
      this.setData({
        payClass: 0
      })
      let diff = String(minPrice - this.data.totalPrice)
      if (diff.indexOf('.') > -1) {
        if (diff.split('.')[1].length > 2) {
          diff = parseFloat(diff).toFixed(2);
        }
      }
      return '还差' + diff + '元';
    } else {
      this.setData({
        payClass: 1
      })
      return '结算';
    }
  },
  //結算
  pay() {
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    }
    // window.alert('支付' + this.totalPrice + '元');
    //确认支付逻辑
    var resultType = "success";
    wx.redirectTo({
      url: '../goods/pay/pay?resultType=' + resultType
    })
  },
  //彈起購物車
  toggleList: function() {
    if (!this.data.totalCount) {
      return;
    }
    wx.showLoading({
      title: '正在加载购物车...',
      mask: true
    })
    let that = this;
    takeawayInfo.getCartData((res) => {
      wx.hideLoading()
      this.setData({
        totalCount: res.Datas.SumCommodityNum,
        totalPrice: res.Datas.SumCommodityPrice,
        carArray: res.Datas.ShoppingCartList
      })
      let length = that.data.carArray.length > 4 ? 4.4 : that.data.carArray.length
      this.setData({
        rectHeight: (this.data.Proportion * 92) + ((92 * this.data.Proportion) * length)
      })
      this.setData({
        payDesc: this.payDesc()
      })

      this.setData({
        fold: false,
      })
      var fold = this.data.fold

      this.cartShow(fold)

    })

  },
  cartShow: function(fold) { //购物车弹起
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
      animation.translate(0, -(this.data.rectHeight)).step();
    } else {
      this.setData({
        cartShow: 'none',
      })
      animation.translate(0, 0).step();
    }
    this.setData({
      animationData: animation.export(),
    })
  },
  sizeTap: function(e) {
    let index = e.currentTarget.dataset.idx
    let sizeId = e.currentTarget.dataset.sizeid
    let prices = e.currentTarget.dataset.price
    this.setData({
      sizeIndex: index,
      sizeId: sizeId,
      price: prices
    })
  },
  tasteTap: function(e) {
    let index = e.currentTarget.dataset.index
    let paindex = e.currentTarget.dataset.paindex
    let id = e.currentTarget.dataset.id
    let list = this.data.productList
    for (var i = 0, length = list.LableList[paindex].OptionsValueList.length; i < length; i++) {
      list.LableList[paindex].OptionsValueList[i].check = false;
    }
    list.LableList[paindex].OptionsValueList[index].check = true;
    this.setData({
      productList: list
    })


  },
  userAuth(id) {
    let that = this;
    wx.getLocation({
      success: function(res) {
        wx.hideLoading();
        that.setData({
          LonLat: res.longitude + "," + res.latitude
        })
        that.loadFoodsDetail(id)
      },
      fail(err) {
        wx.hideLoading();
        wx.getSetting({
          success: function(res) {
            if (res.authSetting["scope.userLocation"] == true) {
              that.loadFoodsDetail(id)
            } else {
              wx.hideLoading();
              that.setData({
                authShow: false
              })
            }
          }
        })
      }
    })

  },
  loadFoodsDetail: function(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let that = this;
    takeawayInfo.getFoodsDetail(id, that.data.LonLat, (res) => {
      wx.hideLoading();
      //停止刷新
      wx.stopPullDownRefresh()
      // let sl1 = res.CommodityList.SpecificationList[0].SpecificationID.length ;
      // let ll1 = res.CommodityList.LableList[0].SpecificationID || '';
      let sl = res.CommodityList.SpecificationList.length;
      let ll = res.CommodityList.LableList.length;
      let st = sl > 0 ? res.CommodityList.SpecificationList[0].SpecificationID : "";
      //  let lt = ll > 0 ? res.CommodityList.LableList[0].LableName : "";
      that.setData({
        productyArr: res,
        productList: res.CommodityList,
        customInfoList: res.CustomInfoList,
        price: res.CommodityList.Money,
        minPrice: res.InitialFee,
        totalCount: res.SumCommodityNum,
        totalPrice: res.SumCommodityPrice,
        sizeId: st,
      })
      this.selectLabelOpt();
      that.lookStock("productList", that.data.productList)
      that.setData({
        payDesc: that.payDesc()
      });
    })
  },

  selectLabelOpt() { //商品详情规格标签操作
    let list = this.data.productList
    for (var i = 0, length = list.LableList.length; i < length; i++) {
      for (var j = 0, jlength = list.LableList[i].OptionsValueList.length; j < jlength; j++) {
        if (j == 0) {
          list.LableList[i].OptionsValueList[j].check = true;
        } else {
          list.LableList[i].OptionsValueList[j].check = false;
        }
      }
    }
    this.setData({
      productList: list
    })
  },
  jumpOrder: function() { //跳转到订单结算页面
    let totalPrice = parseFloat(this.data.totalPrice);
    let minPrice = parseFloat(this.data.minPrice);
    if (totalPrice >= minPrice && this.data.payClass == 1) {
      wx.navigateTo({
        url: '/page/home/suborder/suborder?deliveryFee=' + this.data.productyArr.DeliveryFee,
      })
    }

  },
  /*库存操作 */
  lookStock(key, value) { //查看库存
    //carArray
    wx.hideLoading();
    takeawayInfo.getCartData((res) => {
      wx.hideLoading()
      this.setData({
        totalCount: res.Datas.SumCommodityNum,
        totalPrice: res.Datas.SumCommodityPrice,
        carArray: res.Datas.ShoppingCartList
      })
      this.optStock(key, value);
      this.setData({
        payDesc: this.payDesc()
      })
    })
  },
  optStock(key, value) { //操作库存 
    let carArray = this.data.carArray;
    for (var k = 0; k < carArray.length; k++) {
      if (value.CommodityID == carArray[k].CommodityID) {
        value.Inventory = value.Inventory - carArray[k].CommodityNum;
      }
    }
    this.setData({
      [key]: value
    })
  },
  addJStock() { //库存加减 商品列表库存加减
    // this.lookStock("constants", this.data.constants)
    let carArray = this.data.carArray;
    let cvalue = this.data.productList;
    let id = this.data.commodityId;
    cvalue.Inventory = cvalue.Inventory - 1;
    this.setData({
      productList: cvalue
    })
  },
  shopCarAddJStock(opt, num) { //购物车库存加减
    let carArray = this.data.carArray;
    let cvalue = this.data.productList;
    let id = this.data.commodityId;
    if (opt == "empty") { //清空操作
      for (var k = 0; k < carArray.length; k++) {
        if (id == carArray[k].CommodityID) {
          cvalue.Inventory = cvalue.Inventory + carArray[k].CommodityNum;
        }
      }
    } else {
      cvalue.Inventory = cvalue.Inventory - num;
    }

    this.setData({
      productList: cvalue
    })
  },
  //授权
  authClcik(e) {
    if (e.detail.type == 1) {
      this.onLoad()
      return
    }
    let status = e.detail.status;
    this.setData({
      authShow: status
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //this.loadFoodsDetail(options.id)
    this.userAuth(options.id)
    let self = this;
    wx.getSystemInfo({
      success: function(res) {
        // let RIGHT_BAR_HEIGHT = res.windowWidth / 750 * 208;
        // let RIGHT_ITEM_HEIGHT = res.windowWidth / 750 * 20;
        self.setData({
          Proportion: res.windowWidth / 750,
        })

      },
    })
    this.setData({
      commodityId: options.id
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
    let op = this.data.commodityId
    this.userAuth(op)
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