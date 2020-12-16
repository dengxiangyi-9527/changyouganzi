const app = getApp()
const util = require('../../../../utils/util.js')
import { request } from "../../../../utils/request"
import { getTimers } from '../../../../utils/getTimers.js'
import { toast } from '../../../../utils/toast'
import { showModel } from '../../../../utils/showModel'
Page({
  data: {
    listshow:true,
    ishow:true,
    classesList: [], //班次
    classesListNull:[],//无余票
    timestamp:'',//十三位的时间戳,
    timer:'',//日期
    show:false,//遮罩层显示
    textColor:'#999',//
    timestampList: [],//时间戳列表
    dateList: [],//日期列表
    orderDetail:'',//订单详情
    seatList:[
      {
        id:1,
        num:6,
        price:50000,
        check:false
      },
      {
        id:2,
        num:8,
        price:800000,
        check:false
      },
      {
        id:3,
        num:11,
        price:100000,
        check:false
      }
    ],//座位书列表
    //时间选择数据
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    }
  },


  //日期选择点击确定
  timeConfirm(event){
    let index = event.detail.index
    let timestamp = this.data.timestampList[index]
    let timer = event.detail.value.slice(5, 15)
    wx.setStorageSync('currentDate', timestamp)
    this.getTimers(timestamp)
    this.setData({show:false,timer,timestamp})
    this.getClasses()
  },
  //日期取消按钮
  closeTime(){
    this.setData({show:false})
  },
  // 上车点选择
  toStartMap(data) {
    var longitude = Number(data.currentTarget.dataset.item.longtitude)
    var latitude = Number(data.currentTarget.dataset.item.latitude)
    //微信授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.openLocation({
                latitude: latitude,
                longitude: longitude,
                scale: 18
              })
            },
            fail:() => {
              this.openConfirm()
            }
          })
        } else if (res.authSetting['scope.userLocation']){
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 18
          })
        }
      },
    })
  },
  //再次获取授权
  openConfirm(){
    showModel({
      content: '检测到您没打开此小程序的定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      callback: function (res) {
        wx.openSetting({
          success: (res) => { }
        })
      }
    });
  },
  //去订单页
  toOrder(data){
    let carsInfo = JSON.stringify(data.currentTarget.dataset.item)
    let orderDetail = this.data.orderDetail
    let timer = this.data.timer
    let start_station = wx.getStorageSync( 'cityFrom').id
    let end_station = wx.getStorageSync('cityTo' ).id
    let handle = false
    let id_card_number = ''
      request({
        url:'/citytransport/me/get',
        method:'GET',
        type:'charteredBus/pages/selectFlight/index'
      }).then(res => {
        if(res.code == 200){
          console.log(res)
          id_card_number=res.data.id_card_number
          handle=true
          console.log(orderDetail !== '')
          // if (handle&&id_card_number !== '' && orderDetail != "") {
            if (handle&&id_card_number !== '' && orderDetail != "") {
            wx.navigateTo({
              url: '/pages/charteredBus/pages/neworder/index?carsInfo='+carsInfo+'&timer='+timer+'&start_station='+start_station+'&end_station='+end_station+'&orderDetail='+ JSON.stringify(orderDetail)
            })
          } else if(res.data.id_card_number==''){
            wx.showModal({
              title: '提示',
              content: '实名认证后即可进行预定车票，快去实名认证吧～',
              cancelText: '跳过',
              confirmText: '好的',
              cancelColor: '#18AFFF',
              confirmColor: '#18AFFF',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/editUserInfo/verified/verified',
                  })
                } else if (res.cancel) {
                  //留在当前页
                }
              }
            })
          }else if(orderDetail == ''){
            wx.navigateTo({
              url: '/pages/charteredBus/pages/mapselect/index/index?carsInfo='+carsInfo+'&timer='+timer,
            })
          }

        }
      })

  },
  //前一天点击
  previousDay(){
    console.log(this.data.timestamp)
      if (this.data.timer.includes('今天')){
        if(this.data.orderDetail === ''){
          toast({
            title:'只能选择当天或之后的日期'
          })
        }else{
          toast({
            title:'只能选择当天或之前的日期'
          })
        }
        return
      }else{
        this.setData({ timestamp: this.data.timestamp - 24 * 60 * 60 * 1000})
        wx.setStorageSync('currentDate', this.data.timestamp)
        this.getTimers(this.data.timestamp)
        this.getClasses()
        // this.textColor()
      }
  },
  //后一天点击
  nextDay(){
    if(this.data.orderDetail === ''){
      let nowTime = wx.getStorageSync('currentDate')
      if(nowTime < new Date(new Date().toLocaleDateString()).getTime()+2*24*60*60*1000){
        this.setData({ timestamp: nowTime + 24 * 60 * 60 * 1000 })
        wx.setStorageSync('currentDate', this.data.timestamp)
        this.getTimers(this.data.timestamp)
        this.getClasses()
      }else{
        toast({
          title:'选择日期不能超过3天'
        })
      }
    }else{
      let nowTime = wx.getStorageSync('currentDate')
      let num = new Date(this.data.orderDetail.ticket_time*1000).getHours()*60*60*1000 + new Date(this.data.orderDetail.ticket_time).getMinutes()*60*1000 + new Date(this.data.orderDetail.ticket_time).getSeconds()*1000;
      if(nowTime < this.data.orderDetail.ticket_time*1000-num){
        this.setData({ timestamp: nowTime + 24 * 60 * 60 * 1000 })
        console.log(this.data.timestamp)
        wx.setStorageSync('currentDate', this.data.timestamp)
        this.getTimers(this.data.timestamp)
        this.getClasses()
      }else{
        toast({
          title:'只能选择当天或之前的日期'
        })
      }
    }
  },
  //获取班次列表
  getClasses(){
    this.setData({classesListNull:[],classesList:[]})
    var year = new Date(this.data.timestamp).getFullYear() 
    var mounth = new Date(this.data.timestamp).getMonth()+1
    var day = new Date(this.data.timestamp).getDate()
    if(mounth<10){
      mounth = '0' + mounth
    }
    if(day<10){
      day = '0' + day
    }
    var timestamp = year + '-' + mounth + '-' + day
    var classesList = []//有余票
    var classesListNull = []//没有余票或者过时间的车次
    var start_station = ''
    var end_station = ''
    if(wx.getStorageSync('cityFrom')){
       start_station = wx.getStorageSync( 'cityFrom').id
       end_station = wx.getStorageSync('cityTo' ).id
    }else{
       start_station = this.data.orderDetail.start_station_id
       end_station = this.data.orderDetail.end_station_id
    }
    var time = wx.getStorageSync('currentDate')
    var nowTime = new Date().getTime()
    request({
      url:'/citytransport/query/classes',
      data:{start_station:start_station, end_station:end_station, date: String(timestamp)},
      type:'charteredBus/pages/selectFlight/index'
    }).then(res => {
      wx.stopPullDownRefresh()
      if (res.code === 200){
        if(res.data.length !== 0){
          this.setData({listshow:true})
        }else{this.setData({listshow:false})}
        res.data.forEach(res => {
          res.adult_price = (res.adult_price/100).toFixed(2)
          res.adult_original_price = (res.adult_original_price/100).toFixed(2)
          let resTime = res.pick_up_time.split(':')
          resTime = time+Number(resTime[0])*60*60*1000+Number(resTime[1])*60*1000
          // 判断时间是否过期
          if (res.rest_tickets && (resTime > nowTime)){
            classesList.push(res)
            this.setData({
              classesList
            })
          }else{
            classesListNull.push(res)
            this.setData({ classesListNull})
          }
        })
      }
 
    })
  },

  //获取日期
  getTimers(time){
    if (time == ''){
      this.setData({
        timestamp: new Date().getTime()
      })
    }else{
      this.setData({timestamp: time})
    }

    this.setData({
      timer: getTimers(this.data.timestamp).slice(5, 15)
    })
    this.gettextColor()
  },
  //选择日期
  chooseTime(){
    if(this.data.orderDetail === ''){
      var timestampList = []
      var dateList = []
      for (var i = 0; i < 3; i++) {
        var timeDate = new Date(new Date().toLocaleDateString()).getTime()
        timeDate = timeDate + i * 24 * 60 * 60 * 1000
        timestampList.push(timeDate)
        this.setData({ timestampList })
      }
      timestampList.forEach(res => {

        dateList.push(getTimers(res))
        this.setData({ dateList })
      })
      this.setData({ show: true})
    }else{
      toast({
        title:'只能选择当天日期'
      })
    }
  },
  //字体颜色
  gettextColor(){
    if (this.data.timer.includes('今天')) {
      this.setData({ textColor: '#999' })
    } else {
      this.setData({ textColor: '#333' })
    }
  },
  onClose(){
    this.setData({show:false})
  },
  timeCHnage(event){
    console.log(event)
    let index = event.detail.index
    let timestamp = this.data.timestampList[index]
    let timer = event.detail.value.slice(5, 15)
    wx.setStorageSync('currentDate', timestamp)
    this.getTimers(timestamp)
    this.setData({timer,timestamp})
    this.getClasses()
  },

  //选择座位数量
  chooseSeat(e){
    console.log(e)
    let id = e.currentTarget.dataset.item
    let list = this.data.seatList
    let seatList = list.map(res => {
      if(res.id == id){
        res.check = !res.check
      }else{
        res.check = false
      }
      return res
    })
    this.setData({
      seatList
    })
  },

  //页面加载的时候
  onLoad: function (option) {
    //判断有没有订单信息
    if(option.orderDetail == undefined){
    //如果没有代表是购票
    //创建监听函数
    //监听成绩接送首页传来的数据 出发城市ID，目的地城市ID
      let from = wx.getStorageSync('cityFrom').name
      let to = wx.getStorageSync('cityTo').name
      wx.setNavigationBarTitle({
        title: from + '->' + to
      })
    //第一次近页面时出发时间默认当天
    //判断Stroage里是否有currentDate如果没有默认当天时间
    if (wx.getStorageSync('currentDate')) {
      this.setData({
        timestamp: wx.getStorageSync('currentDate')
      })
      this.getTimers(this.data.timestamp)
    } else {
      //当没有时间时默认当前时间
      this.setData({
        timestamp: Date.parse(new Date())
      })
      //把当前时间存入storage
      wx.setStorageSync('currentDate', new Date(new Date().toLocaleDateString()).getTime())
      this.getTimers(this.data.timestamp)
    }
    //获取车次信息
    this.getClasses()
    }else{
      let data = JSON.parse(option.orderDetail)
      console.log(data)
      this.setData({orderDetail:data})
      console.log(12132154156416545645645)
      //r如果有代表是改签
      let timestamp = this.data.orderDetail.ticket_time*1000
      timestamp = timestamp - new Date(timestamp).getHours()*60*60*1000 - new Date(timestamp).getMinutes()*60*1000
      this.setData({timestamp:timestamp})
      wx.setStorageSync('cityFrom', {id:this.data.orderDetail.start_station_id,name:this.data.orderDetail.from})
      wx.setStorageSync('cityTo', {id:this.data.orderDetail.end_station_id,name:this.data.orderDetail.to})
      wx.setStorageSync('currentDate', timestamp)
      this.getTimers(timestamp)
      this.getClasses()
      let {from,to} = this.data.orderDetail
      wx.setNavigationBarTitle({
        title: from + '->' + to
      })
    }
  },
    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.getClasses()
  },
  
})