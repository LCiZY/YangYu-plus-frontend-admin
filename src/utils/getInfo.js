export function getKey(id, token) {
    let authorization = 'admin '.concat(id).concat(';').concat(token)
    return authorization
}

export function isNumber(value) {
    // eslint-disable-next-line radix
    if (value == null || value == undefined) return false
    if (typeof value === 'number') return true
    if (typeof value !== 'string') return false
    var i = 0
    for (; i < value.length; i++) {
        if (value[i] < '0' || value[i] > '9') {
            return false
        }
    }
    return true
}

export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10)
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        default:
            return 0
    }
}

export function isLocalIp(ip) {
    return ip.search(/192.168/) >= 0
}

export function getTimeFromUnix(unix) {
    var date = new Date(unix)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}

export function captureCourseId(snapShot) {
    var patt = /"courseId":(\d+)/
    let result = snapShot.match(patt)
    if (result.length == 2) {
        return result[1]
    } else {
        return ""
    }
}