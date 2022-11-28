import { LOADING_INITIATED } from "../actions/type";

const INITIAL_STATE = {
  isLoading: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_INITIATED:
      return { ...state, isLoading: action.payload };
    default:
      return { ...state };
  }
};

export default reducer;
