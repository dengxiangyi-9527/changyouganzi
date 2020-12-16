// pages/editUserInfo/medicalCheck/medicalCheck.js
import {
  request
} from '../../../utils/request'
import {
  toast
} from '../../../utils/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', //姓名
    job: '', //职业
    cardSrc: '', //工作证照片src
    allIput:false, //是否填完
  },

  /**
   * 真实姓名,职业,公司的输入框,type为data-type传过来的值
   */
  inputMsg(e) {
    // console.log(e)
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value.trim(),
      allIput : true // 点亮可提交按钮
    })
   
  },
  /**
   * 上传工作证
   */
  takePhone() {
    const that = this
    // 调用微信的拍照功能
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        // console.log(tempFilePaths)
        that.uploadQiniu(tempFilePaths);
      }
    })
  },
  /**
   * 图片上传七牛云
   */
  uploadQiniu(tempFilePaths) {
    let that = this;
    //获取七牛云token
    request({
      url: '/public/get-upload-token'
    }).then(res => {
      // console.log(res.data)
      let token = res.data;
      // console.log(token)
      wx.uploadFile({
        url: 'https://upload-z0.qiniup.com',
        name: 'file',
        filePath: tempFilePaths[0],
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          token: token,
        },
        success: function (res) {
          if (res.statusCode == 200) {
            let data = JSON.parse(res.data)
            // console.log(data.key)
            that.setData({
              cardSrc: 'https://static2.jd-gz.com/' + data.key,
              allIput : true // 点亮可提交按钮
            })        
          }
        },
        fail: function (res) {
          console.log(res)
        }
      });
    })
  },
  /**
   * 提交审核
   */
  submitMsg() {
    let name = this.data.name.trim()
    let job = this.data.job.trim()
    let company = this.data.company.trim()
    
    let cardSrc = this.data.cardSrc
    console.log(name, job,company, cardSrc)
    if (name && job && company && cardSrc) {
      //所有的都填完整的情况，请求接口发送给后端
      // 提交审核的按钮变为可点击状态
      this.setData({
        allIput:true
      })
      request({
        url:'/hero/submit',
        data:{
          name,
          job,
          work_unit:company,
          auth_img:cardSrc
        },
        method:'POST'
      }).then(res=>{
        console.log(res)
        if(res.code == 200){
          //提交成功,跳到审核页面
          wx.redirectTo({
            url: '/pages/editUserInfo/medicalCheckResult/medicalCheckResult',
          })
        }else{
          toast({
            title:res.error
          })
        }
      })


    } else if (!name) {
      toast({
        title: "请输入真实姓名"
      })
    } else if (!job) {
      toast({
        title: "请输入你的职业名称"
      })
    } else if(!company){
      toast({
        title: "请输入你的单位名称"
      })
    }else if (!cardSrc) {
      toast({
        title: "请上传你的工作证照片"
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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