import { Layout, Menu, Breadcrumb } from "antd";
import {
  BarChartOutlined,
  UnorderedListOutlined,
  DribbbleOutlined,
  KeyOutlined,
  TeamOutlined,
  FileImageOutlined,
  ScheduleOutlined
} from "@ant-design/icons";
import React, { Component } from "react";
import SponsorList from "../sponsorlist/SponsorList.jsx";
import SponsorFormPage from "../sponsorlist/SponsorFormPage.jsx";
import Player from "../player/Player.jsx";
import Account from "../account/Account.jsx";
import AdminAuth from "../adminAuth/AdminAuth.jsx";
import CategoryListPage from "../category/list/CategoryListPage.jsx";
import CategoryFormPage from "../category/form/CategoryFormPage.jsx";
import CategoryViewPage from "../category/view/CategoryViewPage.jsx";
import TeamListPage from "../teams/TeamListPage.jsx";
import TeamFormPage from "../teams/TeamFormPage.jsx";
import Dashboard from "../dashboard/Dashboard.jsx";
import AdminGallery from "../gallery/AdminGallery.jsx";
import Schedule from "../schedule/Schedule.jsx";
import Stepwiseteam from '../teamFormation/Stepwiseteam.jsx';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import jwt_decode from "jwt-decode";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Sidenav extends Component {
  state = {
    collapsed: false,
    isShowed: false,
    role: "",
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  show = () => {
    this.setState({
      isShowed: !this.state.isShowed,
    });
  };

  async componentWillMount() {
    try {
      const token = localStorage.getItem("token");
      var decoded = jwt_decode(token);
      await this.setState({
        role: decoded.userData.role,
      });
    } catch (e) { }
  }

  render() {
    const isActive = this.state.isShowed;
    return (
      <Layout
        style={{
          height:"100%",
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <Sider
         style={{
          minHeight:"100vh",
          position: "sticky",
          top: "0",
          bottom: "0",
          height: "100%",
        }}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          breakpoint={"md"}
          style={{
            minHeight:"100vh",
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<BarChartOutlined />}>
              <Link to={"/admin/"}>Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UnorderedListOutlined />}>
              <Link to={"/admin/category"}>Category</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />}>
              <Link to={"/admin/team"}>Teams</Link>
            </Menu.Item>


            <SubMenu
              key="sub1"
              title={
                <span>
                  <DribbbleOutlined />
                  <span>Tournament</span>
                </span>
              }
            >
              <Menu.Item key="4">Cricket</Menu.Item>
              <Menu.Item key="5">Badminton</Menu.Item>
              <Menu.Item key="6">Add sports</Menu.Item>
            </SubMenu>
            <Menu.Item key="7" icon={<TeamOutlined />}>
              <Link to={"/admin/sponsor"}>Sponsor</Link>
            </Menu.Item>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <KeyOutlined />
                  <span>Authenticate</span>
                </span>
              }
            >
              <Menu.Item key="8">
                <Link to={"/admin/player"}>Player Registration</Link>
              </Menu.Item>
              <Menu.Item key="9">
                <Link to={"/admin/account"}>Account</Link>
              </Menu.Item>
              {this.state.role === "super_admin" ? (
                <Menu.Item key="10">
                  <Link to={"/admin/auth"}>Admin</Link>
                </Menu.Item>
              ) : null}
            </SubMenu>
            <Menu.Item key="11" icon={<FileImageOutlined />}>
              <Link to={"/admin/gallery"}>Gallery</Link>
            </Menu.Item>
            <Menu.Item key="12" icon={<ScheduleOutlined />}>
              <Link to={"/admin/schedule"}>Schedule</Link>
            </Menu.Item>
            <Menu.Item key="13" icon={<BarChartOutlined />}>
              <Link to={"/admin/stepwiseteam"}>Team formation</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Route exact path="/admin" component={Dashboard} />
              <Route
                exact
                path="/admin/category"
                component={CategoryListPage}
              />
              <Route
                path="/admin/category/:category/view"
                component={(props) => <CategoryViewPage {...props} />}
              />
              <Route
                exact
                path="/admin/category/new"
                component={CategoryFormPage}
              />
              <Route
                exact
                path="/admin/category/:category/edit"
                component={(props) => <CategoryFormPage {...props} />}
              />
              <Route
                exact
                path="/admin/sponsor/:ID/edit"
                component={(props) => <SponsorFormPage {...props} />}
              />
              <Route
                exact
                path="/admin/sponsor/new"
                component={SponsorFormPage}
              />
              <Route exact path="/admin/sponsor" component={SponsorList} />
              <Route exact path="/admin/stepwiseteam"  component={Stepwiseteam} />
              <Route exact path="/admin/team" component={TeamListPage} />
              <Route exact path="/admin/team/new" component={TeamFormPage} />
              <Route exact path="/admin/team/back" component={Stepwiseteam} />          
              <Route
                exact
                path="/admin/team/:team/edit"
                component={(props) => <TeamFormPage {...props} />}
              />
              <Route path="/admin/player" component={Player} />
              <Route path="/admin/account" component={Account} />
              <Route path="/admin/auth" component={AdminAuth} />
              <Route path="/admin/gallery" component={AdminGallery} />
              <Route path="/admin/schedule" component={Schedule} />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(Sidenav);
