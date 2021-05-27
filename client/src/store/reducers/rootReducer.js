import { combineReducers } from "redux";
// reducers
import usersReducer from "store/reducers/usersReducer";
import paginationReducer from "store/reducers/paginationReducer";


const rootReducer = combineReducers({
	users: usersReducer,
	pagination: paginationReducer,
});

export default rootReducer;