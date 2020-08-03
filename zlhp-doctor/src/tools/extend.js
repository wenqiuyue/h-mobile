/**
 **
 * 日期格式化函数扩展
 * @param format
 * @returns {*}
 */
// eslint-disable-next-line no-extend-native
Date.prototype.format = function formatDate(format = "yyyy-MM-dd hh:mm:ss") {
  const o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "h+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    S: this.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  Object.keys(o).forEach(key => {
    if (new RegExp(`(${key})`).test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[key]
          : `00${o[key]}`.substr(`${o[key]}`.length)
      );
    }
  });
  return format;
};
