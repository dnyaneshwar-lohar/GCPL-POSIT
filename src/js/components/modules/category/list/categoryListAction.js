import CategoryService from '../../../modules/category/categoryServices';
import Errors from "../../../shared/error/errors";
const prefix = 'CATEGORY_LIST';

const actions = {
  FETCH_STARTED: `${prefix}_FETCH_STARTED`,
  FETCH_SUCCESS: `${prefix}_FETCH_SUCCESS`,
  FETCH_ERROR: `${prefix}_FETCH_ERROR`,

  doFetch: () => async (
    dispatch,
    getState,
  ) => {
    try {
      dispatch({
        type: actions.FETCH_STARTED,
      });

      const response = await CategoryService.list(
      );
      dispatch({
        type: actions.FETCH_SUCCESS,
        payload: {
          rows: response,
          count: response.length,
        },
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.FETCH_ERROR,
      });
    }
  },

};

export default actions;
