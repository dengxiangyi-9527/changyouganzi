import { request } from '../../../utils/request'
import { toast } from '../../../utils/toast'
// pages/editUserInfo/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,//页码
    page_size:10,//条数
    couponList:[],//代金卷列表
    total:0,
    route_id:''//线路ID
  },
  //查看失效的代金卷
  goExCoupon(){
    wx.navigateTo({
      url: '/pages/coupon/expiredCoupon/expiredCoupon',
    })
  },
  //去使用
  goUse(e){
    let couponInfo = e.currentTarget.dataset.item
    console.log(couponInfo)
    if(couponInfo.check == false){
      let couponList = this.data.couponList.map(res => {
        res.check = false
        if(res.id == couponInfo.id){
          console.log(res)
          res.check=true
        }
        return res
      })
      this.setData({
        couponList
      })
      if(this.data.route_id !== ''){
        let pages = getCurrentPages()
        if(pages.length -1 >0){
          let prePage = pages[pages.length - 2];
          prePage.setData({
            couponInfo,
            couponName:couponInfo.money+'元优惠券',
            couponMoney:couponList.money,
          })
        }
        wx.navigateBack({
          delta:1
        })
      }else{
        wx.redirectTo({
          url: '/pages/cjjs/index/index',
        })
      }
    }else if(couponInfo.check == true){
      let couponList = this.data.couponList.map(res => {
        if(res.id == couponInfo.id){
          let pages = getCurrentPages()
          if(pages.length -1 >0){
            let prePage = pages[pages.length - 2];
            prePage.setData({
              couponInfo:'',
              couponName:"",
              couponMoney:'',
            })
          }
          console.log(res)
          res.check=false
        }
        return res
      })
      this.setData({
        couponList
      })
    }
  },
  // 空白页推荐好友
  toTuiJian(){
    wx.navigateTo({
      url: '/pages/coupon/recommendIndex/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.route_id!== ''){
      this.setData({
        route_id:options.route_id
      })
    }
    request({
      url:'/citytransport/me/coupon',
      method:'POST',
      data:{
        route_id:this.data.route_id,
        status:0,
        page:this.data.page,
        page_size:this.data.page_size
      }
    }).then(res => {
      if(res.code === 200){
        let couponList = []
        res.data.ret.map(data => {
          data['check'] = false
          let pages = getCurrentPages()
          if(pages.length-1>0){
            let prePage = pages[pages.length - 2];
            if(prePage.data.couponInfo){
              if(data.id == prePage.data.couponInfo.id){
                    data.check = true
              }
            }
          }
          this.setData({
            total:res.total
          })
          if(data.route_id !== 0){
            request({
              url:'/citytransport/query/station-query',
              data:{
                route_id:data.route_id
              }
            }).then(ele => {
              if(ele.code === 200){
                data['line'] = ele.data[0].name+'⇌'+ele.data[1].name
                data.money = (data.money/100)
                couponList.push(data)
                this.setData({
                  couponList,
                })
              }
            })
          }else{
            data['line'] = '无限制'
            data.money = (data.money/100)
            couponList.push(data)
            this.setData({
              couponList,
            })
          }
        })
      }
      console.log(this.data.couponList)
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
    if(this.data.total > 10){
      let page = this.data.page + 1 
      request({
        url:'/citytransport/me/coupon',
        method:'POST',
        data:{
          status:0,
          page:page,
          page_size:this.data.page_size
        }
      }).then(res => {
        if(res.code === 200){
          let couponList = this.data.couponList
          res.data.ret.map(res => {
            res.money = (res.money/100)
            couponList.push(res)
          })
          this.setData({
            page:page,
            couponList:couponList,
            total:res.total
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})