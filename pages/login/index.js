// pages/getuserinfo/index.js
import {
  request
} from '../../utils/request.js'
import {
  toast
} from '../../utils/toast.js'
import {
  showModel
} from '../../utils/showModel.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, //是否点了授权
    type: '', //从哪个页面进来
  },

  // 登录
  // 封装session失败重新登录的方法
  userlogin(e) {
    let avatarUrl = e.detail.userInfo.avatarUrl
    let nickName = e.detail.userInfo.nickName
    let province = e.detail.userInfo.province
    let city = e.detail.userInfo.city
    let gender = e.detail.userInfo.gender
    let country = e.detail.userInfo.country
    let language = e.detail.userInfo.language

    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          // console.log(res.code)
          //发起网络请求,将code发给后端
          let invitation_code = wx.getStorageSync('invitation_code')
          request({
            url: '/auth/wechat/session',
            data: {
              code: res.code,
              channel: 'city_transport',
              invitation_code: invitation_code || ""
            },
            method: 'POST',
            type: that.type
          }).then(res => {
            // console.log("获取session")
            // console.log(res)
            if (res.code == 200) {
              // console.log(res.data)
              // 将用户信息存到storage
              // wx.setStorageSync('session_key', res.data.session_key)
              wx.setStorageSync('openid', res.data.openid)
              wx.setStorageSync('token', res.data.token)
              //发起请求，获取用户信息
              request({
                url: '/auth/wechat/get-user',
                data: {
                  // session_key: res.data.session_key,
                  // encryptedData: e.detail.encryptedData,
                  // iv: e.detail.iv
                  openid: res.data.openid,
                  channel: 'city_transport',
                  avatarUrl,
                  nickName,
                  province,
                  city,
                  gender,
                  country,
                  language,
                },
                isLoading: false,
                method: 'POST',
                type: that.type
              }).then(res => {
                console.log(res)
                that.setData({
                  isLogin: true
                })
              }).catch(err => {
                console.log(err)
              })
            } else {
              toast({
                title: res.error //获取用户信息失败
              })
              // console.log(res.error)

            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          // console.log('登录失败！' + res.errMsg)
          toast({
            title: '登录失败！' + res.errMsg
          })
        }
      }
    })
  },
  // 获取用户信息授权   第一次进来就是正常授权
  bindGetUserInfo(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // let that = this
      this.userlogin(e)
    } else {
      //点击拒绝
      return false
    }
    // console.log(e.detail.errMsg)
    // if (session_key) {
    //如果本地有session_key,判断是否有效
    // wx.checkSession({
    //   success() {
    //session_key 未过期，并且在本生命周期一直有效
    //发起请求，获取用户信息
    //如果本地有session_key
    // let openid = wx.getStorageSync('openid')
    // console.log('test')
    // request({
    //   url: '/auth/wechat/get-user',
    //   data: {
    //     openid,
    //     channel: 'city_transport',
    //     avatarUrl,
    //     nickName,
    //     province,
    //     city,
    //     gender,
    //     country,
    //     language,
    //   },
    //   isLoading: false,
    //   method: 'POST',
    //   type: that.type
    // }).then(res => {
    //   that.setData({
    //     isLogin: true
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
    //如果本地没有session_key
    // if (e.detail.errMsg == 'getUserInfo:ok') {
    //   // let that = this
    //   console.log(this)
    //   console.log(that)
    //   let invitation_code = wx.getStorageSync('invitation_code')
    //   console.log("登录邀请码")
    //   that.userlogin(e)
    // } else {
    //   //点击拒绝
    //   return false
    // }
    // },
    // fail() {
    //   // session_key 已经失效，需要重新执行登录流程
    //   //重新登录
    //   // 弹出弹出框，点击授权
    //   if (e.detail.errMsg == 'getUserInfo:ok') {
    //     // let that = this
    //     that.userlogin(e)
    //   } else {
    //     //点击拒绝
    //     return false
    //   }
    // }
    // })
    // } else {
    //   //本地没有session-key,重新调用登录
    //   if (e.detail.errMsg == 'getUserInfo:ok') {
    //     // let that = this
    //     that.userlogin(e)
    //   } else {
    //     //点击拒绝
    //     return false
    //   }
    // }

  },
    // 自动领取新人礼包
    pickCoupon () {
      let that = this
        request({
          url: "/citytransport/member/join-register-activity",
          isLoading:false,
          method: "POST"
        }).then(res => {
          that.setData({
            showCoupon: false
          })
          // that.getBindInfo()
          let options = {
            title: "温馨提示",
            content: "新人专享礼包领取成功，可到我的->代金券中进行查看",
            showCancel: false,
            cancelText: "",
            confirmText: "我知道了"
          }
          showModel(options)
          setTimeout(() => {
            let url = `/pages/${that.type}`
            console.log(url)
            if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
              wx.switchTab({
                url: url,
              })
            }else if(url == '/pages/codeBus/pages/order/index' || url=='/pages/CustomTour/pages/customized/sudmit/index'){
              wx.navigateBack()
            } else {
              wx.redirectTo({
                url: url,
              })
            }
          },1500)
          // wx.showToast({
          //   title: '新人礼包领取成功，可在',
          //   icon: "success",
          //   duration: 3000
          // })
        })
     
    },
  // 获取用户是否可以领取优惠券
  getBindInfo() {
    let that = this
    request({
      url: "/citytransport/member/is-can-join",
      type: that.type
    }).then(res => {
      if (res.data.is_join) {
        this.pickCoupon()
      } else {
        console.log(that.type)
        let url = `/pages/${that.type}`
        if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
          wx.switchTab({
            url: url,
          })
        } else if(url == '/pages/codeBus/pages/order/index' || url=='/pages/CustomTour/pages/customized/sudmit/index'){
          wx.navigateBack()
        } else {
          wx.redirectTo({
            url: url,
          })
        }
      }
      // wx.setStorageSync("couponInfo", res.data)
    }).catch(err => {
      console.log(err)
    })
  },

  //获取手机号成功弹出是否去实名认证
  goVer() {
    let that = this
    request({
      url: '/citytransport/me/get',
      type: that.type
    }).then(res => {
      if (res.code == 200) {
        //获取手机号成功
        if (res.data.id_card_number) {
          //身份证号码存在，提示他已经实名认证过了，跳到疫情人员信息填写页
          // toast({
          //   title: '您已经实名认证过了'
          // })
          //判断跳转回去的页面是否是tabbar页面
          let url = `/pages/${that.type}`
          if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
            wx.switchTab({
              url: url,
            })
          }else if(url == '/pages/codeBus/pages/order/index' || url=='/pages/CustomTour/pages/customized/sudmit/index'){
            wx.navigateBack()
          } else {
            wx.redirectTo({
              url: url,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '实名认证可保障你的合法权益并提高账号安全性，快来认证吧～',
            cancelText: '跳过',
            confirmText: '好的',
            cancelColor: '#18AFFF',
            confirmColor: '#18AFFF',
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/editUserInfo/verified/verified',
                })
              } else if (res.cancel) {
                //判断跳转回去的页面是否是tabbar页面
                let url = `/pages/${that.type}`
                if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
                  wx.switchTab({
                    url: url,
                  })
                }else if(url == '/pages/codeBus/pages/order/index' || url=='/pages/CustomTour/pages/customized/sudmit/index'){
                  wx.navigateBack()
                } else {
                  wx.redirectTo({
                    url: url,
                  })
                }
              }
            }
          })
        }
      }
    })
  },

  //手机号登录
  phonelogin(e) {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求,将code发给后端
          let invitation_code = wx.getStorageSync('invitation_code')
          request({
            url: '/auth/wechat/session',
            data: {
              code: res.code,
              channel: 'city_transport',
              invitation_code: invitation_code || ""
            },
            method: 'POST',
            type: that.type
          }).then(res => {
            if (res.code == 200) {
              // 将用户信息存到storage
              // wx.setStorageSync('session_key', res.data.session_key)
              // wx.setStorageSync('token', res.data.token)
              //发起请求，获取手机号信息
              request({
                url: '/auth/wechat/get-phone',
                data: {
                  session_key: res.data.session_key,
                  channel: 'city_transport',
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv
                },
                isLoading: false,
                method: 'POST',
                type: that.type
              }).then(res => {
                that.setData({
                  isLogin: true
                })
                //获取手机号成功,弹出是否去实名认证
                // that.goVer()

                // 5.28更新需求取消实名认证 6.8继续取消
                let url = `/pages/${that.type}`
                if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
                  wx.switchTab({
                    url: url,
                  })
                }else if(url == '/pages/codeBus/pages/order/index' || url=='/pages/CustomTour/pages/customized/sudmit/index'){
                  wx.navigateBack()
                } else {
                  wx.redirectTo({
                    url: url,
                  })
                }

              }).catch(err => {
                console.log(err)
              })
            } else {
              // toast({title:'网络错误，请稍后再试'})
              // toast({
              //   title: res.error
              // })
            }
          }).catch(err => {
            console.log(err)
          })

        } else {
          // console.log('登录失败！' + res.errMsg)
          // toast({
          //   title: '获取手机号失败！' + res.errMsg
          // })
        }
      }
    })
  },
  // 获取手机号
  getPhoneNumber(e) {
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      request({
        url: '/auth/wechat/get-phone',
        data: {
          channel: 'city_transport',
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'POST',
        type: this.type
      }).then(res => {
        //获取手机号成功
        that.getBindInfo()
        //弹出是否去实名认证页面
        // that.goVer()
        //5.28更新需求取消实名认证
        // setTimeout(() => {
        //   let url = `/pages/${that.type}`
        //   if (url == '/pages/index/index' || url == '/pages/ticket/ticket' || url == '/pages/user/user') {
        //     wx.switchTab({
        //       url: url,
        //     })
        //   } else {
        //     wx.redirectTo({
        //       url: url,
        //     })
        //   }
        // },1500)
      }).catch(err => {
        console.log(err)
      })
    } else {
      return false
    };
    // if (session_key) {
    //本地有session-key，验证是否有效
    // wx.checkSession({
    //   success: res => {
    //     //session有效
    //     request({
    //       url: '/auth/wechat/get-phone',
    //       data: {
    //         session_key: session_key,
    //         channel: 'city_transport',
    //         encryptedData: e.detail.encryptedData,
    //         iv: e.detail.iv
    //       },
    //       method: 'POST',
    //       type: this.type
    //     }).then(res => {
    //       //获取手机号成功
    //       that.getBindInfo()
    //       //弹出是否去实名认证页面
    //       that.goVer()
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   },
    //   fail: err => {
    //     // session_key 已经失效，需要重新执行登录流程
    //     //重新登录
    //     // 弹出弹出框，点击授权
    //     if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    //       // let that = this
    //       that.phonelogin(e)
    //     } else {
    //       //点击拒绝
    //       return false
    //     }
    //   }
    // })
    // } else {
    //   //本地没有session-key,重新执行获取手机号
    //   that.phonelogin(e)
    // }
  },

  // 手机号登录注册 - 获取验证码
  toPhone() {
    wx.navigateTo({
      url: '/pages/getPhoneCode/index',
    })
  },
  goUserPrivacy() {
    //去用户协议页
    wx.navigateTo({
      url: '/pages/editUserInfo/userprivacy/userprivacy',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.type = options.type
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

  }
})