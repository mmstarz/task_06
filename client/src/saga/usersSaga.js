// axios
import axios from "axios";
// saga effects
import { put, takeEvery, call } from "redux-saga/effects";
// types
import {
	GOT_CURRENT_USERS,
	ERR_CURRENT_USERS,
	FETCH_CURRENT_USERS,
} from "store/actions/types";

// workers
function* getUsersWorker({options}) {	
	try {
		// Cant get params!Options not passed.
		// {undefined}
		const {skip, limit} = options;
		const data = yield call(axios.get(`/api/users/${skip}&${limit}`));
		
		yield put({ type: GOT_CURRENT_USERS, payload: data });
	} catch (err) {
		yield put({ type: ERR_CURRENT_USERS });
	}
}

function* addUserWorker() {
	// async api call
	// send redux action wth result
}

function* updUserWorker() {
	// async api call
	// send redux action wth result
}

function* remUserWorker() {
	// async api call
	// send redux action wth result
}

// watcher
export function* usersWatcher() {
	yield takeEvery(FETCH_CURRENT_USERS, getUsersWorker);
}
