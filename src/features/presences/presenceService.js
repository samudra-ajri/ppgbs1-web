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

// Get presence by room id
const getPresencesByRoomId = async (data, token) => {
  const { page=1, roomId } = data
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(`${API_URL}room/${roomId}?page=${page}`, config)
  return response.data
}

// Check presence status
const isPresent = async (roomId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(`${API_URL}room/${roomId}/ispresent`, config)
  return response.data
}

const presenceService = {
  createPresence,
  isPresent,
  getPresencesByRoomId
}

export default presenceService