// components/signIn_alert /signIn_alert .js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    childTsData: {
      type: Object,
      observer(newData) {
        if (this.properties.childTsData.length > 0) {
          this.setData({
            alertShow: true
          })
          for (var i = 0; i < this.properties.childTsData.length; i++) {
            if (this.properties.childTsData[i].DisType === 3) {
              let arr = [];

              arr.push(this.properties.childTsData[i])
              this.setData({
                typeArray: arr
              })
              console.log(this.data.typeArray);
            }
          }
        }

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    alertShow: false,
    type: 0,
    typeArray: []
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