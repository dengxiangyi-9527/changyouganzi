// component/progressBar/progressBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value: '退款进度'
    },
    price:{
      type:Number,
      value:0
    },
    refund:{
      type:String,
      value:'退回微信'
    },
    explain:{
      type:String,
      value:'预计1-5个工作日退款到账'
    },
    firstText:{
      type:String,
      value:"已受理"
    },
    centerText:{
      type:String,
      value:'提交到微信处理'
    },
    lastText:{
      type:String,
      value:'开始退款'
    },
    firstTime:{
      type:String,
      value:''
    },
    centerTime:{
      type:String,
      value:''
    },
    lastTime:{
      type:String,
      value:''
    },
    change:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // title:'',
    // price:0,
    // refund:'',
    // explain:'',
    // fistText:'',
    // centerText:'',
    // lastText:'',
    // firstTime:'',
    // centerTime:'',
    // lastTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})
