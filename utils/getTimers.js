//导出获取时间函数
/**
 * changeTimes:Number 十三位的时间戳
 */
export  function getTimers(changeTimes){
    var times = new Date(changeTimes);
    var year = times.getFullYear()
    var yue = (times.getMonth() + 1 < 10 ? '0' + (times.getMonth() + 1) : times.getMonth() + 1); //月
    var tian = (times.getDate() < 10 ? "0" + times.getDate() : times.getDate()); //天
    var day = times.getDay()
    // var hours = new Date(changeTimes - Date.parse(new Date())).getDate()
    var hours = (changeTimes - new Date(new Date().toLocaleDateString()).getTime())/1000/60/60
    var timer = ''
    if (0<= hours && hours < 24) {
      timer = year+'年'+ yue + '月' + tian + '日' + '(今天)';
    } else if (hours >= 24 && hours<48) {
      timer = year + '年' + yue + '月' + tian + '日' + '(明天)';
    } else if (hours>=48 && hours<72) {
      timer = year + '年' + yue + '月' + tian + '日' + '(后天)';
    } else {
      switch (day) {
        case 0:
          timer = year+'年'+ yue + '月' + tian + '日' + '(周日)'
          break;
        case 1:
          timer = year + '年' + yue + '月' + tian + '日' + '(周一)'
          break;
        case 2:
          timer = year + '年' + yue + '月' + tian + '日' + '(周二)'
          break;
        case 3:
          timer = year + '年' + yue + '月' + tian + '日' + '(周三)'
          break;
        case 4:
          timer = year + '年' + yue + '月' + tian + '日' + '(周四)'
          break;
        case 5:
          timer = year + '年' + yue + '月' + tian + '日' + '(周五)'
          break;
        case 6:
          timer = year + '年' + yue + '月' + tian + '日' + '(周六)'
          break;
      }
    }
    return (timer)
}