import { request } from "../../../../../utils/request"
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
    timer:'',
    allPrice:0,
    userName:'',
    tel:'',
    orderSn:'',
    price:'',
    from:'',
    Minutes:'',
    getSeconds:'',
    setIn:'',
    pick_up_time:'',
    carInfo:'',
    to:'',
    days:'',
    personNum:'',
    carName:''
  },

  // 点击确认支付按钮事件  向后台发送数据
  confirmPay() {
    var that = this
    request({
      url:'/pay/pay',
      data:{
        order_sn:this.data.orderSn
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
      url:'/charter-custom/detail-order',
      data:{
        order_sn:this.data.orderSn
      }
    }).then(res => {
      if(res.code == 200){
        console.log(res)
        let creat_time = new Date(res.data.created_at.replace(/-/g, '/'))
        let countdown = (30 * 60 * 1000+creat_time.getTime()-new Date().getTime()>0 ? 30 * 60 * 1000+creat_time.getTime()-new Date().getTime() : 0)
        this.setData({
          countdown,
          timer:res.data.stime.slice(0,10),
          userName:res.data.name,//用户民
          tel:res.data.phone,//用户电话
          orderSn:res.data.order_sn,//订单号
          allPrice:(res.data.price/100).toFixed(2),//价格
          from:res.data.slocation,//出发地
          init:true,
          carInfo:res.data.car_model,
          to:res.data.elocation,
          days:res.data.days,
          personNum:res.data.member+res.data.old+res.data.child,
          carName:res.data.car_model.name+res.data.car_model.ridership+'座'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderSn = options.orderSn
    console.log(options)
    this.setData({ orderSn })
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