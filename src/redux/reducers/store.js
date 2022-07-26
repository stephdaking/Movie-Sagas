import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
//? Reducers imports
import movies from './movies-reducer';
import genres from './genres-reducer';
import details from './details-reducer';
import search from './search-reducer';
import rootSaga from '../sagas/root-saga';

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create one store that all components can use
const storeInstance = createStore(
	combineReducers({
		movies,
		genres,
		details,
		search,
	}),
	// Add sagaMiddleware to our store
	applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sag aMiddleware
sagaMiddleware.run(rootSaga);

export default storeInstance;
