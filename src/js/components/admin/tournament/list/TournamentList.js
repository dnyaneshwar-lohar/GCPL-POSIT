import React, { Component } from "react";
import { Card, Row, Col, Button, List, Avatar, Skeleton, Tooltip } from "antd";
import { connect } from "react-redux";
import actions from "../../../modules/tournament/list/tournamentListAction.js";
import destroyActions from "../../../modules/tournament/destroy/tournamentDestroyActions.js";
import TournamentFormModal from "../../tournament/form/TournamentFormModal";
import formActions from "../../../modules/tournament/form/tournamentFormAction.js";

import {
  DribbbleOutlined,
  DeleteTwoTone,
  EditTwoTone
} from "@ant-design/icons";

class TournamentList extends Component {
  constructor(){
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(actions.doFetch());
  }

  doDestroy = id => {
    const { dispatch } = this.props;
    dispatch(destroyActions.doDestroy(id));
  };
  showModal = async id => {
    const { dispatch } = this.props;

    await dispatch(formActions.doFind(id));
    this.setState({ visible: true });
  };
  closeModal = async () => {
    this.setState({ visible: false });
  };

  render() {
    const { rows, loading } = this.props;
    return (
      <React.Fragment>
        <List
          className="demo-loadmore-list"
          size="small"
          itemLayout="horizontal"
          dataSource={rows}
          renderItem={item => (
            <List.Item
              actions={[
                <a key="list-edit">
                  <Tooltip title="Edit">
                    <EditTwoTone
                      onClick={() => this.showModal(item.tournament_id)}
                    />
                  </Tooltip>
                </a>,
                <a
                  key="list-delete"
                  onClick={() => this.doDestroy(item.tournament_id)}
                >
                  <Tooltip title="Delete">
                    <DeleteTwoTone />
                  </Tooltip>
                </a>
              ]}
            >
              <Skeleton avatar title={false} loading={loading} active>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={
                        <DribbbleOutlined
                          style={{ fontSize: "20px", color: "#08c" }}
                        />
                      }
                    />
                  }
                  title={item.tournament_name}
                  description={item.tournament_desc}
                />
              </Skeleton>
            </List.Item>
          )}
        />
        <TournamentFormModal
          visible={this.state.visible}
          onCancel={this.closeModal}
          record={this.props.record}
          saveLoading={this.props.saveLoading}
          findLoading={this.props.findLoading}
        />
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    rows: state.tournament.list.rows,
    loading: state.tournament.list.loading,
    record: state.tournament.form.record,
    saveLoading: state.category.form.saveLoading,
    findLoading: state.category.form.findLoading
  };
}
export default connect(mapStateToProps)(TournamentList);
