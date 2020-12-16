// pages/ticket/ticket.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import { request } from '../../utils/request'
import { showModel } from '../../utils/showModel'
import { getTimers } from '../../utils/getTimers'
var QRCode = require('../../utils/weapp-qrcode')
Page({
  onShareAppMessage() {
    return {
      title: 'swiper',
      path: 'page/component/pages/swiper/swiper',
      codeImg:{}
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    page: 2,
    iscode:false,
    tempFilePath:'',
    phoneHeight:'',
    indicatorDots: true,
    background: [], //轮播的数据
    showCancelBtnPopup: false, //控制取消订单按钮的遮罩层
    order_id:'',
    qr_code:'',
    num:0,
    order_sn:"",//当前的订单号
    startX : '',//按下位置
    moveX:'',//移动位置
    ani2:'',//动画
    tranX:0,//轮播移动
    phoneWidth:'',
    moveY:'',
    startY:'',
    maskHeight:'',//表示点高度
    cercleOne:'',//半圆高度
    cercleTwo:'',//半圆高度
    cercleThree:'',//半圆高度
    cercleFour:''//半圆高度
  },
  showPopup() {
    this.setData({ showCancelBtnPopup: true });
  },
  onClose() {
    this.setData({ showCancelBtnPopup: false });
  },
  swiperChange(event){
    this.setData({order_sn:this.data.background[this.data.num].order_sn,})
    this.getErWeiCode(this.data.background[this.data.num].id)
  },
  //取消订单
  toDel(e){
    console.log(e)
    let nowOrder = e.currentTarget.dataset.item
    showModel({
      title: '取消订单',
      content: '当前时段可以取消订单',
      cancelText:'我再想想',
      cancelColor:'#000000',
      confirmText:'继续取消',
      confirmColor:'#18AFFF',
      url:'/pages/order/pages/cancalOrderReason/index?orderDetail='+JSON.stringify(nowOrder)+'&type=4',
    })
  },
  //获取二维码
  //  makeCode (canvas) {
  //       let qrcode = new QRCode(canvas, {
  //         text: 'order_id='+this.data.order_id+'&qr_code='+this.data.qr_code ,
  //         width: 120,
  //         height: 120,
  //         correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
  //         callback: (res) => {
  //       // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
  //         }
  //       })
  //     },

    //生成二维码
    getErWeiCode(canvas){
      let order_id = ''
      let qr_code = ''
      this.data.background.forEach(res => {
        if(res.id == canvas){
          this.setData({
            order_id:res.id,
            qr_code:res.qr_code
          })
        }
      })
      let qrcode = new QRCode(canvas, {
              text: 'order_id='+this.data.order_id+'&qr_code='+this.data.qr_code ,
              width: 500,
              height: 500,
              correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
              callback: (res) => {
            // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
              }
            })
        var context = wx.createCanvasContext(canvas);
        setTimeout(() => {
          context.draw(false,wx.canvasToTempFilePath({
            canvasId: canvas,
            success:  (res) => {
              var tempFilePath = res.tempFilePath;
              this.setData({
                 tempFilePath,
              });
            },
          }))
        },500)
    },
    getTicket(){
      request({
        url:"/citytransport/order/get-ticket",
        isLoading:false
      }).then(res => {
        let newList = []
        if(res.code === 200){
          res.data.forEach(res => {
              newList.push(res)
          })
          if(newList.length > 0){
            newList.map(res => {
              if(res.type == 2){
                  res['date'] = getTimers(res.ticket_time*1000)
              }
              res.date = res.date.slice(0,10)
            })
            this.setData({background:newList,order_sn:newList[0].order_sn})
            this.getHeight('meat'+this.data.background[0].id)
            this.getErWeiCode(this.data.background[0].id)
          }
        }
      })
    },
    startLoc(event){
      let longitude = Number(event.currentTarget.dataset.item.start_point.split(',')[0])
      let latitude = Number(event.currentTarget.dataset.item.start_point.split(',')[1])
      wx.openLocation({
        longitude,
        latitude
      })
    },
    endLoc(event){
      let longitude = Number(event.currentTarget.dataset.item.end_point.split(',')[0])
      let latitude = Number(event.currentTarget.dataset.item.end_point.split(',')[1])
      wx.openLocation({
        longitude,
        latitude
      })
    },


    //按下
    touchStart(e){
      this.setData({
        startX:e.touches[0].pageX,
        startY:e.touches[0].pageY
      })
    },
    //移动
    touchMove(e){
      this.setData({
        moveX:e.touches[0].pageX,
        moveY:e.touches[0].pageY
      })
    },
    //结束
    touchEnd(e){
      let num = this.data.num
      let lenY = this.data.moveY-this.data.startY
      console.log(lenY)
        if(this.data.startX - this.data.moveX>50&&(lenY<50&&lenY>-50)){
          if(num < this.data.background.length - 1){
            num = num +1
          this.setData({num,order_sn:this.data.background[num].order_sn})
          this.moveLeft()
          this.swiperChange()
          this.getHeight('meat'+this.data.background[num].id)
          }
        }else if(this.data.startX-this.data.moveX< 0&&lenY<50&&lenY>-50 ){
          if(num > 0){
            num = num -1
            this.setData({num,order_sn:this.data.background[num].order_sn})
            this.moveRight()
            this.swiperChange()
            this.getHeight('meat'+this.data.background[num].id)
          }
        }
    },
    moveLeft(){
        let tranX = this.data.tranX-this.data.phoneWidth
        var animation = wx.createAnimation({
          duration:500,
          timingFunction:'ease',
          delay: 100,
        })
        animation.translate(tranX,0).step()
        this.setData({
          ani2: animation.export(),
          tranX
        })
    },
    moveRight(){
      let tranX = this.data.tranX+this.data.phoneWidth
        var animation = wx.createAnimation({
          duration:500,
          timingFunction:'ease',
          delay: 100,
        })
        animation.translate(tranX,0).step()
        this.setData({
          ani2: animation.export(),
          tranX
        })
    },
    //购票
    // goticket(){
    //   wx.navigateTo({
    //     url: '/pages/charteredBus/pages/index/index',
    //   })
    // },
    //计算main元素高度
    getHeight(id){
      setTimeout(() => {
        wx.createSelectorQuery().select('#'+id).boundingClientRect((rect) => {
          console.log(id)
          let height = rect.height+94
          let cercleOne = 107/rect.height*100+'%'
          let cercleTwo = 321/rect.height*100+'%'
          let cercleThree  = 379/rect.height*100+'%'
          let cercleFour = 463/rect.height*100+'%'
          console.log(cercleOne,cercleTwo,cercleThree,cercleFour)
          this.setData({
            maskHeight:height,
            cercleOne,
            cercleTwo,
            cercleThree,
            cercleFour
          })
        }).exec()
      },500)
    },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
    this.setData({
      phoneHeight:app.globalData.phoneHeight,
      phoneWidth:app.globalData.phoneWidth
    })
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
    console.log('乘车票页面启动')
    const app = getApp()
    this.setData({
      background:'',
      order_sn:'',
      phoneHeight:app.globalData.phoneHeight,
      phoneWidth:app.globalData.phoneWidth
    })
    this.getTicket()
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
    this.getTicket()
    console.log(this.data.iscode)
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



})