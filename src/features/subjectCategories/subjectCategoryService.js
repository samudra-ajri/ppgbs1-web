import API from '../../api'

const API_URL = '/api/subjects/'

// Get subject categories
const getSubjectCategories = async () => {
  const response = await API.get(API_URL + 'count/categories/')
  return response.data
}

const subjectCategoryService = {
  getSubjectCategories
}

export default subjectCategoryService
