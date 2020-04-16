// 可以使用任何用于获取数据的工具库
import fetch from 'node-fetch';
import Header from '../components/Header';

// TODO: 需要获取 `posts`（通过调用 API ）
// 在此页面被预渲染之前
function Blog({ posts }) {
  return (
    <div>
      <Header />
      {posts.content} |{posts.author}
      <img src='/timg.jpeg'/>
    </div>
  );
}

// 要在预渲染时获取此数据，Next.js 允许你从同一文件 export（导出） 一个名为 getStaticProps 的 async（异步） 函数。该函数在构建时被调用，并允许你在预渲染时将获取的数据作为 props 参数传递给页面。

// 此函数在构建时被调用
export async function getStaticProps() {
  console.log('getStaticProps run');
  // 调用外部 API 获取博文列表
  const res = await fetch('https://v1.jinrishici.com/all.json');
  const posts = await res.json();

  // 通过返回 { props: posts } 对象，Blog 模块
  // 在构建时将接收到 `posts` 参数
  return {
    props: {
      posts
    }
  };
}

export default Blog;
