// components/signIn_alert /signIn_alert .js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    alertShow: true,
    type: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showAlert: function() { //窗口显示
      this.setData({
        alertShow: true
      })
    },
    closeAlert: function() { //窗口隐藏
      this.setData({
        alertShow: false
      })
    },
    confirm: function() {
      this.closeAlert();
    },
  }
})