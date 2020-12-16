// pages/cjjs/index/index.js
const util = require('../../../utils/util.js')
import { request } from "../../../utils/request.js"
import { getTimers } from "../../../utils/getTimers.js"
import { toast } from "../../../utils/toast.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#fff",
      "flag": 1,
      "name": "城际接送"
    },
    show:false,
    servingCity:"甘孜州",
    startCity:"",
    arriveCity:"",
    height:'',
    maxDate:'',
    currentDate:'',//选择日期
    totalTime:'',//选择的时间戳
    dateList:[],//日期列表
    timestampList:[],//时间戳列表
    textColor:'#',
    //出发时间选择
    currentTime: new Date().getTime(),
    minDate: new Date().getTime(),
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
        totalTime: event.detail
      });
    }
  },
 
 //时间选择完成
  confirm(value){
    console.log(value)
    let index = value.detail.index
    let totalTime = this.data.timestampList[index]
    let currentDate = value.detail.value.slice(5,15)
    this.setData({ show: false, totalTime,currentDate});
    console.log(index)
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
    var minDate = new Date(new Date().toLocaleDateString()).getTime()
    var timestampList = []
    var dateList = []
    for(var i = 0; i < 3 ; i++){
      var timeDate = new Date(new Date().toLocaleDateString()).getTime()
      timeDate = timeDate + i * 24 * 60 * 60 * 1000
      timestampList.push(timeDate)
      this.setData({timestampList})
    }
    timestampList.forEach(res => {
     
        dateList.push(getTimers(res))
        this.setData({dateList})

    })
    this.setData({ show: true });
  },
//选择时间关闭
  onClose() {
    this.setData({ show: false });
  },
//时间选择变化
onChnage(value){
  console.log(value)
  let index = value.detail.index
  let totalTime = this.data.timestampList[index]
  let currentDate = value.detail.value.slice(5,15)
  this.setData({totalTime,currentDate});
  console.log(index)
  wx.setStorageSync('currentDate', this.data.totalTime)
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
      url: '/pages/cjjs/selectCity/index?city=from',
    })
  },

  goSelectFinishCity(){
    wx.navigateTo({
      url: '/pages/cjjs/selectCity/index?city=to',
    })
  },

//点击查询城际专车跳到查询页
  toSerach(){
    if (this.data.startCity === this.data.arriveCity && this.data.startCity !== '' && this.data.arriveCity !== ''&&this.data.startCity !== undefined && this.data.arriveCity !== undefined){
      toast({title:'出发地和目的地不能相同'})
    }else{
      if (this.data.startCity !== '' && this.data.arriveCity !== ''&&this.data.startCity !== undefined && this.data.arriveCity !== undefined) {
        wx.navigateTo({
          url: '/pages/cjjs/selectFlight/index'
        })
      } else if (this.data.startCity == '' && this.data.arriveCity !== '') {
        toast({ title: '请选择出发地' })
      } else if (this.data.startCity !== '' && this.data.arriveCity == '') {
        toast({ title: '请选择目的地' })
      } else {
        toast({ title: '请选择出发地和目的地' })
      }
    }
  },
  //城市交换按钮
  exchangeCity(){
    var exCity = null
    exCity = wx.getStorageSync('cityFrom')
    wx.setStorageSync('cityFrom', wx.getStorageSync('cityTo'))
    wx.setStorageSync('cityTo', exCity)
    this.setData({
      startCity: wx.getStorageSync('cityFrom').name,
      arriveCity: wx.getStorageSync('cityTo').name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('cityFrom') == ''){
        this.setData({
          startCity: wx.getStorageSync('cityFrom').name,
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
        //第一次近页面时出发时间默认当天
    //判断Stroage里是否有currentDate如果没有默认当天时间
    if (wx.getStorageSync('currentDate')){
      this.setData({
        totalTime: wx.getStorageSync('currentDate')
      })

        this.setData({
          currentDate:  getTimers(this.data.totalTime).slice(5, 15)
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
      startCity: wx.getStorageSync('cityFrom').name,
      arriveCity: wx.getStorageSync('cityTo').name
    })

    if (wx.getStorageSync('currentDate')){
      this.setData({ textColor:'#E3E5E8'})
    }else{
      this.setData({ textColor: '#333333' })
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