import API from '../../api'

const API_URL = 'api/presences/'

// Create presence
const createPresence = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL, data, config)
  return response.data
}

const presenceService = {
  createPresence,
}

export default presenceService