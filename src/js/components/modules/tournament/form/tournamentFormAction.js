import TournamentService from '../../../modules/tournament/TournamentServices';
import Message from "../../../shared/message";
import Errors from "../../../shared/error/errors";
import action from '../../../modules/tournament/list/tournamentListAction';


const prefix = 'TOURNAMENT_FORM';

const actions = {
  RESET: `${prefix}_RESET`,

  CREATE_STARTED: `${prefix}_CREATE_STARTED`,
  CREATE_SUCCESS: `${prefix}_CREATE_SUCCESS`,
  CREATE_ERROR: `${prefix}_CREATE_ERROR`,

  FIND_STARTED: `${prefix}_FIND_STARTED`,
  FIND_SUCCESS: `${prefix}_FIND_SUCCESS`,
  FIND_ERROR: `${prefix}_FIND_ERROR`,

  UPDATE_STARTED: `${prefix}_UPDATE_STARTED`,
  UPDATE_SUCCESS: `${prefix}_UPDATE_SUCCESS`,
  UPDATE_ERROR: `${prefix}_UPDATE_ERROR`,

  CLEAR_RECORD: `${prefix}_CLEAR_RECORD`,

  doNew: () => {
    return {
      type: actions.RESET,
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: actions.FIND_STARTED,
      });
      const record = await TournamentService.find(id);
      dispatch({
        type: actions.FIND_SUCCESS,
        payload: record,
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.FIND_ERROR,
      });
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: actions.CREATE_STARTED,
      });

      await TournamentService.create(values);

      dispatch({
        type: actions.CREATE_SUCCESS,
      });
      dispatch(action.doFetch())
      Message.success('Tournament Added Successfully');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.CREATE_ERROR,
      });
    }
  },

  doUpdate: (values) => async (
    dispatch,
    getState,
  ) => {
    try {
      dispatch({
        type: actions.UPDATE_STARTED,
      });

      await TournamentService.update(values);

      dispatch({
        type: actions.UPDATE_SUCCESS,
      });
      dispatch(action.doFetch())
      Message.success('Tournament Updated Successfully');
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: actions.UPDATE_ERROR,
      });
    }
  },
};

export default actions;
