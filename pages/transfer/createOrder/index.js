import { toast } from '../../../utils/toast.js'
// pages/cjjs/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0, //获取页面高度
    show: false, // 购票须知弹出层
    active: 'a', //购票须知和退改说明的切换
    showIndex: 0, //费用明细底部折叠面板
    maskData: [{
      title: '标题',
      text: '我是抽屉'
    }],
    showPrice: false, //费用明细弹出层
    changeDisplay: "none", //控制费用明细的遮罩层
    adultPrice: 0,//成人票价格
    kidPrice: 0,//儿童票价格
    carsInfo: '',//车次信息
    timer: '',//出发时间
    adultNum: 0,//成人数年
    kidNum: 0,//儿童数量
    userName: '',//用车人姓名
    tel: '',//用车人电话
    remarks: '',//备注信息
    allPrice: 0,//总金额
    checked: false
  },

  //当前激活的标签改变时触发
  onPriceChange(event) {
    console.log(event.detail)
    this.setData({
      showPrice: event.detail
    });
  },
  // 购票须知弹出层
  showPopup() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false,
      showPrice: false
    });
  },
  //购票须知和退改说明的切换
  onDescriptionChange(event) {

  },
  //费用明细点击
  showPriceDetail(e) {
    if (this.data.adultNum || this.data.kidNum) {
      if (e.currentTarget.dataset.index != this.data.showIndex) {
        this.setData({
          showIndex: e.currentTarget.dataset.index,
          changeDisplay: "block"
        })
      } else {
        this.setData({
          showIndex: 0,
          changeDisplay: "none"
        })
      }
      this.setData({
        showPrice: true
      })
    }
  },
  //关闭遮罩层
  closeMask() {
    this.setData({
      showIndex: 0,
      changeDisplay: 'none'
    })
  },
  //去到畅游甘孜约车协议页面
  toProtocol() {
    wx.navigateTo({
      url: '/pages/cjjs/protocol/index',
    })
  },
  // 获取页面高度
  getHeight() {
    const newHeight = wx.getSystemInfoSync().windowHeight * 2 - 198
    // console.log(newHeight)
    this.setData({
      height: newHeight
    })
  },

  //点击去付款到达确认支付页面
  toPay() {
    var { carsInfo, adultNum, kidNum, timer, allPrice, userName, tel } = this.data
    if (this.data.checked && this.data.userName !== '' && this.data.tel !== '' && (this.data.adultNum !== 0 || this.data.kidNum !== 0)) {
      wx.navigateTo({
        url: '/pages/cjjs/pay/index',
        success: (res) => {
          res.eventChannel.emit('userInfo', { carsInfo, adultNum, kidNum, timer, allPrice, userName, tel })
        }
      })
    } else if (this.data.checked == false) {
      toast({ title: '请先勾选同意协议' })
    } else if (this.data.userName == '') {
      toast({ title: '请填写姓名' })
    } else if (this.data.tel == '') {
      toast({ title: '请填写电话' })
    } else if (this.data.adultNum == 0 && this.data.kidNum == 0) {
      toast({ title: '请填写出行人数' })
    }
  },

  //成年人数变化
  adultChange(event) {
    this.setData({ adultNum: event.detail })
    this.getAllPrice()

  },

  //儿童数量变化
  kidChange(event) {
    this.setData({ kidNum: event.detail })
    this.getAllPrice()
  },
  //获取用户姓名
  getUserName(event) {
    this.setData({ userName: event.detail.value })

  },
  //获取电话
  getUserTel(event) {
    var tel = event.detail.value
    if (tel !== '') {
      if (!(/^1[3456789]\d{9}$/.test(tel))) {
        wx.showToast({
          title: '请输入正确手机号',
          icon: 'none',
          duration: 2000
        })
      } else {
        this.setData({ tel })
      }
    }
  },
  //获取备注
  getRemarks(event) {
    this.setData({ remarks: event.detail.value })
    console.log(this.data.remarks)
  },
  //计算总金额
  getAllPrice() {
    var allPrice = this.data.allPrice
    var adultNum = this.data.adultNum
    var kidNum = this.data.kidNum
    var adultPrice = Number(this.data.adultPrice)
    var kidPrice = Number(this.data.kidPrice)
    allPrice = adultNum * adultPrice + kidNum * kidPrice
    this.setData({ allPrice })
  },
  //点击同意协议
  onChecked() {
    var checked = !this.data.checked
    this.setData({ checked })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight() // 获取页面高度
    //监听selectFlight传来的参数
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('carsInfo', (res) => {
      this.setData({
        carsInfo: res.carsInfo,
        adultPrice: res.carsInfo.adult_price,
        kidPrice: res.carsInfo.kid_price,
        timer: res.timer.slice(0, 6)
      })
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

  }
})