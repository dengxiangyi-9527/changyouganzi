
import { showModel } from './showModel'
// 设置BaseUrl
var baseUrl = 'https://api.jd-gz.com'
// var baseUrl = 'https://dev.jd-gz.com'
// 数据请求封装
export function request(res) {
    // type为当前页面的路径
  let { url, data, method,isLoading,type,isShowModel } = res
  if(isLoading == undefined){
    isLoading = true
  }
  var getToken = () => {
    return wx.getStorageSync('token')
  }
  var header = {
    'content-type': 'application/x-www-form-urlencoded',
    'token': getToken(),
    'Authorization': 'Bearer ' + getToken()
  }
  let type1 = encodeURIComponent('index/index')

  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: data || {},
      method: method || 'GET',
      dataType: 'STRING',
      header: header || {},
      success: (res) => {
          // console.log(res)
            if(res.statusCode == 200){
              if(JSON.parse(res.data).code == 200){
                resolve(JSON.parse(res.data))   
              }else if(JSON.parse(res.data).code == 401){
                let type3 =  type || decodeURIComponent(type1)
                console.log(`/pages/login/index?type=${type3}`)
                if (!isShowModel) {
                  showModel({
                    content:'您尚未登录，请先登录',
                    url:`/pages/login/index?type=${type3}`,
                  })
                } else {
                  resolve(JSON.parse(res.data))   
                }
              }else if(JSON.parse(res.data).code == 500){
                if (!isShowModel) {
                  wx.showModal({
                    content	: '网络请求错误，请稍后重试',
                    showCancel:false,
                    confirmText:'我知道了'
                  })
                } else {
                  resolve(JSON.parse(res.data))  
                }
              }else{
                if (!isShowModel) {
                  if(JSON.parse(res.data).error !=='获取用户信息失败,请稍候再试!'){
                    wx.showModal({
                      content	: JSON.parse(res.data).error,
                      showCancel:false,
                      confirmText:'我知道了'
                    })
                  }
                } else {
                  resolve(JSON.parse(res.data))  
                }
              }
            }else{
              wx.showModal({
                content	: '网络错误，请稍后重试',
                showCancel:false,
                confirmText:'我知道了'
              })
            }         
      },
      fail: (err) => {
        reject(err)
      },
      complete: function () {
        // wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  })
}