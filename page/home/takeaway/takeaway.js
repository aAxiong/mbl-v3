// pages/goods/goods.js
// const constants = require('../../../utils/constants.js')

const util = require('../../../utils/util.js')
import {
  Takeaway
} from 'takeaway_model.js'
var takeaway = new Takeaway()
var app = getApp()
Page({
  data: {
    sceenHeight: '',
    HotList: [],
    // toView: '0',
    searchText: "",
    isShowSelect: true, //规格口味选项
    scrollTop: 100,
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
    cartShow: 'none',
    status: 0,
    active: 0,
    constants: [], // 数据,
    mpconstants: [],
    seaconstants: [], //搜索产品数组
    toView: null, // 左 => 右联动 右scroll-into-view 所需的id
    currentLeftSelect: null, // 当前左侧选择的
    eachRightItemToTop: [], // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
    leftToTop: 0,
    RIGHT_BAR_HEIGHT: 0,
    RIGHT_ITEM_HEIGHT: 0,
    LEFT_ITEM_HEIGHT: 0,
    drap: false,
    seachPageShow: false,
    activityArr: [], //门店活动列表
    productyArr: [], //商品列表,
    currentGoodsId: "",
    distance: 0, //距离
    distanceTime: 0, //配送时间
    tipstShow: false,
    LonLat: "",
    animationData: {},
    rectHeight: 0,
    hide_good_box: true,
    imgUrl: 'https://xcx.mblsoft.com',
    x: '',
    y: '',
    animationBall: {},
    payClass: 0,
    labelShow: false,
    labelList: [],
    stockList: [],
    HotListShow: false,
    authShow: true,
    searchIndex: 0,
    Proportion: '',
    buttonClicked: true
  },

  /*规格操作 */
  //显示规格口味  
  goodsSizeTap(e) {
    let paindex = e.currentTarget.dataset.parentindex
    let index = e.currentTarget.dataset.itemIndex
    let ll = this.data.constants[paindex].ProductList[index].LableList.length;
    let sl = this.data.constants[paindex].ProductList[index].SpecificationList.length;
    let sizeTaste = this.data.constants[paindex].ProductList[index]
    let currentGoodsId = sizeTaste.CommodityID
    let that = this;
    let id = e.currentTarget.id;
    if (ll === 0 && sl === 0) {
      this.setData({
        currentGoodsId: currentGoodsId,
      })
      this.selectData("");
      return
    } else {
      this.setData({
        isShowSelect: false,
        goodsSizeTaste: sizeTaste,
        currentGoodsId: currentGoodsId
      })
    }

  },
  //显示搜索规格口味  
  segoodsSizeTap(e) {
    let paindex = e.currentTarget.dataset.idx
    let sizeTaste = this.data.seaconstants[paindex]
    let currentGoodsId = sizeTaste.CommodityID
    let ll = this.data.seaconstants[paindex].LableList.length;
    let sl = this.data.seaconstants[paindex].SpecificationList.length;
    let that = this;
    let id = e.currentTarget.id;
    if (ll === 0 && sl === 0) {
      this.setData({
        currentGoodsId: currentGoodsId,
      })
      this.selectData("");
      return
    } else {
      this.setData({
        isShowSelect: false,
        goodsSizeTaste: sizeTaste,
        currentGoodsId: currentGoodsId
      })
    }
  },
  //规格选择
  selectData(e) {
    let data = e.detail || ""
    let size = data.size || "";
    let taste = data.taste || "";
    if (data != "") {
      this.setData({
        isShowSelect: data.orderSelect
      })
      if (data.type == 1) { //点了取消
        return
      }
    }
    let that = this;
    var an = wx.createAnimation({
      duration: 300, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%'
    });

    takeaway.optCart(this.data.currentGoodsId, data.size, data.taste, 1, "+", (res) => {
      if (res.Status === 0) {
        wx.hideLoading()
        this.setData({
          totalCount: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice
        })
        /*小球跳动*/
        // this.touchOnGoods();
        an.scale(1.15).step();
        an.scale(1).step();
        this.setData({
          payDesc: this.payDesc(),
          animationBall: an.export()
        })
        this.addJStock("add");
        // this.loadCartData()
      } else {
        wx.showToast({
          title: '添加失败',
          mask: true,
          icon: 'none'
        })
      }
    })
  },

  //外卖列表&搜索列表 减少产品操作
  reduceProduct: function(e) { //减少商品操作 --外卖列表
    let paindex = e.currentTarget.dataset.parentindex
    let index = e.currentTarget.dataset.itemIndex
    let sizeTaste = this.data.constants[paindex].ProductList[index]
    let currentGoodsId = sizeTaste.CommodityID
    this.setData({
      currentGoodsId: currentGoodsId,
    })
    this.reduceProductOpt();
  },
  reduceSeProduct: function(e) { //减少商品操作 --外卖列表
    let paindex = e.currentTarget.dataset.idx
    let sizeTaste = this.data.seaconstants[paindex]
    let currentGoodsId = sizeTaste.CommodityID
    this.setData({
      currentGoodsId: currentGoodsId,
    })
    this.reduceProductOpt();
  },
  reduceProductOpt: function() { //total  外卖列表&搜索列表 减少产品操作
    var an = wx.createAnimation({
      duration: 300, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%'
    });
    takeaway.optCart(this.data.currentGoodsId, "", "", 1, "-", (res) => { //减少商品操作 --外卖搜索列表
      if (res.Status === 0) {
        wx.hideLoading()
        this.setData({
          totalCount: res.Datas.SumCommodityNum,
          totalPrice: res.Datas.SumCommodityPrice
        })
        /*小球跳动*/
        // this.touchOnGoods();
        an.scale(1.15).step();
        an.scale(1).step();
        this.setData({
          payDesc: this.payDesc(),
          animationBall: an.export()
        })
        this.addJStock("reduce");
        // this.loadCartData()
      } else {
        wx.showToast({
          title: '操作失败',
          mask: true,
          icon: 'none'
        })
      }
    })
  },

  /*购物车操作 */
  optShopCart: function(e, opt, num) { //操作购物车+ - 清空
    let id = e.currentTarget.dataset.id;
    let pid = e.currentTarget.dataset.pid
    let that = this;
    let cvalue = this.data.constants;
    let index = e.currentTarget.dataset.itemIndex;
    let cararr = this.data.carArray;
    for (var i = 0; i < cvalue.length; i++) {
      for (var j = 0; j < cvalue[i].ProductList.length; j++) {
        if (cvalue[i].ProductList[j].CommodityID == pid && opt == 'add') {
          if (cvalue[i].ProductList[j].Inventory <= 0) {
            wx.showToast({
              title: '已经没有库存了~',
              icon: 'none',
              mask: true
            })
            return
          }
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

    takeaway.operateCart(id, opt, (res) => {
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
          let length = that.data.carArray.length > 4 ? 4.4 : that.data.carArray.length
          this.setData({
            rectHeight: (this.data.Proportion * 92) + ((92 * this.data.Proportion) * length)
          })
          this.cartShow(false);
        }
        this.setData({
          payDesc: this.payDesc()
        })
        this.shopCarAddJStock(pid, opt, num)
        // this.loadCartData() 3571204333494075392
      } else {
        wx.showToast({
          title: '操作失败',
          mask: true,
          icon: 'none'
        })
      }
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
    takeaway.operateCart(id, "empty", (res) => {
      if (res.Status === 0) {
        this.shopCarAddJStock("", "empty", "")
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
          mask: true,
          icon: 'none'
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
    takeaway.getCartData((res) => {
      wx.hideLoading()
      this.setData({
        totalCount: res.Datas.SumCommodityNum,
        totalPrice: res.Datas.SumCommodityPrice,
        carArray: res.Datas.ShoppingCartList
      })
      this.setData({
        payDesc: this.payDesc()
      })
      let length = that.data.carArray.length > 4 ? 4.4 : that.data.carArray.length
      that.setData({
        rectHeight: (this.data.Proportion * 92) + ((this.data.Proportion * 92) * length)
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
  onLoad: function(options) {

  },
  /*饿了么 双列表操作 */
  getEachRightItemToTop: function() { //计算每个类别总宽度
    var obj = {};
    var totop = 0;
    let self = this;
    wx.getSystemInfo({
      success: function(res) {
        // let RIGHT_BAR_HEIGHT = res.windowWidth / 750 * 208;
        // let RIGHT_ITEM_HEIGHT = res.windowWidth / 750 * 20;
        self.setData({
          RIGHT_BAR_HEIGHT: res.windowWidth / 750 * 20,
          RIGHT_ITEM_HEIGHT: res.windowWidth / 750 * 208,
          LEFT_ITEM_HEIGHT: res.windowWidth / 750 * 57
        })

      },
    })
    // const RIGHT_BAR_HEIGHT = 10; // 右侧每一类的 bar 的高度（固定）
    // const RIGHT_ITEM_HEIGHT = 94; // 右侧每个子类的高度（固定）
    obj[this.data.constants[0].CategoryID] = totop // 右侧第一类肯定是到顶部的距离为 0
    for (let i = 1; i < (this.data.constants.length + 1); i++) { // 循环来计算每个子类到顶部的高度

      totop += (this.data.RIGHT_BAR_HEIGHT + this.data.constants[i - 1].ProductList.length * this.data.RIGHT_ITEM_HEIGHT)
      obj[this.data.constants[i] ? this.data.constants[i].CategoryID : 'last'] = totop // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
    }
    return obj
  },
  rightScroll: function(e) { // 监听右侧的滚动事件与 eachRightItemToTop 的循环作对比 从而判断当前可视区域为第几类，从而渲染左侧的对应类。
    for (let i = 0; i < this.data.constants.length; i++) {
      let left = this.data.eachRightItemToTop[this.data.constants[i].CategoryID]
      let right = this.data.eachRightItemToTop[this.data.constants[i + 1] ? this.data.constants[i + 1].CategoryID : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        this.setData({
          currentLeftSelect: "i" + this.data.constants[i].CategoryID,
          leftToTop: this.data.LEFT_ITEM_HEIGHT * i
        })
      }
    }
  },
  jumpToSick: function(e) { // 左侧类的点击事件
    this.setData({
      toView: e.target.id || e.currentTarget.dataset.id,
      currentLeftSelect: e.target.id || e.currentTarget.dataset.id
    })
  },
  /** 活动列表 */
  downdrap: function(e) { //下拉
    if (this.data.drap == false) {
      this.setData({
        drap: true
      })
    } else {
      this.setData({
        drap: false
      })
    }
  },

  foodDetailTap: function(e) { //商品点击跳转
    let CommodityID = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/page/home/takeaway_info/takeaway_info?id=' + CommodityID,
    })
  },
  userAuth() { //地址授权测试
    let that = this;
    wx.getLocation({
      success: function(res) {
        that.setData({
          LonLat: res.longitude + "," + res.latitude
        })
        that.loadData()
      },
      fail(err) {
        wx.hideLoading();
        wx.getSetting({
          success: function(res) {
            if (res.authSetting["scope.userLocation"] == true) {
              that.loadData()
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
  loadData: function() { //请求数据
    takeaway.getactivityData((res) => {
      this.setData({
        activityArr: res.DisCouponList
      })
    })
    let that = this;
    takeaway.getproductData(that.data.LonLat, (res) => {
      that.data.constants = res.CommodityList;
      //停止刷新
      setTimeout(() => {
        wx.stopPullDownRefresh()
        wx.hideLoading();
      }, 500)
      if (res.CommodityList.length <= 0) {

        wx.showToast({
          title: '暂无商品',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          productyArr: res,
          minPrice: res.InitialFee,
          totalCount: res.SumCommodityNum,
          totalPrice: res.SumCommodityPrice
        })
      } else {
        that.setData({
          constants: res.CommodityList,
          mpconstants: res.CommodityList,
          currentLeftSelect: "i" + that.data.constants[0].CategoryID,
          eachRightItemToTop: that.getEachRightItemToTop(),
          productyArr: res,
          minPrice: res.InitialFee,
          totalCount: res.SumCommodityNum,
          totalPrice: res.SumCommodityPrice
        })
        that.lookStock("constants", res.CommodityList)
      }
      if (res.IsDistance != 0) {
        that.setData({
          tipstShow: true
        })
      }
      that.setData({
        payDesc: that.payDesc()
      });

    })

  },

  /**搜索操作 */
  inputShow: function() { //搜索页面弹起
    let list = wx.getStorageSync('labelList')
    if (this.data.searchIndex == 0) {
      takeaway.getHotSearch((res) => {
        if (res.Status === 0) {
          this.setData({
            HotList: res.Datas.HotCommodityName
          })
          if (res.Datas.HotCommodityName.length > 0) {
            this.setData({
              HotListShow: true,
              searchIndex: 1
            })
          }
        }
      })
    } else {
      this.setData({
        HotListShow: true
      })
    }
    this.setData({
      seachPageShow: true,
      seaconstants: []
    });

    if (list.length > 0) {
      this.setData({
        labelShow: true,
        labelList: list
      });
    }
  },
  inputHide: function() { //关闭搜索
    this.setData({
      seachPageShow: false,
      searchText: "",
      seaconstants: [],
      HotListShow: false
    });
  },
  rmoveHis() {
    wx.removeStorageSync('labelList')
    this.setData({
      labelList: [],
      labelShow: false
    })
    wx.showToast({
      title: '清除成功',
      icon: 'none'
    })
  },

  hisLabelSearch(label) { //标签展示
    let list = wx.getStorageSync('labelList')
    for (var i = 0; i < list.length; i++) {
      if (list[i] == label) {
        return
      }
    }
    if (list == "") {
      let pt = [];
      pt.unshift(label);
      wx.setStorageSync("labelList", pt)
    } else {
      if (list.length > 7) {
        list.pop(1)
      }
      list.unshift(label);
      wx.setStorageSync("labelList", list)
    }
  },
  searchProduct: function(e) { //搜索产品
    let content = e.detail.value || e.currentTarget.dataset.con;
    this.setData({
      labelShow: false,
      searchText: content,
      HotListShow: false
    });
    wx.showLoading({
      title: '搜索中...',
      mask: true
    })
    takeaway.getSearchPro(content, (res) => {
      wx.hideLoading();
      if (res.Status === 0) {
        if (res.Datas.CommodityList.length <= 0) {
          wx.showToast({
            title: '搜索不到相关产品',
            icon: 'none',
            duration: 2000
          })
        }
        this.setData({
          seaconstants: res.Datas.CommodityList
        })
        this.searoptStock("seaconstants", res.Datas.CommodityList)
        this.hisLabelSearch(content)
      }
    })
  },
  jumpOrder: function() {
    let totalPrice = parseFloat(this.data.totalPrice);
    let minPrice = parseFloat(this.data.minPrice);
    if (totalPrice >= minPrice && this.data.payClass == 1) {
      this.cartShow(true);
      wx.navigateTo({
        url: '/page/home/suborder/suborder?deliveryFee=' + this.data.productyArr.DeliveryFee,
      })
    }

  },
  closeTips: function() { //关闭提示
    this.setData({
      tipstShow: false
    })
  },
  onReady: function() {
    // 页面渲染完成

  },
  onShow: function(option) {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let self = this;
    wx.getSystemInfo({
      success: function(res) {
        // let RIGHT_BAR_HEIGHT = res.windowWidth / 750 * 208;
        // let RIGHT_ITEM_HEIGHT = res.windowWidth / 750 * 20;
        self.setData({
          Proportion: res.windowWidth / 750,
          sceenHeight: res.windowHeight - res.windowWidth / 750 * 400,
        })

      },
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.busPos = {};
    this.busPos['x'] = 45; //购物车的位置
    this.busPos['y'] = app.globalData.hh - 56;
    // this.loadData();
    this.userAuth();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  //授权
  authClcik(e) {
    if (e.detail.type == 1) {
      this.onShow()
      return
    }
    let status = e.detail.status;
    this.setData({
      authShow: status
    })
  },
  /*库存操作 */
  lookStock(key, value) { //查看库存
    //carArray
    wx.hideLoading();
    takeaway.getCartData((res) => {
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
    let cvalue = [].concat(this.data.constants)
    for (var k = 0; k < carArray.length; k++) {
      for (var i = 0; i < value.length; i++) {
        for (var j = 0; j < value[i].ProductList.length; j++) {
          if (k == 0) { //第一轮循环就加上一个CommodityNum字段
            value[i].ProductList[j].CommodityNum = 0
          }
          if (value[i].ProductList[j].CommodityID == carArray[k].CommodityID) {
            value[i].ProductList[j].Inventory = value[i].ProductList[j].Inventory - carArray[k].CommodityNum;
            value[i].ProductList[j].CommodityNum = carArray[k].CommodityNum
          }
        }
      }
    }
    console.log(value);
    this.setData({
      [key]: value
    })
  },
  searoptStock(key, value) { //操作库存 搜索操作库存
    let cvalue = this.data.constants;
    for (var k = 0; k < cvalue.length; k++) {
      for (var j = 0; j < cvalue[k].ProductList.length; j++) {
        for (var i = 0; i < value.length; i++) {
          if (k == 0 && j == 0) { //第一轮循环就加上一个CommodityNum字段
            value[i].CommodityNum = 0
          }
          if (value[i].CommodityID == cvalue[k].ProductList[j].CommodityID) {
            value[i].Inventory = cvalue[k].ProductList[j].Inventory
            value[i].CommodityNum = cvalue[k].ProductList[j].CommodityNum
          }
        }
      }
    }
    console.log(value);
    this.setData({
      [key]: value
    })
  },
  addJStock(types) { //库存加减 商品列表库存加减
    // this.lookStock("constants", this.data.constants)
    let carArray = this.data.carArray;
    let cvalue = this.data.constants;
    let sealue1 = this.data.seaconstants;
    let id = this.data.currentGoodsId;

    for (var i = 0; i < cvalue.length; i++) {
      for (var j = 0; j < cvalue[i].ProductList.length; j++) {
        if (cvalue[i].ProductList[j].CommodityID == id) {
          if (types == "add") {
            cvalue[i].ProductList[j].Inventory = cvalue[i].ProductList[j].Inventory - 1;
            cvalue[i].ProductList[j].CommodityNum = cvalue[i].ProductList[j].CommodityNum + 1
          } else {
            cvalue[i].ProductList[j].Inventory = cvalue[i].ProductList[j].Inventory + 1;
            cvalue[i].ProductList[j].CommodityNum = cvalue[i].ProductList[j].CommodityNum - 1
          }
        }
      }
    }

    this.setData({
      constants: cvalue
    })
    if (this.data.seachPageShow == true) { //搜索库存加减

      for (var i = 0; i < sealue1.length; i++) {
        if (sealue1[i].CommodityID == id) {
          if (types == "add") {
            sealue1[i].Inventory = sealue1[i].Inventory - 1;
            sealue1[i].CommodityNum = sealue1[i].CommodityNum + 1;
          } else {
            sealue1[i].Inventory = sealue1[i].Inventory + 1;
            sealue1[i].CommodityNum = sealue1[i].CommodityNum - 1;
          }
        }
      }
      this.setData({
        seaconstants: sealue1
      })
    }

  },
  shopCarAddJStock(id, opt, num) { //购物车库存加减
    let carArray = this.data.carArray;
    let cvalue = this.data.constants;
    // let id = this.data.currentGoodsId;
    if (opt == "empty") { //清空操作
      for (var k = 0; k < carArray.length; k++) {
        for (var i = 0; i < cvalue.length; i++) {
          for (var j = 0; j < cvalue[i].ProductList.length; j++) {
            if (cvalue[i].ProductList[j].CommodityID == carArray[k].CommodityID) {
              cvalue[i].ProductList[j].Inventory = cvalue[i].ProductList[j].Inventory + carArray[k].CommodityNum;
              cvalue[i].ProductList[j].CommodityNum = 0
            }
          }
        }
      }
    } else {
      for (var i = 0; i < cvalue.length; i++) {
        for (var j = 0; j < cvalue[i].ProductList.length; j++) {
          if (cvalue[i].ProductList[j].CommodityID == id) {
            cvalue[i].ProductList[j].Inventory = cvalue[i].ProductList[j].Inventory - num;
            cvalue[i].ProductList[j].CommodityNum = cvalue[i].ProductList[j].CommodityNum + num
          }
        }
      }
    }
    this.setData({
      constants: cvalue
    })
    this.seashopCarAddJStock(id, opt, num)
  },
  seashopCarAddJStock(id, opt, num) {
    let carArray = this.data.carArray;
    let sealue1 = this.data.seaconstants;
    // let id = this.data.currentGoodsId;
    if (this.seachPageShow == false) {
      return
    }
    if (opt == "empty") { //清空操作
      for (var k = 0; k < carArray.length; k++) {
        for (var i = 0; i < sealue1.length; i++) {
          if (sealue1[i].CommodityID == carArray[k].CommodityID) {
            sealue1[i].Inventory = sealue1[i].Inventory + carArray[k].CommodityNum;
            sealue1[i].CommodityNum = 0
          }
        }
      }
    } else {
      for (var i = 0; i < sealue1.length; i++) {
        for (var j = 0; j < sealue1.length; j++) {
          if (sealue1[i].CommodityID == id) {
            sealue1[i].Inventory = sealue1[i].Inventory - num;
            sealue1[i].CommodityNum = sealue1[i].CommodityNum + num
          }
        }

      }
    }
    this.setData({
      seaconstants: sealue1
    })
  },
  onPullDownRefresh() {
    this.onShow()
  }
})