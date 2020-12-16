// pages/editUserInfo/verified/verified.js
import {
  request
} from '../../../utils/request.js'
import {
  toast
} from '../../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '', //接通法大大返回的src
  },

  onShow: function (options) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onReady() {

  },
  onLoad: function (options) {
    let that = this
    request({
      url: '/contract/index/realname'
    }).then(res => {
      // console.log(res.error)
      if (res.code == 200) {
        this.setData({
          url: res.data
        })
      } 
      // else {
      //   console.log(res.error)
      //   toast({
      //     title: res.error
      //   })
      //   wx.switchTab({
      //     url: '/pages/user/user',
      //   })
      // }
    })
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