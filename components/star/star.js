// components/star/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    score:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgList:[]
  },
  ready(){
    let scoreList = []
    for (let i = 0; i < this.properties.score; i++){
      scoreList.push('/images/icon/star.png')
    }
    this.setData({
      imgList: scoreList
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
