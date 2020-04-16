---
title: nextjs
date: 2020-3-15
tags:
  - React
  - 服务端渲染
  - nextjs
categories:
  - [服务端渲染, nextjs]
  - [React]
---

使用 ts，需要添加 ts 支持的包。

`yarn add --dev typescript @types/react @types/node`

## getting-started

```bash
yarn create next-app
cd floder
yarn dev
```

## pages

在 Next.js 中，一个 page（页面） 就是一个从 .js、.ts 或 .tsx 文件导出（export）的 React 组件 ，这些文件存放在 pages 目录下。每个 page（页面）都基于其文件名与路由（route）关联。

### 预渲染

默认情况下，Next.js 将 **预渲染 每个 page（页面）**。这意味着 Next.js 会预先为每个页面生成 HTML 文件(预先拼装，预先执行 js，拼接成 html)，而不是由客户端 JavaScript 来完成。预渲染可以带来更好的性能和 SEO 效果。

Next.js 具有**两种形式的预渲染**：

- 静态生成（推荐）（Static Generation）：HTML 在 构建时 生成，并在每次页面请求（request）时重用。
- 服务器端渲染（Server-side Rendering）：在 每次页面请求（request）时 重新生成 HTML。

你可以创建一个 “混合渲染” 的 Next.js 应用程序：对大多数页面使用“静态生成”，同时对其它页面使用“服务器端渲染”。

**推荐** 在服务器端渲染的同时使用 静态生成 。 CDN 可以缓存静态生成的页面以提高性能。但是，在某些情况下，服务器端渲染可能是唯一的选择。

#### 静态生成（推荐）

如果一个页面使用了 静态生成，在 **构建时（build time） 将生成此页面对应的 HTML 文件** 。

需要获取数据的静态生成。

1. 您的页面 内容 取决于外部数据：使用 getStaticProps。（pages/blog）
2. 你的页面 paths（路径） 取决于外部数据：使用 getStaticPaths （通常还要同时使用 getStaticProps）。

还可以对多种类型的页面使用“静态生成”，包括：

- 营销页面
- 博客文章
- 电商产品列表
- 帮助和文档

您应该问问自己：“我可以在**用户请求之前预先渲染此页面吗**？” 如果答案是肯定的，则应选择“静态生成”。

将“静态生成”与 客户端渲染 **一起使用**：你可以跳过页面某些部分的预渲染，然后使用客户端 JavaScript 来填充它们。

#### 服务器端渲染，也被称为 “SSR” 或 “动态渲染”

参见 pages/SsrDemo。
如果 page（页面）使用的是 服务器端渲染，则会在 每次页面请求时 重新生成页面的 HTML 。

要对 page（页面）使用服务器端渲染，你需要 export 一个名为 **getServerSideProps** 的 async 函数。服务器将在每次页面请求时调用此函数。

如你所见，getServerSideProps 类似于 getStaticProps，**但两者的区别在于 getServerSideProps 在每次页面请求时都会运行，而在构建时不运行**。

## Static File Serving，静态服务器

静态文件存放在 public 文件夹下，这里就是引用的根目录。

## 路由

在 pages 下创建页面，直接对应到路由。

### 一般页面路由

`pages/About -> http://localhost:3000/about`

### 动态路由的页面

`pages/posts/[pid].js(Posts) -> posts/1、posts/2` 的文件，那么就可以通过 `posts/1、posts/2` 等类似的路径进行访问。

`pages/blog/[slug].js → /blog/:slug (/blog/hello-world)`
`pages/[username]/settings.js → /:username/settings (/foo/settings)`
`pages/post/[...all].js → /post/* (/post/2020/id/title)`

### 路由跳转

```js
import Link from 'next/link';
<Link href="/about">
  <a>About Us</a>
</Link>;

<Link href="/blog/[slug]" as="/blog/hello-world">
  <a>To Hello World Blog post</a>
</Link>;
```

## 主要接口 ｜ 获取数据以及组件生命周期

1. getStaticProps： 此函数在构建时被调用；
2. getServerSideProps
3. getInitialProps
