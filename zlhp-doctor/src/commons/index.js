/**
 * 计算时间是今天、昨天、还是更早
 *
 */
export function formatDate(dateparam) {
  let date = new Date(dateparam);
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  // today 为今天凌晨的时间
  let dayTime = 24 * 60 * 60 * 1000;
  let delta = today - date; // 得到相差的时间 ms
  if (delta > 0) {
    if (delta <= dayTime) {
      return "昨天";
    } else if (delta <= 2 * dayTime) {
      return "前天";
    }
  } else if (-delta < dayTime) {
    return `今天 ${new Date(dateparam).format("hh:mm")}`;
  }
  return `${new Date(dateparam).format("yyyy-MMMM-dddd")}`;
}
