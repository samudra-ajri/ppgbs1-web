
import API from '../../api'

const API_URL = '/api/dashboard/'

// Get dashboard
const getDashboard = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL, config)

  return response.data
}

const dashboardService = {
  getDashboard
}

export default dashboardService
