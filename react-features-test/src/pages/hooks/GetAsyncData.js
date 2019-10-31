import React, { useEffect, useState } from "react";

const GetAsyncData = ({ wrap, children }) => {
  console.log("GetAsyncData", wrap);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(true);
  useEffect(() => {
    let isUnmounted = false;
    fetch("https://api.gushi.ci/all.json")
      .then(res => {
        return res.text();
      })
      .then(res => {
        if (!isUnmounted) {
          setLoading(false);
          setValue(res);
        }
      });
    return () => {
      isUnmounted = true;
    };
  }, {});
  return (
    <React.Fragment>
      {loading ? <h2>Loading...</h2> : <h2>value is {value}</h2>}
      {children}
    </React.Fragment>
  );
};
export default GetAsyncData;
