// pages/cjjs/selectCity/index.js
// let City = require('../../../utils/allcity.js');
import { request } from '../../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tit: [], //字母
    cityNameList: [], //城市名称
    isFrom:'',//判断此页面是出发地页面还是目的地的页面
    searchList:[],//搜索城市列表,
    value:''//搜索框内容
  },

//搜索功能
  onChange(e) {
    //判断是出发地还是目的地
    var cityName = e.detail
    var cityNameList = []
    var searchCity = []
      if(cityName !== ''){
        Object.values(this.data.cityNameList).forEach(res => {
          res.forEach(res => {
            if (res.name.includes(cityName)){
              searchCity.push(res)
            }
          })
        })
      }
    this.setData({
      searchList: searchCity,
      value: cityName
    })
  },
  //点击取消
  onClick() {
    this.setData({
      value:'',
      searchList:[]
    })
  },
  bindtap(e) {
    console.log(e.detail)
  },

  //选择城市
  chooseCity(event) {
    //选择的城市是出发地
    if (this.data.isFrom){
      var cityFrom = event.currentTarget.dataset.name
      wx.navigateTo({
        url: '/pages/cjjs/index/index'
      })
      wx.setStorageSync('cityFrom', cityFrom)
    }else{
      var cityTo = event.currentTarget.dataset.name
      wx.navigateTo({
        url: '/pages/cjjs/index/index'
      })
      wx.setStorageSync('cityTo', cityTo)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
onLoad:function(option) {
  //判断是出发地还是目的地
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.on('city',  (data) => {
    if(data == 'from'){
      this.setData({ isFrom: true})
    }else{
      this.setData({ isFrom: false })
    }
  })
  //获取出发地和目的地的城市名
    const titArr = []
    var cityNameArr = []
  request('/citytransport/query/site').then(res => {
    console.log(res)
    if (res.code === 200){
      for (let key in res.data.data) {
        titArr.push(key)
      }
      if (res.data) {
        cityNameArr = res.data
      }
      console.log(cityNameArr)
      this.setData({
        tit: titArr,
        cityNameList: cityNameArr,
      })
    }
  })


},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})