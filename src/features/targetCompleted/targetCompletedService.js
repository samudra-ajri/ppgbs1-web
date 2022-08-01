import API from '../../api'

const API_URL = '/api/completions/'

// Get all completions subjects scores
const getAllCompletionsSubjectScores = async (subjectId, ds, klp, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `scores/all/subjects/${subjectId}?ds=${ds}&klp=${klp}`, config)
  return response.data
}

const targetCompletedService = {
  getAllCompletionsSubjectScores,
}

export default targetCompletedService
