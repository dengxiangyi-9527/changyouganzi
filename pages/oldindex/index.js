//index.js
//获取应用实例
const app = getApp()

import {
  showModel
} from '../../utils/showModel'
import {
  request
} from '../../utils/request'
import {
  toast
} from '../../utils/toast'
Page({
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#333333",
      "flag": 4,
      "name": "首页",
      "font_size":32,
      "font_weight":'bold',
      "cityName":''
    },
    // imgList: ["https://static2.jd-gz.com/banner1.png","https://static2.jd-gz.com/bannerfivemonthous.png","https://static2.jd-gz.com/banner10605.png","https://static2.jd-gz.com/banner4.png"],
    imgList: ["https://static2.jd-gz.com/bannerfivemonthous.png","https://static2.jd-gz.com/banner10605.png","https://static2.jd-gz.com/_20200605182637.png"],
    currenIndex:0,
    tabList: [{
      name: "怎么玩"
    }, {
      name: "吃什么"
    }, {
      name: "住哪里"
    }],
    scrollTop: 0,
    flag: false,
    handle: false,
    isMask: false,
    showCoupon: false,
    isLogined: false,
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
  // 标题点击
  bindTabChange(e) {
    let index = e.currentTarget.dataset.index
    // console.log(index)
    this.setData({
      currenIndex: index
    })
  },

  // 图文系统图片的点击事件
  goImgTextDetail(e) {
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/imgTextDetail/imgTextDetail?index=' + index,
    })
  },
  //事件处理函数
  bindViewTap: function () {

  },
  toCjjs() {
    wx.navigateTo({
      url: '/pages/cjjs/index/index',
    })
  },
  toZjzc() {
    toast({
      title: '请敬请期待'
    })
  },
  toDzbc() {
    toast({
      title: '请敬请期待'
    })
  },
  toJjs() {
    toast({
      title: '请敬请期待'
    })
  },

  //去司乘快客页面
  toSckk(){
    console.log(123)
    // toast({
    //   title: '请敬请期待'
    // })
    let token = wx.getStorageSync('token')
    if (token) {
      request({
        url: '/citytransport/me/get',
        isLogined: false
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          if (res.data.id_card_number) {
            //已实名认证，进入司乘快客
            wx.navigateTo({
              url: '/pages/RideExpress/index/index',
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '实名认证后即可进入司乘快客，快去实名认证吧～',
              cancelText: '跳过',
              confirmText: '好的',
              cancelColor: '#18AFFF',
              confirmColor: '#18AFFF',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/RideExpress/index/index',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              }
            })
          }
        }
      })
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=RideExpress/indexindex'
      })
    }


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
  //页面加载
  onLoad: function (option) {
    let invitation_code = ''
    if (option.scene) {
      invitation_code = decodeURIComponent(option.scene)
    } else if (option.code) {
      invitation_code = option.code
    }
    wx.setStorageSync('invitation_code', invitation_code)
    console.log(`邀请码${invitation_code}`)
    this.setData({
      isMask: app.globalData.cyShow,
    })
    this.getBindInfo()
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

  // 获取用户是否已绑定手机号
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
  onShow: function () {
    wx.removeStorageSync('currentDate')
    // wx.removeStorageSync('cityTo')
    // wx.removeStorageSync('cityFrom')
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('toLocation')
    wx.removeStorageSync('fromLocation')
    wx.removeStorageSync('userInfo')
    this.getBindInfo()
    //首页可转发
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onPageScroll: function (e) { // 获取滚动条当前位置
    if (parseInt(e.scrollTop) >= 240) {
      this.setData({
        flag: true
      })
    } else {
      this.setData({
        flag: false
      })
    }
  }
})