import React, { Component } from "react";
import ReactDOM from "react-dom";
import styles from "./Navbar.css";
import Img from "./pst.png";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink, withRouter } from "react-router-dom";
import { Collapse, Navbar, Nav, NavItem, } from "react-bootstrap";
import { Popover, Avatar, Col, Button } from "antd";
import Profile_Img from "../owner_login/assets/usericon.png";

class NavbarExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      role: "",
      profile_photo: { Profile_Img }
    };
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  handle = async () => {
    if (localStorage.getItem("token")) {
      this.props.handleLogout();
      await this.setState({
        role: '',
        visible: false,
      })
      this.props.history.push('/login');
    }
  };

  loginBtnHandler = () => {
    this.props.history.push('/login');
  }

  componentWillMount() {
    this.props.updateRole();
  }

  render() {
    let db_photo;
    let set_photo = false;
    let initName = "";
    let default_photo = this.state.profile_photo;
    let str = default_photo.toString('base64')
    default_photo = Buffer.from(str, 'utf8');

    if (this.props.photo) {
      db_photo = Buffer.from(this.props.photo, "utf8");
      if (JSON.stringify(db_photo) !== JSON.stringify(default_photo)) {
        set_photo = true;
      } else {
        initName = (this.props.email_id.slice(0, 1)).toUpperCase();
        set_photo = false;
      }
    } else if (this.props.email_id) {
      initName = (this.props.email_id.slice(0, 1)).toUpperCase();
      set_photo = false;
    }

    return (
      <div>
        <Navbar className="Navbar" variant="dark" expand="lg">
          <NavLink to={"/"}>
            <Navbar.Brand className="navbar-brand ml-4">
              <img
                src={Img}
                width="40px"
                height="40px"
                className="d-inline-block align-top"
                alt="GCPL"
              />
            </Navbar.Brand>
          </NavLink>

          <Navbar.Toggle
            className="Navbar-Toggle"
            aria-controls="basic-navbar-nav"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="Nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to={"/about"}>
                  About GCPL
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/journey"}>
                  GCPL Journey
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/gallery"}>
                  Nostalgic Gallary
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to={"/contact"}>
                  Contact Us
                </NavLink>
              </li>
            </Nav>
            <Nav className="Nav-ml-auto">
              <li className="nav-item">
                {localStorage.getItem("token") ? (
                  <Popover
                    placement="bottomLeft"
                    content={
                      <div className="user-popover-info">
                        <Col span={24}>
                          {
                            (this.props.role === "admin" || this.props.role === "super_admin")
                              ?
                              (<div>
                                <NavLink to={"/admin"}>
                                  {this.props.first_name}
                                </NavLink>
                              </div>)
                              :
                              (<div>
                                <NavLink to={"/owner_login"}>
                                  {this.props.first_name}
                                </NavLink><br />
                                <div className="user-popover-navLink">
                                  <NavLink className="user-popover-options" to={"/ownerProfile"}>
                                    Profile
                                  </NavLink>
                                </div>
                              </div>)
                          }
                          {
                            (process.env.AUTHENTICATION == "ON") ?
                              (<>
                                <div className="dropdown-divider"></div>
                                <Button
                                  onClick={this.handle}
                                  style={{ width: "100%" }}
                                  danger
                                >
                                  Logout
                                </Button>
                              </>) :  (<>
                                <div className="dropdown-divider"></div>
                                <Button
                                  disabled
                                  onClick={this.handle}
                                  style={{ width: "100%" }}
                                  danger
                                >
                                  Logout
                                </Button>
                              </>)
                          }
                        </Col>
                      </div>
                    }
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                  >
                    <div className="Right">
                      {
                        (set_photo) ?
                          (<img
                            src={db_photo}
                            width="40px"
                            height="40px"
                            className="profile_image"
                            alt="Profile"
                          />) :
                          (<Avatar
                            className="avatar"
                            size="large"
                            icon={initName}
                          />)
                      }
                    </div>
                  </Popover>
                ) : (
                  <Button type="primary" className="nav-login-btn" onClick={this.loginBtnHandler}>LOGIN</Button>
                )}
              </li>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavbarExample);
