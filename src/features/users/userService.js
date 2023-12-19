
import API from '../../api'

const API_URL = '/users'

// Get users list
const getUsers = async (token, params) => {
  const { positionType, search, ancestorId } = params
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `?isActive=true&search=${search}&positionType=${positionType}&ancestorId=${ancestorId}`, config)
  return response.data
}

// Delete a user
const deleteUser = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(API_URL + userId, config)
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

const userService = {
  getUsers,
  deleteUser,
  updateUser
}

export default userService
