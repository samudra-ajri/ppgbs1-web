import API from '../../api'

const API_URL = 'completions/'

// Get all users completions scores
const getAllCompletionsScores = async (filters, token) => {
  const { ds = '', klp = '', field = '', category = '' } = filters
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
  const { structure, userId, grade, subject, category, subcategory } = filters

  const queryFilters = []
  if (grade) queryFilters.push(`grade=${grade}`)
  if (subject) queryFilters.push(`subject=${subject}`)
  if (category) queryFilters.push(`category=${category}`)
  if (subcategory) queryFilters.push(`subcategory=${subcategory}`)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `sum/${structure}/users/${userId}?${queryFilters.join('&')}`, config)
  return response.data
}

// Get group sum completions
const getGroupSumCompletions = async (token, filters) => {
  const { structure, grade, subject, category, subcategory, ancestorId, organizationId, usersGrade } = filters

  const queryFilters = []
  if (grade) queryFilters.push(`grade=${grade}`)
  if (subject) queryFilters.push(`subject=${subject}`)
  if (category) queryFilters.push(`category=${category}`)
  if (subcategory) queryFilters.push(`subcategory=${subcategory}`)
  if (ancestorId) queryFilters.push(`ancestorId=${ancestorId}`)
  if (organizationId) queryFilters.push(`organizationId=${organizationId}`)
  if (usersGrade) queryFilters.push(`usersGrade=${usersGrade}`)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(API_URL + `sum/${structure}/users?${queryFilters.join('&')}`, config)
  return response.data
}

// Download completion data as Excel
const downloadCompletionData = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  }
  const response = await API.get(`${API_URL}/users/${userId}/download`, config)
  return response.data
}

const completionScoreService = {
  getCompletionsScoresByUserId,
  getAllCompletionsScores,
  getSumCompletions,
  getGroupSumCompletions,
  downloadCompletionData,
}

export default completionScoreService
