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
        let initTasteName = newData.LableList[0] ? newData.LableList[0].LableName : ''
        let sda = newData.LableList.length > 0 ? newData.LableList[0] : ''
        this.setData({
          sizeId: initSizeId,
          tasteName: initTasteName,
          shopData: ins,
          shopData1: sda
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
    shopData1: []
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
      let index = e.currentTarget.dataset.idx
      let tasteName = e.currentTarget.dataset.taste
      this.setData({
        tasteIndex: index,
        tasteName: tasteName,
        shopData1: this.properties.sizeTaste.LableList[index]
      })
    },
    selectFixTap() {
      let size = this.data.sizeId
      let taste = this.data.tasteName
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