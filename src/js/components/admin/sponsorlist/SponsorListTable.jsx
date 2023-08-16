import React, { Component } from "react";
import { Table, Tag, Popconfirm, Tooltip, Divider, Pagination } from "antd";
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../../shared/Spinner";
import moment from "moment";
import SponsorService from "../../modules/sponsor/SponsorServices";

class SponsorListTable extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  doDestroy = async (id) => {
    await SponsorService.destroyAll(id);
    this.fetchData();
  };

  fetchData = async () => {
    const result = await SponsorService.list();
    this.setState({ data: result });
  };

  columns = [
    {
      title: "Name",
      dataIndex: "sponsor_name",
    },
    {
      title: "Short Name",
      dataIndex: "sponsor_short_name",
    },
    {
      title: "Description",
      dataIndex: "sponsor_description",
      render: (record) => {
        return record != "" ? record : <Tag color={"red"}>N.A</Tag>;
      },
    },
    {
      title: "Contact No",
      dataIndex: "contact_no",
    },
    {
      title: "Email ID",
      dataIndex: "email_id",
    },
    {
      title: "Website",
      dataIndex: "website",
    },
    {
      title: "Year",
      dataIndex: "gcpl_accociation_from",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (record) => {
        const color = record === "Yes" ? "green" : "red";
        const value = record === "Yes" ? "Yes" : "No";
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: "Residence Year",
      dataIndex: "agc_residence_year_from",
    },
    {
      title: "Updated Date",
      dataIndex: "",
      render: (record) =>
        record.verify_date !== null
          ? moment(record.update_date).format("DD-MMM-YYYY")
          : null,
    },
    {
      title: "Amount",
      dataIndex: "sponsorship_amount",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      render: (record) => {
        const color = record ? "green" : "red";
        const value = record ? "Yes" : "No";
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      width: "160px",
      render: (_, record) => (
        <div className="table-actions">
          {this.props.row != 0 && (
            <Link to={`/admin/sponsor/${record.email_id}/edit`}>
              <Tooltip title="Update">
                <EditTwoTone />
              </Tooltip>
            </Link>
          )}
          <Divider type="vertical" />
          {this.props.row != 0 && (
            <Popconfirm
              title="Are you sure"
              onConfirm={() => this.doDestroy(record.email_id)}
              okText="Yes"
              cancelText="NO"
            >
              <Tooltip title="Delete">
                <DeleteTwoTone />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  render() {
    return (
      <React.Fragment>
        <Table
          rowKey="email_id"
          columns={this.columns}
          pagination={{ defaultPageSize: 10 }}
          dataSource={this.state.data}
          scroll={{ x: true }}
        />
      </React.Fragment>
    );
  }
}

export default SponsorListTable;
