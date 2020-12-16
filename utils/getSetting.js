  /**
   * 
   * @param {Function} callback //需要授权函数
   * @param {String} scope //需要授权的scope
   */
  import {
    showModel
  } from './showModel'
  //获取授权
  export function getSetting(callback,scope){
    let text = ''
    switch(scope){
      case 'scope.userInfo':
          text = '检测到您没打开小程序获取用户信息的权限，是否去设置打开？'
          break;
      case 'scope.userLocation':
          text = '检测到您没打开小程序获取地理的权限，是否去设置打开？'
          break;
      case 'scope.userLocationBackground':
          text = '检测到您没打开小程序获取后台定位的权限，是否去设置打开？'
          break;
      case 'scope.address':
          text = '检测到您没打开小程序获取通讯地址的权限，是否去设置打开？'
          break;
      case 'scope.invoiceTitle':
          text = '检测到您没打开小程序获取发票抬头的权限，是否去设置打开？'
          break;
      case 'scope.invoice':
          text = '检测到您没打开小程序获取发票的权限，是否去设置打开？'
          break;
      case 'scope.werun':
          text = '检测到您没打开小程序获取微信运动步数的权限，是否去设置打开？'
          break;    
      case 'scope.record':
          text = '检测到您没打开小程序录音功能的权限，是否去设置打开？'
          break;   
      case 'scope.writePhotosAlbum':
          text = '检测到您没打开小程序相册的权限，是否去设置打开？'
          break;   
      case 'scope.camera':
          text = '检测到您没打开小程序摄像的权限，是否去设置打开？'
          break;       
      default:
        text = '检测到您没打开小程序获取此项的权限，是否去设置打开？'    
    }
    //·查看授权信息
    wx.getSetting({
      success:(res) => {
        //判断是否有授权
        if (!res.authSetting[scope]) {
          //打开授权
          wx.authorize({
            scope: scope,
            success: () => {
              //成功后回调
              callback()
            },
            fail:() => {
              //再次获取授权
              showModel({
                content: text,
                confirmText: "确认",
                cancelText: "取消",
                callback:  (res) => {
                  wx.openSetting({
                    success: (res) => { 
                      callback()
                    }
                  })
                }
              });
            }
          })
        }else{
          callback()
        }
      }
    })
  }
