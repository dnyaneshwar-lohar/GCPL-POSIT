import React, { Component } from 'react';
import ViewWrapper from '../../../shared/styles/ViewWrapper.jsx';
import TextViewItem from '../../../shared/view/TextViewItem.jsx';
import Spinner from "../../../shared/Spinner";


class CategoryView extends Component {
  renderView() {
    const { record } = this.props;

    return (
      <ViewWrapper>
        <TextViewItem
          label={"Category Name"}
          value={record.category_name}
        />
        <TextViewItem
          label={"Category Gender"}
          value={record.category_gender}
        />
        <TextViewItem
          label={"Minimum Age"}
          value={record.min_age}
        />
        <TextViewItem
          label={"Maximum Age"}
          value={record.max_age}
        />
        <TextViewItem
          label={"Participation Fee"}
          value={record.participation_fees}
        />
        <TextViewItem
          label={"Sponsorship Amount"}
          value={record.sponsorship_amount}
        />
        <TextViewItem
          label={"Updated At"}
          value={record.update_date}
        />
      </ViewWrapper>
    );
  }

  render() {
    const { record, loading } = this.props;

    if (loading || !record) {
      return <Spinner />;
    }

    return this.renderView();
  }
}

export default CategoryView;
