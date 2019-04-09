# react新功能-2019.4.9

[TOC]

## V16.0

### render可以返回字符串，数组，数字

这里的render的结果，在组件被引用的时候，还是被直接渲染了。
也就是方便了多个组件的连续输出，或者只是输出一个字符串。

支持返回这五类：React elements, 数组和Fragments，Portal，String/numbers，boolean/null。

