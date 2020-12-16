// pages/peripheralTourism//pages/detail/index.js
const app = getApp()
import {
  request
} from '../../../../utils/request'
import {
  getTimers
} from '../../../../utils/getTimers'
import {
  toast
} from '../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    detail:'',
    imgs_json:[],
    swiperIndex:1,
    dateList:[],
    animation:'',
    move:0,
    tabList:[
      {
        icon:"https://static2.jd-gz.com/dizhi.png",
        text:"亮点",
        check:true,
        mate:"highlights"
      },
      {
        icon:"https://static2.jd-gz.com/dizhi.png",
        text:"行程",
        check:false,
        mate:"specificItinerary"
      },
      {
        icon:"https://static2.jd-gz.com/dizhi.png",
        text:"费用",
        check:false,
        mate:"costNotice"
      },
      {
        icon:"https://static2.jd-gz.com/dizhi.png",
        text:"须知",
        check:false,
        mate:"activeNotice"
      },
    ],
    mate:"",
    scrollHeight:"",
    isFixed:false,
    titleTop:"",
    template:0,
    num:''
  },


    //获取详情
    getDetail(){
      request({
        url:'/travel-around/detail',
        data:{
          id:this.data.id
        }
      }).then(res => {
        console.log(res)
        if(res.code == 200&&res.data){
          res.data.notice = res.data.notice.split(/\n/g)
          res.data.price_info = res.data.price_info.split(/\n/g)
          this.setData({
            detail:res.data,
            imgs_json:JSON.parse(res.data.imgs)
          })
        }
      })
    },
    //时间列表
    getList(){
      let nowtemplate = new Date(new Date().toLocaleDateString()).getTime()+1*24*60*60*1000
      let dateList = []
      dateList.push({time:getTimers(nowtemplate).slice(5).replace("月","-").replace("日",""),check:false,template:nowtemplate})
      for(let i=0;i<91;i++){
        nowtemplate=1*24*60*60*1000+nowtemplate
        dateList.push({time:getTimers(nowtemplate).slice(5).replace("月","-").replace("日",""),check:false,template:nowtemplate})
      }
      this.setData({dateList})
      console.log(dateList)
    },
    //轮播图滚动
    swiperChange(e){
      let swiperIndex = e.detail.current+1
      this.setData({swiperIndex})
    },
    //选择时间
    chooseTime(event){
      console.log(event)
      let template = event.currentTarget.dataset.template
      console.log(template)
     let dateList = this.data.dateList.map(res => {
        if(res.template == template){
          res.check =  !res.check
        }else{
          res.check = false
        }
        return res
      })
      this.setData({dateList,template})
    },
    //选择标签
    chooseTab(event){
      let text = event.currentTarget.dataset.text
      let tabList = this.data.tabList.map(res => {
        if(res.text == text){
          res.check =  true
          this.setData({
            mate:res.mate
          })
          console.log(this.data.mate)
        }else {
          res.check = false
        }
        return res
      })
      this.setData({tabList})
    },
    //屏幕滚动
    scroll(){
      let titleHeight = 0
      wx.createSelectorQuery().select('#maintitle').boundingClientRect(rect=>{
        console.log(rect)
        titleHeight = rect.height+24
        }).exec()
      wx.createSelectorQuery().select('#highlights').boundingClientRect(rect=>{
        console.log(rect)
        if(rect.top<=titleHeight){
          this.setData({
            isFixed:true,
            titleTop:titleHeight/2
          })
        }else{
          console.log(123)
          this.setData({
            isFixed:false,
            titleTop:0
          })
        }
        }).exec()
    },
    //客服电话
    telPhone(){
      wx.makePhoneCall({
        phoneNumber:'19150185859'
      })
    },
    //选择上车地点
    goMapSelect(){
      let detail = this.data.detail
      console.log(detail)
      if(this.data.template){
        detail['template'] = this.data.template
        wx.setStorageSync('Tourismdetail',detail)
        wx.navigateTo({
          url: '/pages/peripheralTourism/pages/mapSelect/index/index',
        })
      }else{
        toast({title:"请选择时间"})
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let num = options.num
    this.setData({id,num})
    this.getDetail()
    this.getList()
    let app = getApp()
    console.log(app)
    this.setData({
      scrollHeight:app.globalData.phoneHeight+'px'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})