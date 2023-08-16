import React, { Component } from "react";
import axios from "axios";
import { Table } from "antd";
class categoryDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: []
    };
  }

  componentDidMount() {
    axios.get("http://localhost:4000/admin/player").then(res => {
      this.setState({ person: res.data });
    });
    
  }

  render() {
    const columns = [
      {
        title: "Category Name",
        dataIndex: "category_name",
        key: "category_name",        
      },
      {
        title: "Category Gender",
        dataIndex: "category_gender",
        key: "category_gender"
      },
      {
        title: "Min Age",
        dataIndex: "min_age",
        key: "min_age"
      },
      {
        title: "Max Age",
        dataIndex: "max_age",
        key: "max_age"
      },
      {
        title: "Participation Fees",
        dataIndex: "paerticipation_fees",
        key: "points"
      },      
    ];
    
    return (
      <Table
        dataSource={point}
        columns={columns}
        rowKey="team_name"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />
    );
  }
}

export default categoryDetails;
