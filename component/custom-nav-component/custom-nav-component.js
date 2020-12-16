var amapFile = require('../../utils/amap-wx');//如：..­/..­/libs/amap-wx.js
import { request } from '../../utils/request'
import { toast } from '../../utils/toast'
import { getSetting } from '../../utils/getSetting'
Component({
  // externalClasses: ['commonHead_left_back', 'commonHead_right_text'], 
  properties: {
    myProperty: {
      type: Object,
      value: {
        "bg_color": "white",
        "color": "#000",
        "flag": 3,
        "name": " ",
        "font_size":40,
        "font_weight":'nomal',
        "cityName":'',
        "tabFiexd":false,
        "showModel":false,
        "Iconcolor":"white"
      }
    },
    commonHeadHeight: {
      type: Object,
      value: {}
    }
  },
  data: {

  }, // 私有数据，可用于模版渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function () {
    console.log(this.data.myProperty)
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.statusBarHeight": (34 * 2),
          "commonHeadHeight.titleHeight": res.statusBarHeight + 46
        });

      }
    })

    
    //定位
    if(this.data.myProperty.flag === 4){
      getSetting(() => this.getLoc(),'scope.userLocation')
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      
    },
  },

  methods: {
    commonHead_left_back: function () {
      if(this.data.myProperty.showModel && this.data.myProperty.flag == 5){
        wx.showModal({
          title:'温馨提示',
          content:this.data.myProperty.text,
          success:(res) => {
            if(res.confirm){
              console.log(this.data.myProperty.url)
              wx.switchTab({
                url:this.data.myProperty.url
              })
            }
          }
        })
      }else{
        wx.navigateBack()
      }
    },
    commonHead_left_home: function () {
      wx.reLaunch({
        url:'/pages/index/index'
      })
    },
    cjjs(){
      // wx.navigateTo({
      //   url: '/pages/charteredBus/pages/index/index',
      // })
      toast({
        title: '请敬请期待'
      })
    },
    sckk(){
      wx.navigateTo({
        url: '/pages/RideExpress/index/index',
      })
    },
    ztc(){
      wx.navigateTo({
        url: '/pages/throughTrain/pages/trainList/index',
      })
    },
    lest(){
      toast({
        title: '请敬请期待'
      })
    },
    zpy(){
      wx.navigateTo({
        url: '/pages/peripheralTourism/pages/list/index',
      })
    },
    getLoc(){
      console.log(this)
      var myAmapFun = new amapFile.AMapWX({key:'a7b017fec1ec12bb889eca1a905f887b'});
      myAmapFun.getRegeo({
        success: (data) => {
          console.log(data)
          if(data.length>0){
            request({
              url:'/citytransport/query/position-site',
              data:{
                city_code:data[0].regeocodeData.addressComponent.citycode,
                ad_code:data[0].regeocodeData.addressComponent.adcode
              }
            }).then(res => {
                if(res.code == 200 &&res.data){
                  this.setData({
                    "myProperty.cityName": res.data.name,
                  })
                }
            })
          }
        },
      })
    }
  }

})