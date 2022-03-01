# React-TS

[参考文章](https://juejin.cn/post/6844903972579344392#heading-12)

## 类型列表

1. any
    1. 如果你把一个变量定义为 any 那就和和写 js 没什么区别了
2. unknow
    1. unknown 类型只能被赋值给 any 类型和 unknown 类型本身，不可以将类型为 unknown 的值赋值给其他类型的变量；
    2. 如果一个值被定义为 unknow,那么它可以被赋值为其他的任何类型，但如果一个非 any，非 unknow 的其他类型的值，那么它是不可赋值给 unknow 的类型的值
3. string、number、boolean
4. array

    1. 首先类型大写，后可跟一个<>，定义数组内的所包含的数据类型`let arr1: Array<number> = [1,3,5,6,7]`；
    2. 直接定义数组内包含的数据类型，后跟一个[ ]，`let arr4: string[] = ['q','a','n','zh']`；

5. tuple 元组
    1. tuple 类似 Array，可以称是严格版的数组，可以根据顺序、数量定义数据类型。
    2. 定义一个任意类型的混合模式，`let list:[number,string,string,boolean] = [24,'2','data',false]`；
6. enum 枚举
    1. `enum Color { Red = 9, Green,Blue }`
7. object 非原始类型
    1. `const obj: object = [2, 'q', { a: 2 }];`
8. void 表示没有任何数据类型，空值，与 any 正好相反
    1. 只有 null 和 undefined 可以赋值给 void 类型，所以声明一个 void 类型但变量没什么用
9. never 不存在
    1. 常用于抛出异常或者没有任何返回值
10. undefined && null，这两个类型是任何类型的子类型，（除严格情况）任何类型都可以赋值 undefined 和 null，但本身但用处不是太大，和 void 类似
11. 联合类型，`|`
    1. 联合类型是基于我们上面类型的一个整合，可以取值为定义中的任何一个，使用 | 来分割每个类型。

## 访问限定

1. public：公共属性，成员默认为 public，可加，可不加，都可以被外部访问。
2. protected：受保护属性 ，只可以被类的内部以及类的子类访问
3. private：私有属性，当成员被标记为：private，它只可以被类对内部访问，不能被外部访问，继承中也不可以

## 接口，interface

在 ts 里，接口的作用就是**为这些类型命名和为你的代码或第三方组件定义契约**，用关键字 interface 来定义接口参数的数据类型，并将其给到函数，函数的参数必须遵守 interface 里面定义的类型。

1. 只读属性 readonly
2. 可选属性 ?
3. 函数类型，函数的参数和返回值可以一起通过接口来定义

```ts
interface GetInfo {
    (name: string | number, age: number): boolean;
}

let getInfo: GetInfo;

getInfo = function (name: string, age: number) {
    return typeof name === typeof age;
};

console.log(getInfo('张三', 12)); // false
console.log(getInfo(12, 13)); // true
```

## 泛型

泛型（Generics）是指在定义函数、接口或类的时候，**不预先指定具体的类型，而在使用的时候再指定类型的一种特性**。

有时我们需要一个函数接收什么类型参数，就返回什么类型的值，这时我们就用到了泛型。我们在函数名后添加 <T>，其中 T 就用来指代任意输入的类型，前后类型一致。

```ts
function foo<T>(value: T): T {
    return value - 1;
}
foo('3'); // error 接收的是string ,返回的是number
```

## 类型断言 as

1. 类型断言有两种形式。 其一是“尖括号”语法，value ：
2. 另一个为 as 语法 value as type ：

## keyof 操作符

TypeScript 允许我们遍历某种类型的属性，并通过 keyof 操作符提取其属性的名称，还可获取到 value 的值，如下：

```ts
interface Point {
    x: number;
    y: number;
}

type keys = keyof Point; // type keys = "x" | "y"
```

## 省略部分指定的类型 Omit

## ts 的一些好的使用实践

### 类型联合

```ts
interface IPerson {
    name: string;
    age: number;
    job: string;
}
interface IInfo {
    key: number;
    text: string;
}

type IParams = IInfo & IPerson;
```

## 分解 React 中的 TS 类型定义

```ts
import React from 'react';
import { PaginationProps } from 'antd/es/pagination';

interface IResponseUpload {
    Location: string;
}

interface Item {
    label: string;
    value: number;
}

interface IStatusDict {
    [key: number]: {
        text?: string;
        color?: string;
    };
}

interface IProps {
    name: string;

    age: number;

    isLoading: boolean;

    dataList: Item[];

    statusDict: IStatusDict;

    subIdList: number[];

    detail: {
        job: string;
        showPic?: boolean;
    };

    pagination: PaginationProps;

    type: 1 | 2 | 3;

    size?: 'sm' | 'md' | 'lg' | 'mini';

    width?: number;

    children?: React.ReactChild;

    header?: React.ReactNode;

    onChange?: (e: React.ChangeEvent | string) => void;

    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

    onTableFetch: (props: any) => { items: Array<any>; total: number; page: number; size: number };

    onUpload: (file: File) => Promise<IResponseUpload>;
}
```
