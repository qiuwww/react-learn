# React-Native对于基础的架构的优化

[TOC]

1. 添加状态管理器
2. 处理style的问题
3. 处理语义化标签的问题
4. 添加自己的组件库
5. 添加第三方组件库
6. 优化开发调试方式

## 状态管理选择redux

直接使用

### redux-logger

使用 redux-logger 中间件实现前端 log 日志打印功能。

### redux-thunk

A thunk is a function that wraps an expression to delay its evaluation.

### redux-saga

redux-saga是一个用于管理redux应用异步操作的中间件，redux-saga通过创建sagas将所有异步操作逻辑收集在一个地方集中处理，可以用来代替redux-thunk中间件。

## 页面导航 react-navigation

react-navigation包含以下功能来帮助你创建导航器:

- StackNavigator - 一次只渲染一个页面，并提供页面之间跳转的方法。 当打开一个新的页面时，它被放置在堆栈的顶部

- TabNavigator - 渲染一个选项卡，让用户可以在几个页面之间切换

- DrawerNavigator - 提供一个从屏幕左侧滑入的抽屉

应用程序中的每个屏幕都将收到一个navigation属性，其中包含以下内容：

- navigate - （helper）链接到其他屏幕
- state - **屏幕**当前的状态/路由
- setparams - (helper)改变路由的参数
- goback - (helper)关闭当前的屏幕和向后移动
- dispatch - **向路由器发送一个action**

注意：navigation 属性向下传递**到每个导航相关组件**，包括导航器。唯一的例外是一个navigator的navigation属性**可能**没有helper功能（navigate，goback等）；它只有state和dispatch。为了导航器用navigation属性中的navigate，您将不得不使用动作创建者(action creator)进行调度(dispatch).

### 常用方法

#### navigate(routeName, params, action)

```js
// 无参数跳转 this.props.navigation.navigate("Task");
this.props.navigation.state {key: "Task", routeName: "Task", params: undefined}
// 带参数跳转 this.props.navigation.navigate("Task", { from: 'HomeScreen' })
list.js:1 this.props.navigation.state {key: "Task", routeName: "Task",
params: {…}}
key: "Task"
params: {from: "HomeScreen"}
routeName: "Task"
```

### 配置页面navigationOptions

``` js
// 1. 页面内配置当前页面的一些信息，包括，title，头部信息，自定义header等信息，优先级低于Navigation中的配置。
static navigationOptions = {
  title: "HomeScreen"
};
// 2. Navigation中配置
TaskDetail: {
  screen: TaskDetailScreen,
  navigationOptions: {
    headerTitle: "TaskDetail000"
  }
},
```

## 链接原生库

$ react-native link

使用手动的方式

`https://reactnative.cn/docs/linking-libraries-ios.html`

## 添加状态管理步骤

采用集中管理action和reducer的方式，独立放在文件夹内。

步骤：

1. 创建reducer，函数声明返回state；

### reducer与action

使用 action 来描述“发生了什么”，和使用 reducers 来根据 action 更新 state 的用法。

### Store

Store 就是把它们联系到一起的对象。Store 有以下职责：

- 维持应用的 state；
- 提供 getState() 方法获取 state；
- 提供 dispatch(action) 方法更新 state；
- 通过 subscribe(listener) 注册监听器;
- 通过 subscribe(listener) 返回的函数注销监听器。

再次强调一下 Redux 应用只有一个单一的 store。当需要拆分数据处理逻辑时，你应该使用 reducer 组合 而不是创建多个 store。也就是说他们天生相连。

### Action：行为。

store.dispath(action)

它的作用就是将我们更新组件的 **状态(state) 的每个动作抽象为一个行为**，它有一个必须的参数 type，定义了 Action(行为) 的名称，其他参数可自定义。reducer 是一个纯函数。

它是 store 数据的唯一来源。一般来说你会通过 store.dispatch() 将 action 传到 store。

唯一修改store。唯一调用reducer的地方。

### Reducer：

reducer 的作用就是根据传入的 Action行为和旧的 state对象，返回一个新的 state ，然后组件会根据 state 刷新。

### Store：

当 reducer 返回了新的 state 后，这个 state 怎么传到组件和存储就成了问题，redux 就是把这个状态统一放到 store 中进行管理。

### react-redux

- Provider
- connect

Provider 的任务就是将 store 传给 connect，而 connect 的作用是将我们的组件进行第二次包装，将操作数据的函数和数据的状态包装到 props 中。

#### Provider

放在需要redux管理状态的组件的外层，这样就可以给组件添加props了。
一般情况下store会合并到一起，所以一般也只需要一个Provider来注入store。
理论上可以有多个store，并且可以多个Provider，同时一个Provider也可以添加多个store。

### 数据流向

1. reducer中声明initState；
2. 定义reducer来修改state，这是一个函数，接受参数顺序是`reducer(initState, action)`；
3. 通过createStore方法来生成store对象，保存了reducer中定义的state，并且提供一些方法；
4. Provider注入store到组件；
5. connect来建立store与view的关系；

### view修改数据流向

```export default connect(mapStateToProps,mapDispatchToProps)(App)```

1. 在当前位置触发action，store.dispatch(addNote())；
2. 当Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。而这种 State 的计算过程就叫做 Reducer。**->** 为此，Store 需要知道 Reducer 函数，做法就是在生成 Store 的时候，将 Reducer 传入createStore方法。
3. Reducer 函数里面不能改变 State，必须返回一个**全新的state对象**。
4. state更新，触发view发生改变，而在此之前必须把数据store和操作事件action绑定到需要使用的组件上，就需要用到connect函数。

### 常用函数

- 事件绑定：mapDispatchToProps： 将 action 作为 props 绑定到组件，可以直接在组件中调用触发dispatch。将 action 作为 props 绑定到组件上，**如果不传这个参数redux会把dispatch作为属性注入给组件，可以手动当做store.dispatch使用**。

```js
this.props.actions.addNote(title,text);

this.props.actions.xxx()，即等同于没绑定情况下this.props.dispatch(xxx())，不需要手动dispatch
```

- 数据绑定：mapStateToProps。mapStateToProps：

- bindActionCreators(actionCreators, dispatch)，在mapDispatchToProps内部调用。把一个 value 为不同 action creator 的对象，转成拥有同名 key 的对象。同时使用 dispatch 对每个 action creator 进行包装，以便可以直接调用它们。
  - 惟一会使用到 bindActionCreators 的场景是当你需要把 **action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在**，而且不希望把 dispatch 或 Redux store 传给它。
  - ```this.boundActionCreators = bindActionCreators(TodoActionCreators, dispatch);```
  - 另一替代 bindActionCreators 的做法是，直接把 dispatch 函数当作 prop 传递给子组件，但这时你的子组件需要，引入 action creator 并且感知它们。```return <TodoList todos={todos} dispatch={dispatch} />;```

- compose：组合函数，compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))）

### 常用的包

- react-redux，链接react与redux；
- redux-logger，状态更改的时候打印状态；
- redux-thunk，处理异步，使用redux-saga替代；
- redux-presist，数据持久化，本地操作storage；
- redux-saga，处理异步操作，使用了generator；

## rn项目运行步骤

1. clone
2. npm i
3. pod install
4. 运行 ios下的 NewPayDayLoan.xcworkspace(表示整个项目文件)，NewPayDayLoan.xcodeproj不包括pods文件夹。
5. 注意如果npm包需要link，就手动添加到项目中。[查看](#链接原生库)

## rn页面是被缓存起来的，并不是页面关闭就取消了所有的状态

因为这个还是在内存中的，页面可以一直存在的。相当于tab页面。

## React Navigation

Web浏览器和 React Navigation 工作原理的一个主要区别是：React Navigation 的 stack navigator 提供了在 Android 和 iOS 设备上，在堆栈中的路由之间导航时你期望的**手势和动画**。

### createStackNavigator

createStackNavigator 是一个返回 React 组件的方法。由于`createStackNavigator`函数会返回一个React组件，因此我们可以直接从`App.js`中导出它以用作我们应用程序的根组件。

路由的唯一必需配置项是screen（此项设置一个组件）。
在React Native中，从App.js导出的组件是应用程序的入口点（或根组件） -- 它处在所有组件的最下层。

### 路由配置简写

```js
const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  }
);
```

### 跳转方法

每次调用 `push` 时, 我们会向导航堆栈中添加新路由。 当你调用 `navigate` 时, 它首先尝试查找具有该名称的现有路由, 并且只有在堆栈上没有一个新路由时才会推送该路由。

- navigate，跳转，当前页面跳当前页面就会什么也不做。
- push， 跳转，这使我们能够表达在不考虑现有导航历史的情况下添加其他路由的意图。

如果你处在堆栈深处，上面有多个页面，此时你想要将上面所有的页面都销毁，并返回第一个页面。 在这种情况下，我们知道我们要回到`Home`，所以我们可以使用`navigate('Home')`（而不是`push`！ 尝试一下，看看有什么不同）。 另一个选择是`navigation.popToTop()`，它可以返回到堆栈中的第一个页面。

### Navigation lifecycle

假设用户从 A 路由跳转到 B 路由，**A 将被卸载（ componentWillUnmount方法将被调用）**，当用户回来时，**A 路由将再次被加载**， 在 react-navigation 中这些 React 生命周期方法仍然有效且可用，只是用法与 Web 不同， 这是因为手机导航的需求更加复杂。

当从 B 跳转到 A，B的 componentWillUnmount 方法会被调用，但是 **A 的 componentDidMount方法不会被调用**，应为此时 A 依然是被加载状态。

### 我们是如何发现用户离开和回来的？

React Navigation 将事件发送到订阅了它们的页面组件： 有4个不同的事件可供订阅：willFocus、willBlur、didFocus 和 didBlur。

### 参数传递

- 需要将参数包装成一个对象，作为navigation.navigate方法的第二个参数传递给路由。如： this.props.navigation.navigate('RouteName', { /* params go here */ })
- 读取页面组件中的参数的方法：`this.props.navigation.state.params`。
- 如果没有提供参数，这可能是null，所以使用**getParam通常更容易**，所以你不必处理这种情况。`navigation.getParam('otherParam', 'some default value');`
- 设置param：`this.props.navigation.setParams({ increaseCount: this._increaseCount });`
  - 作为setParams的替代方法，你可以使用状态管理库（例如Redux或MobX），**进行标题栏和页面之间的通信**，就像两个不同组件之间的通信一样。

### 设置标题栏

createStackNavigator默认情况下按照平台惯例设置，所以在**iOS上标题居中，在Android上左对齐**。

为了在标题中使用参数，我们需要使navigationOptions成为一个返回配置对象的函数。 尝试在navigationOptions中使用this.props可能很诱人，但因为它是组件的**静态属性，所以this不会指向一个组件的实例，因此没有 props 可用。**

### 传递给navigationOptions函数的参数是具有以下属性的对象：

- navigation - 页面的 导航属性 ，在页面中的路由为navigation.state。
- screenProps - 从**导航器组件上层传递的 props**
- navigationOptions - 如果未提供新值，将使用的默认或上一个选项

### 跨页面共享通用的navigationOptions

`https://reactnavigation.org/docs/zh-Hans/headers.html#%E8%B7%A8%E9%A1%B5%E9%9D%A2%E5%85%B1%E4%BA%AB%E9%80%9A%E7%94%A8%E7%9A%84-navigationoptions`

通常我们希望可以在多个页面上以类似的方式配置标题栏。

在createStackNavigator的时候添加defaultNavigationOptions配置默认样式。

### 使用自定义组件替换标题

`https://reactnavigation.org/docs/zh-Hans/headers.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E6%9B%BF%E6%8D%A2%E6%A0%87%E9%A2%98`

- 您可以通过navigationOptions中的headerLeft和headerRight属性在标题栏中设置按钮。
- **后退按钮可以通过headerLeft完全自定义**，但是如果你只想更改标题或图片，那么还有其他navigationOptions — headerBackTitle，headerTruncatedBackTitle和headerBackImage

### App容器

onNavigationStateChange(prevState, newState, action)

每当导航器管理的 navigation state 发生变化时，都会调用该函数。 它接收之前的 state、navigation 的新 state 以及发布状态更改的 action。

## 无状态组件

```js
export function Display({ visible, children }) {
  return visible ? children : null;
}
```

## 模块转发

```js
// Display.js
export function Display({ visible, children }) {
  return visible ? children : null;
}
// 模块重定向
export * from "./Display";
```

## 遇到的问题

### position定位的父元素的子元素不能触发事件

元素层叠的问题，一定要注意，定位的时候设置zIndex属性，控制层叠顺序。

## rn与原生通信

借助`NativeModules`模块来进行通信。

[官方文档](https://reactnative.cn/docs/native-modules-setup/#docsNav)

## rn的组件介绍

[组件和API](https://reactnative.cn/docs/components-and-apis/)

- 基础组件
- 交互控件
- 列表视图
- iOS 独有组件
- Android 独有组件
- 其他

### 基础组件

- View
- Text
- Image
- TextInput
- ScrollView，一个封装了平台的ScrollView（滚动视图）的组件，同时还集成了触摸锁定的“响应者”系统。设置`flex: 1`以使其自动填充父容器的空余空间。[文档，注意取舍，对比FlatList](https://reactnative.cn/docs/scrollview.html)
- StyleSheet，提供类似CSS样式表的样式抽象层。 -> `<style>`

#### StyleSheet

### 交互组件

- Button
- Picker， -> select
- Slider，-> 封装了input的滑动取值器
- Switch，封装了input.type=radio

### 列表视图

- FlatList，FlatList还可以方便地渲染行间分隔线，支持多列布局，无限滚动加载等等
- SelectList，类似于上边，多了分组显示。感觉没必要存在这个组件吧，自己完全可以控制分组显示样式的。

### iOS 独有的组件和 API

[官方文档](https://reactnative.cn/docs/components-and-apis/#ios-%E7%8B%AC%E6%9C%89%E7%9A%84%E7%BB%84%E4%BB%B6%E5%92%8C-api)

### Android 独有的组件和 API

[官方文档](https://reactnative.cn/docs/components-and-apis/#android-%E7%8B%AC%E6%9C%89%E7%9A%84%E7%BB%84%E4%BB%B6%E5%92%8C-api)

### 特定场景的组件

- ActivityIndicator，loading
- Alert，alert
- Animated
- Clipboard，剪切板
- Dimensions，设备尺寸， 这里的static get(dim)，取值有哪些，除了window
- Modal，遮罩层，对应html的modal
- StatusBar，控制应用状态栏的组件。
- WebView，根据像素密度获取指定大小的图片。
- PixelRatio，根据像素密度获取指定大小的图片

## 搭配第三方基于react-native的组件库

不添加第三方组件库了，基于如下的两个组件库来开发自己的组件库

### React Native Elements

React Native Elements是一个高度可定制的跨平台 UI 工具包，完全用 Javascript 构建。该库的作者声称“React Native Elements 的想法更多的是关于组件结构而不是设计，这意味着在使用某些元素时可以减少样板代码，但可以完全控制它们的设计”，这对于开发新手和经验丰富的老手来说都很有吸引力。

- React Native Elements 项目地址:[github.com/react-nativ…](https://github.com/react-native-training/react-native-elements)
- React Native Elements 示例项目：[react-native-training.github.io/react-nativ…](https://react-native-training.github.io/react-native-elements/)

### React Native Material

React Native Material UI是一组高度可定制的 UI 组件，实现了谷歌的 Material Design。请注意，这个库使用了一个名为 uiTheme 的 JS 对象，这个对象在上下文间传递，以实现最大化的定制化能力。

- React Native Material UI 项目地址:[github.com/xotahal/rea…](https://github.com/xotahal/react-native-material-ui)
- 包含库组件及示例的清单：[github.com/xotahal/rea…](https://github.com/xotahal/react-native-material-ui/blob/master/docs/Components.md)

### 原来已有的项目

pay-day-loan-client

### 依据属性值来判断组件的类型

```js
  const {
    containerStyle,
    textStyle,
    badgeStyle,
    onPress,
    Component = onPress ? TouchableOpacity : View,
    value,
    theme,
    status,
    ...attributes
  } = props;
```

## 添加组件库 native-base

- [官方文档](https://docs.nativebase.io/Components.html#anatomy-headref)
- [github](https://github.com/GeekyAnts/NativeBase) master

- [版本支持情况 NativeBase Compatibility Modes](https://docs.nativebase.io/docs/Compatibility.html)

- [NativeBase Customizer，样式定制](https://nativebase.io/customizer/)

- [官方demo GeekyAnts/NativeBase-KitchenSink](https://github.com/GeekyAnts/NativeBase-KitchenSink) CRNA分支，这里参看theme下的样式文件

### Components

[查看组件的文档](https://docs.nativebase.io/Components.html#Components)

For more examples go through NativeBase-KitchenSink

#### 使用组件库，创建功能组件的时候

不需要Container，只要要嵌入的页面是被包裹在Container下的就好。

### Anatomy，解剖

定义整体的结构，一些内置的组件具有预设的样式。

#### Container

- A common way to use NativeBase screen structure is to have all the components within `<Container>`

- nb的标签必须被包括在`<Container>`内。

- Container takes mainly three components: `<Header>`, `<Content>` and `<Footer>`.

- Container组件会默认占据剩余的高度

### Header = `<head>`

表示，对应导航的头部配置，navigationOptions.header。
内置的样式应该是定位到Container的顶部。

### Content = `<body>`， 文档的主体

不要头部，尾部的情况下，就只会有一个Content

padder：是否具有一个固定的边距，距离边框。

可以当作无意义的标签来使用，相当于view，类似于vue的template标签，模板将会 替换 挂载的元素。

### Footer = 导航的createBottomTabNavigator，

生成底部导航，类似于Header

### api文档

[CheatSheet](https://docs.nativebase.io/docs/CheatSheet.html)

### Icon

[name的取值](https://oblador.github.io/react-native-vector-icons/) 默认使用Ionicons

[官方库](https://github.com/oblador/react-native-vector-icons)

[icon demo](https://nativebase.io/customizer/#)

#### 使用方式

type: 来说明使用的字体类型
name: 用来说明类型

```jsx  
<Icon name="home" />
<Icon type="FontAwesome" name="home" style={{ fontSize: 40 }} />
<IconNB name={"ios-heart"} style={{ color: "#ED4A6A" }} />
<Icon ios='ios-menu' android="md-menu" style={{fontSize: 20, color: 'red'}}/>
```

IconNB

### Accordion，手风琴样式

``` js
renderHeader={this._renderHeader}
renderContent={this._renderContent}
```

### ActionSheet， 选择器

For ActionSheet to work, you need to wrap your topmost component inside `<Root>` from native-base.

### Badge，徽章

带背景色的view

### Button

样式类型

- block
- transparent
- bordered
- rounded
- full
- icon
- size
- disabled

用途类型

- Primary (default)
- Success
- Info
- Warning
- Danger
- Light
- Dark

### Card，卡片，一块区域

[查看定义](https://docs.nativebase.io/Components.html#card-def-headref)

卡片，自带box-shadow，自有margin

CardItem，相当于分组显示的组，添加属性说明意图

- bordered，内部添加border
- header，表现像一个header
- Footer，同理header
- button，可以添加onpress
- transparent，不显示外阴影及border
- 内部可嵌套很多组件
- cardBody，主体body

### ListItem，类似于view，类似于CardItem

表现出块元素的特性。

### DatePicker

```js
import {
  Modal,
  View,
  Platform,
  DatePickerIOS,
  DatePickerAndroid
} from "react-native";
```

选中按钮如果需要，需要自己重写组件

### Dock Swiper

Swiper

### FABs

Floating Action Buttons

topRight topLeft似乎找不到位置

### Footer Tabs

类似于createBottomTabNavigator，功能比较强了

### Form

Replacing Component:

- Form: React Native View
- Item: React Native TouchableOpacity
- Input: React Native TextInput
- Label: React Native Text

Contents:

- Fixed Label
- Inline Label
- Floating Label
- Stacked Label
- Picker Input
- Regular Textbox
- Underlined Textbox
- Rounded Textbox
- Icon Textbox
- Success Input Textbox
- Error Input Textbox
- Disabled Textbox
- Textarea

Item: 类似于 ListItem， CardItem

### Layout， 布局器

占据父元素的剩余的100%

- Grid，like grid布局
- Row，行
- Col，列

- size，表示占据父级的百分比，flex属性的取值，不设置size，默认是1，优先级高于width

[flex, mdn](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)
[原理：flex常用取值分析](https://www.cnblogs.com/feiying100/p/6876474.html)

### List，列表，一组类似的结构

- List Divider
- List Header
- ListItem Selected
- ListItem NoIndent
- List Icon
- List Avatar
- List Thumbnail
- Dynamic List
- List Separator

属性：

- itemDivider：块分割，一块的标题的意思
- itemHeader：前置空位置，分组
- first： 配合itemHeader
- selected：选中的颜色，应该default可以设置
- noIndent

### Separator，分割区域

不能设置高度

### Picker，select

### Radio Button

### Search Bar

### Segment

Segments are best used as an alternative for tabs. Mainly used in iOS.

tab切换

### Spinner，loading

- color，控制颜色
- size，控制大小，默认large

### Swipeable List，可以左右滑动的list

- renderRow
- renderLeftHiddenRow
- renderRightHiddenRow
- leftOpenValue
- rightOpenValue

SwipeRow/list

### Tabs，选项卡，类似于Segment

horizontal region

#### Tabs

- initialPage={3}
- tabBarPosition={"bottom"}，控制上下显示tab

#### tab

- heading
- [elevation](https://reactnative.cn/docs/view-style-props/#elevation)
- backgroundColor

### Thumbnail，缩略图

### Toast，弹出框

```js
<Button
  onPress={() =>
    Toast.show({
      text: "Wrong password!",
      buttonText: "Okay",
      duration: 3000,
      position: "top",
      textStyle: { color: "yellow" },
      type: "success",
      buttonStyle: { backgroundColor: "#5cb85c" }
    })}
>
  <Text>Toast</Text>
</Button>
```

### Typography，Heading Tags

```html
H1 font-size: 27string, numberHeading tag <H1>
H2 font-size: 24string, numberHeading tag <H2>
H3 font-size: 21string, numberHeading tag <H3>
```

### Drawer

### Ref

```js
<Button
  ref={c => (this._button = c)}
  onPress={() => console.log(this)}
>
  <Text>Click Me</Text>
</Button>

<TextInput
  onChangeText={that => {
    console.log(that);
    console.log(this);
  }}
  style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
/>
```

### Customize，定制样式

#### themes and variables

[默认的样式表：](https://docs.nativebase.io/docs/ThemeVariables.html)

- components: Theme styling files for all the NativeBase components. This is where you would change the style properties of the components if you need to.

Example, if you need to change the height of Button component, you'll need to change height in native-base-theme/components/Button.js.

- variables: Contains three preset theme variable files, namely Platform, material, commonColor. You can change the variables (for color, fontFamily, iconFamily etc) for a uniform look and feel throughout your app.

#### 1.自定义主题，定制整体风格

1. ```node node_modules/native-base/ejectTheme.js```;
2. 修改组件库的引入方式：

```js
import React, { Component } from 'react';
import { Container, Content, Text, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
​export default class ThemeExample extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Content>
            <Text>
              I have changed the text color.
            </Text>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}
```

The `<StyleProvider>` with theme can be applied to any component of NativeBase.

#### 2.修改组件的样式，通过StyleProvider标签注入，适用于外部修改不了的样式

```js
// 这里引入单独的Button的样式修改函数，一般从源代码内复制出来这个文件，做一些修改，不然就用原本的自定义Button的封装组件
// buttonTheme is the customized theme of Button Component​
// 这里还是原来的
import buttonTheme from './Themes/buttonTheme';
// 使用修改的变量，这种方式修改太麻烦了
import customVariables from './Themes/variable';
<StyleProvider style={buttonTheme(customVariables)}>
  <Button primary>
    <Text> Primary </Text>
  </Button>
</StyleProvider>
```

#### 3.自定义style来改变样式，一般的样式配置

```js
<View style={styles.container}>
  <Text style={styles.textContent}>
    Your Component with static style
  </Text>
</View>
```

#### summary

- 可以控制整体的风格，修改variables；
- 可以修改某些组件的样式，修改components，可以查看组件的样式声明；
- 三种样式风格：
  - Platform，默认样式风格，不传就认为是取这一种；
  - Material，Material design，谷歌的一种定义风格；

### 行分布，left，body，right

- body，起于父元素的正中位置；这个位置等同Content；
- left，靠左，宽度等于子元素的宽度；
- right，靠右，同理

## 原生文档

### 运行状态的接口，AppState

能告诉你应用当前是在前台还是在后台，并且能在状态变化的时候通知你。

AppState 通常在处理推送通知的时候用来决定内容和对应的行为。

添加事件来进行回调。

```js
componentWillUnmount() {
  AppState.removeEventListener('change', this._handleAppStateChange);
}
_handleAppStateChange = (nextAppState) => {
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    console.log('App has come to the foreground!')
  }
  this.setState({appState: nextAppState});
}
```

### 异步存储，AsyncStorage

AsyncStorage是一个简单的、异步的、持久化的 Key-Value 存储系统，它对于 App 来说是全局性的。可用来代替 LocalStorage。

```js
// 保存数据：

_storeData = async () => {
  try {
    await AsyncStorage.setItem('@MySuperStore:key', 'I like to save it.');
  } catch (error) {
    // Error saving data
  }
}
// 读取数据：

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('TASKS');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
   } catch (error) {
     // Error retrieving data
   }
}
```

### 相册访问，CameraRoll

CameraRoll模块提供了访问本地相册的功能。

在 iOS 上使用这个模块之前，你需要先链接RCTCameraRoll库，具体做法请参考链接原生库文档。

### 地理位置信息，Geolocation

地理定位（Geolocation）API 遵循web 标准。

### 网络信息，NetInfo

```js
NetInfo.getConnectionInfo().then((connectionInfo) => {
  console.log('Initial, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
});
```