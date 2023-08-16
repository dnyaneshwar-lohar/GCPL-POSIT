import CategoryService from '../../../modules/category/categoryServices';
import action from '../../../modules/category/list/categoryListAction';
import Message from "../../../shared/message";
import Errors from "../../../shared/error/errors";

const prefix =
  'CATEGORY_DESTROY';

const actions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,


  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: actions.DESTROY_STARTED,
      });

      await CategoryService.destroyAll([id]);

      dispatch({
        type: actions.DESTROY_SUCCESS,
      });
      Message.success('Record Deleted Successfully');
      dispatch(action.doFetch())
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.DESTROY_ERROR,
      });
    }
  }
}

export default actions;
