import {
  toast
} from "../../../../utils/toast.js"
import { request } from '../../../../utils/request'
import { showModel } from '../../../../utils/showModel'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    assesBtn: true, //评价按钮和查看评价的切换
    readAssessBtn: false, //查看评价按钮
    showAsses: false, // 点击评价按钮弹出评价的弹出层
    pjDetail: "none", //评价具体内容的显示与不显示
    pjPopup: 326, //弹出框默认高度
    assesText: "评价", //评价按钮的文字，如果评价已完成，会更改成查看评价
    footText: "您的评价会让司机做的更好", //foot的文字
    isClickIcon: false, //是否点击了满意或者不满意的图标，用来控制foot字体颜色
    isClickUnfineIcon: false, //是否点击了不满意的图标，用来控制图标样式
    isClickfineIcon: false, //是否点击了满意的图标，用来控制图标样式
    asserData: [], // 评价详细信息
    assesUnfineData: [], //不满意的信息
    assesFineData: [], //满意的信息
    assesCompleted: false, //评价已完成的标志
    tjBtn: 'block', //匿名提交按钮的显示隐藏
    checkValue: [],//
    orderDetail:'',//详情信息
    tel:"",//电话
    time:'',//时间
    isSatisfied:1,//是否满意标志
    label_id:'',//评价ID
    type:'',
    url:'',
    order_id:'',
    order_sn:''
  },

  // 点击评价按钮,从底部弹出一个弹框
  toAssess() {
    this.setData({
      showAsses: true
    });
  },
  onAssesClose() {
    this.setData({
      showAsses: false
    });
  },

  // 点击弹框里面的满意和不满意
  clickAsser(event) {
    if(this.data.readAssessBtn === true){
      return
    }else{
      this.setData({
        pjDetail: "block",
        isClickIcon: true
      })
      const flag = event.currentTarget.dataset.flag
      if (flag === "unfine") {
        this.setData({isSatisfied:0})
        //点击的是不满意
        request({
          url:'/public/get-evaluate-label',
          data:{
            is_satisfy:0,
          },
          method:'GET'
        }).then(res =>{
          if(res.code === 200){
            res.data.forEach((data) => {
              data['checked'] = false
            })
            this.setData({assesUnfineData:res.data})
            const assesUnLength = this.data.assesUnfineData.length
            const pjPopupH = (Math.ceil(assesUnLength/2)) * 60 + 362 + 198
            // console.log(pjPopupH)
            this.setData({
              footText: "非常不满意，各方面都很差",
              isClickUnfineIcon: true,
              isClickfineIcon: false,
              asserData: this.data.assesUnfineData,
              pjPopup: pjPopupH,
              is_anony:0
            })
          }
        })
      } else {
        this.setData({isSatisfied:1})
        request({
          url:'/public/get-evaluate-label',
          data:{
            is_satisfy:1,
          },
          method:'GET'
        }).then(res =>{
          if(res.code === 200){
            res.data.forEach((data) => {
              data['checked'] = false
            })
            this.setData({assesFineData:res.data})
            const assesLength = this.data.assesFineData.length
            const pjPopupHe = (Math.ceil(assesLength/2)) * 60 + 362 + 198
            this.setData({
              footText: "非常满意，各方面都很棒",
              isClickfineIcon: true,
              isClickUnfineIcon: false,
              asserData: this.data.assesFineData,
              pjPopup: pjPopupHe,
              is_anony:1
            })
          }
        })
      }
    }
  },


  //匿名提交,带上所选评价的下标,评价弹窗消失显示一个toast
  assesTj(event) {
    let url =''
    if(this.data.type == 1){
       url = '/citytransport/order/evaluate'
    }else if(this.data.type == 2){
      url = '/through-train/evaluate'
    }else if(this.data.type == 3){
      url = '/scenic-area/evaluate'
    }
    wx.setStorageSync('isAccesss', true)
    this.onAssesClose()
    request({
      url,
      data:{
        order_id:this.data.orderDetail.id,
        label_id:this.data.label_id,
        is_anony:1,
        is_satisfy:this.data.isSatisfied
      },
      method:'POST'
    }).then(res => {
      console.log(res)
      if(res.code === 200){
        toast({
          title: "感谢你的评价~"
        })
        this.setData({
          assesText: "查看评价",
          assesCompleted: true,
          assesBtn: false,
          readAssessBtn: true
        })
      }
    })
  },
    // 点击退款按钮，跳转弹出一个弹窗，
    refund(e) {
      let orderDetail = {
        order_sn:this.data.orderDetail.order_sn
      }
      if(e.currentTarget.dataset.type==1){
        let ticket_time = this.data.orderDetail.ticket_time
        let nowTime = Date.parse(new Date())/1000
        if(nowTime>ticket_time-2*60*60){
          wx.showModal({
            title: '取消订单',
            content: '当前订单已超出退款时间',
            showCancel:false,
            confirmText:'我知道了',
            confirmColor:'#18AFFF',
          })
        }else{
          showModel({
            title: '取消订单',
            content: '发车8小时之前可以免费取消,2到8小时之间需收取订单金额5%的手续费',
            cancelText:'我再想想',
            cancelColor:'#000000',
            confirmText:'继续取消',
            confirmColor:'#18AFFF',
            url:'/pages/order/pages/cancalOrderReason/index?orderDetail='+JSON.stringify(orderDetail)+'&type='+1,
          })
        }
      }else if(e.currentTarget.dataset.type==4){
        showModel({
          title: '取消订单',
          content: '您确定取消订单并退款',
          cancelText:'我再想想',
          cancelColor:'#000000',
          confirmText:'继续取消',
          confirmColor:'#18AFFF',
          url:'/pages/order/pages/cancalOrderReason/index?orderDetail='+JSON.stringify(orderDetail)+'&type=4',
        })
      }else if(e.currentTarget.dataset.type==5){
        showModel({
          title: '取消订单',
          content: '您确定取消订单并退款',
          cancelText:'我再想想',
          cancelColor:'#000000',
          confirmText:'继续取消',
          confirmColor:'#18AFFF',
          url:'/pages/order/pages/cancalOrderReason/index?orderDetail='+JSON.stringify(orderDetail)+'&type=5',
        })
      }
    },
    // 点击取消订单，跳转弹出一个弹窗，
    cancelOrder(event) {
      console.log(this.data.orderDetail.order_sn)
      let type = ''
      if(this.data.type == 1){
        type=1
      }else if(this.data.type == 2){
        type = 3
      }else if(this.data.type == 3){
        type = 4
      }else if(this.data.type == 4){
        type = 5
      }
      let orderDetail = {
        order_sn:this.data.orderDetail.order_sn
      }
      console.log(type)
      showModel({
        title: '取消订单',
        content: '确定取消订单',
        cancelText:'我再想想',
        cancelColor:'#000000',
        confirmText:'继续取消',
        confirmColor:'#18AFFF',
        url:'/pages/order/pages/cancalOrderReason/index?data='+event.currentTarget.dataset.item + '&orderDetail='+ JSON.stringify(orderDetail)+'&type='+type,
      })
    },
      //点击改签
      reBook(){
        showModel({
          title:"提示",
          content: '仅能修改一次且只能修改当天车次，请三思而后行',
          confirmColor:'#18AFFF',
          cancelColor:'#000000', 
          url: '/pages/charteredBus/pages/selectFlight/index?orderDetail='+JSON.stringify(this.data.orderDetail),
        })
      },
      //点击支付
      toPay(){
        console.log(this.data.type)
        if(this.data.type == 1){
          wx.navigateTo({
            url: '/pages/charteredBus/pages/newPay/index',
            success: (res) => {
              res.eventChannel.emit('orderDetail',{
                orderDetail:this.data.orderDetail
              })
            }
          })
        }else if(this.data.type == 2){
          wx.redirectTo({
            url: '/pages/throughTrain/pages/pay/index?order_id='+this.data.order_id,
          })
        }else if(this.data.type == 3){
          wx.redirectTo({
            url: '/pages/codeBus/pages/pay/index?order_id='+this.data.order_id,
          })
        }else if(this.data.type == 4){
          wx.redirectTo({
            url: '/pages/peripheralTourism/pages/pay/index?order_sn='+this.data.order_sn,
          })
        }
      },
  //查看评价按钮
  readAssess() {
    let url = ''
    if(this.data.type == 1){
      url = '/citytransport/order/evaluate'
   }else if(this.data.type == 2){
     url = '/through-train/get-evaluate'
   }else if(this.data.type == 3){
     url = '/scenic-area/get-evaluate'
   }
    request({
      url,
      data:{
        order_id:this.data.orderDetail.id
      },
      method:'POST'
    }).then(res => {
      if(res.code == 200){
        let list = res.data
        let is_satisfy = res.data.is_satisfy
          request({
            url:'/public/get-evaluate-label',
            data:{
              is_satisfy
            }
          }).then(data => {
            if(data.code == 200){
              data.data.forEach(res => {
                if(list.label_id.includes(String(res.id))){
                  res['checked'] = true
                }else{
                  res['checked'] = false
                }
              })
              this.setData({assesFineData:data.data})
              const assesLength = this.data.assesFineData.length
              const pjPopupHe = assesLength / 2 * 60 + 362 + 166
              if(is_satisfy){
                this.setData({
                  isClickfineIcon: true,
                  isClickUnfineIcon: false,
                  asserData: data.data,
                  showAsses: true,
                  tjBtn: 'none',
                  pjDetail:'block',
                  readAssessBtn:true,
                  pjPopup: pjPopupHe,
                  footText: "非常满意，各方面都很棒",
                })
              }else{
                this.setData({
                  isClickfineIcon: false,
                  isClickUnfineIcon: true,
                  asserData: data.data,
                  showAsses: true,
                  tjBtn: 'none',
                  pjDetail:'block',
                  readAssessBtn:true,
                  pjPopup: pjPopupHe,
                  footText: "非常不满意，各方面都很差",
                })
              }
            }
            console.log(this.data.asserData)
          })
      }
    })
  },

//复选框里单个的内容
  checkbox: function(e) {
    console.log(e)
    if(this.data.readAssessBtn){
      return
    }else{
      var index = e.currentTarget.dataset.index; //获取当前点击的下标
      var asserData = this.data.asserData; //选项集合
      asserData[index].checked = !asserData[index].checked; //改变当前选中的checked值
      let label_id = []
        asserData.forEach(res => {
          if(res.checked){
            label_id += res.id+','
          }
        })
      label_id =  label_id.substring(0,label_id.length-1)
      this.setData({
        label_id,
        asserData: asserData
      });
    }
  },
  //复选框选中的内容
  checkboxChange: function(e) {
    var checkValue = e.detail.value;
    this.setData({
      checkValue: checkValue
    });
  },
  //分享行程
  shareLocation(){
    console.log(111)
    wx.showShareMenu({
      withShareTicket: true,
    })
    
  },
  //点击二维码
  toerweicode(event){
    console.log(event)
    if(this.data.type == 1){
        let orderDetail  = JSON.stringify(event.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/pages/charteredBus/pages/erweicode/index?orderDetail='+orderDetail,
      })
    }else if(this.data.type == 3){
      let orderDetail  = JSON.stringify(event.currentTarget.dataset.item)
      wx.navigateTo({
        url: '/pages/codeBus/pages/qrCode/index?orderDetail='+orderDetail,
      })
    }
    console.log(this.data.type)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({type:options.type})
    if(options.type==1){
      //城际包车和四成快客
      this.setData({url:'/citytransport/order/detail'})
    }else if(options.type == 2){
      //景区直通车
      this.setData({url:'/through-train/detail-order'})
    }else if(options.type == 3){
      //景区快客
      this.setData({url:'/scenic-area/detail-order'})
    }else if(options.type==4){
      //周边游玩
      this.setData({url:'/travel-around/order/detail'})
    }
    if(options.type==1 || options.type == 2 || options.type == 3){
      request({
        url:this.data.url,
        data:{
          id: String(options.id)
        }
      }).then(res => {
        console.log(res)
        if(options.type==1){
          if(res.code === 200){
            res.data.price_pay = (res.data.price_pay/100).toFixed(2)
            if(res.status == 11){
              this.setData({readAssessBtn:true,assesBtn:true})
            }
            console.log(this.data.assesBtn)
            let tel = res.data.phone;
            // tel = "" + tel;
            // replace()方法在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
            // let tel1 =tel.replace(tel.substring(3,7), "****")
            let time = res.data.ticket_time
            let timeDate = new Date(time*1000)
    
            time = (timeDate.getMonth()+1)+'月'+timeDate.getDate()+'日'+(timeDate.getHours()<10 ? '0'+timeDate.getHours() : timeDate.getHours())+":"+(timeDate.getMinutes()<10 ? '0'+timeDate.getMinutes() : timeDate.getMinutes())
            console.log(timeDate,time)
            this.setData({orderDetail:res.data,tel, time:time })
            console.log(this.data.orderDetail)
          }
        }else if(options.type==2){
          if(res.code === 200){
            res.data.price = (res.data.price/100).toFixed(2)
            if(res.status == 11){
              this.setData({readAssessBtn:true,assesBtn:true})
            }
            let tel = res.data.phone;
            // tel = "" + tel;
            // // replace()方法在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
            // let tel1 =tel.replace(tel.substring(3,7), "****")
            let time = res.data.date.slice(0,10).split('-')
            let times = time[0]+'年'+time[1]+'月'+time[2]+'日'
              
            this.setData({orderDetail:res.data,tel:tel, time:times,order_id: String(options.id)})
            console.log(this.data.orderDetail)
          }
        }else if(options.type == 3){
          if(res.code == 200){
            if(res.code === 200){
              res.data.price = (res.data.price/100).toFixed(2)
              if(res.status == 11){
                this.setData({readAssessBtn:true,assesBtn:true})
              }
              let tel = res.data.phone;
              // tel = "" + tel;
              // let tel1 =tel.replace(tel.substring(3,7), "****")
              let time = res.data.date.slice(0,10).split('-')
              let times = time[0]+'年'+time[1]+'月'+time[2]+'日'
                
              this.setData({orderDetail:res.data,tel:tel, time:times,order_id: String(options.id)})
              console.log(this.data.orderDetail)
            }
          }
        }
      })
    }else if(options.type==4){
      console.log(options)
      request({
        url:'/travel-around/order/detail',
        data:{
          order_sn:Number(options.order_sn)
        },
        method:'POST'
      }).then(res => {
        if(res.code === 200){
          res.data.price = (res.data.price/100).toFixed(2)
          if(res.status == 11){
            this.setData({readAssessBtn:true,assesBtn:true})
          }
          let tel = res.data.phone;
          // tel = "" + tel;
          // let tel1 =tel.replace(tel.substring(3,7), "****")
          let time = res.data.date.slice(0,10).split('-')
          let times = time[0]+'年'+time[1]+'月'+time[2]+'日'
          this.setData({orderDetail:res.data,tel:tel, time:times,order_sn:res.data.order_sn})
          console.log(this.data.orderDetail)
        }
      })
    }
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
    // wx.redirectTo({
    //   url: '/pages/order/order',
    // })
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