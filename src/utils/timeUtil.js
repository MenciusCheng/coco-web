 export const dateFormat = (date, layout) => {
    let ret;
    let opt = {
        "y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(layout);
        if (ret) {
            layout = layout.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return layout;
}

export const getMonthFirstDay = function(date) {
    date.setDate(1);
    return dateFormat(date, "yyyy-MM-dd");
};

export const getMonthLastDay = function(date) {
    let month = date.getMonth();
    if (month === 11) {
        date.setDate(31);
    } else {
        date.setDate(1);
        date.setMonth(month + 1);
        date.setDate(date.getDate() - 1);
    }
    return dateFormat(date, "yyyy-MM-dd");
};