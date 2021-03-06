// pages/cjjs/mapselect/index.js
import { request } from '../../../../../utils/request'
var amapFile = require('../../../../../utils/amap-wx');//如：..­/..­/libs/amap-wx.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markersHeight:'',//mark点高度
    mapHeight:'',//地图高度
    startLine:[],//起点围栏
    endLine:[],//终点点围栏
    longitude:'',//地图精度
    latitude:'',//地图维度
    polygon:'',//围栏
    fromloc:'',//上车地点信息
    markText:'',//mark气泡文职
    isgetloc:true,
    startCenterLat:'',
    startCenterLng:'',

  },

  //获取定位
  getLocation(){
    let station_id = wx.getStorageSync('cityFrom').id
    request({
      url:'/public/get-station-location',
      data:{
        station_id,
      }
    }).then(res => {
      if(res.code == 200 && res.data){
        this.setData({
          startLine:res.data.point,
          startCenterLat:res.data.lat,
          startCenterLng:res.data.lng,
        })
          this.getcenter(res.data.point)
          let name = wx.getStorageSync('cityFrom').name
          wx.setNavigationBarTitle({
            title: name
          })
      }
    })
  },
  //地图拖动
  regionchange(e){
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.mapCtx = wx.createMapContext("map4select");
      this.mapCtx.getCenterLocation({
        type: 'gps',
        success:  (res) => {
          if(res.latitude && res.longitude){
            let inRegion = ''
            inRegion = this.inRegion(this.data.startLine,res.longitude,res.latitude)
            if(inRegion){
              let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
              myAmapFun.getRegeo({
                location:res.longitude+','+res.latitude,
                success:(res) => {
                  if(res.length !== 0){
                       let markText = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
                        let fromloc = {
                          address:res[0].name,
                          location:res[0].longitude +','+res[0].latitude,
                          name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
                        }
                        this.setData({fromloc,markText})
                  }
                }
              })
            }else{
                this.setData({fromloc:''})
              this.setData({
                markText:'当前位置不在蓝色区域范围内'
              })
            }
          }
       
        }
      })
    }
  },


    //判断有没有超出范围
    inRegion(listArr,lng,lat){
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

  //获取中心点
  getcenter(lineList){
    let list = new Array()
    lineList.forEach(res => {
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
    if(this.inRegion(lineList,lng,lat)){
      let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
      myAmapFun.getRegeo({
        location:lng+','+lat,
        success:(res) => {
          if(res.length !== 0){
              let markText = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
              let fromloc = {
                address:res[0].name,
                location:res[0].longitude +','+res[0].latitude,
                name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
              }
              this.setData({
                longitude:lng,
                latitude:lat,
                polygon:[{points,fillColor:'#18AFFF30'}],
                markText,
                fromloc,
              })
          }
        }
      })
    }else{
      let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
        myAmapFun.getRegeo({
          location:this.data.startCenterLng+','+this.data.startCenterLat,
          success:(res) => {
            if(res.length !== 0){
              let markText = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
              let fromloc = {
                address:res[0].name,
                location:res[0].longitude +','+res[0].latitude,
                name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
              }
                this.setData({
                  longitude:this.data.startCenterLng,
                  latitude:this.data.startCenterLat,
                  polygon:[{points,fillColor:'#18AFFF30'}],
                  markText,
                  fromloc,
                })
            }
          }
        })
    }

  },
  //上车地点
  goFromLoc(){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/selectMap/locList/index',
    })
    this.setData({
     isgetloc:false
    })
    if(this.data.fromloc == ''){
      console.log(123)
      this.getLocation()
    }
  },
  // },
  //确认行程
  mapOk(){
    if(this.data.fromloc !== ''){
      let fromLocation = {
        fromLocationInfo: this.data.fromloc.address + this.data.fromloc.name,
        fromLocation:this.data.fromloc.location
      }
      wx.setStorageSync('fromLocation', fromLocation)
      this.setData({
        isgetloc:false
       })
       wx.navigateBack()
    }
  },
  //地图定位
  maploc(){
    console.log(this.data.fromloc)
      let name = wx.getStorageSync('cityFrom').name
      wx.setNavigationBarTitle({
        title: name
      })
      let list = this.data.startLine
      let points = []
      list.map((res,index) => {
        points.push({
          latitude:res[1],
          longitude:res[0]
        })
      })
      let lng = this.data.fromloc.location.split(',')[0]
      let lat = this.data.fromloc.location.split(',')[1]
      if(this.inRegion(this.data.startLine,lng,lat)){
        this.setData({
          markText:this.data.fromloc.address
        })
      }else{
        this.setData({
          fromloc:'',
          markText:'当前位置不在蓝色区域范围内'
        })
      }
      this.setData({
        longitude:lng,
        latitude:lat,
        polygon:[{points,fillColor:'#18AFFF30'}],
      })
  },
  dingwei(){
    this.getLocation()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.createSelectorQuery().in(this).select('#meat').boundingClientRect(rect => {
      let app = getApp()
      let phoneHeight = app.globalData.phoneHeight
      let mapHeight = (1-(rect.height/phoneHeight))*100
     
      this.setData({
        mapHeight,
      })
      }).exec()
      wx.createSelectorQuery().in(this).select('#marks').boundingClientRect(rect => {
        let app = getApp()
        let phoneHeight = app.globalData.phoneHeight
        console.log(this.data.mapHeight/100*phoneHeight)
        let markersHeight = ((this.data.mapHeight/100*phoneHeight)/2-rect.height-36)/phoneHeight*100
        this.setData({
          markersHeight
        })
        }).exec()
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
    console.log(this.data.isgetloc)
    if(this.data.isgetloc){
      this.getLocation()
    }else{
      this.maploc()
    }
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