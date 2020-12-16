import { request } from "../../../utils/request"
// pages/editUserInfo/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,//页码
    page_size:10,//条数
    couponList:[],//代金卷列表
    total:0,
    userInfo:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url:'/citytransport/me/coupon',
      method:'POST',
      data:{
        status:1,
        page:this.data.page,
        page_size:this.data.page_size
      }
    }).then(res => {
      if(res.code === 200){
        let couponList = []
        res.data.ret.map(data => {
          if(data.use_time == ''){
            if(data.route_id != 0) {
              request({
                url:'/citytransport/query/station-query',
                data:{
                  route_id:data.route_id
                }
              }).then(ele => {
                if(ele.code === 200){
                  data['line'] = ele.data[0].name+'⇌'+ele.data[1].name
                  data.money = (data.money/100)
                  couponList.push(data)
                  this.setData({
                    couponList,
                    total:res.total
                  })
                }
              })
            }else{
              data.money = (data.money/100)
              couponList.push(data)
              this.setData({
                couponList,
                total:res.total
              })
            }
          }
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