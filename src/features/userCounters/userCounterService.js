
import API from '../../api'

const API_URL = '/api/users/'

// Get users roles counter
const getRolesCounter = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'roles', config)
  return response.data
}

const userCounterService = {
    getRolesCounter
}

export default userCounterService
