import { toast } from '../../../../utils/toast.js'
import { request } from '../../../../utils/request.js'
import { getTimers } from '../../../../utils/getTimers'
import { showModel } from '../../../../utils/showModel'
let app = getApp()
// pages/cjjs/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0, //获取页面高度
    show: false, // 购票须知弹出层
    active: 1, //购票须知和退改说明的切换
    showIndex: 0, //费用明细底部折叠面板
    IconTrue:false,//费用明细控制
    showPrice: false, //费用明细弹出层
    changeDisplay: false, //控制费用明细的遮罩层
    adultPrice: 0,//成人票价格
    kidPrice: 0,//儿童票价格
    carsInfo: '',//车次信息
    timer: '',//出发时间
    adultNum: 1,//成人数年
    kidNum: 0,//儿童数量
    // userName: '',//用车人姓名
    tel: '',//用车人电话
    remarks: '',//备注信息
    allPrice: 0,//总金额
    fromCityInfo:'',//出发城市信息
    toCityInfo:'',//终点城市信息
    checked: false,
    isRead:false,//输入框是否只读
    iscode:false,//乘车须知显示
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
    isClick:true,//防斗
    scenic_id:"",//车辆ID,
    // cardID:'',//身份证
    iconChange:false,
    userList:[]
  },
  //城市交换
  changeCity(){
    let {fromCityInfo,toCityInfo} = this.data
    let info = this.data.fromCityInfo
    fromCityInfo = toCityInfo
    toCityInfo = info
    this.setData({
      fromCityInfo,
      toCityInfo
    })
  },
  //当前激活的标签改变时触发
  onPriceChange(event) {
    this.setData({
      showPrice: event.detail
    });
  },
  // 购票须知弹出层
  showPopup(event) {
    let active = Number(event.currentTarget.dataset.item)
    this.setData({
      show: true,
      active
    })
  },
  onClose() {
    this.setData({
      show: false,
      showPrice: false
    });
  },
  //购票须知和退改说明的切换
  onDescriptionChange(event) {

  },
  //费用明细点击
  showPriceDetail(e) {
    let IconTrue = !this.data.IconTrue
    let showPrice = !this.data.showPrice
    let changeDisplay = !this.data.changeDisplay
    this.setData({
      IconTrue,
      showPrice,
      changeDisplay
    })
  },
  //关闭遮罩层
  closeMask() {
    this.setData({
      IconTrue:false,
      showIndex: false,
      changeDisplay: false
    })
  },
  //去到畅游甘孜约车协议页面
  toProtocol(e) {
    console.log(e.currentTarget.dataset.protocoltype)
    let protocoltype = e.currentTarget.dataset.protocoltype
    wx.navigateTo({
      url: '/pages/cjjs/protocol/index?protocoltype=' + protocoltype,
    })
  },
  // 获取页面高度
  getHeight() {
    const newHeight = wx.getSystemInfoSync().windowHeight * 2 - 198
    this.setData({
      height: newHeight
    })
  },

  //点击去付款到达确认支付页面
  toPay() {
    let { fromCityInfo,toCityInfo,adultNum,tel,remarks,checked,userList } = this.data
    let date = new Date(new Date().toLocaleDateString()).getTime()/1000
    let isClick = this.data.isClick
    let scenic_id = wx.getStorageSync('scenic_id')
    console.log(scenic_id)
    if(isClick){
      this.setData({isClick:false})
      if(tel!=''&&checked&&userList.length>0){
        request({
          url:"/scenic-area/order/submit",
          data:{
            start_station_id:fromCityInfo.id,
            end_station_id:toCityInfo.id,
            name:userList[0].name,
            phone:tel,
            num:adultNum,
            remarks,
            through_train_id:0,
            route_id:0,
            start_location:'0',
            end_location:'0',
            start_point:fromCityInfo.name,
            end_point:toCityInfo.name,
            date,
            scenic_id,
            id_card_number:userList[0].id_card_number,
            addon:JSON.stringify(userList)
          },
          method:'POST'
        }).then(res => {
          if(res.code == 200 && res.data){
            wx.removeStorage({ key: 'scenic_id',})
            console.log(res)
            toast({
              title:'下单成功'
            })
            wx.reLaunch({
              url:'/pages/codeBus/pages/pay/index?order_id='+res.data.order_id
            })
          }
        })
      }else if(userList.length == 0){
        toast({title:'请添加乘客'})
      }else if(tel == ''){
        toast({title:'请填写你的电话号码'})
      }else if(!checked){
        console.log(checked)
        toast({title:'请先勾选同意协议'})
      }
      this.data.settimeout = setTimeout(() => {
        this.setData({isClick:true})
      },1000)
    }
  },

  //成年人数变化
  addadultNum() {
    let adultNum = this.data.adultNum
      ++adultNum
      this.setData({
        adultNum
      })
      this.getAllPrice()
  },
  upadultNum() {
    let adultNum = this.data.adultNum
    let kidNum = this.data.kidNum
    if(adultNum + kidNum > 1){
      if(adultNum>0){
        --adultNum
        this.setData({
          adultNum
        })
        this.getAllPrice()
      }
    }else{
      toast({
        title:'人数不能为0'
      })
    }
  },

  //儿童数量变化
  addkidNum() {
    let kidNum = this.data.kidNum
      ++kidNum
      this.setData({
        kidNum
      })
      this.getAllPrice()
  },
  upkidNum() {
    let kidNum = this.data.kidNum
    let adultNum = this.data.adultNum
    if(adultNum + kidNum > 1){
      if(kidNum>0){
        --kidNum
        this.setData({
          kidNum
        })
        this.getAllPrice()
      }
    }else{
      toast({
        title:'人数不能为0'
      })
    }
  },
  //获取用户姓名
  getUserName(event) {
    console.log(this.data.isRead)
    var name = event.detail.value
    this.setData({ userName:name })
  },
  //获取身份证
  getUserID(event){
    var cardID = event.detail.value
    this.setData({ cardID })
    console.log(this.data.cardID)
  },
  //获取电话
  getUserTel(event) {
    var tel = event.detail.value
    if (tel !== '') {
      var tel = event.detail.value
      this.setData({
        tel
      })
    }
  },
 //判断手机号
 inspectTel(){
  var tel = this.data.tel
  if (tel !== '') {
    if (!(/^1[3456789]\d{9}$/.test(tel))) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 2000
      })
      this.setData({ tel:'' })
    } else {
      this.setData({ tel })
    }
  }
},
  //获取备注
  getRemarks(event) {
    this.setData({ remarks: event.detail.value })
  },
  //计算总金额
  getAllPrice() {
   let { adultNum,kidNum,adultPrice, kidPrice } = this.data
   let allPrice = ((adultNum*adultPrice+kidNum*kidPrice)/100).toFixed(2)
   this.setData({
    allPrice
   })
  },
  //点击同意协议
  onChecked() {
    var checked = !this.data.checked
    this.setData({ checked })
  },
  //乘车须知和退改说明
  exached(){
    this.setData({iscode:!this.data.iscode})
  },
  //联系客服  
  callPhone(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.item,
      fail:(err) => {
        throw(err)
      }
    })
  },
  //计算当前时间
  getNowDay(){
    let nowTimers = new Date(new Date().toLocaleDateString()).getTime()
      this.setData({
        timer: getTimers(nowTimers).slice(5)
      })
  },
  //获取用户信息
  getUserInfo(){
    request({
      url:'/citytransport/me/get',
      isShowModel:true,
    }).then(res => {
      if(res.code == 401){
        showModel({
          content: '您尚未登录，请先登录',
          confirmColor:'#18AFFF',
          url:'/pages/login/index?type=codeBus/pages/order/index'
        })
      }else if(res.code == 200){
        this.setData({
          tel:res.data.phone
        })
      }
    })
  },
  //获取返程路线
  getBackLine(scenic_id){
    request({
      url:'/public/default-back-route',
      data:{
        scenic_id
      }
    }).then(res => {
      if(res.code == 200 && res.data){
        this.setData({
          fromCityInfo:res.data[0].from,
          toCityInfo:res.data[0].to,
          adultPrice:res.data[0].adultPrice,
          kidPrice:res.data[0].kidPrice
        })
        this.getAllPrice()
      }
    })
  },
  //删除按钮显示
  scrollend(e){
    console.log(e)
    let item = e.target.dataset.item
    let userList = this.data.userList.map(res => {
      if(res.id == item.id){
        res.delcheck = true
      }
      return res
    })
    this.setData({userList})
  },
  scrollstart(e){
    let item = e.target.dataset.item
    let userList = this.data.userList.map(res => {
      if(res.id == item.id){
        res.delcheck = false
      }
      return res
    })
    this.setData({userList})
  },
  //添加乘客
  addUser(){
    wx.navigateTo({
      url: '/pages/commonUser/pages/index/index?userList='+JSON.stringify(this.data.userList),
    })
  },
  //删除乘客
  delUser(e){
    let item = e.currentTarget.dataset.item
    let userList = []
    this.data.userList.map(res =>{
      if(res.id != item.id){
        userList.push(res)
      }
    })
    this.setData({userList})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let scenic_id = Number(options.scenic_id)
    // if(typeof scenic_id === 'number' && !isNaN(scenic_id)){
      wx.setStorageSync('scenic_id', scenic_id)
      this.getBackLine(scenic_id)
      this.setData({scenic_id})
      console.log(scenic_id)
      this.getNowDay()
      this.getUserInfo()
    // }else{
    //   toast({
    //     title:"扫码错误，请重新扫码"
    //   })
    // }

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
    let num = this.data.userList.length
    this.setData({
      adultNum:num
    })
    this.getAllPrice()
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

  },

  
onPageScroll:function(e){
  if(e.scrollTop<0){
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
}

})