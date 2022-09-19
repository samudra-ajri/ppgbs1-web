import API from '../../api'

const API_URL = 'api/events/'

// Create evenet
const createEvent = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL, data, config)
  return response.data
}

// Get evenet by id
const getEvent = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + id, config)
  return response.data
}

const authService = {
  createEvent,
  getEvent
}

export default authService