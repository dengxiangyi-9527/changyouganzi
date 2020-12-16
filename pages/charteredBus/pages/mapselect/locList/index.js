import { request } from "../../../../../utils/request"

// pages/cjjs/mapselect/locList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loclist:[],//地址列表
    keywords:'',//搜素词
    searchText:'',
    cityName:'',//城市名字
    adcode:'',//城市adcode
    isFrom:'',//..
    Commonaddress:''
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
    //点击在地图选择
    goBack(){
      wx.navigateBack()
      let pages = getCurrentPages()
      if(pages.length-1>0){
        let prePage = pages[pages.length - 2];
        prePage.setData({
          isgetloc:true
        })
      }
    },
    //点击地址
    chooseloc(event){
      let pages = getCurrentPages()
      if(pages.length-1>0){
        let prePage = pages[pages.length - 2];
        if(event.currentTarget.dataset.item.locname == undefined){
          event.currentTarget.dataset.item['locname'] = event.currentTarget.dataset.item.name
        }
        if(this.data.isFrom){
          let fromloc = {
            address:event.currentTarget.dataset.item.district+event.currentTarget.dataset.item.address,
            name:event.currentTarget.dataset.item.locname,
            location:event.currentTarget.dataset.item.location
          }
          prePage.setData({
            fromloc,
            isgetloc:false
          })
        }else{
          let endloc = {
            address:event.currentTarget.dataset.item.district+event.currentTarget.dataset.item.address,
            name:event.currentTarget.dataset.item.locname,
            location:event.currentTarget.dataset.item.location
          }
          prePage.setData({
            endloc,
            isgetloc:false
          })
        }
      }
      wx.navigateBack()
    },

    //获取常用地址
    getusualLoc(){
      request({
        url:'/citytransport/me/get-address',
      }).then(res => {
         console.log(res)
         if(res.code == 200 && res.data.length>0){
           this.setData({
            Commonaddress:res.data
           })
         }
      })
    },

    //修改地址
    changeLoc(e){
      console.log(e)
      wx.navigateTo({
        url: '/pages/commonAddress/addAddress/addAddress?id='+e.currentTarget.dataset.item.id,
      })
    },
    //新增地址
    addLoc(){
      wx.navigateTo({
        url: '/pages/commonAddress/index/index',
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 'from'){
      let name = wx.getStorageSync('cityFrom').name
      wx.setNavigationBarTitle({
        title: name
      })
      this.setData({
        isFrom:true,
        searchText:'输入上车地点',
        cityName:name
      })
    }else if(options.type == 'to'){
      let name = wx.getStorageSync('cityTo').name
      wx.setNavigationBarTitle({
        title: name
      })
      this.setData({
        isFrom:false,
        searchText:'输入下车地点',
        cityName:name
      })
    }
    wx.request({
      url: 'https://restapi.amap.com/v3/config/district?parameters',
      data:{
       key:'378e9c01b887d13383eba7dc7ef637b8',
       keywords:this.data.cityName,
       subdistrict:2
      },
      success: (res) => {
        console.log(res)
        if(res.statusCode == 200 && res.data.infocode == 10000){
          this.setData({
            adcode:res.data.districts[0].adcode
          })
        }
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
    this.getusualLoc()
    let pages = getCurrentPages()
    let prePage = pages[pages.length - 2];
    console.log(prePage.data)
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