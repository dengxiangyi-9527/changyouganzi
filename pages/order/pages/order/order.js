// pages/order/order.js
import { request } from '../../../../utils/request.js';
import { toast } from '../../../../utils/toast'
import { showModel } from '../../../../utils/showModel';
import {getTimers} from '../../../../utils/getTimers'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0, //屏幕高度
    navHeight: 64, //导航栏的高度
    active: 0, // tab切换的下标，
    orderInfo:[],//未取消未完成的订单
    isInit:false,//判断初始化是否完成
    orderInfoNull:[],//已取消已完成的订单
    pageNum:1,
    status:-1,
    noData:false, //没有更多数据
    orderList:[]
  },
  goorderList(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/order/pages/orderList/index?id='+e.currentTarget.dataset.id,
    })
  },
  getOrderList(){
    request({
      url:"/citytransport/order/get-ticket",
      isLoading:false
    }).then(res => {
      let newList = []
      if(res.code === 200){
        res.data.forEach(res => {
            newList.push(res)
        })
        if(newList.length > 0){
          newList.map(res => {
            if(res.type == 2){
                res['date'] = getTimers(res.ticket_time*1000)
            }
            res.date = res.date.slice(0,10)
          })
          this.setData({orderList:newList})
        }
      }
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
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
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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