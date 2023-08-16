import React, { Component } from "react";
import axios from "axios";
import { Table } from "antd";
import point from './point.js'
class PointTable extends Component {
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
        title: "Team",
        dataIndex: "team_name",
        key: "team_name",        
      },
      {
        title: "Match",
        dataIndex: "match",
        key: "match"
      },
      {
        title: "Win",
        dataIndex: "win",
        key: "win"
      },
      {
        title: "Lost",
        dataIndex: "lose",
        key: "lose"
      },
      {
        title: "Points",
        dataIndex: "points",
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

export default PointTable;
