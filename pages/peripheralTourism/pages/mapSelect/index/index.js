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
    longitude:'',//地图精度
    latitude:'',//地图维度
    fromloc:'',//上车地点信息
    markText:'',//mark气泡文职
    isgetloc:true,
    adcode:""
  },

  //获取定位
  getLocation(){
    let detail = wx.getStorageSync('Tourismdetail')
    wx.setNavigationBarTitle({
      title: detail.location_start
    })
    let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
    myAmapFun.getInputtips({
      keywords: detail.location_start,
      success: (res) => {
        if(res && res.tips){
          console.log(res)
          this.setData({adcode:res.tips[0].adcode})
          if(res.tips[0].location.length != 0){
            let fromloc = {
              address:res.tips[0].name+res.tips[0].address,
              name:res.tips[0].name,
              location:res.tips[0].location
            }
            this.setData({
              longitude:res.tips[0].location.split(',')[0],
              latitude:res.tips[0].location.split(',')[1],
              markText:res.tips[0].name,
              fromloc
            })
          }else{
            let fromloc = {
              address:res.tips[1].name+res.tips[1].address,
              name:res.tips[1].name,
              location:res.tips[1].location
            }
            this.setData({
              longitude:res.tips[1].location.split(',')[0],
              latitude:res.tips[1].location.split(',')[1],
              markText:res.tips[1].name,
              fromloc
            })
          }
        }
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
              let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
              myAmapFun.getRegeo({
                location:res.longitude+','+res.latitude,
                success:(res) => {
                  console.log(res)
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
            }
        }
      })
    }
  },
  goFromLoc(){
    wx.navigateTo({
      url: '/pages/peripheralTourism/pages/mapSelect/locList/index?adcode='+this.data.adcode,
    })
  },
  mapOk(){
    wx.setStorageSync('fromloc', this.data.fromloc)
    wx.navigateTo({
      url: '/pages/peripheralTourism/pages/order/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        this.getLocation()
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
    console.log(this.data)
    let fromLoc = this.data.fromloc
    if(fromLoc){
      this.setData({
        longitude:fromLoc.location.split(',')[0],
        latitude:fromLoc.location.split(',')[1],
        markText:fromLoc.name
      })
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