import React, { Component } from 'react';
import CategoryListTable from './CategoryListTable.jsx'
import CategoryListToolbar from './CategoryListToolbar.jsx';


class CategoryListPage extends Component {
  render() {
    return (
      <React.Fragment>
          <CategoryListToolbar />
          <CategoryListTable />
      </React.Fragment>
    );
  }
}
export default CategoryListPage;
