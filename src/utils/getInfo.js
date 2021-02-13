

export function getKey(id, token) {
    let authorization = 'admin '.concat(id).concat(';').concat(token)
    return authorization
}

export function isNumber(value) {
    // eslint-disable-next-line radix
    let id = parseInt(value - 0)
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(id)) return false
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