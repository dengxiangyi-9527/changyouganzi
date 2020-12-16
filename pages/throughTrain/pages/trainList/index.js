// pages/throughTrain/pages/trainList/index.js
import {
  request
} from '../../../../utils/request'
import{
  showModel
} from '../../../../utils/showModel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainList:[],//列表数据
    init:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let fromId = wx.getStorageSync('cityFrom').id
    let toId = wx.getStorageSync('cityTo').id
    request({
      url:'/through-train/list-route',
      data:{
        station1:fromId,
        station2:toId
      }
    }).then(res => {
      if(res.code == 200 && res.data.length>0){
        let trainList = res.data
        trainList.map(res => {
          res.price = (res.price/100).toFixed(2)
          res.unit_price = (res.unit_price/100).toFixed(2)
        })
        this.setData({
          trainList,
          init:true
        })
      }
    })
  },
  // 跳转到详情
  bindDetail (e) {
    let token = wx.getStorageSync('token')
    if(token){
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/pages/throughTrain/pages/throughTrainDetail/index?item='+JSON.stringify(item),
      })
    }else{
      showModel({
        content:'您还未登录，请先登录',
        method:1,
        url:'/pages/login/index?type=throughTrain/pages/trainList/index'
      })
    }
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