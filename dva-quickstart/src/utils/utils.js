export function getLocationSearch(href = location.href) {
  const theRequest = new Object();
  if (href.indexOf("?") > -1) {
    const hrefStr = href.substr(href.indexOf("?") + 1);
    const arr = hrefStr.split("&");
    arr.filter(item => {
      theRequest[item.split('=')[0]] = item.split('=')[1];
    })
    return theRequest;
  }
  return {};
}
