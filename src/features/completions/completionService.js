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

// Get completions by category
const getCompletionsByCategory = async (category, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'categories/' + category, config)
  return response.data
}

// Get user completions scores
const getCompletionsScores = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'scores', config)
  return response.data
}

// Get user completions scores by user id
const getCompletionsScoresByUserId = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'user/' + userId + '/scores', config)
  return response.data
}

const completionService = {
  getCompletions,
  getCompletionsScores,
  getCompletionsByCategory,
  getCompletionsScoresByUserId
}

export default completionService
