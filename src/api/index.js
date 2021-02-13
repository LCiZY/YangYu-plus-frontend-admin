import request from '@/utils/request'
import { isLocalIp } from '@/utils/getInfo'


// const preFix = isLocalIp(window.location.origin) ? '/api' : ''
const preFix = '/api'


export function post(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.post(preFix + urlMapping, param)
}

export function get(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.get(preFix + urlMapping, param)
}
