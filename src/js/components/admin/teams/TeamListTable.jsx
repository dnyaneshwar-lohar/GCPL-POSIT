import React, { Component } from 'react';
import { Table, Tag, Popconfirm, Tooltip, Divider, Result, Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import TeamService from '../../modules/team/TeamServices.js';

class TeamListTable extends Component {
  constructor() {
    super();
    this.state = {
      data: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  doDestroy = async (id) => {
    await TeamService.destroyAll(id);
    this.fetchData();
  };

  fetchData = async () => {
    const result = await TeamService.list();
    this.setState({ data: result });
  };

  columns = [
    {
      title: 'Team Catagory',
      dataIndex: 'category_name',
      align: 'center',
    },
    {
      title: 'Team',
      dataIndex: 'team_name',
      align: 'center',
    },
    {
      title: 'Team Short Name',
      dataIndex: 'team_short_name',
      align: 'center',
    },
    {
      title: 'Sponsor Email',
      dataIndex: 'sponsor_email_id',
      align: 'center',
    },
    {
      title: 'Sponsor Player',
      dataIndex: 'sponsor_player',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: '',
      align: 'center',
      width: '160px',
      render: (_, record) => (
        <div className="table-actions">
          {this.props.row != 0 && (
            <Link to={`/admin/team/${record.team_name}/edit`}>
              <Tooltip title="Update">
                <EditTwoTone />
              </Tooltip>
            </Link>
          )}
          <Divider type="vertical" />
          {this.props.row != 0 && (
            <Popconfirm
              title="Are you sure"
              onConfirm={() => this.doDestroy(record.team_name)}
              okText="Yes"
              cancelText="NO">
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
      <div>
        <Table
          rowKey="team_name"
          pagination={{ defaultPageSize: 10 }}
          columns={this.columns}
          dataSource={this.state.data}
          scroll={{ x: true }}
        />
      </div>
    );
  }
}

export default withRouter(TeamListTable);
