/**
 * 测试访问地址：http://localhost:8000/api/users
 * async testMock() {
 *   // eslint-disable-line
 *  let res = await request("http://localhost:8000/api/users", {});
 *  console.log(res);
 *}
 */
export default {
  "GET /api/users": { users: [1, 2] },
  // 支持自定义函数，API 参考 express@4
  "POST /api/users/create": (req, res) => {
    res.end("OK");
  }
};
