// pages/cjjs/throughTrainDetail/index.js
import{
  request
} from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(0,0,0,0)",
      "color": "#333",
      "flag": 1,
      "name": ""
    },
    num:0,//门票数量
    trainDetail:'',
    carPrice:'',//汽车票价
    discount:false,//七月10号到八月十号打折
    IconTrue:false,
    init:false
  },
  addNum(){
    let num = this.data.num
    num++
    console.log(num)
    this.setData({
      num
    })
  },
  upNum(){
    let num = this.data.num
    if(num>0){
      num--
    }
    this.setData({
      num
    })
  },
  goOrder(){
    let carInfo = this.data.trainDetail
    carInfo['num'] = this.data.num
    if(this.data.discount){
      carInfo['totalPrice'] = 4500
    }else{
      carInfo['totalPrice'] = 9000
    }
    console.log(carInfo)
    wx.navigateTo({
      url: '/pages/throughTrain/pages/selectMap/index/index?carInfo='+JSON.stringify(carInfo),
    })
  },
  //展开详情
  showDetail(){
    let IconTrue = !this.data.IconTrue
    this.setData({
      IconTrue,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = JSON.parse(options.item).id
    let carPrice = JSON.parse(options.item).price
    request({
      url:'/through-train/detail',
      data:{
        id
      }
    }).then(res => {
      if(res.code == 200 && res.data){
        console.log(res.data.project)
        let project = res.data.project.split(/\n/g)
        console.log(project)
        res.data.project = project
        res.data.img_json = JSON.parse(res.data.img_json)
        this.setData({
          trainDetail:res.data,
          carPrice,
          init:true
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
    let timeStamp = new Date(new Date().toLocaleDateString()).getTime()
    if(timeStamp>=1594310400000 && timeStamp<=1596988800000){
      this.setData({
        discount:true
      })
    }else{
      this.setData({
        discount:false
      })
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

  },
  /**
   * 页面滑动
   */
  onPageScroll: function (ev){
    console.log(ev)
    if(ev.scrollTop>=10){
      console.log(123)
      this.setData({
        nav: {
          "bg_color": "rgba(255,255,255,1)",
          "color": "#333",
          "flag": 1,
          "name": "直通车详情",
          "font_size":32,
          "font_weight":'bold',
          "tabFiexd":true,
          "Iconcolor":'black'
        },
      })
    }else{
      this.setData({
        nav: {
          "bg_color": "rgba(0,0,0,0)",
          "color": "#333",
          "flag": 1,
          "name": "",
          "tabFiexd":false,
          "Iconcolor":'white'
        },
      })
    }
  }
})