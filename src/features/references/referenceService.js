
import API from '../../api'

const API_URL = '/directories'

// Get directories list
const getReferences = async (token, { page = 1, search = '' } = {}) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const queryParams = new URLSearchParams({ page, search }).toString()
  let targetUrl = `${API_URL}?${queryParams}`
  const response = await API.get(targetUrl, config)
  return response.data
}

const referenceService = {
  getReferences,
}

export default referenceService
