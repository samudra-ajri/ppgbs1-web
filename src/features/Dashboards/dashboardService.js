import API from '../../api'
import serialize from '../../helpers/serializeFilter'

const API_URL = '/api/dashboard/'

// Get dashboard
const getDashboard = async (filters, token) => {
  const queryParams = (serialize(filters))
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `?${queryParams}`, config)

  return response.data
}

const dashboardService = {
  getDashboard
}

export default dashboardService
