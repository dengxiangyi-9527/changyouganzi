import { toast } from '../../../../utils/toast'
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
    active: 1, //购票须知和退改说明的切换
    showIndex: 0, //费用明细底部折叠面板
    maskData: [{
      title: '标题',
      text: '我是抽屉'
    }],
    cityFromName:'',
    cityToName:'',
    showPrice: false, //费用明细弹出层
    changeDisplay: 0, //控制费用明细的遮罩层
    adultPrice: 0,//成人票价格
    kidPrice: 0,//儿童票价格
    carsInfo: '',//车次信息
    timer: '',//出发时间
    adultNum: 1,//成人数年
    kidNum: 0,//儿童数量
    userName: '',//用车人姓名
    userCarid:'',//用车人身份证
    tel: '',//用车人电话
    remarks: '',//备注信息
    allPrice: 0,//总金额
    checked: false,
    start_station_id:'',//出发地地点id
    end_station_id:'',//重点ID
    orderDetail:'',//订单详情
    fromLocation:'',//上车点名字
    fromLocationInfo:'',//上车点经纬度
    toLocation:'',//下车点信息
    toLocationInfo:'',//下车点经纬度
    timestamp:'',//时间戳
    member_numbers:'',//总票数
    isRead:false,//输入框是否只读
    iscode:false,//乘车须知显示
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
    couponInfo:'',//优惠卷信息
    couponName:'',//优惠券名称
    couponMoney:0,//优惠券金额
    isClick:true,//防斗
    through_train:[],//直通车
    isHero:false,//是否为防疫英雄
    through_trainList:[],//选择得直通车列表
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
    if (this.data.adultNum || this.data.kidNum) {
      if (e.currentTarget.dataset.index != this.data.showIndex) {
        this.setData({
          showIndex: e.currentTarget.dataset.index,
          changeDisplay: 1
        })
      } else {
        this.setData({
          showIndex: 0,
          changeDisplay: 0
        })
      }
      this.setData({
        showPrice: true
      })
    }
  },
  //关闭遮罩层
  closeMask() {
    this.setData({
      showIndex: 0,
      changeDisplay: 0
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

  //点击去付款到达确认支付页面
  toPay() {
    let isClick = this.data.isClick
    if(isClick){
      this.setData({isClick:false})
      var { adultNum, kidNum, carsInfo, userName, tel, remarks, allPrice,timer } = this.data
      //选择车次的时间戳
      let timestamp = wx.getStorageSync('currentDate') + Number(carsInfo.start_time.split(':')[0])*60*60*1000+Number(carsInfo.start_time.split(':')[1])*60*1000
      //判断用户信息是否填写完整
      console.log(this.data.toLocation !== 'undefined' )
      // if (this.data.checked && this.data.userCarid !== '' && this.data.userName !== '' && this.data.tel !== '' && this.data.adultNum !== 0 && this.data.fromLocationInfo!==''&&  this.data.toLocationInfo !== '') {
      if (this.data.checked  && this.data.userName !== '' && (/^1[3456789]\d{9}$/.test(tel)) && this.data.adultNum !== 0 && this.data.fromLocationInfo!==''&&  this.data.toLocationInfo !== '') {
        wx.login({
          success: (res) => {
            if(res.code){
              console.log(this.data.through_train)
              //提交订单
              request({
                url:'/citytransport/order/submit',
                data:{
                  start_station_id:this.data.start_station_id,
                  end_station_id:this.data.end_station_id,
                  name:String(userName),
                  phone:String(tel),
                  remark:String(remarks),
                  adult_numbers:adultNum,
                  child_numbers:kidNum,
                  member_numbers:adultNum+kidNum,
                  total_price:allPrice,
                  car_id:carsInfo.car_id,
                  ticket_time:timestamp/1000,
                  start_point:this.data.fromLocation,
                  end_point:this.data.toLocation,
                  start_name:this.data.fromLocationInfo,
                  end_name:this.data.toLocationInfo,
                  member_coupon_id:this.data.couponInfo.id,
                  business_id:wx.getStorageSync('business_id'),
                  through_train:JSON.stringify(this.data.through_trainList)
                },
                method:'POST'
              }).then(res => {
                let data = res
                if(res.code === 200 && res.data){
                  clearInterval(this.data.settimeout)
                  if(res.data.order_status == 2){
                    wx.removeStorageSync('business_id')
                    wx.showModal({
                      content: '订单提交成功',
                      confirmText:'我知道了',
                      showCancel:false,
                      success:() => {
                        toast({
                          title:String(res.error)
                        })
                        wx.redirectTo({
                          url: '/pages/order/pages/',
                        })
                      }
                    })
                  }else{
                    wx.navigateTo({
                      url: '/pages/charteredBus/pages/newPay/index',
                      success: (res) => {
                        res.eventChannel.emit('userInfo', { carsInfo, adultNum, kidNum, timer, allPrice, userName, tel, order_id:data.data.order_id, order_sn:data.data.order_sn })
                      }
                    })
                    toast({
                      title:'下单成功'
                    })
                  }
                  wx.removeStorageSync('currentDate')
                  wx.removeStorageSync('toLocation')
                  wx.removeStorageSync('fromLocation')
                }else{
                  toast({
                    title:'下单失败，请稍后重试'
                  })
                }
              })
            }
          },
        })
      } else if (this.data.checked == false) {
        toast({ title: '请先勾选同意协议' })
      // } else if (this.data.userName == '' ||this.data.userCarid=="") {
      } else if (this.data.userName == '' ) {
        toast({ title: '请填写完整的个人信息' })
      } else if (this.data.tel == '') {
        toast({ title: '请填写电话' })
      } else if (this.data.adultNum == 0) {
        toast({ title: '请填写出行人数' })
      }else if(this.data.fromLocation == '' ){
        toast({ title: '请填写上车地点' })
      }else if(this.data.toLocation == ''){
        toast({ title: '请填写下车地点' })
      }else if(!(/^1[3456789]\d{9}$/.test(tel))){
        toast({ title: '请填写正确的电话' })
      }
      this.data.settimeout = setTimeout(() => {
        this.setData({isClick:true})
      },1000)
    }
   
  },

  //改签
  toRebook(){
    if (this.data.checked == true) {
      console.log(this.data)
      let timestamp = wx.getStorageSync('currentDate') + Number(this.data.carsInfo.start_time.split(':')[0])*60*60*1000+Number(this.data.carsInfo.start_time.split(':')[1])*60*1000
      request({
        url:'/citytransport/order/change-ticket',
        data:{
          order_sn:this.data.orderDetail.order_sn,
          ticket_time:timestamp/1000,
          car_id:this.data.carsInfo.car_id
        },
        method:'POST'
      }).then(res => {
        if(res.code === 200&&res.data){
          wx.removeStorageSync('currentDate')
          // wx.removeStorageSync('cityTo')
          // wx.removeStorageSync('cityFrom')
          wx.removeStorageSync('toLocation')
          wx.removeStorageSync('fromLocation')
          toast({
            icon:'none',
            title: '改签成功',
          })
          wx.switchTab({
            url: '/pages/order/pages/order/order',
            success:(res) =>{
              this.setData({
                orderDetail:''
              })
            }
          })
        }else{
          toast({
            icon:'none',
            title: '改签失败，请稍后重试',
          })
        }
      })
      
    }else{
      toast({ title: '请先勾选同意协议' })
    }

  },
  //成年人数变化
  addadultNum() {
    if(!this.data.isRead){
      if(this.data.adultNum+this.data.kidNum<this.data.carsInfo.rest_tickets){
        let adultNum = this.data.adultNum + 1 
        this.setData({ adultNum })
        this.getAllPrice()
      }else{
        toast({
          title:'余票仅剩'+ this.data.carsInfo.rest_tickets+'张'
        })
      } 
    }
  },
  upadultNum() {
    if(!this.data.isRead){
      if(this.data.adultNum > 0){
        let adultNum = this.data.adultNum - 1 
        let through_train = this.data.through_train.map(res => {
          if(res.num>adultNum+this.data.kidNum){
            res.num = adultNum+this.data.kidNum
          }
          return res
        })
        this.setData({ adultNum,through_train })
        this.getAllPrice()
      }
    }

  },

  //儿童数量变化
  addkidNum() {
    if(!this.data.isRead){
      if(this.data.adultNum+this.data.kidNum<this.data.carsInfo.rest_tickets){
        let kidNum = this.data.kidNum + 1 
        this.setData({ kidNum })
        this.getAllPrice()
      }else{
        toast({
          title:'余票仅剩'+ this.data.carsInfo.rest_tickets+'张'
        })
      } 
    }

  },
  upkidNum() {
    if(!this.data.isRead){
      if(this.data.kidNum > 0){
        let kidNum = this.data.kidNum - 1 
        let through_train = this.data.through_train.map(res => {
          if(res.num>kidNum+this.data.adultNum){
            res.num = kidNum+this.data.adultNum
          }
          return res
        })
        this.setData({ kidNum,through_train })
        this.getAllPrice()
      }
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
      if (!(/^1[3456789]\d{9}$/.test(tel))) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        })
        this.setData({ tel })
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
  //计算总金额
  getAllPrice() {
    if(!this.data.isRead){
      let trainPrice = 0
      let through_train = this.data.through_train
      let allPrice = this.data.allPrice
      let adultNum = this.data.adultNum
      let kidNum = this.data.kidNum
      let kidPrice = this.data.kidPrice
      let adultPrice = Number(this.data.adultPrice)
      console.log(this.data.couponInfo)
      if(this.data.couponInfo !== ''){
        this.setData({
          couponMoney:this.data.couponInfo.money
        })
      }
      if(through_train.length != []){
        through_train.forEach(res => {
          if(res.num >0){
            trainPrice += res.num*(res.price)
          }
        })
      }
      allPrice = ((adultNum * adultPrice+kidNum*kidPrice)-this.data.couponMoney).toFixed(2)
      if(this.data.isHero){
        allPrice = ((allPrice*100-res.data.money)/100).toFixed(2)
     }
     if(allPrice<0 && trainPrice == 0){
       allPrice = '0.00'
     }else if(trainPrice != 0 && allPrice<0){
       allPrice = (trainPrice/100).toFixed(2)
     }else if(trainPrice != 0 && allPrice>0){
       allPrice = ((allPrice*100+trainPrice)/100).toFixed(2)
     }
     this.setData({ allPrice})
    }
  },
  //防疫英雄认证
  isHero(){
    request({
      url:'/citytransport/order/compute',
      data:{
        ticket_time:(wx.getStorageSync('currentDate') + Number(this.data.carsInfo.start_time.split(':')[0])*60*60*1000+Number(this.data.carsInfo.start_time.split(':')[1])*60*1000)/1000,
        price:this.data.carsInfo.adult_price*100
      }
    }).then(res => {
      if(res.code == 200 && res.data.text == '防疫英雄免票'){
        this.setData({
          isHero:true
        })
      }
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
  //上车地点修改
  startLoc(){
    if(!this.data.isRead){
      let pages = getCurrentPages()
      if(pages.length-1>0){
        let prePage = pages[pages.length - 2];
        prePage.setData({
          isFrom:true,
          // isgetloc:true
        })
      }
      wx.navigateBack()
    }
  },

    //下车地点修改
    endLoc(){
      if(!this.data.isRead){
        let pages = getCurrentPages()
        if(pages.length-1>0){
          let prePage = pages[pages.length - 2];
          prePage.setData({
            isFrom:false,
            // isgetloc:true
          })
        }
        wx.navigateBack()
      }
    },
    //直通车详情
    goThrougthDetail(e){
      let train = e.currentTarget.dataset.item
      wx.navigateTo({
        url: '/pages/charteredBus/pages/throughTrainDetail/index?train='+JSON.stringify(train),
      })
    },

    //直通车票减
    upNum(e){
      let through_trainList = []
      if(!this.data.isRead){
        let train = e.currentTarget.dataset.item
        if(train.num > 0){
          train.num = train.num-1
          let through_train = this.data.through_train.map(res => {
            if(res.id == train.id){
              res.num = train.num
            }
            if(res.num > 0){
              through_trainList.push(res)
            }
            return res
          })
          console.log(through_trainList)
          this.setData({
            through_trainList,
            through_train
          })
          this.getAllPrice()
        }
      }
    },
    addNum(e){
      let through_trainList = []
      if(!this.data.isRead){
        let train = e.currentTarget.dataset.item
        if(train.num < this.data.kidNum+this.data.adultNum){
          train.num = train.num+1
          let through_train = this.data.through_train.map(res => {
            if(res.id == train.id){
              res.num = train.num
            }
            if(res.num > 0){
              through_trainList.push(res)
            }
            return res
          })
          this.setData({
            through_trainList,
            through_train
          })
          console.log(through_trainList)
          this.getAllPrice()
        }else{
          toast({
            title:'景区直通车票数不可超过总人数'
          })
        }
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取出发城市和目的城市的
    this.getHeight() // 获取页面高度
    //监听数据
      if(JSON.stringify(options) !== "{}"){
        console.log(JSON.parse(options.carsInfo))
        let through_train = JSON.parse(options.carsInfo).through_train
        through_train.forEach(res => {
          res['num'] = 0
        })
        this.setData({
          // allPrice:(1*JSON.parse(options.carsInfo).adult_price).toFixed(2),
          end_station_id:options.end_station,
          start_station_id:options.start_station,
          carsInfo: JSON.parse(options.carsInfo),
          adultPrice: JSON.parse(options.carsInfo).adult_price,
          kidPrice:(JSON.parse(options.carsInfo).child_price/100).toFixed(2),
          timer: options.timer.slice(0, 6),
          through_train:through_train
        })
        console.log(through_train)
     
        //改签数据
        if(options.orderDetail !== ''){
          console.log(JSON.parse(options.orderDetail))
          this.setData({
            orderDetail:JSON.parse(options.orderDetail),
            userName:JSON.parse(options.orderDetail).name,
            tel:JSON.parse(options.orderDetail).phone,
            adultNum:JSON.parse(options.orderDetail).adult_numbers,
            allPrice:JSON.parse(options.orderDetail).price_pay,
            fromLocationInfo:JSON.parse(options.orderDetail).start_name,
            toLocationInfo:JSON.parse(options.orderDetail).end_name,
            couponMoney:(JSON.parse(options.orderDetail).coupon_money/100),
            couponName:(JSON.parse(options.orderDetail).coupon_money/100)+'元代金券'
          })
        }else{
          console.log(1231212)
           //获取个人基本信息
           request({
            url:'/citytransport/me/get',
            method:'GET'
          }).then(res =>{
            if(res.code == 200){
              if(res.data.name !== ''){
                this.setData({userName:res.data.name,})
              }
              if(res.data.id_card_number != '未实名'){
                this.setData({userCarid:res.data.id_card_number})
              }
              if(res.data.phone != ''){
                this.setData({
                  tel:res.data.phone
                })
              }
            }
          })
          request({
            url:'/citytransport/order/compute',
            data:{
              ticket_time:(wx.getStorageSync('currentDate') + Number(this.data.carsInfo.start_time.split(':')[0])*60*60*1000+Number(this.data.carsInfo.start_time.split(':')[1])*60*1000)/1000,
              price:this.data.carsInfo.adult_price*100
            }
          }).then(res => {
            if(res.code == 200 && res.data.text == ''){
              request({
                url:'/citytransport/me/coupon',
                data:{
                  status:0,
                  route_id:this.data.carsInfo.route_id,
                  page:1,
                  page_size:500,
                },
                method:'POST'
              }).then(res => {
                if(res.code == 200 && res.data.ret.length>0){
                  let ret = res.data.ret
                  for(let i=0;i<ret.length-1;i++){
                    for(let j=0;j<ret.length-i-1;j++){
                      if(ret[j].money<ret[j+1].money){
                        let swap = ret[j]
                        ret[j] = ret[j+1]
                        ret[j+1]=swap
                      }
                    }
                  }
                  console.log(ret)
                  let couponList = []
                  ret.map((res) => {
                    if(ret[0].money == res.money){
                      couponList.push(res)
                    }
                  })
                  for(let i=0;i<couponList.length-1;i++){
                    for(let j=0;j<couponList.length-i-1;j++){
                      if(couponList[j].route_id>couponList[j+1].route_id){
                        let swap = couponList[j]
                        couponList[j] = couponList[j+1]
                        couponList[j+1]=swap
                      }
                    }
                  }
                  console.log(couponList)
                  couponList[0].money = (couponList[0].money/100).toFixed(2)
                  this.setData({
                    couponInfo:couponList[0],//优惠卷信息
                    couponName:couponList[0].money+'元优惠券',//优惠券名称
                    couponMoney:couponList[0].money,
                  })
                  this.isHero()
                  this.getAllPrice()
                }
              })
            }
          })
        }
      }
      if(this.data.orderDetail === ''){
        this.setData({isRead: false})
      }else{
        this.setData({isRead: true})
      }
  },


  callPhone(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.item,
      fail:(err) => {
        throw(err)
      }
    })
  },
  //优惠卷
  goCoupon(){
    if(this.data.orderDetail == ''){
      wx.navigateTo({
        url: '/pages/coupon/couponList/coupon?route_id='+this.data.carsInfo.route_id,
      })
    }
  },
  //

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync('toLocation')){
      this.setData({
        toLocationInfo:wx.getStorageSync('toLocation').toLocationInfo,
        toLocation:wx.getStorageSync('toLocation').toLocation,
      })
      console.log(wx.getStorageSync('toLocation'))
    }
    if(wx.getStorageSync('fromLocation')){
      this.setData({
        fromLocationInfo:wx.getStorageSync('fromLocation').fromLocationInfo,
        fromLocation:wx.getStorageSync('fromLocation').fromLocation
      })
    }
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