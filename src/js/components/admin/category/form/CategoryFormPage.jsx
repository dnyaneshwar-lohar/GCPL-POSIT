import React, { Component } from "react";
import CategoryForm from "../../category/form/CategoryForm.jsx";
import PageTitle from "../../../shared/styles/PageTitle.jsx";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getHistory } from "../../../modules/store";
import actions from "../../../modules/category/form/categoryFormAction.js";
import Listactions from "../../../modules/category/list/categoryListAction.js";
class CategoryFormPage extends Component {
  state = {
    dispatched: false,
  };
  componentDidMount() {
    const { dispatch, match } = this.props;

    if (this.isEditing()) {
      dispatch(actions.doFind(match.params.category));
    } else {
      dispatch(actions.doNew());
    }
    dispatch(Listactions.doFetch());
    this.setState({ dispatched: true });
  }

  doSubmit = (data) => {
    const { dispatch } = this.props;
    if (this.isEditing()) {
      dispatch(actions.doUpdate(data));
    } else {
      dispatch(actions.doCreate(data));
    }
    this.props.history.push("/admin/category");
  };

  isEditing = () => {
    const { match } = this.props;
    return !!match.params.category;
  };

  title = () => {
    return this.isEditing() ? "Edit Category" : "New Category";
  };

  render() {
    const { saveLoading, findLoading, rows } = this.props;
    return (
      <React.Fragment>
        <PageTitle>{this.title()}</PageTitle>
        {this.state.dispatched && (
          <CategoryForm
            saveLoading={saveLoading}
            findLoading={findLoading}
            record={this.props.record}
            isEditing={this.isEditing()}
            onSubmit={this.doSubmit}
            onCancel={() => this.props.history.push("/admin/category")}
            categoryName={rows}
          />
        )}
      </React.Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    record: state.category.form.record,
    saveLoading: state.category.form.saveLoading,
    findLoading: state.category.form.findLoading,
    rows: state.category.list.rows,
  };
}

export default withRouter(connect(mapStateToProps)(CategoryFormPage));
