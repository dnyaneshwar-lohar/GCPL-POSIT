import actions from '../../../modules/tournament/list/tournamentListAction';

const initialData = {
  rows: [],
  count: 0,
  loading: false,
};

export default (state = initialData, { type, payload }) => {


  if (type === actions.FETCH_STARTED) {
    return {
      ...state,
    };
  }

  if (type === actions.FETCH_SUCCESS) {
    return {
      ...state,
      rows: payload.rows,
      count: payload.count,
    };
  }

  if (type === actions.FETCH_ERROR) {
    return {
      ...state,
      rows: [],
      count: 0,
    };
  }

  return state;
}
