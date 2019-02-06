function getAuthHeader() {
    return `Token ${localStorage.getItem('token')}`
}

export default getAuthHeader;