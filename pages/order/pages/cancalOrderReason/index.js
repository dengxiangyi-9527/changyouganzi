// pages/cjjs/cancalOrderReason/index.js
import {toast} from '../../../../utils/toast'
import {request} from '../../../../utils/request'
import { showModel } from '../../../../utils/showModel'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0, //屏幕的高度
    radio: '', //单选框选中的
    selected: false, //单选框是否选中
    isCancel:'',
    price:'',
    resoneData: [
      {
        id: 0,
        text: "行程有变，暂不需要用车"
      },
      {
        id: 1,
        text: "起点终点输入错误"
      },
      {
        id: 2,
        text: "选择了其他交通方式"
      },
      {
        id: 3,
        text: "其他平台价格更低"
      }
    ],
    type:''
  },


  // 获取屏幕的高度
  getWindowHeight() {
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
      selected: true
    });
  },

  onClick(event) {
    let {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
      selected: true
    });
  },

  //点击取消订单按钮，先判断是否选中了某一个理由，再跳转到订单详情页，订单退款中...
  goCancaling() {
    let radio = this.data.resoneData[this.data.radio].text
    let is_free = 0
    console.log(this.data.price)
    if(this.data.price == 0){
      is_free = 1
    }
    wx.showModal({
      content: '确定取消订单？',
      cancelText:'再想想',
      success:(res) => {
        if(res.confirm){
          console.log(this.data.type)
          if(this.data.type == 1){
            if(this.data.isCancel === 'cancel'){
              //取消订单
              if(this.data.radio !== ''){
                request({
                  url:'/citytransport/order/cancel',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio),
                    is_free
                  },
                  method:'POST'
                }).then(res => {
                  if(res.code === 200 && res.data){
                    toast({title:'取消订单成功'})
                    setTimeout(() => {
                      wx.switchTab({
                        url: '/pages/order/pages/order/order',
                      })
                    },1000)
                  }
                })
              }
            }else{
              let radio = this.data.resoneData[this.data.radio].text
              if (this.data.radio !== '' ) {
                //跳转到订单详情页，订单退款中...
                request({
                  url:'/payment/refund',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio)
                  },
                  method:'POST'
                }).then(res => {
                 if(res.code == 200){
                  toast({
                    title:'订单退款成功'
                  })
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/order/pages/order/order',
                    })
                  },1000)
                  }
                })
              }
            }
          }else if(this.data.type == 2){
            //四成快客取消订单
            request({
              url:'/quick/order/cancel',
              data:{
                reason:String(radio),
                order_sn:String(this.data.order_sn)
              },
              method:'POST'
            }).then(res => {
              if(res.code == 200 && res.data){
                toast({title:'取消订单成功'})
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/order/pages/order/order',
                  })
                },1000)
              }
            })
          }else if(this.data.type == 3){
              request({
                url:'/through-train/order/cancel',
                data:{
                  reason:String(radio),
                  order_sn:String(this.data.order_sn)
                },
                method:'POST'
              }).then(res => {
                if(res.code == 200 && res.data){
                  toast({title:'取消订单成功'})
                  setTimeout(() => {
                    wx.switchTab({
                      url: '/pages/order/pages/order/order',
                    })
                  },1000)
                }
              })
          }else if(this.data.type == 4){
            console.log(123)
            if(this.data.isCancel === 'cancel'){
              //取消订单
              if(this.data.radio !== ''){
                request({
                  url:'/scenic-area/order/cancel',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio),
                    is_free
                  },
                  method:'POST'
                }).then(res => {
                  if(res.code === 200 && res.data){
                    toast({title:'取消订单成功'})
                    setTimeout(() => {
                      wx.switchTab({
                        url: '/pages/order/pages/order/order',
                      })
                    },1000)
                  }
                })
              }
            }else{
              let radio = this.data.resoneData[this.data.radio].text
              if (this.data.radio !== '' ) {
                //跳转到订单详情页，订单退款中...
                request({
                  url:'/scenic-area/payment/refund',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio)
                  },
                  method:'POST'
                }).then(res => {
                 if(res.code == 200){
                  toast({
                    title:'订单退款成功'
                  })
                    setTimeout(() => {
                      wx.switchTab({
                        url: '/pages/order/pages/order/order',
                      })
                    },1000)
                  }
                })
              }
            }
          }else if(this.data.type == 5){
            console.log(123)
            if(this.data.isCancel === 'cancel'){
              //取消订单
              if(this.data.radio !== ''){
                request({
                  url:'/travel-around/order/cancel',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio),
                    is_free
                  },
                  method:'POST'
                }).then(res => {
                  if(res.code === 200 && res.data){
                    toast({title:'取消订单成功'})
                    setTimeout(() => {
                      wx.switchTab({
                        url: '/pages/order/pages/order/order',
                      })
                    },1000)
                  }
                })
              }
            }else{
              let radio = this.data.resoneData[this.data.radio].text
              if (this.data.radio !== '' ) {
                //跳转到订单详情页，订单退款中...
                request({
                  url:'/travel-around/order/refund',
                  data:{
                    order_sn:String(this.data.order_sn),
                    reason:String(radio)
                  },
                  method:'POST'
                }).then(res => {
                 if(res.code == 200){
                  toast({
                    title:'订单退款成功'
                  })
                    setTimeout(() => {
                      wx.switchTab({
                        url: '/pages/order/pages/order/order',
                      })
                    },1000)
                  }
                })
              }
            }
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({ 
      isCancel: options.data, 
      order_sn:JSON.parse(options.orderDetail).order_sn,
      // price:JSON.parse(options.orderDetail).price_pay||JSON.parse(options.orderDetail).price,
      type:options.type
    })
    console.log(this.data.type)
    this.getWindowHeight() //获取屏幕的高度
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})