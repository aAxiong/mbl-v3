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

  },
  /**
   * 组件的方法列表
   */
  methods: {
    authClick() {
      this.triggerEvent('authTriggerTap', {
        'status': true,
        "type": 0
      })
    },
    authCallback(e) {
      this.triggerEvent('authTriggerTap', {
        'status': true,
        "type": 1
      })
    }
  }
})