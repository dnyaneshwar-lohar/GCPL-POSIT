import TournamentService from '../../../modules/tournament/TournamentServices';
import action from '../../../modules/tournament/list/tournamentListAction';
import Message from "../../../shared/message";
import Errors from "../../../shared/error/errors";

const prefix =
  'TOURNAMENT_DESTROY';

const actions = {
  DESTROY_STARTED: `${prefix}_DESTROY_STARTED`,
  DESTROY_SUCCESS: `${prefix}_DESTROY_SUCCESS`,
  DESTROY_ERROR: `${prefix}_DESTROY_ERROR`,


  doDestroy: (id) => async (dispatch) => {
    try {
      dispatch({
        type: actions.DESTROY_STARTED,
      });

      await TournamentService.destroyAll([id]);

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
