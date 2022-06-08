import API from '../../api'

const API_URL = '/api/completions/'

// Get user completions
const getCompletions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL, config)
  return response.data
}

const completionService = {
  getCompletions,
}

export default completionService
