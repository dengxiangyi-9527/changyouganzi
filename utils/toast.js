// 封装toast显示
export function toast(options) {
  const {
    title,
    icon
  } = options
  wx.showToast({
    title,
    icon: icon || 'none',
    duration: 2000
  })
}
