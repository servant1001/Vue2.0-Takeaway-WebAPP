export function formatDate(date, fmt) {
    // 年
    if (/(y+)/.test(fmt)) { // 匹配以y開頭1個或多個字串
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)); // RegExp.$1 相當於是 yyyy
    }
    // 月、天
    let o = {
        'M+': date.getMonth() + 1, // getMonth 從 0 開始，所以+1
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
