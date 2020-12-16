// pages/CustomTour//pages/packageList/index.js
import {
  request
} from '../../../../utils/request'
import {
  getTimers
} from '../../../../utils/getTimers'
import { toast } from '../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:'',//开始时间
    endDate:'',//结束时间
    dayNum:'',//天数
    activeKey:0,//导航栏index
    carList:'',//车型列表
    carInfoList:[],//车型信息列表
  },

  //获取日期
  getDate(time,isFrom){
    let times = getTimers(time)
    times = times.slice(0,4)+'-'+times.slice(5,7)+'-'+times.slice(8,10)
    if(isFrom){
      this.setData({currentDate:times})
    }else{
      this.setData({endDate:times})
    }
  },  

  //获取车型
  getCarList(){
    request({
      url:'/charter/list-model',
      data:{
        stime:this.data.currentDate,
        etime:this.data.endDate
      }
    }).then(res => {
      console.log(res)
      if(res.code == 200 && res.data){
          this.setData({carList:res.data})
          this.onChange({detail:0})
      }
    })
  },
  //选择车型
  onChange(e){
    let carInfoList = []
    let carList = []
    let id = e.detail
    for(let i in this.data.carList){
      carList.push(this.data.carList[i])
    }
    if(id == 0){
      carList.map(res => {
        res.map(item => {
          carInfoList.push(item)
        })
      })
    }else{
      carInfoList = carList[id-1]
    }
    this.setData({carInfoList})
    console.log(this.data.carInfoList)
  },
  //填写订单
  toOrdedr(e){
    console.log(e)
    let carInfo = e.currentTarget.dataset.item
    if(!carInfo.disabled){
      wx.navigateTo({
        url: '/pages/CustomTour/pages/order/index?carInfo='+JSON.stringify(carInfo),
      })
    }else{
      toast({title:'暂无该车型'})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentTime = wx.getStorageSync('currentDate')
    let endTime = wx.getStorageSync('endDate')
    this.getDate(currentTime,true)
    this.getDate(endTime,false)
    if(endTime && currentTime){
      let dayNum = (endTime-currentTime)/1000/60/60/24+1
      this.setData({dayNum})
      console.log(dayNum)
    }
    this.getCarList()
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