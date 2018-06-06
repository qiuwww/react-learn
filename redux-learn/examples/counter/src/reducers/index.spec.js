import counter from './index'
// 测试reducers下的counter（store）
describe('reducers', () => {
  describe('counter', () => {
    it('should provide the initial state', () => {
      // 传入一个 undefined 和 {} 需要返回默认的0
      expect(counter(undefined, {})).toBe(0)
    })

    it('should handle INCREMENT action', () => {
      expect(counter(1, { type: 'INCREMENT' })).toBe(2)
    })

    it('should handle DECREMENT action', () => {
      expect(counter(1, { type: 'DECREMENT' })).toBe(0)
    })

    it('should ignore unknown actions', () => {
      // 非法命令返回默认的0
      expect(counter(1, { type: 'unknown' })).toBe(1)
    })
  })
})
