
import API from '../../api'

const API_URL = '/users'

// Get users list
const getUsers = async (token, {
  page = 1,
  positionType = '',
  ancestorId = '',
  organizationId = '',
  sex = '',
  grade = '',
  search = '',
  isForgotPassword = '',
} = {}) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const queryParams = new URLSearchParams({
    page,
    isActive: true,
    search,
    positionType,
    ancestorId,
    organizationId,
    sex,
    grade,
    isForgotPassword,
  }).toString()

  let targetUrl = `${API_URL}?${queryParams}`
  if (isForgotPassword) targetUrl = `${API_URL}/forgot-password?${queryParams}`

  const response = await API.get(targetUrl, config)
  return response.data
}


// Delete a user
const deleteUser = async (token, params) => {
  const { userId, positionId } = params
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(API_URL + `/${userId}/positions/${positionId}`, config)
  return response.data
}

// Update a user
const updateUser = async (token, userId, data) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.put(API_URL + userId, data, config)
  return response.data
}

// Download users data as Excel
const downloadUsersData = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  }
  const response = await API.get(`${API_URL}/download`, config)
  return response.data
}

const userService = {
  getUsers,
  deleteUser,
  updateUser,
  downloadUsersData,
}

export default userService
