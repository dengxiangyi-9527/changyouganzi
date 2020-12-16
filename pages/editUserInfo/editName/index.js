// pages/editUserInfo/editName/index.js
import {
  request
} from '../../../utils/request.js'
import toast from '../../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0, //计算输入的个数
  },
  /**输入时触发 */
  input(e) {
    this.setData({
      num: e.detail.length
    })
    console.log(e.detail)
  },
  /**输入完成失去焦点时触发 */
  finish(e) {
    console.log(e.detail.value) //输入框的值
    let str = e.detail.value.trim();
    if (str.length > 0) {
      //上传修改的信息
      request({
        url: '/citytransport/me/edit',
        data: {
          username: str
        },
        method: 'POST'
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          // wx.setStorageSync('nickName', e.detail.value)
          wx.redirectTo({
            url: '/pages/editUserInfo/edit/index'
          })
        } else {
          toast({
            title: res.msg
          })
        }
      })
    }else{
      wx.showToast({
        title: '用户名不能为空，请重新输入',
        icon:'none'
      })
      // toast({
      //   title:'用户名'
      // })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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