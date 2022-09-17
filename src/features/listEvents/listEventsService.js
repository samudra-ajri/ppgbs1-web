import API from '../../api'

const API_URL = 'api/events/'

// List evenets
const listEvents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'admin', config)
  return response.data
}

const listEventsService = {
  listEvents,
}

export default listEventsService