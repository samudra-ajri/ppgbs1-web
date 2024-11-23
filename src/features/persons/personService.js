
import API from '../../api'

const API_URL = '/users'

// Get user by id
const getUserById = async (token, userId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.get(`${API_URL}/${userId}`, config)
  return response.data // Return data only Redux will handle localStorage.
}

// update user student by admin
const updateStudentByAdmin = async (token, userId, payload) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const response = await API.put(API_URL + `/${userId}/student-by-admin`, payload, config)
  return response.data
}

const personService = {
  getUserById,
  updateStudentByAdmin,
}

export default personService
