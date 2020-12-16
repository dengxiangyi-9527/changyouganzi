// pages/CustomTour//pages/order/index.js
import{
  getTimers
} from '../../../../utils/getTimers'
import{
  request
} from '../../../../utils/request'
import{
  toast
} from '../../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],//乘客列表
    tel:'',//电话
    checked:false,//协议按钮
    allPrice:0,//总价格
    showIcon:false,
    carInfo:'',//车辆信息
    currentDate:'',//开始时间
    endDate:'',//结束时间
    dayNum:'',//天数
    remarks:''
  },

    //获取电话
    getUserTel(event) {
      var tel = event.detail.value
      if (tel !== '') {
        var tel = event.detail.value
        this.setData({
          tel
        })
      }
    },
   //判断手机号
   inspectTel(){
    var tel = this.data.tel
    if (tel !== '') {
      if (!(/^1[3456789]\d{9}$/.test(tel))) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        })
        this.setData({ tel:'' })
      } else {
        this.setData({ tel })
      }
    }
  },
    //获取备注
    getRemarks(event) {
      this.setData({ remarks: event.detail.value })
    },

      //添加乘客
  addUser(){
    wx.navigateTo({
      url: '/pages/commonUser/pages/index/index?userList='+JSON.stringify(this.data.userList),
    })
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
    //去到畅游甘孜约车协议页面
    toProtocol(e) {
      console.log(e.currentTarget.dataset.protocoltype)
      let protocoltype = e.currentTarget.dataset.protocoltype
      wx.navigateTo({
        url: '/pages/charteredBus/pages/protocol/index?protocoltype=' + protocoltype,
      })
    },
    onChecked() {
      var checked = !this.data.checked
      this.setData({ checked })
    },
  //费用明细点击
  showPriceDetail(e) {
    let showIcon = !this.data.showIcon
    this.setData({showIcon})
  },
    //获取日期
    getDate(time,isFrom){
      let times = getTimers(time)
      times = times.slice(0,4)+'-'+times.slice(5,7)+'-'+times.slice(8,10)
      if(isFrom){
        this.setData({currentDate:times})
      }else{
        this.setData({endDate:times})
      }
    }, 

    //下单
    toPay(){
      let { userList,tel,currentDate,endDate,fromLoc,carInfo,checked,remarks } = this.data
      let startDay = new Date(new Date().toLocaleDateString()).getTime()+23*60*60*1000
      let endDay = new Date(new Date().toLocaleDateString()).getTime()+30*60*60*1000
      let nowDay = new Date().getTime()
      if(nowDay > startDay && nowDay<endDay){
        toast({ title:'23点后系统维护，请于明早6点后下单'})
      }else{
        if(userList.length>0&&tel != '' && currentDate != ''&&endDate != '' && fromLoc != ''&&carInfo!='' && checked){
          console.log(fromLoc.fromLocation.split(','))
          request({
            url:'/charter/submit',
            data:{
              name:userList[0].name,
              phone:tel,
              id_card_number:userList[0].id_card_number,
              stime:currentDate,
              etime:endDate,
              lat:fromLoc.fromLocation.split(',')[1],
              lng:fromLoc.fromLocation.split(',')[0],
              location:fromLoc.fromLocationInfo,
              car_model_id:carInfo.id,
              remark:remarks
            },
            method:'POST'
          }).then(res => {
            console.log(res)
            if(res.code == 200 && res.data){
              toast({title:'下单成功'})
              wx.removeStorageSync('endDate')
              wx.removeStorageSync('currentDate')
              wx.removeStorageSync('fromLocation')
              wx.navigateTo({
                url: '/pages/CustomTour/pages/pay/index?orderSn='+res.data,
              })
            }
          })
        }else if(userList.length == 0){
          toast({title:'请添加乘客'})
        }else if(tel == ''){
          toast({title:'请填写联系电话'})
        }else if(currentDate == ''){
          toast({title:'请重新选择开始时间'})
        }else if(endDate == ''){
          toast({title:'请重新选择结束时间'})
        }else if(fromLoc ==''){
          toast({title:'请重新选择上车地点'})
        }else if(carInfo == ''){
          toast({title:'请重新选择车型'})
        }else if(!checked){
          toast({title:'请先勾选同意协议'})
        }
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let carInfo = JSON.parse(options.carInfo)
    let currentTime = wx.getStorageSync('currentDate')
    let endTime = wx.getStorageSync('endDate')
    let fromLoc = wx.getStorageSync('fromLocation')
    let dayNum = ''
    let allPrice = ''
    this.getDate(currentTime,true)
    this.getDate(endTime,false)
    if(endTime && currentTime){
       dayNum = (endTime-currentTime)/1000/60/60/24+1
    }
    allPrice = ((dayNum*carInfo.price)/100).toFixed(2)
    this.setData({carInfo,fromLoc,dayNum,allPrice})
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