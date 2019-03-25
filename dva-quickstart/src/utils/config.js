/**
 * Created by ziyu on 17/3/7.
 */
import { hashHistory, browserHistory } from 'dva/router'
import development from './develop.json'
import production from './production.json'
import localMock from './local.json'

import { origin } from './hostName';
const env = 'production';
// const env = 'development';
// const env = 'localMock'

const history = hashHistory
let out = {}

switch (env) {
  case 'development':
    out = {history, origin, env}
    break
  case 'production':
    out = {history, origin, env}
    break
  case 'localMock':
    out = {history, origin, env}
    break
}

export { history, origin, env }
export default out
