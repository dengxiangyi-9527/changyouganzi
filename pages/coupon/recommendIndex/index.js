// pages/coupon/recommendIndex/index.js
import { base64src } from '../../../utils/base64Src.js'
import { showModel } from '../../../utils/showModel'
let app = getApp()
let ctx = null
import {
  request
} from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#fff",
      "flag": 1,
      "name": "",
    },
    listData: [],
    showShare: false,
    isIpx: app.globalData.isIpx ? true : false,
    showPost: false,
    qrcode: "",
    userInfo: {},
    backUrl: "",
    text1: "",
    text2: "扫描二维码立即领取",
    windowW: 0,
    windowH: 0,
    subHeight: 0,
    canvasImgUrl: "",
    registerSuccess: 0,
    orderSuccess:0,
    canvasWidth: 0,
    canvasHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        let canvasWidth = 654*res.windowWidth/750
        let canvasHeight = 932*res.windowHeight/1334
        console.log(`canvasWidth=${canvasWidth}`)
        console.log(`canvasHeight=${canvasHeight}`)
        that.setData({
        windowW: res.windowWidth ,
        windowH: res.windowHeight,
        canvasWidth,
        canvasHeight
        })
      let subHeight = 0
      if (that.data.isIpx) {
        subHeight = 1220 /2
      } else {
        subHeight = 1149/2
      }
      that.setData ({
        subHeight
      })
      },
      })
    wx.downloadFile({
      // url: "https://static2.jd-gz.com/post_back.png",
      url: "https://static2.jd-gz.com/post_img.png",
      success: res => {
        this.setData({
          backUrl: res.tempFilePath
        })
      },
    })
    this.getRecommendList()
    this.getUserInfo ()
    this.getQrcode()
  },
  // 链接到优惠券列表
  bindCouponList () {
    wx.navigateTo({
      url: '/pages/coupon/couponList/coupon',
    })
  },
  // 关闭分享
  closeShare () {
    this.setData({
      showShare: false
    })
  },
  // 自定义微信分享
  onShareAppMessage(res) {
    let that = this
    if (res.from === 'button') {
    // 来自页面内转发按钮
    }
    return {
      path: `/pages/index/index?code=${that.data.userInfo.invitation_code}`
    }
  },
  // 分享操作
  bindShare (e) {
    let type = e.currentTarget.dataset.type
    if (type === "share") {
      this.setData({
        showShare: true
      })
    } else if (type === "post") {
      if (!this.data.canvasImgUrl) {
        this.createPost()
        this.setData({
          showPost: true
        })
        wx.showLoading({
          title:"正在生成图片",
          mask: true
        })
      } else {
        this.setData({
          showShare: false,
          showPost: true
        })
      }
    } else if (type==="close") {
      this.setData({
        showPost: false,
        showShare: false
      })
    }
  },
  // 创建海报
  createPost () {
    let that = this
    let context = wx.createCanvasContext('postCanvas')
    context.rect(0, 610*that.data.windowH/1334, 654*that.data.windowW/750, 322*that.data.windowH/1334)
    context.setFillStyle('#ffffff')
    context.fill()
    context.setFillStyle("#ffffff")
    context.drawImage(that.data.backUrl, 0,0, 654*that.data.windowW/750, 610*that.data.windowH/1334)
    context.setFontSize(24*that.data.windowW/750)
    context.setFillStyle("#666666")
    context.fillText(that.data.text1, (654*that.data.windowW/750 - context.measureText(that.data.text1).width) / 2, 658*that.data.windowH/1334)
    context.setFillStyle("#8C5A16")
    context.fillText(that.data.text2, (654*that.data.windowW/750 - context.measureText(that.data.text2).width) / 2, 890*that.data.windowH/1334)
    context.drawImage(that.data.qrcode, 247*that.data.windowW/750,694*that.data.windowH/1334,160*that.data.windowW/750,160*that.data.windowW/750)
    context.draw(false,function(){
      console.log(11111)
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x:0,
        y:0,
        canvasId: "postCanvas",
        fileType: 'png',
        success: res => {
          that.setData({
            canvasImgUrl:res.tempFilePath
          })
          that.setData({
            showShare: false,
            showPost:true
          })
          wx.hideLoading()
        },
        fail: res => {
        },
        complete: res => {
        }
      })
    },2000)
  },
  // 保存图片到本地
  saveImage () {
    let that = this
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.writePhotosAlbum']){
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: res => {
              that.downloadCanvasImg()
            },
            fail: () => {
              this.openConfirm()
            }
          })
        } else{
          that.downloadCanvasImg()
        }
      }
    })
    
  },
  //再次获取授权
  openConfirm(){
    showModel({
      content: '检测到您没打开此小程序的保存图片权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      callback: function (res) {
        wx.openSetting({
          success: (res) => { }
        })
      }
    });
  },
  // canvas生成图片
  downloadCanvasImg () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.canvasImgUrl,
      success: res => {
        wx.showToast({
          title: '保存成功',
          duration: 2000
        })
      },
      fail: res => {
        wx.showToast({
          title: '保存失败',
          icon: "none",
          duration: 2000
        })
      }
    })
  },
  // 获取用户信息
  getUserInfo  () {
    let that = this
    request({
      url: '/citytransport/me/get',
    }).then(res => {
      let name = ""
      if (res.data.nickname.length > 6) {
        name = res.data.nickname.substr(0,6) + '...'
      } else {
        name = res.data.nickname
      }
      that.setData({
        userInfo: res.data,
        text1: `您的好友${name}送您一张新人礼包劵，快来领取吧`
      })
    })
  },
  // 获取二维码
  getQrcode () {
    let that = this
    request({
      url: "/citytransport/member/get-qr-code",
      method: "POST",
      data: {
        channel: 'city_transport'
      }
    }).then(res => {
      base64src(res.data, res => {
        that.setData({
          qrcode: res
        })
      });
    })
  },
  // 跳转攻略页面
  bindRadiers () {
    wx.navigateTo({
      url: '/pages/coupon/couponRaiders/index',
    })
  },
  // 获取推荐列表
  getRecommendList () {
    console.log("获取推荐列表")
    let that = this
    request({
      url: '/citytransport/member/get-recommend-list',
      method: 'POST'
    }).then(res => {
      if(res.data.data.length > 0) {
        console.log(res.data)
        console.log(res.data.data)
        that.setData({
          listData: res.data.data,
          orderSuccess: res.data.orderSuccess,
          registerSuccess: res.data.registerSuccess
        })
      }
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
})