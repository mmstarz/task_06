import { SET_USERS_OPTIONS } from "store/actions/types";

const initialState = {
  users: {
    page: 0,
    skip: 0,
    limit: 5,
  },
};

const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_USERS_OPTIONS:
      return {
        ...state,
        users: {
          ...payload,
        },
      };
    default:
      return state;
  }
};

export default alertReducer;
