const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDateTime = timestamp => {
  var dateObj = new Date(+timestamp) // ps, 必须是数字类型，不能是字符串, +运算符把字符串转化为数字，更兼容
  var year = dateObj.getFullYear() // 获取年，
  var month = dateObj.getMonth() + 1 // 获取月，必须要加1，因为月份是从0开始计算的

  var date = dateObj.getDate() // 获取日，记得区分getDay()方法是获取星期几的。
  var hours = pad(dateObj.getHours()) // 获取时, pad函数用来补0;
  if (month < 10) {
    month = "0" + month;
  }
  return month + '月' + date + '日' + '  (今天)'
}

const pad = str => {
  return +str >= 10 ? str : '0' + str
}

function getDates(days) {
  var todate = getCurrentMonthFirst()
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}

/**
 * 传入时间后几天
 * param：传入时间：dates: "2018-04-02", later:往后多少天
 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth());
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}

// 获取当前时间
function getCurrentMonthFirst() {
  var date = new Date();
  var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  return todate;
}

//获得某月的最后一天  
function getLastDay(year, month) {
  var new_year = year; //取当前的年份          
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
  if (month > 12) {
    new_month -= 12; //月份减          
    new_year++; //年份增          
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期          
}

module.exports = {
  formatTime: formatTime,
  formatDateTime: formatDateTime,
  getDates: getDates,
  dateLater: dateLater,
  getLastDay: getLastDay
}