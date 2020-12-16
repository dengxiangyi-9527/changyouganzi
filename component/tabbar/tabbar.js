// component/tabbar/tabbar.js
import { showModel } from '../../utils/showModel'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeIndex: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabbar: [
      {
        name: '首页',
        icon: 'index',
        active: 'index_a',
        url: '/pages/index/index',
        show: true
      },
      {
        name: '乘车票',
        icon: 'ticket',
        active: 'ticket_a',
        url: '/pages/ticket/ticket',
        show: true
      },
      {
        name:'订单',
        icon: 'order',
        active: 'order-a',
        url: '/pages/order/pages/order/order',
        show: true
      },
      {
        name: '我的',
        icon: 'user',
        active: 'wode_a',
        url: '/pages/user/user',
        show: true
      }
    ],
    isIpx: app.globalData.isIpx ? true : false, //适配iphone X
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapName(e) {
      let url = e.currentTarget.dataset.url
      console.log(url)
      wx.switchTab({
        url,
      })
    }
  }
})
