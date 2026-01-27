import API from "../../api"

const API_URL = "material-targets/"

// Get target IDs
const getTargetIds = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL + "ids", config)
  return response.data
}

const materialTargetService = {
  getTargetIds,
}

export default materialTargetService
