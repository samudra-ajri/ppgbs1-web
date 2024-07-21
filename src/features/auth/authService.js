import API from '../../api'

const API_URL = 'auths/'

// Register user
const register = async (userData) => {
    const response = await API.post(API_URL + 'register', userData)
    return response.data
}

// Register user by admin
const registerByAdmin = async (userData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}`},
    }
    const response = await API.post(API_URL + 'register-by-admin', userData, config)
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
        const errorMessage = error.response?.data?.message
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
        return decidePosition(userData.newPositionId, token)
    }
}

// Update stdudent profile
const updateStudentProfile = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await API.put('users/me/student', userData, config)
    if (response.data) {
        return decidePosition(userData.newPositionId, token)
    }
}

// Update my password
const updateMyPassword = async (userData, token) => {
    const {
        positionId,
        currentPassword,
        newPassword,
        confirmNewPassword,
    } = userData

    const payload = { currentPassword, newPassword, confirmNewPassword }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await API.put(API_URL + 'update-password', payload, config)
    if (response.data) {
        return decidePosition(positionId, token)
    }
}

// Forogt password
const forgotPassword = async (userData) => {
    const { login } = userData
    const response = await API.post(API_URL + 'forgot-password', { login })
    return response.data
}

// Reset password
const tempPassword = async (data, token) => {
    const { resetPasswordToken, tempPassword } = data
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await API.post(API_URL + 'temp-password/' + resetPasswordToken, { tempPassword }, config)
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
        const errorMessage = error.response?.data?.message
        throw new Error(errorMessage)
    }
}

const authService = {
    register,
    login,
    logout,
    update,
    forgotPassword,
    tempPassword,
    decidePosition,
    updateStudentProfile,
    updateMyPassword,
    registerByAdmin,
}

export default authService