import API from '../../api'

const API_URL = '/api/subjects/'

// Get all subjects
const getSubjects = async () => {
  const response = await API.get(API_URL)
  return response.data
}

// Get subjects by category
const getSubjectsByCategory = async (category) => {
  const response = await API.get(API_URL + 'categories/' + category)
  return response.data
}

const subjectService = {
  getSubjects,
  getSubjectsByCategory,
}

export default subjectService
