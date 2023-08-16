import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '../modules/store';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import NavbarExample from '../navbar/Navbar.jsx';
import About from '../about/About.jsx';
import Gallary from '../gallary/Gallary.jsx';
import Journey from '../journey/Journey.jsx';
import Admin from '../admin/Admin.jsx';
import Owner_login from '../owner_login/owner_login_page/Owner_login.jsx';
import Contact from '../contact/Contact.jsx';

import ownerhome from '../owner_homepage/OwnerHomepage.jsx';
import Profile from "../owner_login/profile_page/Profile.jsx";

import LoginTabs from '../login-tabs/LoginTabs.jsx';
import AuthComponent from '../AuthComponent/AuthComponent.jsx';
import OwnerReg from '../ownerReg/OwnerReg.jsx';
import AdminReg from '../adminReg/AdminReg.jsx';
import NotFound from '../notFound/NotFound.jsx';
import ForgetPassword from '../reset/forgetPassword/ForgetPassword.jsx';
import ResetPasssword from '../reset/resetPasssword/ResetPasssword.jsx';
import jwt_decode from 'jwt-decode';
import 'antd/dist/antd.css';

const store = configureStore();

class FormContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      email_id: null,
      first_name: null,
      photo: null,
    };
    this.handleLogout = this.handleLogout.bind();
    this.updateRole = this.updateRole.bind();
  }

  handleLogout = async () => {
    localStorage.removeItem('token');
    await this.setState(
      {
        token: null,
        role: '',
        email_id: '',
        first_name: '',
        photo: '',
      },
      () => {}
    );
    return <Redirect to="/login" />;
  };

  updateRole = async () => {
    try {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      await this.setState({
        token: token,
        role: decoded.userData.role,
        email_id: decoded.userData.email_id,
        first_name: decoded.userData.first_name,
        photo: decoded.userData.photo,
      });
    } catch (e) {}
  };

  async componentWillMount() {
    try {
      const token = localStorage.getItem('token');
      var decoded = jwt_decode(token);
      await this.setState({
        token: token,
        role: decoded.userData.role,
        email_id: decoded.userData.email_id,
        first_name: decoded.userData.first_name,
        photo: decoded.userData.photo,
      });
    } catch (e) {}
  }

  render() {
    return (
      <Router>
        <div>
          <NavbarExample
            role={this.state.role}
            email_id={this.state.email_id}
            first_name={this.state.first_name}
            photo={this.state.photo}
            updateRole={this.updateRole}
            handleLogout={this.handleLogout}
          />
          <Switch>

            <Route exact path="/" render={(props) => (this.state.token == null ? <Redirect to="/login" /> : <Redirect to="/auth" />)} /> 
            <Route path="/auth" render={(props) => (this.state.role ? <AuthComponent role = {this.state.role} {...props}/> : <Redirect to="/login" />)}/>
            <Route path="/about" component={About} />
            <Route path="/gallery" component={Gallary} />
            <Route path="/journey" component={Journey} />

            <Route path="/home" component={ownerhome} />
            <Route path ="/fp-admin" render={(props) => ( <ForgetPassword role = "admin"/>)} />
            <Route path ="/fp-player" render={(props) => (<ForgetPassword role = "player"/>)} />
            <Route exact path ='/admin-reset/token' render={(props) => ( <ResetPasssword role = "admin"/>)} />
            <Route exact path ='/player-reset/token' render={(props) => (<ResetPasssword role = "player"/>)} />
            <Route path ="/ownerReg" component = {OwnerReg} />
            <Route path="/owner_login"  render={(props) => (this.state.role !== null ? <Owner_login role = {this.state.role} handleLogout = {this.handleLogout} {...props}/> : <Redirect to="/login" />)}></Route>
            <Route path ="/ownerProfile" render={(props) => <Profile role = {this.state.role} handleLogout = {this.handleLogout} {...props}/> }/>
            <Route path ="/adminReg" component = {AdminReg} />
            <Route path="/admin" render={(props) => (this.state.role !== null ? <Admin role = {this.state.role} handleLogout = {this.handleLogout} {...props}/> : <Redirect to="/login" />)}/>
            <Route path="/contact" component = {Contact}/>
 	          <Route path="/login" render={(props) => (this.state.token == null ? <LoginTabs updateRole = { this.updateRole }/> : <Redirect to="/auth" />)} /> 
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default FormContainer;
const wrapper = document.getElementById('root');
wrapper
  ? ReactDOM.render(
      <Provider store={store}>
        <FormContainer />
      </Provider>,
      wrapper
    )
  : false;
