import API from '../../api'

const API_URL = '/api/completions/'

// Create completion
const createCompletion = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL, config)
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

const completionDetailsService = {
  createCompletion,
  getCompletionBySubjectId
}

export default completionDetailsService
