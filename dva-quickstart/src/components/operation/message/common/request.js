import { origin } from '../../../../utils/hostName.js';

let msgOrigin = '';
if (origin === 'https://yhadmin.yangcongjietiao.com') {
  msgOrigin = 'https://message-center.yangcongjietiao.com:88';
} else if (origin === 'http://testapi2.yangcongjietiao.com:8082') {
  msgOrigin = 'http://testapi2.yangcongjietiao.com:8083';
} else {
  msgOrigin = origin;
}

function checkStatus(response) {
  if (response.status === 200) {
    return response
  } else {
    return response
  }
/*
  const error = {}
  error.response = response
  throw error*/
}

function parseJSON(response) {
  console.log(response)
  var a = response.json()
  console.log(JSON.stringify(a))
  return a
  // return response.json()
}

export let fetchPost = (url, body, header = {}) => {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // 'productCategory': sessionStorage.getItem("productCategory"),
    // 'appCode':sessionStorage.getItem("appCode"),
    ...header,
  }
  // if (env !== 'localMock') {
  //   headers.accessToken = auth.getToken()
  // }
  // headers.accessToken = auth.getToken()
  return fetch(`${msgOrigin}${url}`, {
    method: 'POST',
    headers,
    timeout: 3,
    mode: 'cors',
    body: JSON.stringify({
      ...body
    })
  }).then(checkStatus).then(parseJSON).then(res => {
      return res
  })
}

