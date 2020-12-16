// pages/peripheralTourism//pages/list/index.js
import {
  request
} from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],//列表
    page:1,
    pagesize:10,
    total:0,
  },

  getList(){
    let {page,pagesize} = this.data
    let dataList = []
    request({
      url:'/travel-around/list-route',
      data:{
        page,
        pagesize
      }
    }).then(res => {
      if(res.code == 200 && res.data.data.length > 0){
        res.data.data.map(item => {
          item['num'] = (item.id * 123 + 456) % 100
          if(item.status == 1){
            dataList.push(item)
          }
        })
        this.setData({
          dataList,
          total:res.total
        })
      }
    })
  },
  goDetail(event){
    console.log(event)
    let id = event.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/peripheralTourism/pages/detail/index?id='+id+'&num='+event.currentTarget.dataset.item.num,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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