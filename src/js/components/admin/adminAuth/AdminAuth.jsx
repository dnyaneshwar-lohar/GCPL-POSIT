import React, {
  Component,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  notification,
  Tag,
} from "antd";
import Message from "../../shared/message";
import axios from "axios";

class AdminAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: [],
    };
  }

  fetchData = () => {
    axios.get("http://localhost:4000/admin/auth").then((res) => {
      this.setState({ account: res.data });
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  handleApprove = (key) => {
    axios
      .post("http://localhost:4000/admin/authStatus", null, {
        params: {
          user_id: key,
        },
      })
      .then((res) => {
        this.fetchData();
      })
      .then((response) => {
        Message.success("Record has been approved");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleRole = (key) => {
    axios
      .post("http://localhost:4000/admin/authRole", null, {
        params: {
          user_id: key,
        },
      })
      .then((res) => {
        this.fetchData();
      })
      .then((response) => {
        Message.success("Role has been changed");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { account } = this.state;
    const columns = [
      {
        title: "User Name",
        dataIndex: "user_name",
      },
      {
        title: "Email Id",
        dataIndex: "email_id",
      },
      {
        title: "Phone No",
        dataIndex: "phone_no",
      },
      {
        title: "Action",
        dataIndex: "",
        render: (text, record) =>
          this.state.dataSource != "" ? (
            record.approve_status == "1" ? (
              <Tag color="green">APPROVED</Tag>
            ) : (
              <Popconfirm
                title={
                  record.approve_status != "1"
                    ? "Sure want to approve"
                    : "Already approved"
                }
                onConfirm={
                  record.approve_status != "1"
                    ? () => this.handleApprove(record.user_id)
                    : null
                }
              >
                <a style={{ color: "#1890FF" }}>APPROVE</a>
              </Popconfirm>
            )
          ) : null,
      },
      {
        title: "Change Role",
        dataIndex: "",
        render: (text, record) =>
          this.state.dataSource != "" ? (
            record.user_group_id == "1" ? (
              <Tag color="green">SUPER ADMIN</Tag>
            ) : (
              <Popconfirm
                title={
                  record.user_group_id != "1"
                    ? "Sure want to change role"
                    : "Role can't be changed..!"
                }
                onConfirm={
                  record.user_group_id != "1"
                    ? () => this.handleRole(record.user_id)
                    : null
                }
              >
                <a style={{ color: "#1890FF" }}>ADMIN</a>
              </Popconfirm>
            )
          ) : null,
      },
    ];
    return (
      <Table
        dataSource={account}
        rowClassName={() => "editable-row"}
        columns={columns}
        rowKey={"user_id"}
        scroll={{ x: true }}
      />
    );
  }
}
export default AdminAuth;
