import API from '../../api'

const API_URL = '/api/completions/'

// Get completions subject scores
const getCompletionsSubjectScoresDetails = async (subjectId, ds, klp, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `scores/details/subjects/${subjectId}?ds=${ds}&klp=${klp}`, config)
  return response.data
}

const targetCompletedService = {
  getCompletionsSubjectScoresDetails,
}

export default targetCompletedService
