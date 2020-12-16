// pages/cjjs/throughTrainDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#333",
      "flag": 1,
      "name": ""
    },
    num:0,//门票数量
  },
  addNum(){
    let num = this.data.num
    num++
    console.log(num)
    this.setData({
      num
    })
  },
  upNum(){
    let num = this.data.num
    if(num>0){
      num--
    }
    this.setData({
      num
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // request({
    //   url:'/admin/throughtrain/get',
    //   data:{
    //     id:JSON.parse(options.train).id
    //   },
    //   method:'GET'
    // }).then(res => {
    //   console.log(res)
    // })
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

  },
  /**
   * 页面滑动
   */
  onPageScroll: function (ev){
    console.log(ev)
    if(ev.scrollTop>=10){
      console.log(123)
      this.setData({
        nav: {
          "bg_color": "rgba(255,255,255,1)",
          "color": "#333",
          "flag": 1,
          "name": "直通车详情",
          "font_size":32,
          "font_weight":'bold',
          "tabFiexd":true,
          "Iconcolor":'black'
        },
      })
    }else{
      this.setData({
        nav: {
          "bg_color": "rgba(0,0,0,0)",
          "color": "#333",
          "flag": 1,
          "name": "",
          "tabFiexd":false,
          "Iconcolor":'white'
        },
      })
    }
  }
})