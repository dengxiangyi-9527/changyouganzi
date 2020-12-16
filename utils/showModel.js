/**
 * options:Object 传递参数
 * title:String 提示标题
 * content： String 提示内容
 * showCancel:Boolean 是否显示取消按钮
 * cancelColoe：String 取消按钮的文字颜色
 * cancelText: String 取消按钮的文字
 * confirmText: String 确认按钮文字
 * confirmColor： String 确认按钮文字颜色
 * url：String 确认跳转的路径
 * data：Object 跳转参数
 */
export function showModel(options){
  var { title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor, url,method,callback} = options
  console.log(method)
  if(method){
    method = method
  }else{
    method = 2
  }
  wx.showModal({
    title: title || '',
    content: content || '',
    showCancel: showCancel || true,
    cancelText: cancelText || '取消',
    cancelColor: cancelColor || '#000000',
    confirmText: confirmText || '确认',
    confirmColor: confirmColor || '#576B95',
    success:(res) => {
      if(res.confirm){
        if(callback){
          callback()
        }
        if(url){
          if(method == 1){
            wx.redirectTo({
              url: url,
            })
          }else if(method == 2){
            console.log(url)
            wx.navigateTo({
              url: url,
            })
          }else if(method == 3){
            wx.reLaunch({
              url: url
            })
          }
        }else if(method == 4){
          wx.navigateBack({
            delte:1
          })
        }else if(method == 5){
          wx.switchTab({
            url: url,
          })
        }
      }
    }
  })
}