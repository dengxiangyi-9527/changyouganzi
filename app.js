//app.js
import {
  request
} from './utils/request'
App({
  onLaunch: function () {
    let that = this
    this.globalData.cyShow = true
    // console.log(333)
    // 获取手机系统信息
    wx.getSystemInfo({
      success: res => {
        //导航高度
        console.log(res)
        this.globalData.navHeight = res.statusBarHeight + 46;
        this.globalData.phoneHeight = res.screenHeight
        this.globalData.phoneWidth = res.screenWidth
        let modelmes = res.model; //手机品牌
        console.log('手机品牌', modelmes)
        if (modelmes.indexOf('iPhone X') != -1) { //XS,XR,XS MAX均可以适配,因为indexOf()会将包含'iPhone X'的字段都查出来
          this.globalData.isIpx = true
        }
      },
      fail(err) {
        console.log(err);
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //小程序版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
 
  onHide: function () {},
  globalData: {
    time: 20 * 60 * 60 * 1000,
    userInfo: null,
    navHeight: 0,
    phoneHeight: '',
    isIpx: false, // 是否iphoneX
    cyShow: false,
    phoneWidth:''
    // id_card_number: '', //身份证号码，用来判断是否已经实名认证
  },
  onShareAppMessage: function (res) {
    console.log(111)
    var that = this;
    return {
      title: '畅游甘孜小程序',
      path: '/pages/index/index',
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
        // that.shareClick();
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

})

