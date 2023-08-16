import React, { Component } from "react";
import { Table } from "antd";
class TimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timetable_data: [],
    };
  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    fetch("http://localhost:4000/getTimetable")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          timetable_data: findresponse.data,
        });
      })
  };
  render() {
    const columns = [
      {
        title: "Tournament Name",
        dataIndex: "tournament_name",
        key: "tournament_name",
      },
      {
        title: "Team One",
        dataIndex: "first_team",
        key: "first_team",
      },
      {
        title: "Team Two",
        dataIndex: "second_team",
        key: "second_team",
      },
      {
        title: "Date",
        dataIndex: "match_date",
        key: "match_date",
      },
      {
        title: "Match Time",
        dataIndex: "match_time",
        key: "match_time",
      },
      {
        title: "Match Venue",
        dataIndex: "match_venue",
        key: "match_venue",
      },
    ];

    return (
      <div>
        <Table
          dataSource={this.state.timetable_data}
          columns={columns}
          rowKey="match_detail"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          style={{ marginTop: "2%" }}
        />
      </div>
    );
  }
}

export default TimeTable;
