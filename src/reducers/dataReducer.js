import {FETCH_TODOS, FETCH_STARTS} from '../actions/types';

export default (state = {}, action) => {
  switch(action.type) {
    case FETCH_TODOS:
      return action.payload;
    case FETCH_STARTS:
      return action.payload;
    default:
      return state;
  }
};