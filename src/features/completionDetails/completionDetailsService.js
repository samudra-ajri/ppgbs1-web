import API from '../../api'

const API_URL = '/api/completions/'

// Get completion by id
const getCompletion = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + id, config)
  return response.data
}

const completionDetailsService = {
  getCompletion
}

export default completionDetailsService
