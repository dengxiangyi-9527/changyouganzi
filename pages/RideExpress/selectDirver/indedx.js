// pages/RideExpress/selectDirver/indedx.js
import {
  request
} from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    driveList: [], //司机列表
    driveName: '', //搜索司机名字
    serDriveList: [], //搜索列表
    driveInfo: '', //选择司机信息
    total:'',
    pages:1
  },
  //输入司机名字
  searchName(e) {
    let driveName = e.detail
    let serDriveList = []
    this.data.driveList.map(res => {
      if (res.name.includes(driveName)) {
        serDriveList.push(res)
      }
    })
    this.setData({
      driveName,
      serDriveList
    })
  },

  //拨打客服电话
  toCall() {
    wx.makePhoneCall({
      phoneNumber: '19150185859',
      fail:(err) => {
        throw(err)
      }
    })
  },
  //选择司机
  chooseDrive(e) {
    console.log(e)
    this.setData({
      driveInfo: e.currentTarget.dataset.item
    })
    let pages = getCurrentPages(); //获取页面栈
    if (pages.length > 1) { //说明有上一页存在
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里，调用上一页的函数
      prePage.setData({
        driveInfo: e.currentTarget.dataset.item
      })
      wx.navigateBack()
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    request({
      url: '/carpool/list-driver',
      data:{
        page:this.data.pages,
        pagesize:10,
      },
      method: 'GET'
    }).then(res => {
      if (res.code == 200 && res.data.data.length !== 0) {
        this.setData({total:res.data.total})
        let list = []
        res.data.data.map(res => {
          res.star = (res.star/10).toFixed(1)
            if(res.car.length != 0 && res.car.route_name != ''){
              res.car.route_name = res.car.route_name.split('-')[0]+'-'+ res.car.route_name.split('-')[1]
              res.car['route_name2'] = res.car.route_name.split('-')[1]+'-'+ res.car.route_name.split('-')[0]
            }
           if(res.car_id != 0){
            list.push(res)
           }
        })
        this.setData({
          driveList: list
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
    if(this.data.driveList.length<this.data.total){
      let pages = this.data.pages+1
      this.setData({pages})
      request({
        url: '/carpool/list-driver',
        data:{
          page:this.data.pages,
          pagesize:10,
        },
        method: 'GET'
      }).then(res => {
        if (res.code == 200 && res.data.data.length !== 0) {
          this.setData({total:res.data.total})
          let list = this.data.driveList
          res.data.data.map(res => {
            res.star = (res.star/10).toFixed(1)
              if(res.car.length != 0 && res.car.route_name != ''){
                res.car.route_name = res.car.route_name.split('-')[0]+'-'+ res.car.route_name.split('-')[1]
                res.car['route_name2'] = res.car.route_name.split('-')[1]+'-'+ res.car.route_name.split('-')[0]
              }
             if(res.car_id != 0){
              list.push(res)
             }
          })
          this.setData({
            driveList: list
          })
        }
      })    
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})