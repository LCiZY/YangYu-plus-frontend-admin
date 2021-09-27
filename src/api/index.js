import request from '@/utils/request'


export function post(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.post(urlMapping, param)
}

export function get(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.get(urlMapping, param)
}
