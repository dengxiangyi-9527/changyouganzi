// pages/CustomTour//pages/customized/detail/index.js
import {
  request
} from '../../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:''
  },
  //获取订单
  getDetail(){
    request({
      url:'/charter-custom/detail-order',
    }).then(res => {
      if(res.code == 200 && res.data){
        if(res.data.status == 10){
          res.data.stime = res.data.stime.slice(0,10).replace(/\-/g,"/");
          res.data.etime = res.data.etime.slice(0,10).replace(/\-/g,"/");
          this.setData({
            detail:res.data
          })
        }else{
          wx.redirectTo({
            url: '/pages/CustomTour/pages/customized/process/index',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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