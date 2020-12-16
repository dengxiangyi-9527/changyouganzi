// pages/RideExpress/selctCity/index.js
import { request } from '../../../utils/request'
import { toast } from '../../../utils/toast'
var amapFile = require('../../../utils/amap-wx')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loclist:[],
    keywords:'',
    type:'',
    nowCity:'成都',
    text:"",
    nowCityInfo:'',
    adcode:'',
    commonloclist:[],
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

  //点击
  chooseloc(e){
    let loc = e.currentTarget.dataset.item
    if(loc.location.length !== 0){
      let locstr = loc
       locstr.name = loc.name.reduce((prev,cur) => {
        return prev+cur
      })
      console.log(locstr)
      var pages = getCurrentPages();//获取页面栈
      if(pages.length > 1){ //说明有上一页存在
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];
        //关键在这里，调用上一页的函数
       if(this.data.type == 'from'){
        prePage.setData({
          fromloc: locstr
        })
        wx.navigateBack()
       }else if(this.data.type == 'to'){
        prePage.setData({
          toloc: locstr
        })
        wx.navigateBack()
       }
      }
    }else{
      toast({
        title:'请选择详细地址'
      })
    }
  },

  //选择城市
  chooseCity(){
    wx.navigateTo({
      url:'/pages/RideExpress/selectionLoc/index?type='+this.data.type,
    })
  },
  //获取常用地址
  getCommonLoc(){
    request({
      url:'/citytransport/me/get-address'
    }).then(res => {
      console.log(res)
      if(res.code == 200 && res.data.length !==0){
        let list = res.data
        this.setData({
          commonloclist:list
        })
      }
    })
  },
  //地图选择
  goBack(){
    // var pages = getCurrentPages();//获取页面栈
    // if(pages.length > 1){ //说明有上一页存在
    //   //上一个页面实例对象
    //   var prePage = pages[pages.length - 2];
    //   //关键在这里，调用上一页的函数
    //   prePage.setData({
    //     type:this.data.type
    //   })
    // }
    wx.navigateBack()
  },
  //选择常用地址
  chooseComloc(e){
    console.log(e)
    let loc = e.currentTarget.dataset.item
    if(loc.location.length !== 0){
      let locstr = loc
      //  locstr.name = loc.name.reduce((prev,cur) => {
      //   return prev+cur
      // })
      console.log(locstr)
      var pages = getCurrentPages();//获取页面栈
      if(pages.length > 1){ //说明有上一页存在
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];
        //关键在这里，调用上一页的函数
       if(this.data.type == 'from'){
        prePage.setData({
          fromloc: locstr
        })
        wx.navigateBack()
       }else if(this.data.type == 'to'){
        prePage.setData({
          toloc: locstr
        })
        wx.navigateBack()
       }
      }
    }else{
      toast({
        title:'请选择详细地址'
      })
    }
  },
    //新增地址
    addLoc(){
      wx.navigateTo({
        url: '/pages/commonAddress/index/index',
      })
    },
    changeLoc(e){
      console.log(e)
      wx.navigateTo({
        url: '/pages/commonAddress/addAddress/addAddress?id='+e.currentTarget.dataset.item.id,
      })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({type:options.id})
    if(options.id == 'from'){
      wx.setNavigationBarTitle({
        title:'上车点',
      })
      this.setData({text:'你在哪儿上车'})
    }else if(options.id == 'to'){
      wx.setNavigationBarTitle({
        title:'下车点',
        
      })
      this.setData({text:'你在哪儿下车'})
    }
    if(JSON.parse(options.nowCity) == ''){
      let nowCity = '成都市'
      let adcode = 510100
      this.setData({nowCity,adcode})
    }else{
      let nowCity = JSON.parse(options.nowCity).name
      let adcode = JSON.parse(options.nowCity).adcode
      let nowCityInfo = JSON.parse(options.nowCity)
      this.setData({nowCity,adcode,nowCityInfo})
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
    this.getCommonLoc()
    if(this.data.nowCityInfo != ''){
      var pages = getCurrentPages();//获取页面栈
      if(pages.length > 1){ 
         //上一个页面实例对象
         var prePage = pages[pages.length - 2];
        if(this.data.type == 'from'){
          prePage.setData({
            fromCityInfo:this.data.nowCityInfo,
          })
          if(this.data.nowCity != this.data.nowCityInfo.name){
              prePage.setData({
                fromloc:'',
              })
          }
        }else if(this.data.type == 'to'){
          prePage.setData({
            toCityInfo:this.data.nowCityInfo,
          })
          if(this.data.nowCity != this.data.nowCityInfo.name){
            prePage.setData({
              toloc:'',
            })
        }
        }
      }//说明有上一页存在

      let nowCity = this.data.nowCityInfo.name
      let adcode = this.data.nowCityInfo.adcode
      this.setData({nowCity,adcode,nowCityInfo:''})
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