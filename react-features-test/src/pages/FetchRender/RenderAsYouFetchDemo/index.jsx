import React, { Suspense } from 'react';

import './styles.css';
import { fetchProfileData } from './fakeApi';
// 得到的数据结果
const resource = fetchProfileData();
console.log('React', React);

/**
 * @desc 按需渲染
 * 官方文档地址：https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html#___gatsby
 * 暂挂不是数据获取库。这是一种数据获取库与React进行通信的机制，即组件正在读取的数据尚未准备好。然后，React可以等待它准备就绪并更新UI。在Facebook，我们使用Relay及其新的Suspense集成。我们希望像Apollo这样的其他库也可以提供类似的集成。
 从长远来看，我们希望Suspense成为从组件读取异步数据的主要方法-无论数据来自何处。
 */

export default function ProfilePage() {
  return (
    <Suspense fallback={<h3>Loading profile...</h3>}>
      <ProfileDetails />
      <Suspense fallback={<h3>Loading posts...</h3>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
