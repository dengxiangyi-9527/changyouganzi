import { toast } from "../../../../utils/toast"
import { getTimers } from '../../../../utils/getTimers'
// pages/CustomTour//pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#fff",
      "flag": 2,
      "name": ""
    },
    tabindex:1,
    fromLocationInfo:'',
    cityName:'',
    show:false,//时间选择器
    cityShow:false,
    personShow:false,//用户选择器
    currentDate:'',//选择开始日期
    curentTotalTime:0,//选择的时间戳
    dateList:[],//日期列表
    timestampList:[],//时间戳列表
    isShow:false,
    dayNum:0,
    endDate:'',//结束日期
    endTotalTime:0,//选择结束的时间戳
    isFrom:'',//选择日期
    userName:'',//联系人
    userTel:'',//联系电话
    multiArray:'',
    adultNum:0,//成人，
    kidNum:0,//儿童
    oldNum:0,//老人
    cityList:[],
    cityFrom:'成都市',
    cityTo:''
  },
  //导航栏切换
  tabChange(e){
    console.log(e)
    let tabindex = e.currentTarget.dataset.id
    let nav = ''
    if(tabindex == 3){
       nav = {
        "font_size":32,
        "bg_color": "rgba(38, 41, 44, 1)",
        "color": "#fff",
        "flag": 2,
        "name": "团建定制"
      }
    }else{
       nav = {
        "bg_color": "rgba(0, 0, 0, 0)",
        "color": "#fff",
        "flag": 2,
        "name": ""
      }
    }
    this.setData({
      nav,
      tabindex,
      endDate:'',//结束日期
      endTotalTime:0,//选择结束的时间戳
      currentDate:'',//选择开始日期
      curentTotalTime:0,//选择的时间戳
      dayNum:0,
      cityFrom:'成都市',
      cityTo:'',
      adultNum:0,//成人，
      kidNum:0,//儿童
      oldNum:0,//老人
      userName:'',//联系人
      userTel:'',//联系电话
    })
    // if(tabindex == 1){
    //   this.setData({tabindex})
    // }else{
    //   toast({title:'敬请期待'})
    // }
  },
  //上车地点选择
  getFrom(){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/selectMap/index/index',
    })
  },
  //时间选择器
  showPopup(e) {
    console.log(e)
    if(e.currentTarget.dataset.item == 'start'){
      var timestampList = []
      var dateList = []
      for(var i = 1; i < 30 ; i++){
        var timeDate = new Date(new Date().toLocaleDateString()).getTime()
        timeDate = timeDate + i * 24 * 60 * 60 * 1000
        timestampList.push(timeDate)
        this.setData({timestampList})
      }
      timestampList.forEach(res => {
          dateList.push(getTimers(res))
          this.setData({dateList})
      })
      this.setData({ show: true,isFrom:true });
    }else if(e.currentTarget.dataset.item == 'end' && this.data.curentTotalTime){
      var timestampList = []
      var dateList = []
      for(var i = 0; i < 30 ; i++){
        var timeDate = this.data.curentTotalTime
        timeDate = timeDate + i * 24 * 60 * 60 * 1000
        timestampList.push(timeDate)
        this.setData({timestampList})
      }
      timestampList.forEach(res => {
          dateList.push(getTimers(res))
          this.setData({dateList})
      })
      this.setData({ show: true,isFrom:false });
    }else if(!this.data.curentTotalTime){
      toast({title:'请选择出发日期'})
    }
  },
   //时间选择完成
   confirm(value){
    if(this.data.isFrom){
      let index = value.detail.index
      let curentTotalTime = this.data.timestampList[index]
      let currentDate = value.detail.value.slice(0,4)+'-'+value.detail.value.slice(5,7)+'-'+value.detail.value.slice(8,10)
      this.setData({ show: false, curentTotalTime,currentDate});
      wx.setStorageSync('currentDate', this.data.curentTotalTime)
    }else{
      let index = value.detail.index
      let endTotalTime = this.data.timestampList[index]
      let endDate = value.detail.value.slice(0,4)+'-'+value.detail.value.slice(5,7)+'-'+value.detail.value.slice(8,10)
      this.setData({ show: false,endTotalTime,endDate});
      wx.setStorageSync('endDate', this.data.endTotalTime)
    }
    if(this.data.endTotalTime && this.data.curentTotalTime){
      if(this.data.endTotalTime >= this.data.curentTotalTime){
        let dayNum = (this.data.endTotalTime-this.data.curentTotalTime)/1000/60/60/24+1
        this.setData({dayNum})
        console.log(dayNum)
      }else{
        toast({title:'结束时间必须大于开始时间'})
        this.setData({
          endTotalTime:0,
          endDate:'',
          dayNum:0
        })
      }
    }
  },
  //关闭
  onClose(){
    this.setData({show:false,personShow:false})
  },
  //联系客服
  callTel(e){
    wx.makePhoneCall({
      phoneNumber:'19150185859'
    })
  },
  //查询套餐
  inquiryPackage(){
    let { cityName,fromLocationInfo,curentTotalTime,endTotalTime } = this.data
    if(cityName != ''&&fromLocationInfo != '' && curentTotalTime != '' && endTotalTime != ''){
      wx.navigateTo({
        url: '/pages/CustomTour/pages/customTourExplain/index',
      })
    }else if(cityName == ''){
      toast({title:'上车地点'})
    }else if(curentTotalTime == ''){
      toast({title:'请选择出发日期'})
    }else if(endTotalTime == ''){
      toast({title:'请选择结束日期'})
    }
  },
  //私人定制
  gettrip(){
    let { adultNum,kidNum,oldNum,userName,userTel,currentDate,endDate,cityFrom,cityTo } = this.data
    let userInfo = { adultNum,kidNum,oldNum,userName,userTel,currentDate,endDate,cityFrom,cityTo }
    if(this.data.tabindex == 2){
      userInfo['type'] = '私人定制'
    }else {
      userInfo['type'] = '团建定制'
    }
    if((adultNum||kidNum||oldNum) && userName && userTel && currentDate && endDate && cityFrom && cityTo&&(/^1[3456789]\d{9}$/.test(userTel)) && cityFrom!=cityTo){
        wx.navigateTo({
          url: '/pages/CustomTour/pages/customized/sudmit/index?userInfo='+JSON.stringify(userInfo),
        })
    }else if(!cityFrom){
      toast({title:'请选择出发地'})
    }else if(!cityTo){
      toast({title:'请选择目的地'})
    }else if(cityFrom==cityTo){
      toast({title:'出发地目的地相同'})
    }else if(!currentDate){
      toast({title:'请选择出发时间'})
    }else if(!endDate){
      toast({title:'请选择返程时间'})
    }else if(!userName){
      toast({title:'请填写姓名'})
    }else if(!userTel){
      toast({title:'请填写电话'})
    }else if(!(/^1[3456789]\d{9}$/.test(userTel))){
      toast({title:'请填写正确的电话'})
    }else if(!(adultNum||kidNum||oldNum)){
      toast({title:'请选择出行人数'})
    }
    
  },
  //选择器关闭
  onCancel(){
    this.setData({show:false,personShow:false,cityShow:false})
  },
  //定制选择上车地点
  getCity(e){
    let cityList = []
    console.log(e)
    if(e.currentTarget.dataset.item === 'from'){
      cityList = ['成都市','磨西县','泸定县','康定市']
    }else{
      cityList=['成都市','磨西县','泸定县','康定市','丹巴县','色达县','九龙县','九龙县','雅江县','理塘县','稻城县','乡城县','得荣县','巴塘县','道孚县','炉霍县','甘孜县','德格','石渠县','白玉县','新龙县']
    }
    this.setData({cityShow:true,cityList})
  },
  //定制选择城市
  cityconfirm(e){
    console.log(e)
    if(this.data.cityList.length == 4){
      this.setData({cityFrom:e.detail.value,cityShow:false})
    }else{
      this.setData({cityTo:e.detail.value,cityShow:false})
    }
  },
  //定制用户民
  getUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  getUserTel(e){
    this.setData({
      userTel:e.detail.value
    })
  },
  //定制人数
  personChange(){
    this.setData({personShow:true})
    let list = []
    let multiArray = [
      {
        values: [],
        className: '成人',
      },
      {
        values: [],
        className: '儿童',
        defaultIndex: 0,
      },
      {
        values: [],
        className: '老人',
        defaultIndex: 0,
      }
    ]
    for(let i = 0; i<61;i++ ){
      list.push(i)
    }
    for(let i =0;i<3;i++){
      if(i == 0){
        multiArray[i].values = list.map(res => {
          res = res+'成人'
          return res
        })
      }else if(i == 1){
        multiArray[i].values = list.map(res => {
          res = res+'儿童'
          return res
        })
      }else{
        multiArray[i].values = list.map(res => {
          res = res+'老人'
          return res
        })
      }
    }
    this.setData({multiArray})
  },
  //定制人数变化
  personNumChange(e){
    console.log(e)
    this.setData({
      adultNum:Number(e.detail.value[0].slice(0,-2)),
      kidNum:Number(e.detail.value[1].slice(0,-2)),
      oldNum:Number(e.detail.value[2].slice(0,-2)),
    })
  },
  //定制选择人数完成
  personConfirm(e){
    this.setData({
      adultNum:Number(e.detail.value[0].slice(0,-2)),
      kidNum:Number(e.detail.value[1].slice(0,-2)),
      oldNum:Number(e.detail.value[2].slice(0,-2)),
      personShow:false,
    })
  },
  //查看定制单
  goDetail(e){
    wx.navigateTo({
      url: '/pages/CustomTour/pages/customized/process/index?order_sn='+''+'&type='+e.currentTarget.dataset.item,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    if(wx.getStorageSync('fromLocation')){
      this.setData({
        fromLocationInfo:wx.getStorageSync('fromLocation').fromLocationInfo,
        cityName:wx.getStorageSync('cityFrom').name
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