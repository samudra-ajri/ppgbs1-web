import API from '../../api'

const API_URL = '/api/completions/'

// Create completion
const createCompletion = async (completionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL, completionData, config)
  return response.data
}

// Get completion by subject id
const getCompletionBySubjectId = async (subjectId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'subjects/' + subjectId, config)
  return response.data
}

// Get user completion by subject id
const getUserCompletionBySubjectId = async (subjectId, userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + 'subjects/' + subjectId + '/users/' + userId, config)
  return response.data
}

const completionDetailsService = {
  createCompletion,
  getCompletionBySubjectId,
  getUserCompletionBySubjectId
}

export default completionDetailsService
