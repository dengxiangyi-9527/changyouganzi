import { request } from "../../../utils/request.js"
import { showModel } from "../../../utils/showModel"
import { formatDate } from "../../../utils/formatDate"
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
      "text":'订单10分钟后自动取消'
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
    through_train:[]
  },

  // 点击确认支付按钮事件  向后台发送数据
  confirmPay() {
    var that = this
    console.log(this.data.order_id,this.data.order_sn)
    request({
      url:'/payment/pay',
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
                wx.removeStorageSync('currentDate')
                wx.removeStorageSync('userInfo')
                wx.removeStorageSync('toLocation')
                wx.removeStorageSync('fromLocation')
                wx.removeStorageSync('business_id')
                wx.showToast({
                  title: '支付成功'
                })
                clearInterval(this.data.setIn)
                wx.redirectTo({
                  url: '/pages/cjjs/payment/index',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('userInfo',(data) => {
      console.log(data)
      this.setData({
        from:data.carsInfo.from.name,
        to:data.carsInfo.to.name,
        start_time:data.carsInfo.start_time,
        pick_up_time:data.carsInfo.pick_up_time,
        price:data.carsInfo.adult_price,
        adultNum: data.adultNum,
        kidNum: data.kidNum,
        timer: data.timer,
        allPrice: data.allPrice,
        userName:data.userName,
        tel:data.tel,
        order_sn:data.order_sn,
        order_id:data.order_id
      })
      request({
        url:'/citytransport/order/detail',
        data:{
          id:data.order_id
        }
      }).then(res => {
        console.log(res.data)
        let creat_time = new Date(res.data.created_at.replace(/-/g, '/'))
        this.setData({
          countdown:10 * 60 * 1000+new Date(creat_time).getTime()-new Date().getTime(),
          allPrice:(res.data.price_pay/100).toFixed(2),
          through_train:res.data.through_train
        })
      })
    })
    const eventChannels = this.getOpenerEventChannel()
    eventChannels.on('orderDetail',(data) => {
      console.log(data)
      let creat_time = new Date(data.orderDetail.created_at.replace(/-/g, '/'))
      this.setData({
        start_time:(new Date(data.orderDetail.ticket_time*1000).getHours()<10 ? '0'+new Date(data.orderDetail.ticket_time*1000).getHours() : new Date(data.orderDetail.ticket_time*1000).getHours())+':'+(new Date(data.orderDetail.ticket_time*1000).getMinutes()<10 ? '0'+new Date(data.orderDetail.ticket_time*1000).getMinutes() : new Date(data.orderDetail.ticket_time*1000).getMinutes()),
        countdown:10 * 60 * 1000+new Date(creat_time).getTime()-new Date().getTime(),
        from:data.orderDetail.from,
        to:data.orderDetail.to,
        adultNum: data.orderDetail.adult_numbers,
        kidNum: data.orderDetail.kidNum,
        allPrice: data.orderDetail.price_pay,
        userName:data.orderDetail.name,
        tel:data.orderDetail.phone,
        order_sn:data.orderDetail.order_sn,
        order_id:data.orderDetail.id,
        price:(Number(data.orderDetail.adult_price)/100).toFixed(2),
        timer:((new Date(data.orderDetail.ticket_time*1000).getMonth()+1)<10 ? '0'+(new Date(data.orderDetail.ticket_time*1000).getMonth()+1) : (new Date(data.orderDetail.ticket_time*1000).getMonth()+1))+'月'+(new Date(data.orderDetail.ticket_time*1000).getDate()<10 ? '0'+new Date(data.orderDetail.ticket_time*1000).getDate() : new Date(data.orderDetail.ticket_time*1000).getDate())+'日',
        through_train:data.orderDetail.through_train
      })
      console.log(this.data)
    })
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
      let setIn = setInterval(() => {
        let countdown = this.data.countdown-1000
        if(countdown <= 1000){
          clearInterval(setIn)
        }
        this.setData({
          countdown,
          Minutes:(new Date(countdown).getMinutes()<10 ? '0'+new Date(countdown).getMinutes() : new Date(countdown).getMinutes()),
          getSeconds:(new Date(countdown).getSeconds()<10 ? '0'+new Date(countdown).getSeconds() : new Date(countdown).getSeconds()),
        })
      }, 1000);
      this.setData({
        setIn
      })
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