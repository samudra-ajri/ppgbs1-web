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

// Get group targets
const getGroupTargets = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL + "group", config)
  return response.data
}

// Get group targets summary
const getGroupTargetsSummary = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL + "summary/category", config)
  return response.data
}

// Get group targets summary subcategory
const getGroupTargetsSummarySubcategory = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL + "summary/subcategory", config)
  return response.data
}

// Get group targets summary material
const getGroupTargetsSummaryMaterial = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.get(API_URL + "summary/material", config)
  return response.data
}

// Create material targets
const createMaterialTargets = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await API.post(API_URL, data, config)
  return response.data
}

// Delete material targets
const deleteMaterialTargets = async (params, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  }
  const response = await API.delete(API_URL, config)
  return response.data
}

const materialTargetService = {
  getTargetIds,
  getGroupTargets,
  getGroupTargetsSummary,
  getGroupTargetsSummarySubcategory,
  getGroupTargetsSummaryMaterial,
  createMaterialTargets,
  deleteMaterialTargets,
}

export default materialTargetService
