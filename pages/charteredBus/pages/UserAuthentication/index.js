// pages/cjjs/UserAuthentication/index.js
import { toast } from '../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    carId:''
  },
  //获取乘客姓名
  getUserName(event){
    let userName = event.detail.value
    this.setData({userName})
  },
  getCarId(event){
    let carId = event.detail.value
    this.setData({carId})
  },
  btnClick(){
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if(reg.test(this.data.carId)){
      let pages = getCurrentPages()
      if(pages.length-1>0){
        let prePage = pages[pages.length - 2];
        prePage.setData({
          userName:this.data.userName,
          userCarid:this.data.carId
        })
        wx.navigateBack()
      }
    }else{
      console.log(123123)
      toast({title:'身份证输入不合法'})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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