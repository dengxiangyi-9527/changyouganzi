// pages/getPhoneCode/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputPhone: '', //电话号码
  },
  /**电话号码失去焦点 */
  finish(event) {
    this.setData({
      inputPhone: event.detail.value
    })
  },
  /**点击获取验证码 */
  getCode() {
    //拿到输入的手机号请求发送验证码的接口
    console.log(this.data.inputPhone)
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