
import API from '../../api'

const API_URL = '/api/users/'

// Get users list
const getUsers = async (token, page=1) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `?page=${page}&limit=20`, config)
  return response.data
}

const completionService = {
  getUsers,
}

export default completionService
