// pages/CustomTour//pages/customized/process/index.js
import{
  request
} from '../../../../../utils/request'
import {
  showModel
} from '.././../../../../utils/showModel'
import{
  toast
} from '../../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:{
      "bg_color": "rgba(0,0,0,0)",
      "color": "#ffffff",
      "flag": 1,
      "Iconcolor":"black"
    },
    detail:"",
    order_sn:'',
    show:'',
    type:''
  },
  toPay(){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/customized/pay/index?orderSn='+this.data.detail.order_sn,
    })
  },
  getDetail(){
    request({
      url:'/charter-custom/detail-order',
      data:{
        order_sn:this.data.order_sn
      }
    }).then(res => {
      if(res.code == 200 && res.data){
        if((res.data.type == this.data.type)||(res.data.type == this.data.type)){
          this.setData({
            show:true,
            nav:{
              "bg_color": "rgba(0,0,0,0)",
              "color": "#ffffff",
              "flag": 1,
              "Iconcolor":"black"
            }
          })
        }else{
          this.setData({
            show:false,
            nav:{
              "bg_color": "rgba(0,0,0,0)",
              "color": "#ffffff",
              "flag": 1,
              "Iconcolor":"black",
            }
          })
        }
        res.data.price = (res.data.price/100).toFixed(2)
        res.data.stime= res.data.stime.slice(0,10)
        res.data.etime= res.data.etime.slice(0,10)
        this.setData({detail:res.data})
      }
    })
  },
//取消订单
cancelOrder(){
  showModel({
    content:'你确定取消订单',
    callback:()=>{
      request({
        url:'/pay/cancel',
        data:{
          order_sn:this.data.detail.order_sn
        },
        method:'POST'
      }).then(res => {
        if(res.code == 200 && res.data){
          toast({title:'取消成功'})
          wx.switchTab({
            url: '/pages/order/pages/order/order',
          })
        }
      })
    }
  })
},
gotTel(){
  wx.makePhoneCall({
    phoneNumber: '19150185859',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order_sn:options.order_sn,
      type:options.type
    })
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