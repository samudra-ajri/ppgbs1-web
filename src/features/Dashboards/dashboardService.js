
import API from '../../api'

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

// Serialize object filters into query params
const serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export default dashboardService
