import API from '../../api'

const API_URL = '/organizations'

// Get all Ds
const getppd = async () => {
  const response = await API.get(API_URL + '?level=1')
  if (response.data) localStorage.setItem('ppd', JSON.stringify(response.data))
  return response.data
}

// Get all Klp per Ds
const getppk = async (ppdId) => {
  const response = await API.get(API_URL + `?level=2&ancestorId=${ppdId}`)
  if (response.data) localStorage.setItem('ppk', JSON.stringify(response.data))
  return response.data
}

const organizationService = {
  getppd,
  getppk,
}

export default organizationService
