// pages/commonAddress/mapselect/index.js
var amapFile = require('../../../utils/amap-wx');//如：..­/..­/libs/amap-wx.js
import { showModel } from '../../../utils/showModel'
import { getSetting } from '../../../utils/getSetting'
import {
  request
} from '../../../utils/request'
import {
  toast
} from '../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markersHeight:'',//marks高度
    latitude:'',//维度
    longitude:'',//经度
    name:'',//地点名字
    location:'',//经纬度
    address:'',//地址
    markText:'',//marksText
    district:'',
    id:'',
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
  },

  //获取授权
  // getSettings(callback,scope){
  //   //·查看授权信息
  //   wx.getSetting({
  //     success:(res) => {
  //       //判断是否有授权
  //       if (!res.authSetting[scope]) {
  //         //打开授权
  //         wx.authorize({
  //           scope: scope,
  //           success: () => {
  //             //成功后回调
  //             callback()
  //           },
  //           fail:() => {
  //             //再次获取授权
  //             showModel({
  //               content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
  //               confirmText: "确认",
  //               cancelText: "取消",
  //               callback:  (res) => {
  //                 wx.openSetting({
  //                   success: (res) => { 
  //                     callback()
  //                   }
  //                 })
  //               }
  //             });
  //           }
  //         })
  //       }else{
  //         callback()
  //       }
  //     }
  //   })
  // },

  //获取定位
  getlocation(){
    var myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
    myAmapFun.getRegeo({
      success: (res) => {
        console.log(res)
        if(res.length>0){
          let markText = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
          let address = res[0].name
          let location = res[0].longitude +','+res[0].latitude
          let name = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
          let district = res[0].regeocodeData.addressComponent.city +  res[0].regeocodeData.addressComponent.district
          this.setData({
            district,
            markText,
            address,
            location,
            name,
            latitude:res[0].latitude,
            longitude:res[0].longitude,
            markers: [{
              id: 0,
              latitude: res[0].latitude,
              longitude:res[0].longitude,
              width: 50,
              height: 50
            }],
          })
         
        }
      },
    })
  },

  regionchange(e){
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.mapCtx = wx.createMapContext("map4select");
      this.mapCtx.getCenterLocation({
        type: 'gps',
        success:  (res) => {
          if(res.latitude && res.longitude){
              this.setData({
                location:res.longitude+','+res.latitude,
              })
              let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
              myAmapFun.getRegeo({
                location:res.longitude+','+res.latitude,
                success:(res) => {
                  console.log(res)
                  if(res.length !== 0){
                      let markText = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
                      let address = res[0].name
                      let location = res[0].longitude +','+res[0].latitude
                      let name = (res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name)
                      let district = res[0].regeocodeData.addressComponent.city +  res[0].regeocodeData.addressComponent.district
                      this.setData({
                        markText,
                        address,
                        location,
                        name,
                        district
                      })  
                  }
                }
              })
          }
       
        }
      })
    }
  },
  chooseLoc(){
    wx.showModal({
      title:'选择常用地址',
      content:'您选择选择'+this.data.name+'为你的常用地址',
      success: (res) => {
        if (res.confirm) {
          request({
            url:"/citytransport/me/add-address",
            data:{
              address:this.data.address,
              name:this.data.name,
              city_name:this.data.nowCity,
              location:this.data.location,
              district:this.data.district,
              id:this.data.id
            },
            method:'POST'
          }).then(res => {
            if(res.code == 200 && res.data){
              wx.navigateBack({
                delta:2
              })
            }
          })
        } 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id){
      this.setData({
        id:options.id
      })
    }
    if(options.nowCity){
      this.setData({
        nowCity:options.nowCity
      })
    }
    wx.createSelectorQuery().in(this).select('#marks').boundingClientRect(rect => {
      let app = getApp()
      let phoneHeight = app.globalData.phoneHeight
      let markersHeight = ((phoneHeight)/2-rect.height-36)/phoneHeight*100
      this.setData({
        markersHeight
      })
      }).exec()
      getSetting(this.getlocation,'scope.userLocation')
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