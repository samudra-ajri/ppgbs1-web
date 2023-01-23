import API from '../../api'

const API_URL = 'api/users/'

// Register user
const register = async (userData) => {
    const response = await API.post(API_URL, userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Login user
const login = async (userData) => {
    const response = await API.post(API_URL + 'login', userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Logout user
const logout = () => {
    localStorage.removeItem('user')
}

// Update my profile
const update = async (userData, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    const response = await API.put(API_URL + 'me', userData, config)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

// Forogt password
const forgotPassword = async (userData) => {
    const response = await API.put(API_URL + 'forgot-password', userData)
    return response.data
}

const authService = {
    register,
    login,
    logout,
    update,
    forgotPassword,
}

export default authService