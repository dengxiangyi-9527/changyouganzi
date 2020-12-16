// pages/RideExpress/selectionLoc/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:'',
    cityList:[],
    nowCity:'成都',
    text:''
  },

  //获取城市列表
  getCityList(){
    wx.request({
      url: 'https://restapi.amap.com/v3/config/district',
      data:{
        key:'378e9c01b887d13383eba7dc7ef637b8',
        keywords:'四川省',
        page:1
      },
      success: (res) => {
        console.log(res)
        if(res.statusCode == 200 && res.data.infocode == '10000'){
          let cityList = []
          res.data.districts[0].districts.map(res => {
            if(res.adcode == 510700 || res.adcode == 510100 || res.adcode == 510900 || res.adcode == 510500 || res.adcode == 513400 || res.adcode == 513200 || res.adcode == 513300 || res.adcode == 511800){
              cityList.push(res)
            }
          })
          this.setData({
            cityList
          })
          console.log(this.data.cityList)
        }
      }
    })
  },
  //选择城市
  chooseCity(e){
    let nowCity = e.currentTarget.dataset.item
    var pages = getCurrentPages()
    if(pages.length > 1){
      var prePage = pages[pages.length - 2];
      prePage.setData({
        nowCityInfo: nowCity
      })
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityList()
    console.log(options)
    if(options.type == 'from'){
      wx.setNavigationBarTitle({
        title:'出发城市',
      })
      this.setData({
        text:'你在哪儿上车'
      })
    }else if(options.type == 'to'){
      wx.setNavigationBarTitle({
        title:'目的城市',
      })
      this.setData({
        text:'你在哪儿下车'
      })
    }else if(options.type == 'selctCity'){
      wx.setNavigationBarTitle({
        title:'选择城市',
      })
      this.setData({
        text:'选择地址'
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