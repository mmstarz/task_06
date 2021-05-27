// internal saga dispatchers
import { put, takeEvery } from "redux-saga/effects";
// action types
import { SET_PAGINATION_ASYNC } from "store/actions/types";
import { setPagination } from "store/actions/paginationActions";

// delay
const delay = (ms) => new Promise(res => setTimeout(res, ms))

// workers
function* paginationWorker() {
	// how to get arguments from action?!
	yield delay(500);
	yield put(setPagination())
}

// watcher
export function* paginationWatcher() {
	yield takeEvery(SET_PAGINATION_ASYNC, paginationWorker)
}