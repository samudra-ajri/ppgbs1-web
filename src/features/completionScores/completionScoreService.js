import API from '../../api'

const API_URL = 'completions/'

// Get all users completions scores
const getAllCompletionsScores = async (filters, token) => {
  const { ds='', klp='', field='', category='' } = filters
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `scores/all?ds=${ds}&klp=${klp}&field=${field}&category=${category}`, config)
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

// Get sum user completions
const getSumCompletions = async (token, filters) => {
  const { structure, userId } = filters
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `sum/${structure}/users/${userId}`, config)
  return response.data
}

const completionScoreService = {
  getCompletionsScoresByUserId,
  getAllCompletionsScores,
  getSumCompletions,
}

export default completionScoreService
