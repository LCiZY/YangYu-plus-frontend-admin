

export function getKey(id, token) {
    let authorization = 'admin '.concat(id).concat(';').concat(token)
    return authorization
}
