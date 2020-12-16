// pages/editUserInfo/edit/index.js
import areaList from './area.js'; //引入省市地区的数据
import {
  request
} from '../../../utils/request.js'
import {
  toast
} from '../../../utils/toast.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '', //头像
    nickName: '', //用户名
    gender: '', //性别
    city: '', //城市
    province: '', //省份
    user_introduction: '', //个人简介
    genderShow: false, //更改性别的弹窗显示
    manGender: false, //是否点击了男
    girlGender: false, //是否点击了女
    birthdayShow: false, //更改生日的弹窗
    currentDate: new Date().getTime(), //当前时间
    minDate: new Date().getTime() - new Date().getTime(), //生日日期最小时间
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    }, //生日日期的选择
    showBirthdayData: '', //显示在页面的生日日期
    areaShow: false, //更改地区的弹窗显示
    areaList: areaList, //省市区的数据列表
    // urlKey:'', //七牛云的上传成功之后返回的key
  },

  //获取用户信息
  getUserInfoForm() {
    let that = this
    request({
      url: '/citytransport/me/get',
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        let data = res.data
        console.log(data.username)
        console.log(data.nickname)
        if(data.username){
          this.setData({
            nickName: data.username, //用户名
          })
        }else{
          this.setData({
            nickName: data.nickname, //用户名
          })
        }

        if (!data.intro) {
          this.setData({
            user_introduction: '点击设置', //个人简介
          })
        } else {
          this.setData({
            user_introduction: data.intro, //个人简介
          })
        }
        if (wx.getStorageSync('avatarUrl')) {
          this.setData({
            avatarUrl: wx.getStorageSync('avatarUrl')
          })
        } else {
          this.setData({
            avatarUrl: data.avatar_image
          })
        }
        if (!data.birthday) {
          this.setData({
            showBirthdayData: '点击设置',
          })
        } else {
          this.setData({
            showBirthdayData: data.birthday,
          })
        }
        if (data.gender == 2) {
          this.setData({
            gender: '女'
          })
        } else if (data.gender == 1) {
          this.setData({
            gender: '男'
          })
        }
        // 省份
        if (data.province_id) {
          // console.log(areaList.province_list)
          for (let key in areaList.province_list) {
            if (key.includes(data.province_id)) {
              this.setData({
                province: areaList.province_list[key]
              })
            }
          }
        } else {
          this.setData({
            province: data.province, //省份
          })
        }
        // 城市
        if (data.city_id) {
          // console.log(areaList.city_list)
          for (let key in areaList.city_list) {
            if (key.includes(data.city_id)) {
              this.setData({
                city: areaList.city_list[key]
              })
            }
          }
        } else {
          this.setData({
            city: data.city, //省份
          })
        }

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
            console.log(data.key)
            that.setData({
              avatarUrl: 'https://static2.jd-gz.com/' + data.key
            })
            wx.setStorageSync('avatarUrl', 'https://static2.jd-gz.com/' + data.key)
          }
        },
        fail: function (res) {
          console.log(res)
        }
      });
    })


  },
  /**更换头像 */
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
  /**更换用户名 */
  editName() {
    // console.log("更换用户名")
    wx.navigateTo({
      url: '/pages/editUserInfo/editName/index',
    })
  },
  /**更换简介 */
  editJj() {
    // console.log("更换简介")
    wx.navigateTo({
      url: '/pages/editUserInfo/editJj/index',
    })
  },
  /**选择性别 */
  editGender() {
    this.setData({
      genderShow: true
    });
  },
  onGenderClose() {
    this.setData({
      genderShow: false
    });
  },
  clickManGender() {
    //点击的是男,改变页面状态
    this.setData({
      manGender: true,
      girlGender: false,
      genderShow: false
    });
    // 将修改的存到storage里
    // wx.setStorageSync('user_gender', '男')
    request({
      url: '/citytransport/me/edit',
      data: {
        gender: 1
      },
      method: 'POST'
    }).then(res => {
      if (res.code == 200) {
        this.getUserInfoForm()
      }
    })
    // this.isLogin()
    this.getUserInfoForm()
  },
  clickGirlGender() {
    this.setData({
      manGender: false,
      girlGender: true,
      genderShow: false
    });
    // 将修改的存到storage里
    // wx.setStorageSync('user_gender', '女')
    request({
      url: '/citytransport/me/edit',
      data: {
        gender: 2
      },
      method: 'POST'
    }).then(res => {
      if (res.code == 200) {
        this.getUserInfoForm()
      }
    })
  },
  getDate(str) {
    var oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSec = oDate.getSeconds(),
      oTime = oYear + '年' + oMonth + '月' + oDay + '日' //最后拼接时间
    return oTime;
  },
  /**更改生日 */
  editBirthday() {
    //更改生日的弹窗出现
    this.setData({
      birthdayShow: true
    });
  },
  onBirthdayClose() {
    //更改生日的弹窗关闭
    // this.getUserInfoForm()
    this.setData({
      birthdayShow: false
    })
  },
  // 生日日期选择,vant框架的事件
  onInput(event) {
    let updateB = this.getDate(event.detail)
    // console.log(updateB)
    // console.log(event.detail)
    this.setData({
      currentDate: event.detail
    })
    request({
      url: '/citytransport/me/edit',
      data: {
        birthday: updateB
      },
      method: 'POST'
    }).then(res => {
      if (res.code == 200) {
        // toast({title:'修改生日成功'})
        // console.log(res)
      }
    })
  },
  //点击确定
  confirm(e) {
    // this.getUserInfoForm()
    this.setData({
      birthdayShow: false
    })

  },


  /**更改地区 */
  editArea() {
    this.setData({
      areaShow: true
    });
  },
  onAreaClose() {
    this.setData({
      areaShow: false
    });
  },
  areaConfirm(e) {
    // wx.setStorageSync('province', e.detail.values[0].name)
    // wx.setStorageSync('city', e.detail.values[1].name)
    console.log(parseInt(e.detail.values[0].code)) //省份的code
    console.log(parseInt(e.detail.values[1].code)) //城市的code
    request({
      url: '/citytransport/me/edit',
      data: {
        province_id: e.detail.values[0].code,
        city_id: e.detail.values[1].code
      },
      method: 'POST'
    }).then(res => {
      if (res.code == 200) {
        // console.log(res)
        this.getUserInfoForm()
      }
    })

    this.setData({
      province: e.detail.values[0].name,
      city: e.detail.values[1].name,
      areaShow: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取用户信息
    this.getUserInfoForm()
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
    wx.switchTab({
      url: '/pages/user/user',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
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