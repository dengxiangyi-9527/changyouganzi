// pages/cjjs/protocol/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protocoltype:'', //传过来的协议名称
    url:'', //web-view的src
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.protocoltype)
    if(options.protocoltype == 'carhire'){
      //约车协议
      this.setData({
        url:'https://static2.jd-gz.com/carhire2.html'
      })
    }else if(options.protocoltype == 'chartered'){
      //包车协议
      this.setData({
        url:'https://static2.jd-gz.com/chartered2.html'
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