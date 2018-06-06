
// 初始化测试操作吧
// React测试必须使用官方的测试工具库，但是它用起来不够方便，所以有人做了封装，推出了一些第三方库，其中Airbnb公司的Enzyme最容易上手。
import { configure } from 'enzyme'

import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })
