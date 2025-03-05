import API from '../../api'

const API_URL = 'completions/'

// Create completion
const createCompletion = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL, data, config)
  return response.data
}

// Create completion by admin
const createCompletionByAdmin = async (userId, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL + `users/${userId}/create-by-admin`, data, config)
  return response.data
}

// Delete completion
const deleteCompletion = async (data, token) => {
  const materialIds = data?.materialIds
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(API_URL + '?materialIds=' + materialIds.join(','), config)
  return response.data
}

// Delete completion by Admin
const deleteCompletionByAdmin = async (userId, data, token) => {
  const materialIds = data?.materialIds
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(API_URL + `users/${userId}/delete-by-admin?materialIds=` + materialIds.join(','), config)
  return response.data
}


const authService = {
  createCompletion,
  deleteCompletion,
  createCompletionByAdmin,
  deleteCompletionByAdmin,
}

export default authService