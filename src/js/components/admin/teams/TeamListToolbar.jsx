import React, { Component } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Toolbar from "../../shared/styles/Toolbar.jsx";

class TeamListToolbar extends Component {

  render() {
    return (
      <Toolbar>
        <Link to={`/admin/team/new`}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 15 }}
          onClick={this.handleClickAdd}
        >
          {'New'}
        </Button>
        </Link>
      </Toolbar>
    );
  }
}

export default TeamListToolbar;