import { all } from "redux-saga/effects";
// watchers
import { usersWatcher } from "saga/usersSaga";
import { paginationWatcher } from "saga/paginationSaga";

export function* rootWatcher() {
	yield all([usersWatcher, paginationWatcher]);
}
