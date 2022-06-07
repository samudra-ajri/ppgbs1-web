import API from '../../api'

const API_URL = '/api/subjects/'

// Get all subjects
const getSubjects = async () => {
  const response = await API.get(API_URL)
  return response.data
}

const subjectService = {
  getSubjects,
}

export default subjectService
