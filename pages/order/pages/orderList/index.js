import{
  request
} from '../../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:[],//有效订单
    orderInfoNull:[],//无效订单
    page:1,//页码
    pagesize:10,//每页条数
    status:0,//状态,
    allNum:0,
    init:false,
    id:''
  },

  //回到城际接送订单入口
  cjjsOrder(){
    console.log(getCurrentPages())
    wx.switchTab({
      url: '/pages/order/pages/order/order',
    })
  },
  //获取列表
  getList(){
    let orderInfoNull = this.data.orderInfoNull
    let orderInfo = this.data.orderInfo
    let url = this.data.url
    if(url){
      request({
        url,
        data:{
          page:this.data.page,
          pagesize:this.data.pagesize,
          page_size:this.data.pagesize,
          status:this.data.status
        }
      }).then(res => {
        if(res.code == 200&&res.data.length != 0){
          if(this.data.id == 1){
            res.data.data.forEach(res => {
              res.price_pay = (res.price_pay/100).toFixed(2)
              if(res.status === 8 || res.status === 5 || res.status === 9 || res.status === 11){
                orderInfoNull.push(res)
              }else{
                orderInfo.push(res)
              }
            })
            this.setData({ orderInfo,orderInfoNull,allNum:res.data.total})
            console.log(orderInfoNull)
          }else if(this.data.id == 2 || this.data.id==3 ){
              res.data.data.forEach(res =>{
                res.price = (res.price/100).toFixed(2)
                res.date = res.date.slice(0,10)
                if(res.status === 3 || res.status === 4 || res.status === 7 || res.status === 6 || res.status === 5 || res.status == 8){
                  orderInfoNull.push(res)
                }else{
                  orderInfo.push(res)
                }
              })
              this.setData({ orderInfo,orderInfoNull,allNum:res.data.total})
              console.log(orderInfoNull)
          }else if(this.data.id == 5){
            console.log(res)
            res.data.data.forEach(res => {
              res.price = (res.price/100).toFixed(2)
              res.date = res.date.slice(0,10)
              if(res.status === 3 || res.status === 4 || res.status === 7 || res.status === 6 || res.status === 5 || res.status == 8){
                orderInfoNull.push(res)
              }else{
                orderInfo.push(res)
              }
            })
            this.setData({ orderInfo,orderInfoNull,allNum:res.data.total})
          }else if(this.data.id == 6){
            res.data.data.forEach(res => {
              res.price = (res.price/100).toFixed(2)
              res.date = res.stime.slice(0,10)
              if(res.status === 3 || res.status === 4 || res.status === 7 || res.status === 6 || res.status === 5 || res.status == 8 || res.status == 9){
                orderInfoNull.push(res)
              }else if(res.status != 10){
                orderInfo.push(res)
              }
            })
            request({
              url:'/charter-custom/list-order',
              data:{
                page:this.data.page,
                pagesize:this.data.pagesize,
                page_size:this.data.pagesize,
                status:this.data.status
              },
            }).then(res => {
              if(res.code == 200){
                res.data.data.forEach(res => {
                  res.price = (res.price/100).toFixed(2)
                  res.date = res.stime.slice(0,10)
                  res['location'] = res.slocation
                  if(res.status === 3 || res.status === 4 || res.status === 7 || res.status === 6 || res.status === 5 || res.status == 8 || res.status == 9){
                    orderInfoNull.push(res)
                  }else if(res.status != 10){
                    orderInfo.push(res)
                  }
                })
                this.setData({ orderInfo,orderInfoNull,allNum:res.data.total})
              }
            })  
          }
        }
        this.setData({
          init:true
        })
      })
    }
  },
    //点击tab切换
    onChange(event) {
      console.log(event)
      let index =  event.detail.index
      if(index == 0){
        this.setData({
          page:1,
          pagesize:10,
          status:0,
          orderInfoNull:[],
          orderInfo:[],
          init:false
        })
      }else if(index == 1){
        this.setData({
          page:1,
          pagesize:10,
          status:1,
          orderInfoNull:[],
          orderInfo:[],
          init:false
        })
      }else if(index == 2){
        this.setData({
          page:1,
          pagesize:10,
          status:2,
          orderInfoNull:[],
          orderInfo:[],
          init:false
        })
      }
      this.getList()
    },
    ///详情
    toOrderDetail(e){
      if(this.data.id==1){
          if(event.currentTarget.dataset.id.type == 1){
            wx.navigateTo({
              url: '/pages/order/pages/orderDetail/index?id='+e.currentTarget.dataset.id.id+'&type=1',
            })
          }else if(event.currentTarget.dataset.id.type == 2){
            wx.navigateTo({
              url: '/pages/RideExpress/index/index?id='+ event.currentTarget.dataset.id.id,
            })
          }

      }else if(this.data.id == 2){
        wx.navigateTo({
          url: '/pages/order/pages/orderDetail/index?id='+e.currentTarget.dataset.id.id+'&type=2',
        })
      }else if(this.data.id == 3){
        wx.navigateTo({
          url: '/pages/order/pages/orderDetail/index?id='+e.currentTarget.dataset.id.id+'&type=3',
        })
      }else if(this.data.id == 5){
        console.log(e.currentTarget.dataset.id.order_sn)
        wx.navigateTo({
          url: '/pages/order/pages/orderDetail/index?order_sn='+e.currentTarget.dataset.id.order_sn+'&type=4',
        })
      }else if(this.data.id == 6){
          if(!e.currentTarget.dataset.id.type){
            wx.navigateTo({
              url: '/pages/CustomTour/pages/orderDetail/index?orderSn='+e.currentTarget.dataset.id.order_sn,
            })
          }else{
            wx.navigateTo({
              url: '/pages/CustomTour/pages/customized/process/index?order_sn='+e.currentTarget.dataset.id.order_sn+'&type='+e.currentTarget.dataset.id.type,
            })
          }
      }
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({id:options.id})
    console.log(this.data.id)
    if(options.id == 1){
      this.setData({url:'/citytransport/order/get-order'})
    }else if(options.id == 2){
      this.setData({url:'/through-train/list-order'})
    }else if(options.id == 3){
      this.setData({url:'/scenic-area/list-order'})
    }else if(options.id == 5){
      this.setData({url:'/travel-around/order/list'})
    }else if(options.id == 6){
      this.setData({url:'/charter/list-order'})
    }
    this.getList()
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
    this.setData({
      page:1,
      pagesize:10,
      orderInfo:[],
      orderInfoNull:[]
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.orderInfo.length+this.data.orderInfoNull.length<this.data.allNum){
      let page = this.data.page
      this.setData({
        page:page+1
      })
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})