import React, { Component } from "react";
import { Tabs } from 'antd';
import TimeTable from "../timetable/TimeTable.jsx";
import PointTable from "../pointtable/PointTable.jsx";
const TabPane = Tabs.TabPane;

class Figures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
    };
  }


  render() {    
    return (
      <div className="card-container">
        <Tabs type="card">
          <TabPane tab="Point Table" key="1">
            <PointTable/>          
          </TabPane>
          <TabPane tab="Time Table" key="2">
            <TimeTable />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Figures;
