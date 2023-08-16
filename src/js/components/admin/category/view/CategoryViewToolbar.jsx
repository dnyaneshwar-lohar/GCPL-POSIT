import { Button, Popconfirm, Form } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Toolbar from "../../../shared/styles/Toolbar.jsx";
import destroyActions from "../../../modules/category/destroy/categoryDestroyActions.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import FormWrapper, {
  tailFormItemLayout,
  formItemLayout
} from "../../../shared/styles/FormWrapper";

class CategoryViewToolbar extends Component {
  category = () => {
    return this.props.match.params.category;
  };
  doDestroy = () => {
    const { dispatch } = this.props;
    dispatch(destroyActions.doDestroy(this.category()));
    this.props.history.push("/admin/category");
  };
  state = {
    size: "default"
  };
  render() {
    const { size } = this.state;
    return (
      <Toolbar>
        <Form.Item {...tailFormItemLayout}>
          <Link to={`/admin/category/${this.category()}/edit`}>
            <Button type="primary" icon={<EditOutlined />} size={size}>
              Update
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure"
            onConfirm={() => this.doDestroy()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              disabled={this.props.loading}
              size={size}
            >
              Delete
            </Button>
          </Popconfirm>
        </Form.Item>
      </Toolbar>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.category.destroy.loading
  };
}
export default withRouter(connect(mapStateToProps)(CategoryViewToolbar));
