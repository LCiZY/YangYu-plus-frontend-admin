import request from '@/utils/request'

export function fetchUserData() {
    return request.get('https://api.github.com/users/woai3c')
}


export function post(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.post('/api' + urlMapping, param)
}

export function get(urlMapping, param) {
    if (urlMapping[0] != '/') urlMapping = '/' + urlMapping
    return request.get('/api' + urlMapping, param)
}
