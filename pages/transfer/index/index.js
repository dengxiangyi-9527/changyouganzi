// pages/cjjs/index/index.js
const util = require('../../../utils/util.js')
import { requestGet } from "../../../utils/request.js"
import { getTimers } from "../../../utils/getTimers.js"
import { toast } from "../../../utils/toast.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#fff",
      "flag": 1,
      "name": ""
    },
    typeData:[
      {
        name:"接机",
        type:1,
        active:true
    },
      {
        name:"送机",
        type:2,
        active:false
    }
    ],
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value+'日';
    },
    //选择时间
    onInput(event) {
      this.setData({
        currentDate: event.detail
      });
    }
  },
 // 接送机选择
 bindTypeChoose (e){
   let type =e.currentTarget.dataset.type
   let data = this.data.typeData
   data.map((item,index) => {
     if(index === type -1) {
       item.active = true
     } else {
       item.active = false
     }
   })
   this.setData({
     typeData:data
   })
 },
 //时间选择完成
  confirm(value){
    this.setData({ show: false, totalTime: value.detail});

        this.setData({
         currentDate: getTimers(this.data.totalTime)
        })
    wx.setStorageSync('currentDate', this.data.totalTime)
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      totalTime: e.detail.value
    })
  },

  changeTime(e){
  },
  cancelTime(){
    this.setData({ show: false });
  },

  showPopup() {
    console.log(1)
    var minDate = new Date(new Date().toLocaleDateString()).getTime()
    var maxDate = minDate + 7*24*60*60*1000
    console.log(minDate,maxDate)
    this.setData({ show: true, maxDate });
  },
//选择时间关闭
  onClose() {
    this.setData({ show: false });
  },
//关闭时间选择
  onCancel(){
    this.setData({ show: false });
  },
//左上角的返回按钮
  goBack(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

//点击出发地输入框跳转到出发地车站页面选择
  goSelectStartCity(){
    wx.navigateTo({
      url: '/pages/cjjs/selectCity/index',
      success: (res) => {
        res.eventChannel.emit('city','from')
      }
    })
  },

  goSelectFinishCity(){
    wx.navigateTo({
      url: '/pages/cjjs/selectCity/index',
      success: (res) => {
        res.eventChannel.emit('city', 'to')
      }
    })
  },

//点击查询城际专车跳到查询页
  toSerach(){
    if(this.data.startCity !== '' && this.data.arriveCity !== ''){
      wx.navigateTo({
        url: '/pages/cjjs/selectFlight/index',
        success: (res) => {
          res.eventChannel.emit('getCityName', { formCityId: this.data.startCity.id, toCityId: this.data.arriveCity.id, timestamp: this.data.totalTime})
        }
      })
    } else if (this.data.startCity == '' && this.data.arriveCity !== ''){
      toast({ title: '请选择出发地'})
    } else if (this.data.startCity !== '' && this.data.arriveCity == ''){
      toast({ title: '请选择目的地' })
    }else{
      toast({ title: '请选择出发地和目的地' })
    }
  },
  //城市交换按钮
  exchangeCity(){
    var exCity = null
    exCity = wx.getStorageSync('cityFrom')
    wx.setStorageSync('cityFrom', wx.getStorageSync('cityTo'))
    wx.setStorageSync('cityTo', exCity)
    this.setData({
      startCity: wx.getStorageSync('cityFrom'),
      arriveCity: wx.getStorageSync('cityTo')
    })
    console.log(this.data.startCity)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //第一次近页面时出发时间默认当天
    //判断Stroage里是否有currentDate如果没有默认当天时间
    if (wx.getStorageSync('currentDate')){
      this.setData({
        totalTime: wx.getStorageSync('currentDate')
      })

        this.setData({
            currentDate: getTimers(this.data.totalTime)
        })
    }else{
      var times = new Date();
      var yue = (times.getMonth() + 1 < 10 ? '0' + (times.getMonth() + 1) : times.getMonth() + 1); //月
      var tian = (times.getDate() < 10 ? "0" + times.getDate() : times.getDate()); //天
      var timer = yue + '月' + tian + '日' + '今天';
      this.setData({
        currentDate: timer
      })
    }
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      startCity: wx.getStorageSync('cityFrom'),
      arriveCity: wx.getStorageSync('cityTo')
    })

    if (wx.getStorageSync('currentDate')){
      this.setData({ textColor:'#E3E5E8'})
    }else{
      this.setData({ textColor: '#333333' })
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