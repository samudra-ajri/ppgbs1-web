import API from '../../api'

const API_URL = '/events'

// Create presence
const createPresence = async (data, token) => {
  const { eventId } = data
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL + `/${eventId}/presences`, data, config)
  return response.data
}

// Create presence by amdin
const createPresenceByAdmin = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(`${API_URL}admin`, data, config)
  return response.data
}

// Remove attender
const removeAttender = async (data, token) => {
  const { roomId, attenderId } = data
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(`${API_URL}room/${roomId}/attender/${attenderId}`, config)
  return response.data
}

// Get presence by room id
const getPresencesByRoomId = async (data, token) => {
  const { page = 1, roomId } = data
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(`${API_URL}room/${roomId}?page=${page}`, config)
  return response.data
}

// Check presence status
const detail = async (params, token) => {
  const { eventId, userId } = params
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(`${API_URL}/${eventId}/presences/${userId}`, config)
  return response.data
}

const presenceService = {
  createPresence,
  createPresenceByAdmin,
  detail,
  getPresencesByRoomId,
  removeAttender,
}

export default presenceService