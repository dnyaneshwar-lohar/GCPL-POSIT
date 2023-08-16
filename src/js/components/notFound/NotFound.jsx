import React, { Component } from 'react'
import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';
import './NotFound.css';

class NotFound extends Component {
    render() {
        return (
            <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" icon={<HomeOutlined/>} size={"middle"} onClick={() => this.props.history.push('/')}>Back To Home</Button>}
            />
        )
    }
}

export default withRouter(NotFound);
