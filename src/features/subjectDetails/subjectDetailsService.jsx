import API from '../../api'

const API_URL = '/api/subjects/'

// Get subjects by id
const getSubject = async (id) => {
  const response = await API.get(API_URL + id)
  return response.data
}

const subjectDetailService = {
  getSubject
}

export default subjectDetailService
