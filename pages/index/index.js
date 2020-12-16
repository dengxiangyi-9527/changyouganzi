// pages/indexPage/index.js
const app = getApp();
import {
  showModel
} from '../../utils/showModel'
import {
  request
} from '../../utils/request'
import {
  toast
} from '../../utils/toast'
import {
  getTimers
} from '../../utils/getTimers'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false, //适配iphone Xddsd
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#ffffff",
      "flag": 4,
      "name": "首页",
      "font_size":32,
      "font_weight":'bold',
      "cityName":'',
      "tabFiexd":false
    },
    imgList: ["https://static2.jd-gz.com/shouyebannar1.png","https://static2.jd-gz.com/shouyebannar2.png","https://static2.jd-gz.com/shouyebannar3.png"],
    // imgList: ["https://static2.jd-gz.com/shouyebannar2.png","https://static2.jd-gz.com/shouyebannar3.png"],
    currenIndex:0,
    scrollTop: 0,
    flag: false,
    handle: false,
    isMask: false,
    showCoupon: false,
    isLogined: false,
    show:false,//时间选择器
    startCity:"",//出发城市
    arriveCity:"",//目的城市
    currentDate:'',//选择日期
    totalTime:'',//选择的时间戳
    dateList:[],//日期列表
    timestampList:[],//时间戳列表
    //出发时间选择
    currentTime: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value+'日';
    },
    //选择时间
    onInput(event) {
      this.setData({
        totalTime: event.detail
      });
    },
    tabList: [{
      name: "怎么玩"
    }, {
      name: "吃什么"
    }, {
      name: "住哪里"
    }],
  },

  //点击出发城市
  startCity(){
    wx.navigateTo({
      url: '/pages/charteredBus/pages/selectCity/index?city=from',
    })
  },
  //点击目的城市
  endCity(){
    wx.navigateTo({
      url: '/pages/charteredBus/pages/selectCity/index?city=to',
    })
  },
  //时间选择
  chnageTime(){
    this.setData({show:true})
  },
  //地点交换按钮
  exchangeCity(){
    var exCity = null
    exCity = wx.getStorageSync('cityFrom')
    wx.setStorageSync('cityFrom', wx.getStorageSync('cityTo'))
    wx.setStorageSync('cityTo', exCity)
    this.setData({
      startCity: wx.getStorageSync('cityFrom').name,
      arriveCity: wx.getStorageSync('cityTo').name
    })
  },
  //时间选择
  showPopup() {
    var minDate = new Date(new Date().toLocaleDateString()).getTime()
    var timestampList = []
    var dateList = []
    for(var i = 1; i < 31 ; i++){
      var timeDate = new Date(new Date().toLocaleDateString()).getTime()
      timeDate = timeDate + i * 24 * 60 * 60 * 1000
      timestampList.push(timeDate)
      this.setData({timestampList})
    }
    timestampList.forEach(res => {

        dateList.push( getTimers(res))
        this.setData({dateList})
    })
    this.setData({ show: true });
  },
   //时间选择完成
   confirm(value){
    console.log(value)
    let index = value.detail.index
    let totalTime = this.data.timestampList[index]
    let currentDate = value.detail.value.slice(5,15)
    this.setData({ show: false, totalTime,currentDate});
    console.log(index)
    wx.setStorageSync('currentDate', this.data.totalTime)
  },
  //时间变化
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      totalTime: e.detail.value
    })
  },
  //选择时间关闭
  onClose() {
    this.setData({ show: false });
  },
//时间选择变化
onChnage(value){
  console.log(value)
  let index = value.detail.index
  let totalTime = this.data.timestampList[index]
  let currentDate = value.detail.value.slice(5,15)
  this.setData({totalTime,currentDate});
  console.log(index)
  wx.setStorageSync('currentDate', this.data.totalTime)
},
//关闭时间选择
  onCancel(){
    this.setData({ show: false });
  },
  //点击查询城际专车跳到查询页
  toSerach(){
    if (this.data.startCity === this.data.arriveCity && this.data.startCity !== '' && this.data.arriveCity !== ''&&this.data.startCity !== undefined && this.data.arriveCity !== undefined){
      toast({title:'出发地和目的地不能相同'})
    }else{
      if (this.data.startCity !== '' && this.data.arriveCity !== ''&&this.data.startCity !== undefined && this.data.arriveCity !== undefined) {
        wx.navigateTo({
          url: '/pages/throughTrain/pages/trainList/index'
        })
      } else if (this.data.startCity == '' && this.data.arriveCity !== '') {
        toast({ title: '请选择出发地' })
      } else if (this.data.startCity !== '' && this.data.arriveCity == '') {
        toast({ title: '请选择目的地' })
      } else {
        toast({ title: '请选择出发地和目的地' })
      }
    }
  },
    // 标题点击
    bindTabChange(e) {
      let index = e.currentTarget.dataset.index
      // console.log(index)
      this.setData({
        currenIndex: index
      })
    },
    //打电话
    toCall(){
      wx.makePhoneCall({
        phoneNumber:'19150185859',
        fail:(err) => {
          throw(err)
        }
      })
    },
    getdefaultLine(){
      request({
        url:'/public/default-route'
      }).then(res => {
        if(res.code == 200){
          console.log(res)
          wx.setStorageSync('cityFrom',res.data[0])
          wx.setStorageSync('cityTo',res.data[1])
          this.setData({
            startCity: wx.getStorageSync('cityFrom').name,
            arriveCity: wx.getStorageSync('cityTo').name
          })
        }
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.getdefaultLine()
    let invitation_code = ''
    if (option.scene) {
      if(decodeURIComponent(option.scene).split(',')[0] == 0){
        invitation_code = ''
      }else{
        invitation_code = decodeURIComponent(option.scene).split(',')[0]
      }
    } else if (option.code) {
      invitation_code = option.code
    }
    wx.setStorageSync('business_id', decodeURIComponent(option.scene).split(',')[1])
    wx.setStorageSync('invitation_code', invitation_code)
    console.log(`邀请码${invitation_code}`)
    this.setData({
      isMask: app.globalData.cyShow,
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
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('toLocation')
    wx.removeStorageSync('fromLocation')
    wx.removeStorageSync('endDate')
    wx.removeStorageSync('currentDate')
    this.getBindInfo()
    //首页可转发
    wx.showShareMenu({
      withShareTicket: true
    })
    //判断是否有时间
    if (wx.getStorageSync('currentDate') && wx.getStorageSync('currentDate') >= new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000){
      this.setData({
        totalTime: wx.getStorageSync('currentDate')
      })
        this.setData({
          currentDate: getTimers(this.data.totalTime).slice(5)
        })
    }else{
      let currentDate = new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000
      wx.setStorageSync('currentDate', currentDate)

        this.setData({
          currentDate: getTimers(currentDate).slice(5)
        })
    }
    this.setData({
      height: wx.getSystemInfoSync().windowHeight,
      
    })
    if(wx.getStorageSync('cityFrom')){
      this.setData({
        startCity: wx.getStorageSync('cityFrom').name,
      })
    }else{
      this.setData({
        startCity: '',
      })
    }
    if(wx.getStorageSync('cityTo')){
      this.setData({arriveCity: wx.getStorageSync('cityTo').name})
    }else{
      this.setData({
        arriveCity: '',
      })
    }
  },
  // 自动领取新人礼包
  pickCoupon () {
    let that = this
    if (that.data.isLogined) {
      request({
        url: "/citytransport/member/join-register-activity",
        isLoading:false,
        method: "POST"
      }).then(res => {
        that.setData({
          showCoupon: false
        })
        that.getBindInfo()
        let options = {
          title: "温馨提示",
          content: "新人专享礼包领取成功，可到我的->代金券中进行查看",
          showCancel: false,
          cancelText: "",
          confirmText: "我知道了"
        }
        showModel(options)
        // wx.showToast({
        //   title: '新人礼包领取成功，可在',
        //   icon: "success",
        //   duration: 3000
        // })
      })
    } else {
      showModel({
        content: '您尚未登录，请先登录',
        url: `/pages/login/index?type=index/index`,
      })
    }
  },
    // 新人礼包点击事件
    bindActivity(e) {
      console.log(e)
      let that = this
      let type = e.currentTarget.dataset.type
      if (type === "close") {
        this.setData({
          showCoupon: false
        })
      } else {
        if (that.data.isLogined) {
          request({
            url: "/citytransport/member/join-register-activity",
            isLoading:false,
            method: "POST"
          }).then(res => {
            that.setData({
              showCoupon: false
            })
            that.getBindInfo()
            wx.showToast({
              title: '领取成功',
              icon: "success",
              duration: 3000
            })
          })
        } else {
          showModel({
            content: '您尚未登录，请先登录',
            url: `/pages/login/index?type=index/index`,
          })
        }
      }
    },
      // banner点击事件
  bindBannerTap(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    // if (index == 0) {
    //   wx.navigateTo({
    //     url: '/pages/swiperDetail/detailone/index',
    //   })
    // } else 
    if (index == 0) {
      wx.navigateTo({
        url: '/pages/swiperDetail/detailtwo/index',
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '/pages/swiperDetail/detailthree/index',
      })
    } else if (index == 2) {
      wx.navigateTo({
        url: '/pages/swiperDetail/detailfour/index',
      })
    }
  },
    //判断是否可以领取
    judgeGetCondition() {
      console.log("判断")
      let couponInfo = wx.getStorageSync('couponInfo')
      let showCoupon = true
      if (couponInfo) {
        console.log(1)
        if (couponInfo.is_join) {
          console.log(2)
          showCoupon = true
          // this.pickCoupon()
        } else {
          console.log(3)
          showCoupon = false
        }
      }
      this.setData({
        showCoupon
      })
      console.log(this.data.showCoupon)
    },
    // 获取用户是否可领取优惠券
    getBindInfo() {
      request({
        url: "/citytransport/member/is-can-join",
        isLoading:false,
        isShowModel: true
      }).then(res => {
        if (res.code !== 200) {
          this.setData({
            isLogined: false
          })
        } else {
          this.setData({
            isLogined: true
          })
        }
        wx.setStorageSync("couponInfo", res.data)
        this.judgeGetCondition()
      }).catch(err => {})
    },
  //关闭遮罩层
  delMask() {
    this.setData({
      isMask: false
    })
  },
    //去查看疫情详情
    goDetail() {
      this.setData({
        isMask: false
      })
      let that = this
      let token = wx.getStorageSync('token')
      if (token) {
        //判断是否为防疫英雄
        request({
          url: '/hero/get',
          isLoading:false
        }).then(res => {
          console.log(res)
          if (res.code == 200) {
            //获取成功
            if (res.data.length === 0) {
              console.log(res.data)
              //未认证
              request({
                url: '/citytransport/me/get',
                isLoading:false
              }).then(res => {
                console.log(res)
                if (res.code == 200) {
                  if (res.data.id_card_number !== '未实名') {
                    // if (res.data.id_card_number) {
                    //实名认证
                    wx.navigateTo({
                      url: '/pages/editUserInfo/medicalCheck/medicalCheck',
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '实名认证后即可进行抗疫认证，快去实名认证吧～',
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
                          that.setData({
                            isMask: true
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else {
              if (res.data.status == 0 || res.data.status == 1 || res.data.status == 2) {
                //0是待认证，1是认证失败，2是认证成功。跳转到查看审核状态界面
                wx.navigateTo({
                  url: '/pages/editUserInfo/medicalCheckResult/medicalCheckResult'
                })
              }
            }
          }
        })
      } else {
        //登录成功跳转回来的页面路径
        let type = 'index/index'
        showModel({
          content: '您还未登录，请先登录',
          // url: `/pages/${type}`,
          url: `/pages/login/index?type=${type}`,
          method: 3,
        })
      }
  
    },
  toCjjs() {
    // wx.navigateTo({
    //   url:'/pages/codeBus/pages/order/index'
    // })
    toast({
      title: '请敬请期待'
    })
  },
  toZjzc() {
    toast({
      title: '请敬请期待'
    })
  },
  toDzbc() {
    wx.navigateTo({
      url: '/pages/CustomTour/pages/index/index',
    })
    // toast({
    //   title: '请敬请期待'
    // })
  },
  toperpheralTaourism() {
    wx.navigateTo({
      url: '/pages/peripheralTourism/pages/list/index',
    })
    // toast({
    //   title: '请敬请期待'
    // })
  },
    //去司乘快客页面
    toSckk(){
        wx.navigateTo({
          url: '/pages/RideExpress/index/index',
        })  
    },
    // 图文系统图片的点击事件
    goImgTextDetail(e) {
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '/pages/imgTextDetail/imgTextDetail?index=' + index,
      })
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
  /**
   * 页面滚动
   */
  onPageScroll: function (ev){
    console.log(ev)
    if(ev.scrollTop>=100){
      this.setData({
        nav: {
          "bg_color": "rgba(0,0,0,0)",
          "color": "#ffffff",
          "flag": 4,
          "font_size":32,
          "font_weight":'bold',
          "tabFiexd":true,
          "cityName":wx.getStorageSync('cityFrom').name
        },
      })
    }else{
      this.setData({
        nav: {
          "bg_color": "rgba(0,0,0,0)",
          "color": "#ffffff",
          "flag": 4,
          "font_size":32,
          "font_weight":'bold',
          "tabFiexd":false,
          "cityName":wx.getStorageSync('cityFrom').name
        },
      })
    }
  }
})