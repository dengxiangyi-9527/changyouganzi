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
    userName: '',//用车人姓名
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
    detail:''
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
    let {userName,adultNum,kidNum,tel,remarks,checked,detail,allPrice } = this.data
    let address = wx.getStorageSync('fromloc').address
    let lng = Number(wx.getStorageSync('fromloc').location.split(',')[0])
    let lat = Number(wx.getStorageSync('fromloc').location.split(',')[1])
    let isClick = this.data.isClick
    if(isClick){
      this.setData({isClick:false})
      if(userName!=''&&adultNum!=0&&tel!=''&&checked){
        request({
          url:"/travel-around/order/submit",
          data:{
            price:allPrice*100,
            travel_around_id:detail.id,
            name:userName,
            phone:tel,
            num:adultNum,
            num_children:kidNum,
            date:detail.template/1000,
            location_start:address,
            location_end:this.data.detail.location_dismiss,
            lat,
            lng,
            remarks
          },
          method:'GET'
        }).then(res => {
          if(res.code == 200 && res.data){
            console.log(res)
            toast({
              title:'下单成功'
            })
            wx.removeStorage({
              key: 'Tourismdetail',
            })
            wx.removeStorage({
              key: 'fromloc',
            })
            wx.reLaunch({
              url:'/pages/peripheralTourism/pages/pay/index?order_sn='+res.data.order_sn
            })
          }
        })
      }else if(userName == ''){
        toast({title:'请填写您的姓名'})
      }else if(tel == ''){
        toast({title:'请填写你的电话号码'})
      }else if(adultNum == 0 && kidNum==0){
        toast({title:'出行人数不能为零'})
      }else if(adultNum == 0 && kidNum!=0){
        toast({title:'儿童需有大人陪同'})
      }else if(!checked){
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
          method:1,
          url:'/pages/login/index?type=codeBus/pages/order/index'
        })
      }else if(res.code == 200){
        this.setData({
          tel:res.data.phone
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    let detail = wx.getStorageSync('Tourismdetail')
    let adultPrice=detail.price
    let kidPrice = detail.price_child
    let fromCityInfo = wx.getStorageSync('fromloc')
    let toCityInfo=detail.location_dismiss
    console.log(detail)
    let timer = getTimers(detail.template).slice(5)
    this.setData({
      detail,
      timer,
      fromCityInfo,
      adultPrice,
      kidPrice,
      toCityInfo
    })
    this.getAllPrice()
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

  },

  
onPageScroll:function(e){
  if(e.scrollTop<0){
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
}

})