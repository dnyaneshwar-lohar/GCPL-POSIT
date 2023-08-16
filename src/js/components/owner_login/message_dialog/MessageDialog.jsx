import React, { Component } from "react";
import { ReactDOM } from "react-dom";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import { Modal, Button, Space, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

class MessageDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.messageType == "positive") {
      Modal.success({
        title: "Successful",
        content: this.props.dialogMessage,
        onOk: () => {
          this.props.handleUpdate();
        }
      });
    } else if (this.props.messageType == "warning") {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: "Do you want to update?",
        content: this.props.dialogMessage,
        onOk: () => {
          this.props.handleOk();
          message.success("Successfully updated, logging out", 2);
          this.props.logout();
          this.props.history.push("/login");
        },
        onCancel: () => {
          this.props.handleCancle();
        }
      });
    } else {
      Modal.error({
        title: "Error",
        content: this.props.dialogMessage,
        onOk: () => {
          this.props.handleErrorOk();
        }
      });
    }
  }

  render() {
    return <div></div>;
  }
}
export default withRouter(MessageDialog);
