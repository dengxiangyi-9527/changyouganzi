
// pages/cjjs/selectMap/index.js
import { request } from '../../../../utils/request'
import { showModel } from '../../../../utils/showModel'
var amapFile = require('../../../../utils/amap-wx')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    length:'',
    phoneHeight:app.globalData.phoneHeight,
    show:false,
    cityInfo:[],
    cityName:'',
    tips:'',
    longitude:'',
    latitude:'',
    markers:[{
      id:1,
      latitude:'',
      longitude:'',
    }],
    polygon:[{
      points:[]
    }],
    locationInfo:'',
    list:[],
    from:'',
    to:'',
    option:''
  },

  //点击地图
  changeLocation(event){
    console.log(this.data.list)
    wx.showLoading({
      title:'正在搜索'
    })
    let latitude= event.detail.latitude
    let longitude = event.detail.longitude
    let location = String(longitude).substring(0,10)+','+String(latitude).substring(0,9)
    if(this.inRegion(this.data.list,Number(longitude),Number(latitude))){
      wx.hideLoading()
      this.setData({
        markers:[{
          id:1,
          latitude,
          longitude
        }]
      })
      wx.request({
        url: 'https://restapi.amap.com/v3/geocode/regeo',
        data:{
          key:'378e9c01b887d13383eba7dc7ef637b8',
          location
        },
        success:(res) => {
          console.log(res)
          if(res.statusCode === 200){
            this.setData({
              show:false,
              locationInfo:res.data.regeocode.formatted_address
            })
            if(this.data.option == 'from'){
              wx.setStorageSync('fromLocation', {fromLocationInfo:this.data.locationInfo,fromLocation:location})
              showModel({
                content:"确定选择"+this.data.locationInfo,
                method:4,
              })
            }else if(this.data.option == 'to'){
              wx.setStorageSync('toLocation', {toLocationInfo:this.data.locationInfo,toLocation:location})
              showModel({
                content:"确定选择"+this.data.locationInfo,
                method:4,
              })
            }

            // wx.openLocation({
            //   latitude,
            //   longitude,
            //   address:this.data.locationInfo
            // })
          }
        }
      })
    }else{
      wx.hideLoading()
      wx.showModal({
        showCancel:false,
        content:'选取地点不在上车范围'
      })
    }
  },
  //判断有没有超出范围
  inRegion(listArr,lng,lat){
    console.log(listArr,lng,lat)
    var num = 0
    for(var i=0;i<listArr.length;i++){
      var arr1 = listArr[i]
      var arr2 = listArr[(i+1)%listArr.length]
      if(arr1[1] == arr2[1]) continue
      if(lat<Math.min(arr1[1],arr2[1])) continue
      if(lat>Math.max(arr1[1],arr2[1])) continue
      var connect = arr2[0]+((arr1[0]-arr2[0])*(lat-arr2[1])/(arr1[1]-arr2[1]))
      if(connect<lng)continue
      if(connect == arr2[0]&&lat==arr2[1])continue
      if(connect==lng)return true
      num++
    }
    return num%2 == 1
  },
  getcenter(data){
    let list = new Array()
    data.forEach(res => {
      list.push(res)
    })
    let points = []
    var lng = 0
    var lat = 0
    var lngMax = 0
    var lngMin = 0
    var latMax = 0
    var latMin = 0
    list.map((res,index) => {
      points.push({
        latitude:res[1],
        longitude:res[0]
      })
    })
    for(var i = 0; i<list.length-1;i++){
      for(var j=0;j<list.length-1-i;j++){
        if(list[j][0]>list[j+1][0]){
          var arr = list[j]
          list[j] = list[j+1]
          list[j+1] = arr 
        }
      }
    }
    lngMax = list[list.length-1][0]
    lngMin = list[0][0]
    for(var i = 0; i<list.length-1;i++){
      for(var j=0;j<list.length-1-i;j++){
        if(list[j][1]>list[j+1][1]){
          var arr = list[j]
          list[j] = list[j+1]
          list[j+1] = arr 
        }
      }
    }
    latMax = list[list.length-1][1]
    latMin = list[0][1]
    lng = (lngMax-lngMin)/2+lngMin 
    lat = (latMax-latMin)/2+latMin
    this.setData({
      polygon:[{points,fillColor:'#18AFFF30'}],
      longitude:lng,
      latitude:lat,
      markers:[{
        id:1,
        latitude:lat,
        longitude:lng,
      }],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let start_station_id = wx.getStorageSync('cityFrom').id
    let end_station_id = wx.getStorageSync('cityTo').id
    request({
      url:'/public/get-location',
      data:{
        start_station_id,
        end_station_id
      }
    }).then(res => {
      console.log(res)
      if(res.code === 200){
        if(options.data === 'from'){
          wx.setNavigationBarTitle({
            title: "上车地点"
          })
        console.log(res.data.start)
        this.setData({option:'from',list:res.data.start})
        this.getcenter(res.data.start)
        }else{
          wx.setNavigationBarTitle({
            title: "下车地点"
          })
          this.setData({option:'to',list:res.data.end})
          this.getcenter(res.data.end)
        }
      }
    })
  },
  //获取城市
  inputCity(e){
    console.log(app.globalData.phoneHeight)
    var that = this;
    var keywords = e.detail.value; 
    var myAmapFun = new amapFile.AMapWX({key: 'a7b017fec1ec12bb889eca1a905f887b'});
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: (data) => {
        console.log(data)
        if(data && data.tips){
          that.setData({
            show:true,
            tips: data.tips,
          });
          if(data.tips.length>5){
            this.setData({
              length:5
            })
          }else{
            this.setData({
              length:data.tips.length
            })
          }
        }
      }
    })
  },
  //dinaji
  bindSearch(e){
    console.log(e)
    var cityInfo = e.target.dataset.keywords;
    console.log(cityInfo.location)
    if(cityInfo.location.length == 0){
      wx.showModal({
        showCancel:false,
        content:'请选择具体位置'
      })
    }else{
      if(!this.inRegion(this.data.list,Number(cityInfo.location.split(',')[0]),Number(cityInfo.location.split(',')[1]))){
        wx.showModal({
          showCancel:false,
          content:'选取地点不在上车范围'
        })
      }else{
        if(this.data.option == 'from'){
          wx.setStorageSync('fromLocation', {fromLocationInfo:cityInfo.district+cityInfo.name,fromLocation:cityInfo.location})
          showModel({
            content:"确定选择"+cityInfo.district+cityInfo.name,
            method:4,
          })
          this.setData({
            locationInfo:cityInfo.district+cityInfo.name,
            show:false,
            cityInfo,
            cityName:cityInfo.name,
            markers:[{
              id:1,
              latitude:cityInfo.location.split(',')[1],
              longitude:cityInfo.location.split(',')[0],
            }],
            longitude:Number(cityInfo.location.split(',')[0]),
            latitude:Number(cityInfo.location.split(',')[1]),
            tips:[]
          })
        }else{
          wx.setStorageSync('toLocation', {toLocationInfo:cityInfo.district+cityInfo.name,toLocation:cityInfo.location})
          showModel({
            content:"确定选择"+cityInfo.district+cityInfo.name,
            method:4,
          })
          this.setData({
            locationInfo:cityInfo.district+cityInfo.name,
            show:false,
            cityInfo,
            cityName:cityInfo.name,
            markers:[{
              id:1,
              latitude:cityInfo.location.split(',')[1],
              longitude:cityInfo.location.split(',')[0],
            }],
            longitude:Number(cityInfo.location.split(',')[0]),
            latitude:Number(cityInfo.location.split(',')[1]),
            tips:[]
          })
        }

      }

    }
  },
  closeList(){
    this.setData({show:false,tips:''})
  },
  closeText(){
    this.setData({
      cityName:'',
      tips:[],
      show:false
    })
  },
  closeTexts(){
    this.setData({
      cityName:'',
      tips:[],
      show:false
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