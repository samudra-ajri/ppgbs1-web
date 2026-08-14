import API from '../../api'

const API_URL = '/events'

// Create event
const createEvent = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  data.grades = data.selectedGrades.map(item => item.grade)
  const response = await API.post(API_URL, data, config)
  return response.data
}

// Get event by id
const getEvent = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `/${id}`, config)
  return response.data
}

// Get the last event with the same name created by the logged in user
const getLastEventByName = async (name, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(
    API_URL + `/last?name=${encodeURIComponent(name)}`,
    config
  )
  return response.data
}

const authService = {
  createEvent,
  getEvent,
  getLastEventByName
}

export default authService