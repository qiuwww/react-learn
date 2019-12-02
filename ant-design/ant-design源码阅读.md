# ant-design 源码阅读

服务于企业级产品的设计体系，基于确定和自然的设计价值观上的**模块化解决方案**，让设计者和开发者专注于更好的用户体验。

组件库基于[react-component](https://github.com/react-component)下的基础组件。

## 工程目录

```
.
├── .circleci/                      // 持续集成和持续部署工具
├── mock/                           // The directory where the mock file is located, based on express
├── .github/
    ├── workflows                   // 工作流
    ├── lock.yml                    // 可在一段时间不活动后锁定已关闭的问题并提取请求。
└── components/                     // 具体组件
    ├── index.jsx                   // components包导出总出口
    ├── modal/                      // modal 举例
        ├── __tests__/              // jest 测试用例
        ├── demo/                   // 使用例子
        ├── style/                  // 样式文件，样式与内容分开打包的
        ├── index.jsx               // 组件的入口
        ├── Modal.jsx               // 使用ts定义的各种接口与方法，默认导出Modal类
        ├── locale.jsx              // 此文件定义展示字段的locale字段与一些方法
        ├── confirm.jsx             // 简洁模式，或者使用Modal.confirm打开的窗口，与Modal结构类似
        ├── ActionButton.jsx        // 还不知道是干什么的，只是封装了一下Button？
    ├── pages/                      // page directory, the file inside is the route
        ├── .umi/                   // dev temp directory, need to be added to .gitignore
        ├── .umi-production/        // build temporary directory, will be deleted automatically
        ├── document.ejs            // HTML template
        ├── 404.js                  // 404 page
        ├── page1.js                // page 1, arbitrarily named, export react component
        ├── page1.test.js           // Use case file, umi test will match all files ending in .test.js and .e2e.js
        └── page2.js                // page 2, arbitrarily named
    ├── global.css                  // Conventional global style files, imported automatically, or global.less
    ├── global.js                   // can add polyfill here
├── .umirc.js                       // umi configuration, same as config/config.js, choose one
├── .env                            // environment variable
└── package.json
```

### CircleCI

他可以绑定 GitHub/Bitbucket，只要你的代码有变更，就会自动抓取，根据你的配置，提供运行环境，执行测试、构建和部署。

CircleCI 是一个基于云的系统 - 不需要专用服务器，您无需管理它。 但是，它还提供了一个本地解决方案，允许您在私有云或数据中心中运行它。

#### 类似的工具

Jenkins 是一个独立的基于 Java 的程序，随时可以运行，包含 Windows，Mac OS X 和其他类 Unix 操作系统的软件包。

**CircleCI 建议用于小型项目**，其主要目标是尽快开始集成。

当您从事开源项目时，建议使用 Travis CI，这些项目应在不同环境中进行测试。

**Jenkins 被推荐用于大型项目**，在这些项目中，您需要进行大量自定义，这些自定义可以通过使用各种插件来完成。 您可以在这里更改几乎所有内容，但此过程可能需要一段时间。 如果您计划使用 CI 系统最快的开始，Jenkins 可能不是您的选择。

## 值得思考的问题

### 看过 antd 源码吗，如何实现一个 Model，Message 组件？

只能猜想到 React Portals，未曾看过源码，有待提升。

## components 组件分析

如果需要使用 Form 自带的收集校验功能，需要使用 **Form.create()包装组件**，每一个需要收集的值还需要 `getFieldDecorator` 进行注册。

Form.create 创建一个具有注册、收集、校验功能的"实例"。

Form.create 的核心能力是创建实例 this.props.form，并不是创建组件。

包装组件的目的是为了更新组件。

包装组件的目的就是为了被包装组件的父组件更新，一旦被 getFieldDecorator 修饰过的组件触发**onChange 事件**，**便会触发这个父组件的的更新(forceUpdate)，从而促使被包装组件的 render。** 如：Form.create()(A) A 就是我们所说的被包装组件。

注册(getFieldDecorator)。

### avatar 头像组件分析

```
components/avator/
├── index.tsx                       // UI组件源文件，即TSX（TypeScript+JSX），包含整个组件的内容和逻辑。
├── index.zh-CN.md&index.en-US.md   // 组件使用说明文档
├── style/                          // UI组件样式文件，包含当前UI组件的相关样式
    ├── index.less                  // 组件具体的内容
        ├──themes/index             // 基础的样式变量生命文件，可以被外部覆盖，以及相关的公共样式文件
        ├──mixins/index             // 基础的less函数
    ├── index.tsx                   // 样式文件的入口，依赖关系声明文件
├── __tests__/                      // UI组件测试文件，包含当前UI组件相关的单元测试，使用Jest单元测试框架。
├── demo                            // 用来进行展示和用法示例说明的文档
```

代码分析，查看源码注释。

#### 组件的引用

通常组件都是可以单独引用的，当然需要引用 js 和相应的 css。

我们在设计 UI 组件库时，处于文件大小的考虑，我们也应该**保证每个 UI 组件都互不依赖**（同一层级的组件，排除本身业务上就有依赖关系的组件），做到不使用的组件不引入，减小业务方文件大小。

### 组件库打包 webpack 配置，getWebpackConfig

`@ant-design/tools/lib/getWebpackConfig`

### Alert 组件分析

```ts
import * as ReactDOM from 'react-dom';
handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  // 获取节点，设置节点属性
  // 使用react-dom获取dom节点，并修改属性值
  const dom = ReactDOM.findDOMNode(this) as HTMLElement;
  dom.style.height = `${dom.offsetHeight}px`;
};
```
