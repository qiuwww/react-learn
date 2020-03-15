import fetch from 'node-fetch';

function SsrDemo({ data }) {
  // Render data...
  return (
    <div>
      {data.content} | {data.author}
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  console.log("getServerSideProps run");
  // Fetch data from external API
  const res = await fetch('https://v1.jinrishici.com/all.json');
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default SsrDemo;
