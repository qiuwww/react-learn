# 打包百度搜索

打包一个外壳

## android

参照官网基本是可以实现打包运行的

## ios

需要执行`npm i`和`cd ios && pod install`

安装 ios 的依赖需要很久，等待需要很久

## 开发

webview 现在在单独的 react-native-webview 包内，需要`yarn add react-native-webview && react-native link react-native-webview`
