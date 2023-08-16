import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import category from '../modules/category/categoryReducers';
import tournament from '../modules/tournament/tournamentReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    category,
    tournament,
  });
