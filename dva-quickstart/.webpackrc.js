const path = require("path");
export default {
  entry: {
    index: "./src/index.js"
  },
  // 注入外部引入的全局变量
  externals: {
    // BMap: "BMap"
  },
  extraBabelPlugins: [
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
  ],
  env: {
    development: {
      define: {
        "process.env": "dev",
        USE_COMMA: 2
      },
      extraBabelPlugins: ["dva-hmr"],
      publicPath: "/"
    },
    production: {
      define: {
        "process.env": "prod",
        USE_COMMA: 3
      },
      extraBabelPlugins: [["transform-remove-console"]],
      publicPath: "./"
    }
  },
  // 别名
  alias: {
    components: path.resolve(__dirname, "./src/components/")
  },
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  outputPath: path.resolve(__dirname, "./admin"),
  hash: true,
  browserslist: ["> 1%", "last 2 versions"]
};
