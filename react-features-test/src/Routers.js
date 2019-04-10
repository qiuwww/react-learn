import React, { Component } from "react";
import Home from "./pages/home/Home";
import Feature0_4 from "./pages/feature0_4/Feature0_4";
import Feature4_6 from "./pages/feature4_6/Feature4_6";
// using ES6 modules
import { HashRouter, Route, Link, Switch } from "react-router-dom";
import Feature8 from "./pages/feature8/Feature8";
class Layout extends Component {
  render() {
    return (
      <div className="Layout">
        <h2>测试react的功能</h2>
        <ul>
          <li>
            <Link to="/feature0_4">v16.0 ~ 16.4的新特性</Link>
          </li>
          <li>
            <Link to="/feature4_6">v16.4 ~ 16.6的新特性</Link>
          </li>
          <li>
            <Link to="/feature8">v16.8的新特性 Hooks</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

function Routers() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Home} redirectPath="/" />
        <Layout path="/" component={Layout}>
          <Route path="/feature0_4" component={Feature0_4} />
          <Route path="/feature4_6" component={Feature4_6} />
          <Route path="/feature8" component={Feature8} />
          <Route path="/home" component={Home} />
        </Layout>
      </Switch>
    </HashRouter>
  );
}

export default Routers;
