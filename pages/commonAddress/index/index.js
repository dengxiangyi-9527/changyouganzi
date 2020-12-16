// pages/commonAddress/index/index.js
import {
  request
} from '../../../utils/request'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 页面列表数据
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
  },

  /**新增地址按钮 */
  add_edit_address(e) {
    let type = e.currentTarget.dataset.type
    let item = e.currentTarget.dataset.item
    console.log(item)
    if (type == 'add') {
      //新增
      // 判断地址list的长度，如果>5就弹出最多只能添加5个
      if (this.data.list.length >= 5) {
        wx.showToast({
          title: '只能建五个地址哦～',
          icon: 'none'
        })
      } else {
        //跳转到新增地址页
        wx.navigateTo({
          url: `/pages/commonAddress/addAddress/addAddress?type=${type}`,
        })
      }
    } else {
      //编辑
      //带上id跳转到新增地址页
      wx.navigateTo({
        url: `/pages/commonAddress/addAddress/addAddress?type=${type}&item=${item.location}&id=${item.id}`
      })
    }
  },
  onClose(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request({
            url: '/citytransport/me/del-address',
            data: {
              id
            },
            method: 'POST'
          }).then(res => {
            console.log(res)
            if (res.code == 200) {
              wx.showToast({
                title: '删除地址成功'
              })
              that.getList() //重新渲染数据
              
            } else {
              wx.showToast({
                title: res.error
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //获取列表数据
  getList() {
    request({
      url: '/citytransport/me/get-address'
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          list: res.data
        })
        console.log(this.data.list)
      } else {
        wx.showToast({
          title: res.error,
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
    //获取列表数据
    this.getList()
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