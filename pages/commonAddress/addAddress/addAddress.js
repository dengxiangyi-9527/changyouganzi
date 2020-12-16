// pages/commonAddress/index/index.js
import {
  request
} from '../../../utils/request'
import {
  toast
} from '../../../utils/toast'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [], // 页面列表数据
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
    keywords:'',//关键词
    loclist:[],//地址列表
    nowCity:'',//当前城市
    adcode:'',//城市adcode
    nowCityInfo:'',//当前城市信息
    id:'',//地址id
  },

  //搜索
  searchloc(e){
    let keywords = e.detail.value
    this.setData({keywords})
    wx.request({
      url: 'https://restapi.amap.com/v3/assistant/inputtips',
      data:{
        key:'378e9c01b887d13383eba7dc7ef637b8',
        keywords,
        city:this.data.adcode,
        citylimit:true
      },
      success:(res) => {
        if(res.data.infocode == 10000){
          let loclist = []
          res.data.tips.map(res => {
              loclist.push(res)
          })
          console.log(loclist)
          loclist.map(res => {
            res['locname'] = res.name
            res.name = res.name.replace(new RegExp(`${keywords}`, 'g'), `%%${keywords}%%`).split('%%')
          })
          this.setData({loclist})
          console.log(loclist)
        }
      }
    })
  },
  //取消
  onclose(){
    this.setData({keywords:'',loclist:[]})
  },

    //选择城市
    chooseCity(){
      wx.navigateTo({
        url:'/pages/RideExpress/selectionLoc/index?type=selctCity',
      })
    },
    //选择城市
    chooseloc(event){
      let that = this
      let locInfo = event.currentTarget.dataset.item
      console.log(locInfo)
      if(locInfo.location.length != 0 && locInfo.address.length){
        wx.showModal({
          title:'选择常用地址',
          content:'您选择选择'+locInfo.name+'为你的常用地址',
          success (res) {
            if (res.confirm) {
              console.log(res)
              request({
                url:"/citytransport/me/add-address",
                data:{
                  address:locInfo.address,
                  name:locInfo.locname,
                  city_name:that.data.nowCity,
                  location:locInfo.location,
                  district:locInfo.district,
                  id:that.data.id
                },
                method:'POST'
              }).then(res => {
                if(res.code == 200 && res.data){
                  wx.navigateBack()
                }
              })
            } 
          }
        })
      }else{
        toast({
          title:'请选择详细地址'
        })
      }
    },
    //地图选地址
    map_address(){
      console.log(this.data.id)
      wx.navigateTo({
        url: '/pages/commonAddress/mapselect/index?id='+this.data.id+'&nowCity='+this.data.nowCity,
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id:options.id
      })
    }
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
    if(this.data.nowCityInfo != ''){
      let nowCity = this.data.nowCityInfo.name
      let adcode = this.data.nowCityInfo.adcode
      this.setData({nowCity,adcode})
    }else{
      let nowCity = '成都市'
      let adcode = 510100
      this.setData({nowCity,adcode})
    }
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