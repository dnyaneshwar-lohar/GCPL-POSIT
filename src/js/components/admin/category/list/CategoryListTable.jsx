import React, { Component } from "react";
import { Table, Tag, Popconfirm, Tooltip, Divider } from "antd";
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";  
import destroyActions from "../../../modules/category/destroy/categoryDestroyActions.js";
import actions from "../../../modules/category/list/categoryListAction.js";

class CategoryListTable extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actions.doFetch());
  }
  doDestroy = id => {
    const { dispatch } = this.props;
    dispatch(destroyActions.doDestroy(id));
  };

  columns = [
    {
      title: "Category Name",
      dataIndex: "category_name"
    },
    {
      title: "Category Gender",
      dataIndex: "category_gender"
    },
    {
      title: "Min Age",
      dataIndex: "min_age"
    },
    {
      title: "Max Age",
      dataIndex: "max_age"
    },
    {
      title: "Participation Fee",
      dataIndex: "participation_fees"
    },
    {
      title: "Sponsor",
      dataIndex: "sponsorship_amount"
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: record => {
        const color = record ? "green" : "red";
        const value = record ? "Yes" : "No";
        return <Tag color={color}>{value}</Tag>;
      }
    },
    {
      title: "Action",
      dataIndex: "",
      width: "160px",
      render: (_, record) => (
        <div className="table-actions">
          {this.props.row != 0 && (
            <Link to={`/admin/category/${record.category_name}/edit`}>
              <Tooltip title="Update">
                <EditTwoTone />
              </Tooltip>
            </Link>
          )}
          <Divider type="vertical" />
          {this.props.row != 0 && (
            <Popconfirm
              title="Are you sure"
              onConfirm={() => this.doDestroy(record.category_name)}
              okText="Yes"
              cancelText="NO"
            >
              <Tooltip title="Delete">
                <DeleteTwoTone />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      )
    }
  ];

  render() {
    const { rows, loading } = this.props;
    return (
      <div>
        <Table
          rowKey="category_name"
          loading={loading}
          columns={this.columns}
          dataSource={rows}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    rows: state.category.list.rows,
    loading: state.category.list.loading || state.category.destroy.loading
  };
}

export default withRouter(connect(mapStateToProps)(CategoryListTable));
