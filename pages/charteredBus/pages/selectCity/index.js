
import { request } from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tit: [], //字母
    cityNameList: [], //城市名称
    isFrom:'',//判断此页面是出发地页面还是目的地的页面
    searchList:[],//搜索城市列表,
    value:'',//搜索框内容
    nowCity:'',//当前城市
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

  },

  //选择城市
  chooseCity(event) {
    //选择的城市是出发地
    if (this.data.isFrom == true){
      var cityFrom = event.currentTarget.dataset.name
      wx.navigateBack()
      wx.setStorageSync('cityFrom', cityFrom)
    }else if(this.data.isFrom == false){
      var cityTo = event.currentTarget.dataset.name
      wx.navigateBack()
      wx.setStorageSync('cityTo', cityTo)
    }else{
      var city = event.currentTarget.dataset.name
      wx.navigateBack()
      wx.setStorageSync('nowCity', city)
    }
  },

  //选择字符
  selectword(e){
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
onLoad:function(option) {
  this.setData({
    nowCity:wx.getStorageSync('cityFrom').name
  })
  if(option.city == 'nowCity'){
    console.log(this.data.nowCity)

  }else{
    if(option.city == 'from'){
      this.setData({ isFrom: true})
      wx.setNavigationBarTitle({
        title: "出发地"
      })
    }else if(option.city == 'to'){
      this.setData({ isFrom: false })
      wx.setNavigationBarTitle({
        title: "目的地"
      })
    }
    //获取出发地和目的地的城市名
      const titArr = []
      var cityNameArr = []
    request({
      url:'/citytransport/query/site'
    }).then(res => {
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
  }
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