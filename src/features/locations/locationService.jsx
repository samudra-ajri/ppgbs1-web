import API from '../../api'

const API_URL = '/api/locations/'

// Get all locations
const getLocations = async () => {
  const response = await API.get(API_URL)
  return response.data
}

const locationService = {
  getLocations,
}

export default locationService
