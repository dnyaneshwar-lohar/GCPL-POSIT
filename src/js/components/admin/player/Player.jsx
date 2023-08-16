import React, { Component } from "react";
import axios from "axios";
import { Table, Popconfirm, Tag } from "antd";
import jwt_decode from "jwt-decode";
import moment from "moment";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      email_id: "",
    };
  }

  fetchData = () => {
    axios.get("http://localhost:4000/admin/player").then((res) => {
      this.setState({ players: res.data });
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
        .post("http://localhost:4000/admin/player", null, {
          params: {
            registration_no: key,
            verify_by: email,
          },
        })
        .then((res) => {
          this.fetchData();
        })
        .then((response) => {
          () => console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    const { players } = this.state;
    const columns = [
      {
        title: "Name",
        dataIndex: "player_first_name",
      },
      {
        title: "Category Name",
        dataIndex: "category_name",
      },
      {
        title: "T-Shirt Size",
        dataIndex: "t_shirt_size",
      },
      {
        title: "Registered At",
        dataIndex: "",
        render: (record) =>
          record.verify_date !== null ? (
            moment(record.registration_date).format("DD-MMM-YYYY")
          ) : (
            <Tag color={"red"}>N.A</Tag>
          ),
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
                    ? () => this.handleApprove(record.registration_no)
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
        dataSource={players}
        columns={columns}
        rowKey={"registration_no"}
        scroll={{ x: true }}
      />
    );
  }
}
export default Player;
