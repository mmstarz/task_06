import axios from "axios";

import {
	GOT_CURRENT_USERS,
	ERR_CURRENT_USERS,
	ADD_USER,
	UPD_USER,
	REM_USER,
	ERR_USER,
	FETCH_CURRENT_USERS,
} from "store/actions/types";

// @route       POST api/users
// @desc        add User
export const addUser = (inputs) => {
	// inputs - {name, surname, description}
	return async (dispatch) => {
		try {
			// headers
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			// body
			const body = JSON.stringify({ ...inputs });

			// send request & get respond
			// const res = await axios.post("/api/users", body, config);
			await axios.post("/api/users", body, config);

			// dispatch redux action
			// dispatch({ type: ADD_USER, payload: res.data });
			
			// no need in payload as data will be received from getUsers
			// based on actual pagination props			

			dispatch({type: ADD_USER })
		} catch (err) {
			// dispacth redux acton
			dispatch({ type: ERR_USER });
		}
	};
};

// @route       PUT api/users/:id
// @desc        update User
export const updUser = (id, inputs) => {
	// inputs - {name, surname, description, avatar}
	return async (dispatch) => {
		try {
			// headers
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			// body
			const body = JSON.stringify({ ...inputs });

			// send request & get respond
			const res = await axios.put(`/api/users/${id}`, body, config);

			// dispatch redux action
			dispatch({ type: UPD_USER, payload: res.data });
		} catch (err) {
			// dispacth redux acton
			dispatch({ type: ERR_USER });
		}
	};
};

// @route       DELETE api/users/:id
// @desc        remove User
export const remUser = (id) => {
	return async (dispatch) => {
		try {
			// send request
			await axios.delete(`/api/users/${id}`);

			// dispatch redux action
			dispatch({ type: REM_USER, payload: id });
		} catch (err) {
			// dispacth redux acton
			dispatch({ type: ERR_USER });
		}
	};
};

// @route       GET api/users
// @desc        get Users list
export const getUsers = (options) => {
	return async (dispatch) => {
		try {
			const {skip, limit} = options;
			const res = await axios.get(`/api/users/${skip}&${limit}`);
			
			dispatch({ type: GOT_CURRENT_USERS, payload: res.data });
		} catch (err) {
			console.log("err: ", err.message);
			// dispatch redux action
			dispatch({ type: ERR_CURRENT_USERS });
		}
	};
};

// saga actions
export const fetchUsers = (options) => ({ type: FETCH_CURRENT_USERS, options });