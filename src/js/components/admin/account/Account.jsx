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
import jwt_decode from "jwt-decode";
import moment from "moment";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: [],
      email_id: "",
    };
  }

  fetchData = () => {
    axios.get("http://localhost:4000/admin/account").then((res) => {
      this.setState({ account: res.data });
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  handleApprove = async (key) => {
    try {
      const token = localStorage.getItem("token");
      var decoded = jwt_decode(token);
      await this.setState({
        role: decoded.userData.role,
        email_id: decoded.userData.email_id,
      });
      this.submit(key, this.state.email_id);
    } catch (e) {}
  };

  submit = (key, email) => {
    if (email != null) {
      axios
        .post("http://localhost:4000/admin/account", null, {
          params: {
            account_id: key,
            verify_by: email,
          },
        })
        .then((res) => {
          this.fetchData();
        })
        .then((res) => {
          () => console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    const { account } = this.state;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Phase",
        dataIndex: "phase_no",
      },
      {
        title: "Building",
        dataIndex: "building_no",
      },
      {
        title: "Flat",
        dataIndex: "flat_no",
      },
      {
        title: "Owner",
        dataIndex: "owner",
      },
      {
        title: "Mobile No",
        dataIndex: "mobile_no",
      },
      {
        title: "Email",
        dataIndex: "email_id",
      },
      {
        title: "Verified By",
        dataIndex: "",
        render: (record) =>
          record.verify_by !== null ? (
            record.verify_by
          ) : (
            <Tag color={"red"}>N.A</Tag>
          ),
      },
      {
        title: "Verified At",
        dataIndex: "",
        render: (record) =>
          record.verify_date !== null ? (
            moment(record.verify_date).format("DD-MMM-YYYY")
          ) : (
            <Tag color={"red"}>N.A</Tag>
          ),
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
                    ? () => this.handleApprove(record.account_id)
                    : null
                }
              >
                <a style={{ color: "#1890FF" }}>APPROVE</a>
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
        rowKey={"account_id"}
        scroll={{ x: true }}
      />
    );
  }
}

export default Account;
