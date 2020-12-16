// pages/editUserInfo/medicalCheckResult/medicalCheckResult.js
import {
  request
} from '../../../utils/request'
import {
  toast
} from '../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOutTime: true, //3秒之后提示框消失
    real_name: '', //真实姓名
    job: '', //职业
    company:'',//工作单位
    nagivate_img: '', //工作证图片
    status: '', //认证状态
  },
  /**重新认证次数已用完 */
  timeOver() {
    wx.showModal({
      title: '提示',
      content: '您的机会已用完，每人仅有三次审核机会。',
      confirmText: '我知道了',
      showCancel: false
    })
  },
  //去重新认证的按钮
  goMedicalCheck() {
    // this.timeOver()
    wx.redirectTo({
      url: '/pages/editUserInfo/medicalCheck/medicalCheck',
    })
  },

  /**
   * 去乘车anniu
   */
  goCar() {
    wx.redirectTo({
      url: '/pages/cjjs/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // toast({title:"提交成功",icon:'success'})
    request({
      url: '/hero/get'
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          real_name: res.data.name,
          job: res.data.job,
          company:res.data.work_unit,
          nagivate_img: res.data.auth_img,
          status: res.data.status
        })
      } else {
        toast({
          title: res.error
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
  onShareAppMessage: function () {

  }
})