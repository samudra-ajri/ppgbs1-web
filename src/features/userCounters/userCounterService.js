
import API from '../../api'

const API_URL = '/api/users/'

// Get users roles counter
const getRolesCounter = async (ds, klp, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `roles?ds=${ds}&klp=${klp}`, config)

  return response.data
}

const userCounterService = {
    getRolesCounter
}

export default userCounterService
