// pages/CustomTour//pages/orderDetail/index.js
import{
  request
} from '../../../../utils/request'
import{
  toast
} from '../../../../utils/toast'
import{
  showModel
} from '../../../../utils/showModel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail:'',
    orderSn:'',
    dayNum:'',
    isCancel:true
  },
  getDetail(){
    request({
      url:'/charter/detail-order',
      data:{
        order_sn:this.data.orderSn
      }
    }).then(res => {
      console.log(res)
      if(res.code == 200 && res.data){
        res.data.stime = res.data.stime.slice(0,10)
        res.data.etime = res.data.etime.slice(0,10)
        let dayNum = (new Date(res.data.etime.replace(/-/g, '/')).getTime()- new Date(res.data.stime.replace(/-/g, '/')).getTime())/1000/60/60/24+1
        let nowDay = new Date().getTime()
        let startDay =new Date(res.data.stime.replace(/-/g,'/')).getTime()
        if(nowDay >= startDay){
          this.setData({isCancel:false})
        }
        this.setData({orderDetail:res.data,dayNum})
      }
    })
  },
  //退款
  refundOrder(){
    let nowDay = new Date().getTime()
    let startDay =new Date(this.data.orderDetail.pay_time.replace(/-/g,'/')).getTime()
    console.log(startDay+30*60*1000)
    if(nowDay > startDay+30*60*1000){
      showModel({
        title:'订单退款',
        content:'当前时间已超过下单时间半小时，扣除一天费用的50%！您确定退款？',
        callback:() => {
         request({
            url:'/pay/refund',
            data:{
              order_sn:this.data.orderSn
            },
            method:'POST'
          }).then(res => {
              if(res.code == 200){
                toast({
                  title:res.error
                })
                this.getDetail()
              }
          })
        }
      })
    }else{
      showModel({
        title:'订单退款',
        content:'您确定退款？',
        callback:() => {
         request({
            url:'/pay/refund',
            data:{
              order_sn:this.data.orderSn
            },
            method:'POST'
          }).then(res => {
              if(res.code == 200){
                toast({
                  title:res.error
                })
                this.getDetail()
              }
          })
        }
      })
    }
  },
  //取消订单
  cancelOrder(){
    showModel({
      title:'订单取消',
      content:'您确定取消订单？',
      callback:() => {
       request({
          url:'/pay/cancel',
          data:{
            order_sn:this.data.orderSn
          },
          method:'POST'
        }).then(res => {
            if(res.code == 200 && res.data){
              toast({
                title:'订单取消成功'
              })
              this.getDetail()
            }
        })
      }
    })
  },
  //支付
  toPay(){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/pay/index?orderSn='+this.data.orderSn,
    })
  },
  //客服
  goTel(){
    wx.makePhoneCall({
      phoneNumber:'19150185859'
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({orderSn:options.orderSn})
      this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})