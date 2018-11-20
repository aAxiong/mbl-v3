// components/ordering_select/ordering_select.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    sizeTaste: {
      type: Object,
      observer(newData) { //默认选中第一个
        let initSizeId = newData.SpecificationList.length > 0 ? newData.SpecificationList[0].SpecificationID : ''
        let ins = newData.SpecificationList.length > 0 ? newData.SpecificationList[0] : ''
        this.selectLabelOpt()
        this.setData({
          sizeId: initSizeId,
          // tasteName: initTasteName,
          shopData: ins,
          shopData1: this.labelGenerate()
        })
        this.triggerEvent('moneyTriggerTap', {
          'index': 0
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sizeIndex: 0,
    tasteIndex: 0,
    sizeId: '',
    tasteName: '',
    shopData: [],
    shopData1: ""
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //取消规格选择
    selectCancleTap() {
      this.triggerEvent('selectTriggerTap', {
        'orderSelect': true,
        'type': 1
      })
      this.setData({
        sizeIndex: 0,
        tasteIndex: 0,
        sizeId: '',
        tasteName: ''
      })
    },
    //大小选择
    sizeTap(e) {
      let index = e.currentTarget.dataset.idx
      let sizeId = e.currentTarget.dataset.sizeid
      this.setData({
        sizeIndex: index,
        sizeId: sizeId,
        shopData: this.properties.sizeTaste.SpecificationList[index]
      })
      this.triggerEvent('moneyTriggerTap', {
        'index': index
      })
    },
    //口味选择
    tasteTap(e) {
      let index = e.currentTarget.dataset.index
      let paindex = e.currentTarget.dataset.paindex
      let id = e.currentTarget.dataset.id
      let list = this.properties.sizeTaste
      for (var i = 0, length = list.LableList[paindex].OptionsValueList.length; i < length; i++) {
        list.LableList[paindex].OptionsValueList[i].check = false;
      }
      list.LableList[paindex].OptionsValueList[index].check = true;
      this.setData({
        sizeTaste: list,
        shopData1: this.labelGenerate()
      })
    },
    selectLabelOpt() { //商品详情规格标签操作
      let list = this.properties.sizeTaste
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
        sizeTaste: list
      })
    },
    labelGenerate() {
      let tasteName = ""
      let count = 0
      let list = this.properties.sizeTaste
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
      return tasteName
    },
    selectFixTap() {
      let size = this.data.sizeId
      let taste = this.data.shopData1
      if (size && (taste || this.data.sizeTaste.LableList.length === 0)) {
        this.triggerEvent('selectTriggerTap', {
          'orderSelect': true,
          'size': size,
          'taste': taste,
          'type': 0
        })
        this.setData({
          sizeIndex: 0,
          tasteIndex: 0,
          sizeId: '',
          tasteName: ''
        })
      } else {
        wx.showToast({
          title: '没选择规格或口味哦！',
          icon: 'none',
          mask: true
        })
      }

    }
  }
})