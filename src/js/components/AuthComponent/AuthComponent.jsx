import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';

class AuthComponent extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        (this.props.role === "admin" || this.props.role === "super_admin") ? this.props.history.push('/admin') :
        (this.props.role === "player") ? this.props.history.push('/owner_login') : this.props.history.push('/login')
    }

    render() {
        return (
        <div>

        </div>
        )
    }
}

export default withRouter(AuthComponent);
