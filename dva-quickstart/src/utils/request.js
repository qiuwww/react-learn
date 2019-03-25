import fetch from 'dva/fetch'
import {origin, env} from '../utils/config'
import auth from '../services/auth'
import {message} from 'antd'
import {history} from '../utils/config'

function jsonParse(res) {
  return res.json().then(json => ({...res, json}))
}

function errorMessageParse(res) {
  const {code, msg} = res.json
  if (code === 0) {
    return res.json
  } else if (code === 10000) {
    auth.logout()
  } else {
    message.error(msg)
  }
}

function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export let fetchPost = (url, body = {}, method, header = {}) => {
  // console.log(url);
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'productCategory': sessionStorage.getItem("productCategory"),
    'appCode':sessionStorage.getItem("appCode"),
    ...header,
  }
  // if (env !== 'localMock') {
  //   headers.accessToken = auth.getToken()
  // }
  headers.accessToken = auth.getToken()
  return fetch(`${origin}${url}`, {
    method: method || 'POST',
    headers,
    timeout: 3,
    mode: 'cors',
    body: method === 'GET' ? null : JSON.stringify({
      ...body
    }),
  }).then(checkStatus).then(parseJSON).then(res => {
    if (res.code && res.code === 700000) {
      window.localStorage.clear()
      // history.push('/login')
    } else {
      return res
    }
  })
}

export let getCaptcha = (url, body, header)=>{
  return fetch(`${origin}${url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...header,
    },
    timeout:3,
    mode: 'cors',
    body:JSON.stringify({
      ...body
    })
  }).then(checkStatus)
    .then(parseJSON)
    .then(res => {
      if(res.code == 0) {
        return res
      } else {
        message.error(res.msg);
      }
    })
}
