import React, { Component } from "react";
import CategoryView from "../view/CategoryView.jsx";
import CategoryViewToolbar from "../view/CategoryViewToolbar.jsx";
import PageTitle from "../../../shared/styles/PageTitle.jsx";
import { connect } from "react-redux";
import actions from "../../../modules/category/view/categoryViewAction.js";

class CategoryViewPage extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch(actions.doFind(match.params.category));
  }
  render() {
    return (
      <React.Fragment>
        <PageTitle>View Category</PageTitle>
        <CategoryView loading={this.props.loading} record={this.props.record} />
        <CategoryViewToolbar match={this.props.match}/>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.category.view.loading,
    record: state.category.view.record
  };
}
export default connect(mapStateToProps)(CategoryViewPage);
