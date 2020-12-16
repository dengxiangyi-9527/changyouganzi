import { request } from "../../../../utils/request.js"
const app = getApp()
// pages/cjjs/pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
        "bg_color": "rgba(255,255,255,1)",
        "color": "#333",
        "flag": 5,
        "name": "订单支付",
        "font_size":32,
        "font_weight":'bold',
        "Iconcolor":'black',
        "showModel":true,
        "url":'/pages/order/pages/order/order',
        "text":'订单30分钟后自动取消'
    },      
    countdown: 10 * 60 * 60 * 1000, //倒计时
    kidNum:0,
    timer:'',
    allPrice:0,
    userName:'',
    tel:'',
    order_id:'',
    order_sn:'',
    price:'',
    from:'',
    to:'',
    Minutes:'',
    getSeconds:'',
    setIn:'',
    pick_up_time:'',
    through_train:[],
    num:''
  },

  // 点击确认支付按钮事件  向后台发送数据
  confirmPay() {
    var that = this
    console.log(this.data.order_id,this.data.order_sn)
    request({
      url:'/scenic-area/payment/pay',
      data:{
        order_id:String(this.data.order_id),
        order_sn:String(this.data.order_sn)
      },
      method:'POST'
    }).then(res => {
      console.log(res)
      if(res.code == 200){
        wx.login({
          success:() => {
            wx.requestPayment({
              timeStamp:String(res.data.timeStamp),
              nonceStr:String(res.data.nonceStr),
              package:String(res.data.package),
              signType:String(res.data.signType),
              paySign:String(res.data.paySign),
              success:(res)=> {
                wx.showToast({
                  title: '支付成功'
                })
                clearInterval(this.data.setIn)
                wx.redirectTo({
                  url: '/pages/codeBus/pages/payMent/index',
                })
              },
              fail(err){
                console.log(err)
              }
            })
          }
        })
      }
    })
  },
  getDetail(){
    request({
      url:'/scenic-area/detail-order',
      data:{
        id:this.data.order_id
      }
    }).then(res => {
      if(res.code == 200){
        console.log(res)
        let creat_time = new Date(res.data.created_at.replace(/-/g, '/'))
        let countdown = (30 * 60 * 1000+creat_time.getTime()-new Date().getTime()>0 ? 30 * 60 * 1000+creat_time.getTime()-new Date().getTime() : 0)
        this.setData({
          countdown,
          timer:res.data.date.slice(0,10),
          userName:res.data.name,//用户民
          tel:res.data.phone,//用户电话
          order_sn:res.data.order_sn,//订单号
          allPrice:(res.data.price/100).toFixed(2),//价格
          from:res.data.start_point,//出发地
          to:res.data.end_point,//目的地
          init:true,
          num:res.data.num
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let order_id = options.order_id
    this.setData({ order_id })
    this.getDetail()
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
    let countdown = this.data.countdown
      this.setData({
        Minutes:(new Date(countdown).getMinutes()<10 ? '0'+new Date(countdown).getMinutes() : new Date(countdown).getMinutes()),
        getSeconds:(new Date(countdown).getSeconds()<10 ? '0'+new Date(countdown).getSeconds() : new Date(countdown).getSeconds()),
      })
      if(countdown > 0){
        let setIn = setInterval(() => {
          let countdown = this.data.countdown-1000
          if(countdown <= 1000){
            clearInterval(setIn)
          }
          this.setData({
          nav: {
              "bg_color": "rgba(255,255,255,1)",
              "color": "#333",
              "flag": 5,
              "name": "订单支付",
              "font_size":32,
              "font_weight":'bold',
              "Iconcolor":'black',
              "showModel":true,
              "url":'/pages/order/pages/order/order',
              "text":'订单'+(new Date(countdown).getMinutes()<10 ? '0'+new Date(countdown).getMinutes() : new Date(countdown).getMinutes())+'分钟后自动取消'
            },
            countdown,
            Minutes:(new Date(countdown).getMinutes()<10 ? '0'+new Date(countdown).getMinutes() : new Date(countdown).getMinutes()),
            getSeconds:(new Date(countdown).getSeconds()<10 ? '0'+new Date(countdown).getSeconds() : new Date(countdown).getSeconds()),
          })
        }, 1000);
        this.setData({
          setIn
        })
      }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.setIn)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.setIn)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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