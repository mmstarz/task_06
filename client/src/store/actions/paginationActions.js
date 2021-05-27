import { SET_USERS_OPTIONS } from "store/actions/types";

export const setPagination = (options) => {
	return (dispatch) => {
		dispatch({
			type: SET_USERS_OPTIONS,
			payload: options,
		});
	};
};
