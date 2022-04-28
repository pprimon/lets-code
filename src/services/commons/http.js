import axios from 'axios'

const http = (endpoint, token, contentType,  bearer) => {
  const headers = {
    'Content-Type': contentType || 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  if (token) {
    
    bearer ? headers.Authorization = `Bearer ${token}` : headers.Authorization = token
    headers.Accept = 'application/json;version=1'
  }

  headers.Accept = 'application/json'

  return axios.create({
    baseURL: endpoint,
    timeout: 30000,
    headers,
  })
}

export const defaultService = (token = null, bearer = false) =>
  http('http://0.0.0.0:4000', token, 'application/json', bearer)

export default http