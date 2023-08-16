import list from '../../modules/tournament/list/tournamentListReducers';
import form from '../../modules/tournament/form/tournamentFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
