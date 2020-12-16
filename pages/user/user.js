// pages/user/user.js
import {
  request
} from '../../utils/request.js'
import {
  showModel
} from '../../utils/showModel'
import {
  toast
} from '../../utils/toast.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '', //用户名
    isLogined: false, //用户是否登录
    avatarUrl: '', //头像地址
    intro: '', //个人简介
    isVerified: true, //是否实名认证
    // isVerified: false, //是否实名认证
    status: '', //防疫认证的状态
    newIsVerified: false, //5.28新增实名认证字段 6.8号开启实名认证
  },
  // 跳转发票中心
  bindInvioceCenter() {
    // if (this.data.isLogined) {
    //   if (this.data.isVerified) {
    //     wx.navigateTo({
    //       url: '/pages/invoiceCenter/index/index',
    //     })
    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '实名认证后即可进入发票中心，快去实名认证吧～',
    //       cancelText: '跳过',
    //       confirmText: '好的',
    //       cancelColor: '#18AFFF',
    //       confirmColor: '#18AFFF',
    //       success(res) {
    //         if (res.confirm) {
    //           wx.navigateTo({
    //             url: '/pages/editUserInfo/verified/verified',
    //           })
    //         } else if (res.cancel) {

    //         }
    //       }
    //     })
    //   }
    // } else {
    //   showModel({
    //     content: '您还未登录，请先登录',
    //     url: '/pages/login/index?type=user/user'
    //   })
    // }
  },
  // 跳转推荐新人主页
  bindRecommend() {
    console.log(this.data.isVerified)
    if (this.data.isVerified) {
      wx.navigateTo({
        url: '/pages/coupon/recommendIndex/index',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '实名认证后即可邀请好友获大礼，快去实名认证吧～',
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

          }
        }
      })
    }
  },

  /**
   * 跳转至常用地址页
   */
  bindCommonAddress() {
    if (this.data.isLogined) {
      wx.navigateTo({
        url: '/pages/commonAddress/index/index',
      })
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=user/user'
      })
    }
  },
  /**
   * 判断是否已登录
   */
  isLogin() {
    let that = this
    wx.checkSession({
      success() {
        console.log('已登录')
        // 查看是否授权  获取用户信息
        wx.getSetting({
          success(res) {
            console.log(123)
            // console.log(res.authSetting['scope.userInfo'])
            if (res.authSetting['scope.userInfo']) {
              // console.log("已授权")
              request({
                url: '/citytransport/me/get',
                type: 'user/user',
                isLoading: false
              }).then(res => {
                console.log(res)
                if (res.code == 200) {
                  //用户名
                  if (res.data.username) {
                    that.setData({
                      nickName: res.data.username,
                      isLogined: true
                    })
                  } else {
                    that.setData({
                      nickName: res.data.nickname,
                      isLogined: true
                    })
                  }
                  //头像
                  if (wx.getStorageSync('avatarUrl')) {
                    that.setData({
                      avatarUrl: wx.getStorageSync('avatarUrl')
                    })
                  } else {
                    that.setData({
                      avatarUrl: res.data.avatar_image
                    })
                  }
                  //简介
                  if (res.data.intro) {
                    that.setData({
                      intro: res.data.intro
                    })
                  } else {
                    that.setData({
                      intro: '写个简介开始旅行吧'
                    })
                  }
                  //实名认证 如果有身份证号码就是实名认证了
                  if (res.data.id_card_number !== "未实名") {
                    that.setData({
                      isVerified: true,
                      newIsVerified: true
                    })
                    // if (res.data.id_card_number) {
                    //   that.setData({
                    //     isVerified: true,
                    //     // newIsVerified:true
                    //   })
                    //   console.log(2323)
                    //   console.log(that.data.isVerified)
                    //   app.globalData.id_card_number = res.data.id_card_number //将实名之后的身份证号码赋值给全局的身份证号码s
                  } else {
                    console.log(2222)
                    console.log(that.data.isVerified)
                  }
                  //判断是否为防疫英雄
                  request({
                    url: '/hero/get',
                    isLoading: false
                  }).then(res => {
                    console.log(res)
                    if (res.data.length == 0) {
                      //未认证
                      that.setData({
                        status: 4
                      })
                    } else {
                      console.log(res.data)
                      that.setData({
                        status: res.data.status
                      })
                    }
                  })
                }
              })
            }
          }
        })
      },
      fail() {
        //登录已过期,出现登录按钮,执行登录流程
        that.setData({
          isLogined: false,
          status: 4, //防疫未认证
        })

      }
    })
  },
  // 去登录
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/index?type=user/user',
    }) //重新登录
  },

  // 编辑用户信息
  editUserInfo() {
    //先判断是否登陆成功
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/editUserInfo/edit/index',
      }) //进入用户信息编辑页
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=user/user'
      })
    }
  },

  /**点击订单跳转到订单页 */
  toOrder() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/order/pages/throughOrder/index',
      })
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=order/pages/order/order'
      })
    }
  },
  //点击代金券跳转到代金卷页
  toCoupon() {
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/coupon/couponList/coupon',
      })
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=coupon/couponList/coupon'
      })
    }
  },

  /**
   * 实名认证，接法大大接口
   */
  goVerified() {
    let token = wx.getStorageSync('token')
    console.log(111)
    if (token) {
      wx.navigateTo({
        url: '/pages/editUserInfo/verified/verified',
      })
    } else {
      showModel({
        content: '您还未登录，请先登录',
        url: '/pages/login/index?type=editUserInfo/verified/verified'
      })
    }
  },
  verified() {
    toast({
      title: '您已经实名认证过了'
    })
  },
  /**
   * 疫情防护人员认证
   */
  goMedicalCheck() {
    let that = this
    let token = wx.getStorageSync('token')
    console.log(token)
    if (token) {
      request({
        url: '/citytransport/me/get',
        isLogined: false,
        type: 'user/user'
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          if (res.data.id_card_number !== '未实名') {
            // if (res.data.id_card_number) {
            //已实名认证，去疫情人员信息填写页
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
                  console.log('用户点击取消')
                  // 跳转到之前的tabbar我的页面，并重新调用是否登录方法，刷新tabbar我的页面数据
                  wx.switchTab({
                    url: '/pages/user/user',
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
        url: '/pages/login/index?type=user/user'
      })
    }

  },
  //查看审核状态
  goMedicalCheckResult() {
    wx.navigateTo({
      url: '/pages/editUserInfo/medicalCheckResult/medicalCheckResult',
    })
    // request('/hero/get').then(res=>{
    //   console.log(res)
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.isLogin()
    // console.log("111onLoad")
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.isLogin()
    // console.log("222onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isLogin()
    // console.log("333onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log("444onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log("555onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.isLogin()
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