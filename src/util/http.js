
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://39.107.72.219:3000',
  params: {
    cookie: localStorage.getItem('cookie'),
    withCredentials: true
  }
})

export default http
