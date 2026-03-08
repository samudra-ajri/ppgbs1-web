import API from "../../api"

const API_URL = "materials/"

// Search materials
const searchMaterials = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL, config)
  return response.data
}

const materialService = {
  searchMaterials,
}

export default materialService
