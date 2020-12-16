import { toast } from "../../../../../utils/toast"
import { request } from '../../../../../utils/request'
import { showModel } from '../../../../../utils/showModel'
// pages/CustomTour//pages/customized/sudmit/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data1:[
      {
        id:1,
        name:'初次体验',
        check:false,
      },
      {
        id:2,
        name:'故地重游',
        check:false,
      },
      {
        id:3,
        name:'深度探索',
        check:false,
      },
    ],
    data2:[
      {
          id:1,
          name:"门票",
          check:false,
      },
      {
        id:2,
        name:"线路设计",
        check:false,
      },
      {
        id:3,
        name:"用车",
        check:false,
      },
      {
        id:4,
        name:"酒店",
        check:false,
      },
      {
        id:5,
        name:"用餐",
        check:false,
      },
    ],
    data3:[
      {
        id:1,
        name:'无明确预算',
        check:false,
      },
      {
        id:2,
        name:'¥1000-¥3000',
        check:false,
      },
      {
        id:3,
        name:'¥3000-¥5000',
        check:false,
      },
      {
        id:4,
        name:'¥5000-¥8000',
        check:false,
      },
      {
        id:5,
        name:'¥8000-¥10000',
        check:false,
      },
      {
        id:6,
        name:'¥10000以上',
        check:false,
      },
    ],
    remark:'',
    userInfo:'',//用户信息
    userList:[]
  },
  //提交
  submit(){
    if('Travel' in this.data.userInfo && 'services' in this.data.userInfo &&'prices' in this.data.userInfo && this.data.userList.length>0){
      request({
        url:'/charter-custom/submit',
        data:{
          type:this.data.userInfo.type,
          name:this.data.userInfo.userName,
          phone:this.data.userInfo.userTel,
          id_card_number:this.data.userList[0].id_card_number,
          stime:this.data.userInfo.currentDate,
          etime:this.data.userInfo.endDate,
          slocation:this.data.userInfo.cityFrom,
          elocation:this.data.userInfo.cityTo,
          member:Number(this.data.userInfo.adultNum),
          child:Number(this.data.userInfo.kidNum),
          old:Number(this.data.userInfo.oldNum),
          manytimes:this.data.userInfo.Travel.name,
          budget:this.data.userInfo.prices.name,
          service:String(this.data.userInfo.services),
          remark:this.data.remark,
        },
        method:'POST'
      }).then(res => {
        console.log(res)
        if(res.code == 200 && res.data){
          wx.navigateTo({
            url: '/pages/CustomTour/pages/customized/process/index?order_sn='+''+'&type='+this.data.userInfo.type,
          })
        }
      })
    }else if(this.data.userList.length == 0){
      toast({title:'请添加乘客'})
    }else{
      toast({title:'请选择基本需求'})
    }
  },
    //添加乘客
    addUser(){
      wx.navigateTo({
        url: '/pages/commonUser/pages/index/index?userList='+JSON.stringify(this.data.userList),
      })
    },
    scrollend(e){
      console.log(e)
      let item = e.target.dataset.item
      let userList = this.data.userList.map(res => {
        if(res.id == item.id){
          res.delcheck = true
        }
        return res
      })
      this.setData({userList})
    },
    scrollstart(e){
      let item = e.target.dataset.item
      let userList = this.data.userList.map(res => {
        if(res.id == item.id){
          res.delcheck = false
        }
        return res
      })
      this.setData({userList})
    },
      //删除乘客
  delUser(e){
    let item = e.currentTarget.dataset.item
    let userList = []
    this.data.userList.map(res =>{
      if(res.id != item.id){
        userList.push(res)
      }
    })
    this.setData({userList})
  },
  //选择第几次去
  numChange(e){
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    let data1 = []
    console.log(id)
     this.data.data1.map(res =>{
      res.check = false
      if(res.id == id){
        res.check = !res.check
      }
      if(res.check){
        let userInfo =  this.data.userInfo
        userInfo['Travel'] = res
        this.setData({userInfo})
      }
      data1.push(res)
    })
    console.log(data1)
    this.setData({data1})
  },
  //服务
  serviceChange(e){
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    let data2 = []
    let list = []
    let userInfo =  this.data.userInfo
     this.data.data2.map(res =>{
      if(res.id == id){
        res.check =  !res.check
      }
      console.log(res)
      if(res.check){
        list.push(res.name)
      }
      userInfo['services'] = list
      this.setData({userInfo})
      data2.push(res)
    })
    console.log(data2)
    this.setData({data2})
  },
  priceChange(e){
    console.log(e.currentTarget)
    let id = e.currentTarget.dataset.id
    let data3 = []
    console.log(id)
     this.data.data3.map(res =>{
      res.check = false
      if(res.id == id){
        res.check = !res.check
      }
      if(res.check){
        let userInfo =  this.data.userInfo
        userInfo['prices'] = res
        this.setData({userInfo})
      }
      data3.push(res)
    })
    this.setData({data3})
  },
  //备注
  remarkInput(e){
    console.log(e)
    this.setData({
      remark:e.detail.value
    })
    let userInfo =  this.data.userInfo
    userInfo['remark'] = res
    this.setData({userInfo})
  },
  //获取用户信息
  getUserInfo(){
    request({
      url:'/citytransport/me/get',
      isShowModel:true,
    }).then(res => {
      if(res.code == 401){
        showModel({
          content: '您尚未登录，请先登录',
          confirmColor:'#18AFFF',
          url:'/pages/login/index?type=CustomTour/pages/customized/sudmit/index'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({userInfo:JSON.parse(options.userInfo)})
    this.getUserInfo()
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