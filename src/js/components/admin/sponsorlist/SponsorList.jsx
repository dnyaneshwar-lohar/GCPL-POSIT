import React, { Component } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import SponsorListTable from "./SponsorListTable.jsx";

class SponsorList extends Component {

  render() {
    return (
      <React.Fragment>
        <Link to={`/admin/sponsor/new`}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 15 }}
          onClick={this.handleClickAdd}
        >
          {'New'}
        </Button>
        </Link>
        <SponsorListTable/>
      </React.Fragment>
    );
  }
}

export default SponsorList;
