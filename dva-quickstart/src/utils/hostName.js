import { message } from 'antd';

const defaultOrigin = window.adminOrigin || null;

const hostName = window.location.host;
const domain = ['.zaixianjieshu.com'];
const hostList = ['.kmxswl.', 'szdfwlkj.', 'mhrpxx.', 'youqian.', 'ywsnmxx.', 'wzyywlkj.', 'kmlth.', 'wdjkd.', 'cssmjwl.', 'wzhswl.', 'nkrwkt.', 'hzxunhao.', 'xiaohuangyu00.'];
let product = 'none';

domain.forEach((item) => {
  if (hostName.indexOf(item) > -1) {
    product = hostName.substr(0, hostName.indexOf(item));
  }
});
if (product === 'none') {
  hostList.forEach((item) => {
    if (hostName.indexOf(item) > -1) {
      product = item.replace(/\./g,'');
    }
  });
}
// if (hostName.indexOf('kmxswl.com') > -1) {
//   product = 'kmxswl';  // 龙猫钱包
// } else if (hostName.indexOf('szdfwlkj.com') > -1) { //海草云
//   product = 'szdf';
// }

if (product === 'none') {
  if (hostName === 'yhoss.yangcongjietiao.com') {
    product = 'yhh';
  } else if (hostName.indexOf('localhost') > -1) {
    product = 'localhost';
  } else if (!defaultOrigin) {
    message.error('配置信息有误，请联系客服', 100 * 1000);
  }
}

const originList = {
  none: '',
  // localhost: 'http://192.168.2.105:8081',
  localhost: 'http://testapi2.yangcongjietiao.com:8082',
  // localhost: 'https://yhadmin.yangcongjietiao.com',
  yhh: 'http://testapi2.yangcongjietiao.com:8082',//test
  // yhh: 'https://yhadmin.yangcongjietiao.com',//prd
  yk: 'http://47.99.14.159:88',
  hsy: 'http://47.99.14.7:88',
  wz: 'http://47.96.222.54:88',
  fh: 'http://114.55.202.200:88',
  sc: 'http://47.99.3.217:88',
  jy: 'http://47.98.30.175:88',
  jf: 'http://47.110.21.229:88',
  qs: 'http://101.37.195.223:88',
  wzjy: 'http://101.37.192.15:88',
  mf: 'http://101.37.195.101:88',
  akqb: 'http://101.37.187.240:88',
  hzxf: 'http://47.110.7.80:88',
  qdhhj: 'http://101.37.191.232:88',
  fqxyr: 'http://47.110.6.253:88',
  nbtq: 'http://47.99.224.150:88',
  gdly: 'http://101.37.191.81:88',
  hzhh: 'http://47.99.224.45:88',
  ahzyh: 'http://47.99.225.236:88',
  hnlc: 'http://47.99.228.115:88',
  hzzs: 'http://47.110.184.20:88',
  jnyj: 'http://47.110.184.52:88',
  cnjr: 'http://101.37.192.217:88',
  scbt: 'http://101.37.191.193:88',
  nbky: 'http://47.110.167.104:88',
  rarb: 'http://47.99.224.145:88',
  hzsl: 'http://47.110.179.164:88',
  gzjb: 'http://47.110.179.199:88',
  nbjl: 'http://47.99.2.58:88',
  gxhbx: 'http://47.99.227.168:88',
  gxhbxkkd: 'http://47.99.226.4:88',
  whjlg: 'http://47.110.18.244:88',
  whbcy: 'http://47.110.186.203:88',
  wzzl: 'http://47.96.222.142:88',
  lsxh: 'http://47.97.238.237:88',
  wzgt: 'http://47.110.199.68:88',
  fzyf: 'http://47.110.19.149:88',
  hzyd: 'http://47.97.239.239:88',
  ahewm: 'http://47.99.2.90:88',
  hzrm: 'http://47.110.4.21:88',
  fzlq: 'http://47.110.189.101:88',
  shzm: 'http://47.99.226.124:88',
  raaq: 'http://47.110.166.11:88',
  xayjy: 'http://47.110.185.92:88',
  cncy: 'http://101.37.192.172:88',
  dqyd: 'http://47.110.196.47:88',
  jxzc: 'http://47.110.185.160:88',
  ahrb: 'http://47.110.196.192:88',
  ahzyhysd: 'http://47.110.196.213:88',
  nhqj: 'http://47.110.164.216:88',
  ralc: 'http://47.96.240.12:88',
  nbyd: 'http://47.96.240.14:88',
  szldb: 'http://47.110.195.7:88',
  hfac: 'http://110.75.135.217:88',
  qdhhjjysd: 'http://110.75.135.221:88',
  lsyz: 'http://47.110.164.10:88',
  lsbr: 'http://47.110.164.21:88',
  nbkh: 'http://47.110.211.87:88',
  gzjbkywd: 'http://47.110.211.109:88',
  wzjykyj: 'http://101.37.191.117:88',
  dydy: 'http://101.37.191.5:88',
  szyy: 'http://47.110.6.255:88',
  pyrx: 'http://47.110.6.255:82',
  qzjy: 'http://47.110.6.255:84',
  fzxyc: 'http://47.110.6.255:86',
  wzzy: 'http://47.110.6.255:90',
  mhrx: 'http://47.110.6.255:92',
  wzjyydb: 'http://47.110.6.255:94',
  lygyj: 'http://47.110.6.255:96',
  wzzklg: 'http://47.110.6.255:2001',
  sdcn: 'http://47.110.6.255:2003',
  whyzd: 'http://47.110.6.255:2005',
  ncxy: 'http://47.110.6.255:2007',
  zjxg: 'http://47.110.6.255:2009',
  hzjz: 'http://47.110.6.255:2011',
  ahrzd: 'http://47.110.6.255:2013',
  wxqz: 'http://47.110.6.255:2015',
  nbyh: 'http://47.110.6.255:2017',
  szds: 'http://47.110.6.255:2019',
  mcdzsw: 'http://47.110.6.255:2021',
  hzjc: 'http://47.110.6.255:2023',
  hzfj: 'http://47.110.6.255:2025',
  lsbrhjy: 'http://47.110.6.255:2027',
  wlhthy: 'http://47.110.6.255:2029',
  cxjf: 'http://47.110.6.255:2031',
  fzzr: 'http://101.37.191.5:2001',
  jhsz: 'http://101.37.191.5:2003',
  sxzsx: 'http://101.37.191.5:2005',
  hzyb: 'http://101.37.191.5:2007',
  fdfls: 'http://101.37.191.5:2009',
  mzyl: 'http://101.37.191.5:2011',
  hzwh: 'http://101.37.191.5:2013',
  nboh: 'http://101.37.191.5:2015',
  fjnazx: 'http://101.37.191.5:2017',
  yzjt: 'http://101.37.191.5:2019',
  cqblw: 'http://101.37.191.5:2021',
  mqrj: 'http://101.37.191.5:2023',
  jxrr: 'http://101.37.191.5:2025',
  fjqm: 'http://101.37.191.5:2027',
  nbqh: 'http://101.37.191.5:2029',
  ynyz: 'http://101.37.191.5:2031',
  wzbz: 'http://101.37.191.5:2033',
  ycth: 'http://101.37.191.5:2035',
  tslj: 'http://101.37.191.117:3001',
  sxwd: 'http://101.37.191.117:3003',
  ycnb: 'http://101.37.191.117:3005',
  rant: 'http://101.37.191.117:3007',
  czbz: 'http://101.37.191.117:3009',
  jhszjxbx: 'http://101.37.191.117:3011',
  ntxxczj: 'http://101.37.191.117:3013',
  ftrsdddq: 'http://101.37.191.117:3015',
  lxkjfyqb: 'http://101.37.191.117:3017',
  jsyxlb: 'http://101.37.191.117:3019',
  clwlwwb: 'http://101.37.191.117:3021',
  srfkjbk: 'http://101.37.191.117:3023',
  kldzcyqb: 'http://101.37.191.117:3025',
  pjmwjqb: 'http://101.37.191.117:3027',
  ytylhmcs: 'http://101.37.191.117:3029',
  qsdkzd: 'http://101.37.191.117:3031',
  fgwlsx: 'http://101.37.191.117:3033',
  mydzcxd: 'http://101.37.191.117:3035',
  bmkjxnym: 'http://101.37.191.117:3037',
  hywhkyh: 'http://101.37.191.117:3039',
  pjcf: 'http://101.37.191.117:3041',
  dmwlzsqb: 'http://101.37.191.117:3043',
  wzay: 'http://101.37.191.117:3045',
  wzxxjskd: 'http://47.110.211.109:3001',
  raqy: 'http://47.110.211.109:3003',
  kmxswl: 'http://47.110.211.109:3005',
  szdfwlkj: 'http://47.110.211.109:3007',
  hzjp: 'http://47.110.211.109:3009',
  sjqb: 'http://47.110.211.109:3011',
  mhrpxx: 'http://47.110.211.109:3013',
  youqian: 'http://47.110.211.109:3015',
  ywsnmxx: 'http://47.110.211.109:3017',
  wzyywlkj: 'http://47.110.211.109:3019',
  kmlth: 'http://47.110.211.109:3021',
  wdjkd: 'http://47.110.211.109:3023',
  cssmjwl: 'http://47.110.211.109:3025',
  wzhswl: 'http://47.110.211.109:3027',
  nkrwkt: 'http://47.110.211.109:3029',
  hzbj: 'http://47.110.211.109:3031',
  hzxunhao: 'http://47.110.211.109:3033',
  xiaohuangyu00: 'http://47.110.211.109:3035',
  sdxh: 'http://47.110.211.109:3037',
}[product];

const origin = defaultOrigin || originList;

console.log(product, origin);
export { origin }
