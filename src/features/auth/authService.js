import API from '../../api'

const API_URL = 'auths/'

// Register user
const register = async (userData) => {
    const response = await API.post(API_URL + 'register', userData)
    return response.data
}

// Login user
const login = async (userData) => {
    try {
        const response = await API.post(API_URL + 'login', userData)
        if (response.data) {
            const config = {
                headers: {
                    Authorization: `Bearer ${response.data.data.token}`,
                },
            }
            const profile = await API.get(API_URL + 'me', config)
            const user = { ...response.data.data, ...profile.data.data }
            localStorage.setItem('user', JSON.stringify(user))
            return user
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Gagal melakukan login.'
        throw new Error(errorMessage)
    }
}

// Logout user
const logout = () => {
    localStorage.clear()
}

// Update my profile
const update = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await API.put('users/me', userData, config)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        return decidePosition(userData.newPositionId, token)
    }
}

// Forogt password
const forgotPassword = async (userData) => {
    const response = await API.put(API_URL + 'forgot-password', userData)
    return response.data
}

// Reset password
const resetPassword = async (data, token) => {
    const { resetPasswordToken, newPassword } = data
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await API.put(API_URL + 'reset-password/' + resetPasswordToken, { newPassword }, config)
    return response.data
}

// decide position
const decidePosition = async (positionId, token) => {
    try {
        const switchPositionConfig = { headers: { Authorization: `Bearer ${token}` } }
        const response = await API.post(API_URL + 'switch-position/', { positionId }, switchPositionConfig)
        if (response.data) {
            const config = { headers: { Authorization: `Bearer ${response.data.data.token}` } }
            const profile = await API.get(API_URL + 'me', config)
            const user = { ...response.data.data, ...profile.data.data }
            user.alreadyDecidedPosition = true
            localStorage.setItem('user', JSON.stringify(user))
            return user
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Gagal melakukan login.'
        throw new Error(errorMessage)
    }
}

const authService = {
    register,
    login,
    logout,
    update,
    forgotPassword,
    resetPassword,
    decidePosition,
}

export default authService