
function coordinateLoc(longitude,Latitude ){
  let lng = (longitude*1).toFixed(6)
  let lat = (Latitude *1).toFixed(6)
 return new Promise((resolve,reject) => {
  wx.request({
    url: 'https://restapi.amap.com/v3/assistant/coordinate/convert',
    data:{
      key:'378e9c01b887d13383eba7dc7ef637b8',
      locations:lng+','+lat,
      coordsys:'gps'
    },
    success:(res) => {
      resolve(res.data)
    }
  })
 })
}
export { coordinateLoc };