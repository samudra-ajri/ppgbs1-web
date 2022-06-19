import API from '../../api'

const API_URL = '/api/completions/'

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
  getCompletionBySubjectId
}

export default completionDetailsService
