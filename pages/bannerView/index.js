// pages/bannerView/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = Number(options.type)
    console.log('传过来的index' + type)
    let url = ""
    // switch (type) {
    //   case 0 : 
    //   url = "https://v.xiumi.us/board/v5/4CdOb/212630342"
    //   break
    //   case 1 :
    //   url = "https://v.xiumi.us/board/v5/32Tlt/212595729"
    //   break
    //   case 2 :
    //   url = "https://v.xiumi.us/board/v5/32Tlt/211716852"
    //   break
    //   case 3 :
    //   url = "https://v.xiumi.us/board/v5/4CdOb/212637906"
    //   break
    //   default:
    //   url = "https://v.xiumi.us/board/v5/32Tlt/212595729"
    // }
    console.log(url)
    this.setData({
      url
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