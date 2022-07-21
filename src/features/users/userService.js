
import API from '../../api'

const API_URL = '/api/users/'

// Get users list
const getUsers = async (token, filters={page:1, limit:20}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `?page=${filters.page}&limit=${filters.limit}`, config)
  return response.data
}

const completionService = {
  getUsers,
}

export default completionService
