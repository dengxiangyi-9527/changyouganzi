// pages/RideExpress/index.js
var amapFile = require('../../../utils/amap-wx');//如：..­/..­/libs/amap-wx.js
import { getTimers } from'../../../utils/getTimers'
import { request } from '../../../utils/request'
import { toast } from '../../../utils/toast'
import { showModel  } from '../../../utils/showModel'
import { getSetting } from '../../../utils/getSetting'
var QRCode = require('../../../utils/weapp-qrcode')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowLat:'30.5702',//当前维度
    nowLng:'104.06476',//当前精度
    markers: [{
      iconPath: "",
      id: 0,
      width:25,
      height:34,
      latitude: '',
      longitude: '',
    }],
    mapHeight:'',//地图高度
    points:[],//坐表数组
    scale:16,//地图缩放
    polyline:'',//线路
    ispersonBox:false,//选择人数弹出层
    istimeBox:false,//选择时间弹出层
    isdriveBox:false,//司机弹窗
    isUserInfo:false,//订单弹窗
    isorder:false,//订单页面
    ispay:false,//支付成功
    istell:false,//修改手机号
    paydetail:false,//费用明细
    isClickUnfineIcon:false,//不满意
    isClickfineIcon:false,//满意
    isAccess:false,//评价弹窗
    iscancelOrder:false,//订单取消
    markerShow:true,//定位点显示
    columns: [
      {
        values: [],
        className: 'column1',
      },
      {
        values: [],
        className: 'column2',
        defaultIndex: 0,
      },
      {
        values: [],
        className: 'column3',
        defaultIndex: 0,
      }
    ],
    personNumList:[
      {
        value:1,
        check:true
      },
      {
        value:2,
        check:false
      },
      {
        value:3,
        check:false
      },
      {
        value:4,
        check:false
      },
    ],
    driveSearList:[],//搜索司机列表
    driveList:[],
    timeint:'',//时间格式化
    time:'',//选择时间
    // searchName:'',//搜索司机的民字
    // driverName:'',//司机民字
    driveInfo:'',//司机信息
    personNum:'',//选择人数
    timecomfrim:'',//确定时间
    timestamps:'',//确定时间戳
    userName:'',//用户姓名
    userTel:'',//用户电话
    fromloc:'',//上车点
    toloc:'',//下车点
    nowPhone:'',//当前手机号
    accessList:[],//评价列表
    order_id:'',//订单ID
    order_sn:'',//订单号
    tempFilePath:'',//二维码
    status:'',//订单状态
    orderDetail:'',//订单详情
    accessBtn:true,//评价是否可点
    qr_code:'',//二维码
    type:'from',
    fromCityInfo:'',
    toCityInfo:''
  },


  //关闭弹窗
  onclose(){
    this.setData({
      ispersonBox:false,
      istimeBox:false,
      isdriveBox:false,
      isUserInfo:false,
      isorder:false,
      ispay:false,
      isAccess:false,
      iscancelOrder:false
    })
  },
  //关闭订单核实
  closeverify(){
    this.setData({
      markerShow:true,
      isorder:false,
      markers: [{
        iconPath: "",
        id: 0,
        width:25,
        height:34,
        latitude: '',
        longitude: '',
      }],
      points:'',
      polyline: [],
      toloc:''
    })
    this.Currentposition()
  },
  //关闭订单详情
  oncloseOrderDetail(){
    wx.navigateBack()
  },
  oncloseAccess(){
    this.setData({
      isAccess:false
    })
  },

  //选择人数弹窗
  chnageperson(){
    this.setData({
      ispersonBox:true
    })
  },
  //选择人数
  selectPersonNum(e){
    let value = e.currentTarget.dataset.item
    let personNumList = this.data.personNumList
    personNumList.map((res) => {
      res.check = false
      if(res.value == value){
        res.check = !res.check
        this.setData({personNum:res.value})
      }
    })
    this.setData({personNumList})
  },
  //确定人数
  confirmPerson(){
    let personNumList = this.data.personNumList
    personNumList.map(res => {
      if(res.check){
        this.setData({personNum:res.value,ispersonBox:false,})
      }
    })
  },


  //获取时间列表
  getDateList(){
    let timeARR=[]
    let timestamp = Date.parse(new Date())+10*60*1000;
    for(let i=0;i<2;i++){
      let time = new Date(new Date().toLocaleDateString()).getTime()
      time = time + i*24*60*60*1000
      timeARR.push( getTimers(time))
      let yuer = "columns[" + 0 + "].values"
      this.setData({
        [yuer]:timeARR,
      })
    }
    let hourList = []
      for(let i= new Date(timestamp).getHours();i<24;i++){
        if(i<10){
          i='0'+i
        }
        hourList.push(i+'时')
        let hour = "columns[" + 1 + "].values"
        this.setData({
          [hour]:hourList
        })
      }
    let minList = []
    for(let i=new Date(timestamp).getMinutes();i<60;i++){
      if(i<10){
        i='0'+i
      }
      minList.push(i+'分')
      let min = "columns[" + 2 + "].values"
      this.setData({
        [min]:minList
      })
    }
  },
  //时间转变
  timeChange(time,index){
    let hourList = []
    let minList = []
    let timestamp = Date.parse(new Date())+10*60*1000;
    if(index == 0){
      if(time[0].includes('明天')){
        time[1] = '00时'
        time[2] = '00分' 
        for(let i= 0;i<24;i++){
          if(i<10){
            i='0'+i
          }
          hourList.push(i+'时')
          let hour = "columns[" + 1 + "].values"
          this.setData({
            [hour]:hourList
          })
        }
        for(let i=0;i<60;i++){
          if(i<10){
            i='0'+i
          }
          minList.push(i+'分')
          let min = "columns[" + 2 + "].values"
          this.setData({
            [min]:minList
          })
        }
       }else if(time[0].includes('今天')){
        time[1] = new Date(timestamp).getHours()
        if(time[1]<10){
          time[1] = '0'+time[1]+'时'
        }else{
          time[1] = time[1]+'时'
        }
        time[2] = new Date(timestamp).getMinutes()
        if(time[2]<10){
          time[2] = '0'+time[2]+'分'
        }else{
          time[2] = time[2]+'分'
        }
        
        for(let i= new Date(timestamp).getHours();i<24;i++){
          if(i<10){
            i='0'+i
          }
          hourList.push(i+'时')
          let hour = "columns[" + 1 + "].values"
          this.setData({
            [hour]:hourList
          })
        }
        for(let i=new Date(timestamp).getMinutes();i<60;i++){
          if(i<10){
            i='0'+i
          }
          minList.push(i+'分')
          let min = "columns[" + 2 + "].values"
          this.setData({
            [min]:minList
          })
        }
       }
    }
    if(time[0].includes('今天')&&index == 1 && this.data.columns[1].values[0] !=time[1]){
      for(let i=0;i<60;i++){
        if(i<10){
          i='0'+i
        }
        minList.push(i+'分')
        let min = "columns[" + 2 + "].values"
        this.setData({
          [min]:minList
        })
      }
      time[2] = '00分'
      console.log(time)
      this.setData({
        time
      })
    }else if(time[0].includes('今天')&&index == 1 && this.data.columns[1].values[0] ==time[1]){
      for(let i=new Date(timestamp).getMinutes();i<60;i++){
        if(i<10){
          i='0'+i
        }
        minList.push(i+'分')
        let min = "columns[" + 2 + "].values"
        this.setData({
          [min]:minList
        })
      }
      time[2] = (new Date(timestamp).getMinutes()<10 ? '0'+new Date(timestamp).getMinutes()+'分' : new Date(timestamp).getMinutes()+'分')
      this.setData({
        time
      })
    }
  },
  //点击选择时间
  clickTime(){
    let time = [this.data.columns[0].values[0],this.data.columns[1].values[0],this.data.columns[2].values[0]]
    this.timeChange(time,0)
    this.setData({istimeBox:true,time})
    console.log(this.data.time)
  },
  //时间选择器变化
  timesChange(e){
    let {index} = e.detail;
    let time = e.detail.value
    console.log(time)
    if(index == 0){
      this.timeChange(time,index)
    }else if(index == 1){
      this.timeChange(time,index)
    }
     this.setData({time})
  },
  //时间确定
  comfirmTime(){
    let time = this.data.time
    console.log(time)
    let mounth = time[0].substring(5,7)
    let day = time[0].substring(8,10)
    let hour = time[1].substring(0,2)
    let min = time[2].substring(0,2)
    let timecomfrim = mounth + '/'+day+'/'+hour+':'+min
    let year = time[0].substring(0,4)
    console.log(hour)
    let timeint = year + '-' + mounth + '-'+day+' '+hour+':'+min
    let iphonetime = year+'/'+mounth+'/'+day+' '+hour+':'+min
    let timestamps = new Date(iphonetime).getTime() / 1000
    console.log(timestamps)
    this.setData({timecomfrim, istimeBox:false,timeint,timestamps})
  },
  //选择司机
  changedrives(){
    // this.setData({isdriveBox:true})
    wx.navigateTo({
      url: '/pages/RideExpress/selectDirver/indedx',
    })
  },
  //搜索司机
  searchName(e){
    let name = e.detail
    let driveSearList = []
    this.data.driveList.map(res => {
      if(res.name.includes(name)){
        driveSearList.push(res)
      }
    })
    this.setData({driveSearList,searchName:name})
  },
  //选择司机
  changeDrive(e){
    let id = e.currentTarget.dataset.item.id
    let list = []
    if(this.data.driveSearList.length > 0){
      list = this.data.driveSearList
      list.map(res => {
          res.check = false
          if(res.id == id){
            res.check = !res.check
          }
      })
      this.setData({driveSearList:list})
    }else if(this.data.driveSearList.length == 0){
      list = this.data.driveList
      list.map(res => {
          res.check = false
          if(res.id == id){
            res.check = !res.check
          }
      })
      this.setData({driveList:list})
    }
  },
  //地图拖动
  regionchange(e){
    if(this.data.markerShow){
      if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
        this.mapCtx = wx.createMapContext("map4select");
        this.mapCtx.getCenterLocation({
          type: 'gcj02',
          success:  (res) => {
            let map = wx.createMapContext('map4select')
            let myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
            myAmapFun.getRegeo({
             location:res.longitude+','+res.latitude,
              success:(res) => {
                if(res.length !== 0){
                  console.log(this.data.type)
                  if(this.data.type == 'from'){
                    let fromloc = {
                      adcode:res[0].regeocodeData.addressComponent.adcode,
                      address:res[0].name,
                      district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
                      location:res[0].longitude +','+res[0].latitude,
                      name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
                      id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
                      typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
                    }
                    this.setData({fromloc})
                  }else if(this.data.type == 'to'){
                    let toloc = {
                      adcode:res[0].regeocodeData.addressComponent.adcode,
                      address:res[0].name,
                      district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
                      location:res[0].longitude +','+res[0].latitude,
                      name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
                      id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
                      typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
                    }
                    this.setData({toloc})
                  }
                }
              }
            })
          },      
        })  
          
      }
    }
  },  
  //下单
  addUserInfo(){
    let { driveInfo, personNum, timestamps, fromloc, toloc} = this.data
    if(driveInfo == '' || personNum == '' || timestamps =='' || fromloc=='' || toloc == ''){
      toast({
        title:'请完善信息'
      })
    
    }else if(timestamps == 0 || isNaN(timestamps)){
      toast({
        title:'选择出行时间错误'
      })
    }else {
      this.setData({isUserInfo:true})
    }
    // let { driveInfo, personNum, timestamps, userName, fromloc, toloc, nowPhone} = this.data
    // if(driveInfo == '' || personNum == '' || timestamps =='' || fromloc=='' || toloc == ''){
    //   toast({
    //     title:'请填写完整的下单信息~'
    //   })
    // }else{
    //   request({
    //     url:'/quick/order/submit',
    //     data:{
    //      name:userName,
    //      phone:nowPhone,
    //      adult_numbers:personNum,
    //      member_numbers:personNum,
    //      start_name:fromloc.name,
    //      start_point:fromloc.location,
    //      end_point:toloc.location,
    //      end_name:toloc.name,
    //      car_id:driveInfo.car_id,
    //      driver_id:driveInfo.id,
    //      ticket_time:timestamps/1000
    //     },  
    //     method:'POST'
    //   }).then(res => {
    //     if(res.code == 200 && res.data.result){
    //       toast({
    //         title:res.data.msg
    //       })
    //       this.setData({isorder:true,order_id:res.data.result.order_id,order_sn:res.data.result.order_sn,markerShow:false})
    //       this.getline(this.data.fromloc.location,this.data.toloc.location)
    //     }
    //   })
    // }
  },
  //线路规划
  getline(fromLoc,toloc){
    let myAmapFun = new amapFile.AMapWX({key: 'a7b017fec1ec12bb889eca1a905f887b'});
    myAmapFun.getDrivingRoute({
      origin: fromLoc,
      destination: toloc,
      success: (data) => {
        var points = [];
        if(data.paths && data.paths[0] && data.paths[0].steps){
          var steps = data.paths[0].steps;
          for(var i = 0; i < steps.length; i++){
            var poLen = steps[i].polyline.split(';');
            for(var j = 0;j < poLen.length; j++){
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            } 
          }
          this.setData({
            points,
            polyline: [{
              points: points,
              color: "#0091ff",
              width: 6
            }],
            markers: [{
              iconPath: "https://static2.jd-gz.com/startMark.png",
              id: 1,
              width:25,
              height:30,
              latitude: this.data.fromloc.location.split(',')[1],
              longitude: this.data.fromloc.location.split(',')[0],
            },{
              iconPath: "https://static2.jd-gz.com/endMark.png",
              id: 2,
              width:25,
              height:30,
              latitude: this.data.toloc.location.split(',')[1],
              longitude: this.data.toloc.location.split(',')[0],
            }],
          });
        }
      }

    })
  },
  //用户名
  getuserName(e){
    let userName = e.detail.value
    this.setData({userName})
  },
  //用户电话
  getuserTel(e){
    let userTel = e.detail.value
    this.setData({nowPhone:userTel})
  },
  //去下单
  goOrder(){
  
    let { driveInfo, personNum, timestamps, userName, fromloc, toloc, nowPhone} = this.data
    console.log(driveInfo, personNum, timestamps, userName, fromloc, toloc, nowPhone)
    if(driveInfo == '' || personNum == '' || timestamps =='' || fromloc=='' || toloc == '' || (!(/^1[3456789]\d{9}$/.test(nowPhone))) ){
      toast({
        title:'请填写完整的下单信息~'
      })
    }else if(timestamps == 0 || isNaN(timestamps)){
      toast({
        title:'时间选择错误'
      })
    }else if(!(/^1[3456789]\d{9}$/.test(nowPhone))){
      toast({
        title:'请输入正确手机号'
      })
    }else{
      request({
        url:'/quick/order/submit',
        data:{
         name:userName,
         phone:nowPhone,
         adult_numbers:personNum,
         member_numbers:personNum,
         start_name:fromloc.name,
         start_point:fromloc.location,
         end_point:toloc.location,
         end_name:toloc.name,
         car_id:driveInfo.car_id,
         driver_id:driveInfo.id,
         ticket_time:timestamps
        },  
        method:'POST'
      }).then(res => {
        if(res.code == 200 && res.data.result){
          toast({
            title:res.data.msg
          })
          this.setData({isorder:true,order_id:res.data.result.order_id,order_sn:res.data.result.order_sn,markerShow:false})
          this.getline(this.data.fromloc.location,this.data.toloc.location)
        }
      })
    }
  },
  //订单支付
  topay(){
    let that = this
    wx.scanCode({
      success:(res) => {
        if(res.result !== ''){
          let order_id = res.result.split('&')[0].slice(3)
          let order_sn = res.result.split('&')[1].slice(9)
          request({
            url:'/quick/order/bind-user',
            data:{
              order_id,
              order_sn
            },
            method:'POST'
          }).then(res => {
            if(res.code == 200 && res.data){
              request({
                url:'/payment/pay',
                data:{
                  order_id:order_id,
                  order_sn:order_sn
                },
                method:'POST'
              }).then(res => {
                if(res.code == 200){
                  wx.login({
                    success:() => {
                      wx.requestPayment({
                        timeStamp:String(res.data.timeStamp),
                        nonceStr:String(res.data.nonceStr),
                        package:String(res.data.package),
                        signType:String(res.data.signType),
                        paySign:String(res.data.paySign),
                        success(res) {
                          wx.showToast({
                            title: '支付成功'
                          })
                          that.setData({
                            isorder:false,//订单页面
                            ispay:true,//支付成功
                          })
                          that.getDetail(order_id)
                          // setTimeout(() => {
                          //   that.getErWeiCode('qrcode')
                          // },1000)
                        },
                        fail(err){
                          toast({
                            title:'支付失败，请稍后重试'
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  //生成二维码
  getErWeiCode(canvas){
    wx.showLoading({
      title: '二维码生成中...',
    })
    request({
      url:'/citytransport/order/get-qrcode',
      data:{
        order_sn:this.data.order_sn,
        isLoading:false
      },
      isShowModel:true
    }).then(res => {
      if(res.code == 200){
        this.setData({order_id:res.data.order_id,qr_code:res.data.qr_code})
        let qrcode = new QRCode(canvas, {
                text: 'order_id='+this.data.order_id+'&qr_code='+this.data.qr_code ,
                width: 400,
                height: 400,
                correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                callback: (res) => {
              // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
                }
              })
          var context = wx.createCanvasContext(canvas);
          console.log(context)
          setTimeout(() => {
            console.log(1321233)
            context.draw(false,wx.canvasToTempFilePath({
              canvasId: canvas,
              success:  (res) => {
                var tempFilePath = res.tempFilePath;
                this.setData({
                   tempFilePath,
                });
                wx.hideLoading()
                console.log(tempFilePath)
              },
            }))
          },1000)
      }
    })
  },
  //获取用户信息
  getuserInfo(){
    request({
      url:'/citytransport/me/get',
      data:{
        isLoading:false
      },
      method:'GET'
    }).then(res => {
      if(res.code == 200){
        this.setData({
          userTel:res.data.phone,
          nowPhone:res.data.phone,
          userName:res.data.name
        })
      }
    })
  },
  //修改手机号
  Modifytell(){
    if(this.data.nowPhone == ''){
      this.getuserInfo()
    }
    this.setData({
      istell:true,
      isorder:false
    })
  },
  //关闭修改手机号页面
  closetell(){
    this.setData({
      istell:false,
      isorder:true
    })
  },
  //查看费用明细
  gopaydetail(){
    this.setData({
      paydetail:true
    })
  },
  //g关闭费用明细
  closedetail(){
    this.setData({
      paydetail:false
    })
  },
  //上车地点
  fromloc(){
    this.setData({
      type:'from'
    })
    wx.navigateTo({
      url: '/pages/RideExpress/selctCity/index?id=from'+'&nowCity='+JSON.stringify(this.data.fromCityInfo),
    })
  },
  //下车地点
  toloc(){
    this.setData({
      type:'to'
    })
    wx.navigateTo({
      url: '/pages/RideExpress/selctCity/index?id=to'+'&nowCity='+JSON.stringify(this.data.toCityInfo),
    })
  },
  //当前定位
  Currentposition(){
    var myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
    //获取当前定位
    myAmapFun.getRegeo({
      success: (res) => {
        //成功回调
        if(this.data.type == 'from'){
          let fromloc = {
            adcode:res[0].regeocodeData.addressComponent.adcode,
            address:res[0].name,
            district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
            location:res[0].longitude +','+res[0].latitude,
            name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
            id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
            typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
          }
          this.setData({
            nowLng:res[0].longitude,
            nowLat:res[0].latitude,
            // markers,
            polyline:[],
            fromloc
          })
        }else{
          let toloc = {
            adcode:res[0].regeocodeData.addressComponent.adcode,
            address:res[0].name,
            district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
            location:res[0].longitude +','+res[0].latitude,
            name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
            id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
            typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
          }
          this.setData({
            nowLng:res[0].longitude,
            nowLat:res[0].latitude,
            // markers,
            polyline:[],
            toloc
          })
        }
      },
      fail: function(info){
        //失败回调
        toast({
          title:'定位失败，稍后重试'
        })
      }
    })
  },
  //
  getposition(lng,lat){
    var myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
    //获取当前定位
    myAmapFun.getRegeo({
      location:lng+','+lat,
      success: (res) => {
        //成功回调
        if(this.data.type == 'from'){
          // let fromloc = {
          //   adcode:res[0].regeocodeData.addressComponent.adcode,
          //   address:res[0].name,
          //   district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
          //   location:res[0].longitude +','+res[0].latitude,
          //   name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
          //   id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
          //   typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
          // }
          this.setData({
            nowLng:res[0].longitude,
            nowLat:res[0].latitude,
            polyline:[],
            // fromloc
          })
        }else if(this.data.type == 'to'){
          // let toloc = {
          //   adcode:res[0].regeocodeData.addressComponent.adcode,
          //   address:res[0].name,
          //   district:res[0].regeocodeData.addressComponent.province+res[0].regeocodeData.addressComponent.city+res[0].regeocodeData.addressComponent.district,
          //   location:res[0].longitude +','+res[0].latitude,
          //   name:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].name : res[0].name),
          //   id:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].id : ''),
          //   typecode:(res[0].regeocodeData.aois.length>0 ? res[0].regeocodeData.aois[0].type : ''),
          // }
          this.setData({
            nowLng:res[0].longitude,
            nowLat:res[0].latitude,
            polyline:[],
            // toloc
          })
        }
      },
      fail: function(info){
        //失败回调
        toast({
          title:'定位失败，稍后重试'
        })
      }
    })
  },
  //评价
  goAccess(){
    this.setData({
      isAccess:true
    })
  },
  //点击不满意
  unSatisfied(){
    if(this.data.accessBtn){
      request({
        url:'/public/get-evaluate-label',
        data:{
          is_satisfy:0,
        },
        method:'GET'
      }).then(res => {
        if(res.code == 200 && res.data.length != 0){
          res.data.map(res => {
            res['check'] = false
          })
          this.setData({
            accessList:res.data
          })
        }
      })
      this.setData({
        isClickUnfineIcon:true,
        isClickfineIcon:false
      })
    }
  },
  //点击满意
  satisfied(){
    if(this.data.accessBtn){
      request({
        url:'/public/get-evaluate-label',
        data:{
          is_satisfy:1,
        },
        method:'GET'
      }).then(res => {
        if(res.code == 200 && res.data.length != 0){
          res.data.map(res => {
            res['check'] = false
          })
          this.setData({
            accessList:res.data
          })
        }
      })
      this.setData({
        isClickUnfineIcon:false,
        isClickfineIcon:true
      })
    }

  },
  //选择评价内容
  chooseAccess(e){
    if(this.data.accessBtn){
      let item = e.currentTarget.dataset.item
      let accessList = this.data.accessList.map(res => {
        if(res.id == item.id){
          res.check = !res.check
        }
        return res
      })
      this.setData({
        accessList
      })
    }
  },
  //提交评价
  submitAccess(){
    let is_satisfy = ''//满意不满意
    let label_id = ''
    if(this.data.isClickUnfineIcon){
      is_satisfy = 0
    }else{
      is_satisfy = 1
    }
    this.data.accessList.map(res => {
      if(res.check){
        label_id += ','+String(res.id)
      }
    })
    label_id = label_id.substring(1,8)
    request({
      url:'/quick/order/evaluate',
      method:'POST',
      data:{
        is_anony:1,
        is_satisfy,
        order_id:this.data.order_id,
        label_id
      }
    }).then(res => {
      toast({
        title:'感谢您的评价!'
      })
      this.setData({
        isAccess:false
      })
      this.getDetail(this.data.order_id)
    })
  },
  //查看评价
  lookAccess(){
    request({
      url:'/quick/order/get-evaluate',
      data:{
        order_id:this.data.order_id
      }
    }).then(res => {
      if(res.code == 200 ){
        let {is_satisfy,label_id} = res.data
        request({
          url:'/public/get-evaluate-label',
          data:{
            is_satisfy,
          }
        }).then(res => {
          if(res.code == 200 && res.data.length >0){
            res.data.map(res => {
              if(label_id.includes(String(res.id))){
                res['check'] = true
              }else{
                res['check'] = false
              }
            })
            if(is_satisfy == 1){
              this.setData({
                isClickUnfineIcon:false,//不满意
                isClickfineIcon:true,//满意
              })
            }else{
              this.setData({
                isClickUnfineIcon:true,//不满意
                isClickfineIcon:false,//满意
              })
            }
            this.setData({
              accessList:res.data,
              isAccess:true,
              accessBtn:false
            })
          }
        })
      }
    })
  },
  //取消订单
  cancelOrder(){
    let orderDetail = {
      order_sn:this.data.order_sn
    }
    wx.navigateTo({
      url: '/pages/order/pages/cancalOrderReason/index?orderDetail='+JSON.stringify(orderDetail)+'&type='+2
    })
  },
  //修改手机号
  changeTel(){
    if(this.data.userTel !== ''){
      if(Number(this.data.nowPhone) !== Number(this.data.userTel)){
        if ((/^1[3456789]\d{9}$/.test(this.data.userTel))) {
          request({
            url:'/quick/order/change-phone',
            data:{
              id:this.data.order_id,
              phone:this.data.userTel
            },
            method:'GET'
          }).then(res => {
            if(res.code == 200&&res.data){
              toast({
                title:'修改手机号成功~'
              })
              this.setData({
                istell:false,
                nowPhone:this.data.userTel
              })
            }
          })
        }else{
          toast({
            title:'请输入正确手机号~'
          })
        }
      }else{
        toast({
          title:'修改手机号与当前手机号相同'
        })
      }
    }else{
      toast({
        title:'请填写手机号~'
      })
    }
  },
  //获取订单详情
  getDetail(id){
    request({
      url:'/quick/order/detail',
      method:'GET',
      data:{
        id:id,
        isLoading:false
      }
    }).then(res => {
      if(res.code==200&&res.data){
        this.getline(res.data.start_point,res.data.end_point)
        let driveInfo = {
          name:res.data.driver_name,
          car:{
            brand:res.data.car_brand,
            car_model:res.data.car_name
          },
          star:(res.data.driver_star/10).toFixed(1),
          id:res.data.driver_id,
          selfie_img:res.data.selfie_img
        }
        let fromloc = {
          name:res.data.start_name,
          location:res.data.start_point
        }
        let toloc = {
          name:res.data.end_name,
          location:res.data.end_point
        }
        let timeint = res.data.ticket_time*1000
        let time = new Date(timeint)
        let year = time.getFullYear()
        let mounth = time.getMonth()+1
        let day = time.getDate()
        let hour = time.getHours()
        let min = time.getMinutes()
        let sec = time.getSeconds()
        timeint = year +'-'+ (mounth<10 ? '0'+mounth : mounth) +'-'+(day<10 ? '0'+day : day)+' '+ (hour<10 ? '0'+hour : hour) +':'+ (min<10 ? '0'+min : min) +':'+ (sec<10 ? '0'+sec : sec)
        let orderDetail = res.data
        orderDetail.price_pay = ( orderDetail.price_pay/100).toFixed(2)
        this.setData({
          orderDetail,
          order_sn:res.data.order_sn,
          personNum:res.data.adult_numbers,//选择人数
          driveInfo,
          fromloc,
          toloc,
          timeint,
          order_id:res.data.id,
          status:res.data.status
        })
        if(res.data.status == 0 || res.data.status == 1){
          this.setData({ isorder:true, })
        }else if(res.data.status == 2 || res.data.status == 9 || res.data.status == 11 || res.data.status == 5){
          this.setData({ispay:true})  
        }else if( res.data.status == 8){
          this.setData({iscancelOrder:true})
        }
        if(res.data.status == 2){
          setTimeout(() => {
            this.getErWeiCode('qrcode')
          },1000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取订单详情
    if(options.id){
      this.getDetail(options.id)
      this.setData({markerShow:false})
      // wx.showLoading({
      //   title: '数据加载中。。。',
      //   mask: true,
      // })
    }else{
      // getSetting(this.Currentposition,'scope.userLocation')
      // this.Currentposition()//当前定位
    }
    this.getDateList()//获取时间列表
    this.getuserInfo()//获取用户信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.createSelectorQuery().in(this).select('#meat').boundingClientRect(rect => {
    let app = getApp()
    let phoneHeight = app.globalData.phoneHeight
    let mapHeight = (1-(rect.height/phoneHeight))*100+'%'
    this.setData({
      mapHeight
    })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    if(this.data.markerShow){
      if(this.data.type == 'from'){
        console.log(this.data.fromCityInfo)
        console.log(this.data.fromloc)
        if(this.data.fromCityInfo == '' && this.data.fromloc == ''){
          getSetting(this.Currentposition,'scope.userLocation')
        }else if(this.data.fromCityInfo !== '' && this.data.fromloc == ''){
          this.getposition(this.data.fromCityInfo.center.split(',')[0],this.data.fromCityInfo.center.split(',')[1])
        }else if(this.data.fromCityInfo == '' && this.data.fromloc !== ''){
          this.getposition(this.data.fromloc.location.split(',')[0],this.data.fromloc.location.split(',')[1])
        }else if(this.data.fromCityInfo !== '' && this.data.fromloc !== ''){
          this.getposition(this.data.fromloc.location.split(',')[0],this.data.fromloc.location.split(',')[1])
        }
      }else if(this.data.type == 'to'){
        console.log(this.data.toCityInfo)
        console.log(this.data.toloc)
        if(this.data.toCityInfo == '' && this.data.toloc == ''){
          console.log(111)
          getSetting(this.Currentposition,'scope.userLocation')
        }else if(this.data.toCityInfo !== '' && this.data.toloc == ''){
          console.log(222)
          this.getposition(this.data.toCityInfo.center.split(',')[0],this.data.toCityInfo.center.split(',')[1])
        }else if(this.data.toCityInfo == '' && this.data.toloc !== ''){
          console.log(333)
          this.getposition(this.data.toloc.location.split(',')[0],this.data.toloc.location.split(',')[1])
        }else if(this.data.toCityInfo !== '' && this.data.toloc !== ''){
          this.getposition(this.data.toloc.location.split(',')[0],this.data.toloc.location.split(',')[1])
        }
      }
    }
    // if(this.data.fromloc !== '' && this.data.toloc !== ''){
    //   this.getline(this.data.fromloc.location,this.data.toloc.location)
    //   this.setData({markerShow:false})
    // }else if(this.data.fromloc !== '' && this.data.toloc == ''){
    //   console.log(this.data.fromloc)
    //   let loc = this.data.fromloc.location
    //   this.setData({
    //     nowLat:loc.split(',')[1],
    //     nowLng:loc.split(',')[0],
    //   })
    // }
    // setTimeout(() => {
    //   this.getErWeiCode('qrcode')
    // },1500)
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