// pages/commonUser/pages/index.js
import {
  toast
} from '../../../../utils/toast.js'
import {
  request
} from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    list:[]

  },

  //取消勾选用户
  close(e){
    let userList = this.data.userList
    let item = e.currentTarget.dataset.item
    let list = []
    userList.map(res => {
      if(res.id == item.id){
        res.check = false
      }
      if(res.check){
        list.push(res)
      }
    })
    this.setData({userList})
    let pages = getCurrentPages()
    if(pages.length -1 >0){
      let prePage = pages[pages.length - 2];
      prePage.setData({
       userList:list
      })
    }
  },
  //勾选与用户
  gouxuan(e){
    let item = e.currentTarget.dataset.item
    let userList = this.data.userList
    let list = []
    userList.map(res => {
      if(res.id == item.id){
        res.check = true
        toast({title:'添加成功'})
      }
      if(res.check){
        list.push(res)
      }
    })
    this.setData({userList})
    let pages = getCurrentPages()
    if(pages.length -1 >0){
      let prePage = pages[pages.length - 2];
      prePage.setData({
       userList:list
      })
    }
  },
  //添加乘客
  addUser(){
    wx.navigateTo({
      url: '/pages/commonUser/pages/addUser/index',
    })
  },
  getUserList(){
    request({
      url:'/citytransport/me/passenger',
      method:'POST'
    }).then(res => {
      if(res.code == 200 && res.data){
        let list = this.data.list
        res.data.map(res => {
          res['check'] = false
          res['delcheck'] = false
          list.map(item => {
            if(res.id == item.id){
              res['check'] = true
            }
          })
          return res
        })
        this.setData({
          userList:res.data
        })
      }
    })
  },

  delUser(e){
    wx.showModal({
      content:'确定删除该乘客',
      success:(res) => {
          if(res.confirm){
            let item = e.currentTarget.dataset.item
            request({
              url:'/citytransport/me/del-passenger',
              data:{
                id:item.id
              },
              method:'POST'
            }).then(res => {
              if(res.code == 200 && res.data){
                toast({title:'删除成功'})
                this.getUserList()
                let list = this.data.list
                let lists = []
                list.map(ele => {
                  if(ele.id !== item.id){
                    lists.push(ele)
                    this.setData({list:lists})
                    let pages = getCurrentPages()
                    if(pages.length -1 >0){
                      let prePage = pages[pages.length - 2];
                      prePage.setData({
                      userList:lists
                      })
                    }
                  }
                })
              }
            })
          }
      }
    })
  },
  isOk(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let list = JSON.parse(options.userList)
    this.setData({list})
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
    this.getUserList()
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