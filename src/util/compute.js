/**
 * 格式化时间
 *
 * @param {number} retData  时长
 * @returns {string}
 */
export default function formatTime(number) {
  let second = parseInt(number, 10);
  let minute = 0;
  let hour = 0;
  let result;
  if (second < 60) {
    if (second < 10) {
      result = `0:0${second}`;
    } else {
      result = `0:${second}`;
    }
  } else if (second < 3600) {
    minute = Math.floor(second / 60);
    second %= 60;
    if (second < 10) {
      result = `${minute}:0${second}`;
    } else {
      result = `${minute}:${second}`;
    }
  } else {
    hour = Math.floor(second / 3600);
    minute = Math.floor((second - (hour * 3600)) / 60);
    second %= 60;
    if (minute < 10 && second < 10) {
      result = `${hour}:0${minute}:0${second}`;
    } else if (minute < 10 && second >= 10) {
      result = `${hour}:0${minute}:${second}`;
    } else if (minute >= 10 && second < 10) {
      result = `${hour}:${minute}:0${second}`;
    } else if (minute >= 10 && second >= 10) {
      result = `${hour}:${minute}:${second}`;
    }
  }
  return result;
}
