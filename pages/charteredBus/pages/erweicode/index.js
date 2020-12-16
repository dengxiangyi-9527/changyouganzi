// pages/cjjs/erweicode/index.js
var QRCode = require('../../../../utils/weapp-qrcode')
import {request} from '../../../../utils/request'
import { showModel } from '../../../../utils/showModel'
import { getSetting } from '../../../../utils/getSetting'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      "bg_color": "rgba(24, 175, 255,1)",
      "color": "#fff",
      "flag": 1,
      "name": "电子二维码"
    },
    orderDetail:'',
    order_id:'',
    qr_code:'',
    tempFilePath:'',
    order_sn:'',
    imgsrc:''
  },

  //生成二维码
  getErWeiCode(canvas) {
    let qrcode = new QRCode(canvas, {
            text: 'order_id='+this.data.order_id+'&qr_code='+this.data.qr_code ,
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
            callback: (res) => {
          // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
            }
          })
      var context = wx.createCanvasContext(canvas);
      setTimeout(() => {
        context.draw(false,wx.canvasToTempFilePath({
          canvasId: canvas,
          success:  (res) => {
            var imgsrc = res.tempFilePath;
            this.setData({
              imgsrc,
            });
            wx.hideLoading()
            console.log(this.data.imgsrc)
          },
        }))
      },1000)
  },
    //保存二维码
    baocunCode(){
      this.canvasToTempImage()
    },
    canvasToTempImage() {
      wx.canvasToTempFilePath({
        canvasId: 'zz',
        success: (res) => {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          this.setData({
             tempFilePath,
          });
          getSetting(this.downloadCode,'scope.writePhotosAlbum')
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
      // 下载二维码
      downloadCode(res) {
        var filePath = this.data.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function(res) {
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail: function (err) {
            console.log(err)
            wx.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 2000//持续的时间
          })
        }
      })
    },
    //长按显示
    previewImage(){
        var that = this;
        wx.canvasToTempFilePath({
          canvasId: 'zz',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            console.log(tempFilePath);
            that.setData({
               tempFilePath,
              // canvasHidden:true
            });
            wx.previewImage({
              urls: [tempFilePath],
              current:tempFilePath
            })
          },
          fail: function (res) {
            console.log(res);
          }
        });
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages())
    let orderDetail = JSON.parse(options.orderDetail)
    this.setData({orderDetail})
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
    request({
      url:'/citytransport/order/get-qrcode',
      data:{
        order_sn:this.data.orderDetail.order_sn
      }
    }).then(res => {
      if(res.code == 200){
        this.setData({
          order_id:res.data.order_id,
          qr_code:res.data.qr_code
        })
      }
    })
    wx.showLoading({
      title: '数据正在加载中。。。',
      mask:true
    })
    setTimeout(() => {
      this.getErWeiCode('zz')
    },1500)
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