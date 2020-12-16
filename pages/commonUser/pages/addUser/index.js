// pages/commonUser/pages/addUser/index.js
import { request } from "../../../../utils/request"
import { toast } from '../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    id_card_number:''
  },

  userName(e){
    this.setData({
      name:e.detail.value
    })
  },
  userIdcard(e){
    this.setData({
      id_card_number:e.detail.value
    })
  },

  //确定
  addUser(){
    let {name,id_card_number} = this.data
    request({
      url:"/citytransport/me/add-passenger",
      data:{
        name,
        id_card_number
      },
      method:'POST'
    }).then(res => {
      console.log(res)
      if(res.code == 200 && res.data){
        toast({
          title:'添加成功'
        })
        this.setData({
          name:'',
          id_card_number:''
        })
      }
    })
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