import React, { Component } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Toolbar from "../../../shared/styles/Toolbar.jsx";
import CategoryFormPage from "../form/CategoryFormPage.jsx";

class CategoryListToolbar extends Component {

  render() {
    return (
      <Toolbar>
        <Link to={`/admin/category/new`}>
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

export default CategoryListToolbar;
