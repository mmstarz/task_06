import { createStore, applyMiddleware } from "redux";
// redux thunk
import thunk from "redux-thunk";
// redux saga
import createSagaMiddleware from "redux-saga";
import { rootWatcher } from "saga/rootSaga";
// for redux dev tools extension to work
import { composeWithDevTools } from "redux-devtools-extension";
// root reducer
import rootReducer from "store/reducers/rootReducer";

// initial state
const initialState = {};
// saga middleware
const sagaMiddleware = createSagaMiddleware();
// middlewares
const middlewares = [thunk, sagaMiddleware];

// create store common ver.
// const store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))

// create store this particular ver.
const store = createStore(
	rootReducer,
	initialState,
	composeWithDevTools(applyMiddleware(...middlewares))
);

// assign saga watcher
sagaMiddleware.run(rootWatcher);

export default store;
