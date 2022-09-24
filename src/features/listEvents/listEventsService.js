import API from '../../api'

const API_URL = 'api/events/'

// List evenets
const listEventsGenerus = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL, config)
  return response.data
}

// List evenets admin
const listEvents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'admin', config)
  return response.data
}

// Delete event
const deleteEvent = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.delete(API_URL + id, config)
  return response.data
}

const listEventsService = {
  listEvents,
  listEventsGenerus,
  deleteEvent
}

export default listEventsService