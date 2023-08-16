import React, {Component} from 'react';
import ReactDOM from "react-dom";
import { Card, CardImg, CardText, CardBody,CardTitle, CardSubtitle, Button, Form, FormGroup, Label, Input, FormText,  NavLink, InputGroup } from 'reactstrap';
import '../login-tabs/LoginTabs.css';
import AdminLogin from '../Login/AdminLogin.jsx';
import PlayerLogin from '../Login/PlayerLogin.jsx';

class LoginTabs extends React.Component {
  render() {
    return (
      <div className="tabs">
        <Tabs>
          <Tab label="Admin">
            <div>
              <AdminLogin updateRole = { this.props.updateRole }/>
            </div>
          </Tab>
          <Tab label="Player">
            <div>
              <PlayerLogin updateRole = { this.props.updateRole }/>
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

class Tabs extends React.Component {
  state = {
    activeTab: this.props.children[0].props.label,
  };
  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };
  render() {
    let content;
    let buttons = [];
    return (
      <div>
        {React.Children.map(this.props.children, (child) => {
          buttons.push(child.props.label);
          if (child.props.label === this.state.activeTab)
            content = child.props.children;
        })}

        <TabButtons
          activeTab={this.state.activeTab}
          buttons={buttons}
          changeTab={this.changeTab}
        />
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}

const TabButtons = ({ buttons, changeTab, activeTab }) => {
  return (
    <div className="tab-buttons">
      {buttons.map((button, index) => {
        return (
          <button
            key={index}
            className={button === activeTab ? "active" : ""}
            onClick={() => changeTab(button)}
          >
            {button}
          </button>
        );
      })}
    </div>
  );
};

const Tab = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default LoginTabs;
