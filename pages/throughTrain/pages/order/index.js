import { toast } from '../../../../utils/toast'
import { getTimers } from '../../../../utils/getTimers'
import { request } from '../../../../utils/request.js'
let app = getApp()
// pages/cjjs/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0, //获取页面高度
    show: false, // 购票须知弹出层
    showIndex: 0, //费用明细图标
    maskData: [{
      title: '标题',
      text: '我是抽屉'
    }],
    IconTrue:false,//费用明细图标
    showPrice: false, //费用明细弹出层
    changeDisplay: false, //控制费用明细的遮罩层
    timer: '',//出发时间
    userName: '',//用车人姓名
    // userCarid:'',//用车人身份证
    tel: '',//用车人电话
    remarks: '',//备注信息
    allPrice: 0,//总金额
    checked: false,//阅读同意
    cityFrom:'',//出发地
    fromLocation:'',//上车点名字
    fromLocationInfo:'',//上车点经纬度
    num:'',//门票数量
    route_id:'',//线路ID
    isRead:false,//输入框是否只读
    iscode:false,//乘车须知显示
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
    isClick:true,//防斗
    carInfo:'',//车次信息
    userList:[]
  },

  // 购票须知弹出层
  showPopup(event) {
    let active = Number(event.currentTarget.dataset.item)
    let iscode = ''
    if(active){
      iscode = false
    }else {iscode = true}
    this.setData({
      show: true,
      iscode
    })
  },
  //关闭购票须知
  onClose() {
    this.setData({
      show: false,
      showPrice: false
    });
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
      url: '/pages/charteredBus/pages/protocol/index?protocoltype=' + protocoltype,
    })
  },
  // 获取页面高度
  getHeight() {
    const newHeight = wx.getSystemInfoSync().windowHeight * 2 - 198
    this.setData({
      height: newHeight
    })
  },

  //点击去付款提交订单
  toPay() {
    let isClick = this.data.isClick
    let start_station_id = wx.getStorageSync('cityFrom').id
    let end_station_id = wx.getStorageSync('cityTo').id
    let date = wx.getStorageSync('currentDate')/1000
    let { userList, fromLocation, tel,fromLocationInfo,remarks,checked } = this.data
    let route_id = this.data.carInfo.route_id
    let num = this.data.carInfo.num
    let through_train_id = this.data.carInfo.through_train_id
    if(isClick){
      this.setData({isClick:false})
      if (tel != '' && fromLocationInfo!='' && fromLocation!='' && checked && userList.length > 0) {
        console.log(checked)
        request({
          url:'/through-train/order/submit',
          data:{
            through_train_id,
            start_station_id,
            end_station_id,
            route_id,
            name:userList[0].name,
            id_card_number:userList[0].id_card_number,
            addon:JSON.stringify(userList),
            num,
            start_location:fromLocation,
            start_point:fromLocationInfo,
            date,
            remarks,
            phone:String(tel),
          },
          method:'POST'
        }).then(res => {
          if(res.code == 200 && res.data){
            console.log(res)
            toast({
              title:'下单成功'
            })
            wx.reLaunch({
              url:'/pages/throughTrain/pages/pay/index?order_id='+res.data.order_id
            })
          }
        })
    }else if(userList.length == 0){
      toast({title:'请添加乘客'})
    }else if(tel == ''){
      toast({title:'请填写你的电话号码'})
    }else if(fromLocationInfo == ''){
      toast({title:'请选择你的上车地点'})
    }else if(!checked){
      console.log(checked)
      toast({title:'请先勾选同意协议'})
    }
    this.data.settimeout = setTimeout(() => {
      this.setData({isClick:true})
    },1000)
  }else{
    toast({title:'请勿频繁操作'})
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
    this.setData({
      tel
    })
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
    console.log(event)
    this.setData({ remarks: event.detail.value })
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
  //上车地点修改
  startLoc(){
    if(!this.data.isRead){
      wx.navigateBack()
    }
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

  //计算价格
  getAllPrice(){
    console.log(this.data.carInfo)
    let carInfo = this.data.carInfo
    let allPrice = 0
    allPrice = ((carInfo.price*100+carInfo.totalPrice*100*carInfo.num)/100).toFixed(2)
    this.setData({
      allPrice
    })
  },
  //获取用户信息
  getUserTel(){
    request({
      url:'/citytransport/me/get'
    }).then(res => {
      if(res.code == 200&&res.data.phone!=''){
        this.setData({
          tel:res.data.phone
        })
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
    this.getHeight() // 获取页面高度
    this.getUserTel()
    let cityFrom = wx.getStorageSync('cityFrom').name
    let carInfo = JSON.parse(options.carInfo)
    carInfo.price = (carInfo.price/100).toFixed(2)
    carInfo.totalPrice = (carInfo.totalPrice/100).toFixed(2)
    let timer = wx.getStorageSync('currentDate')
    if(timer){
        this.setData({
          timer:getTimers(timer)
        })
    }
    this.setData({
      cityFrom,
      carInfo
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
    if(wx.getStorageSync('fromLocation')){
      this.setData({
        fromLocationInfo:wx.getStorageSync('fromLocation').fromLocationInfo,
        fromLocation:wx.getStorageSync('fromLocation').fromLocation
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

  },

  
onPageScroll:function(e){
  if(e.scrollTop<0){
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
}

})