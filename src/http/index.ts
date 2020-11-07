import axios from 'axios'

const API_KEY = '0abac63b7fa04fa407e36e5018c4e5022cac5db323bdcabd326b14c7e469b6b3'

export const cryptoHttp = axios.create({
  baseURL: 'https://min-api.cryptocompare.com/data',
  headers: {
    authorization: `ApiKey ${API_KEY}`
  }
})
