import API from '../../api'

const API_URL = '/directories'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
})

// Get directories list
const getReferences = async (token, { page = 1, search = '' } = {}) => {
  const config = getConfig(token)
  const queryParams = new URLSearchParams({ page, search }).toString()
  const targetUrl = `${API_URL}?${queryParams}`
  const response = await API.get(targetUrl, config)
  return response.data
}

// Delete a reference
const deleteReference = async (token, id) => {
  const config = getConfig(token)
  const response = await API.delete(`${API_URL}/${id}`, config)
  return response.data
}

const referenceService = {
  getReferences,
  deleteReference,
}

export default referenceService
