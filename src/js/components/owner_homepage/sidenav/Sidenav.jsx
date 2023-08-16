import { Layout, Menu } from "antd";
import { BarChartOutlined, UnorderedListOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import Details from "../details/Details.jsx";
import Figures from "../figures/Figures.jsx";

import {
  BrowserRouter as Router,
  Link,
  Route,
  withRouter,
} from "react-router-dom";
const { Content, Sider } = Layout;

class Sidenav extends Component {
  state = {
    collapsed: false,
    isShowed: false,
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };
  show = () => {
    this.setState({
      isShowed: !this.state.isShowed,
    });
  };

  render() {
    const isActive = this.state.isShowed;
    return (
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          collapsible="collapsible"
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          breakpoint={"md"}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<UnorderedListOutlined />}>
              <Link to={"/home/"}>Details</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<BarChartOutlined />}>
              <Link to={"/home/figures"}>Figures</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Route exact path="/home/" component={Details}></Route>
              <Route exact path="/home/figures/" component={Figures}></Route>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Sidenav);
