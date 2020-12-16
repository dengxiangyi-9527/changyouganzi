// pages/CustomTour//pages/customTourExplain/index.js
import{
  getTimers
} from '../../../../utils/getTimers'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loc:'',
    time:'',
    dayNum:""

  },
  goList(){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/packageList/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loc = wx.getStorageSync('fromLocation').fromLocationInfo
    let time = getTimers(wx.getStorageSync('currentDate')).slice(0,4)+'-'+getTimers(wx.getStorageSync('currentDate')).slice(5,7)+'-'+getTimers(wx.getStorageSync('currentDate')).slice(8,10)
    let dayNum = (wx.getStorageSync('endDate')-wx.getStorageSync('currentDate'))/1000/60/60/24+1
    this.setData({loc,time,dayNum})
    
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