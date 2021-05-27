import {
  GOT_CURRENT_USERS,
  ERR_CURRENT_USERS,
  ADD_USER,
  UPD_USER,
  REM_USER,
  ERR_USER,
} from "store/actions/types";

const initialState = {
  loading: true,
  error: false,
  count: 0,
  current: [],
};

const usersReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GOT_CURRENT_USERS:
      return {
        ...state,
        loading: false,
        error: false,
        ...payload,
      };
    case ADD_USER:
      return {
        ...state,
        loading: true,
        error: false,        
      };
    case UPD_USER:
      return {
        ...state,
        loading: false,
        error: false,
        current: [...state.current].map((user) =>
          user._id === payload._id ? payload : user
        ),
      };
    case REM_USER:
      return {
        ...state,
        loading: false,
        error: false,
        current: state.current.filter((user) => user._id !== payload),
      };
    case ERR_CURRENT_USERS:
    case ERR_USER:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default usersReducer;
