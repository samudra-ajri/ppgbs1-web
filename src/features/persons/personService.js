
import API from '../../api'

const API_URL = '/users/'

// Get user by id
const getUserById = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + userId, config)
  return response.data
}

const personService = {
  getUserById,
}

export default personService
