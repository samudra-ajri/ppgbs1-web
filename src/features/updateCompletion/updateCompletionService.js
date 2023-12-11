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

// Create completion
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

const authService = {
  createCompletion,
  deleteCompletion,
}

export default authService