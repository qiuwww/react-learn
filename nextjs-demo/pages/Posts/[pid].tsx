import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import fetch from 'node-fetch';

interface Props {}
export default function Posts({}: Props): ReactElement {
  const router = useRouter();

  const { pid } = router.query;
  return <p>Post: {pid}</p>;
}

// 在构建时会调用此函数
// export async function getStaticPaths() {
//   // 调用外部 API 获取博文列表
//   const res = await fetch('https://v1.jinrishici.com/all.json');
//   const posts = await res.json();

//   // 根据博文列表生成所有需要预渲染的路径
//   // const paths = posts.map(post => `/posts/${post.id}`);

//   // // We'll pre-render only these paths at build time.
//   // // { fallback: false } means other routes should 404.
//   // return { paths, fallback: false };

//   return {};
// }
