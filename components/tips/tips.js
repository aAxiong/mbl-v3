// components/tips/tips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    alertShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeAlert: function() {
      this.setData({
        alertShow: false
      })
    },
    showAlert: function() {
      this.setData({
        alertShow: true
      })
    }
  }
})