import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
	yield takeEvery('FETCH_MOVIES', fetchAllMovies);
	yield takeEvery('GET_DETAILS', movieDetails);
}

function* movieDetails(action) {
	//? Hold the id that was sent over in dispatch for the MovieListItem component on click
	const id = action.payload;
	try {
		//? Request the details from the server by ID
		const details = yield axios.get(`/api/movie/details/${id}`);
		yield console.log('DETAILS OF RETURN', details);
		//? After details come back send them to the reducer to update state
		yield put({ type: 'SET_DETAILS', payload: details.data[0] });
	} catch (err) {
		console.log('get details error', err);
	}
}

function* fetchAllMovies() {
	// get all movies from the DB
	try {
		const movies = yield axios.get('/api/movie');
		console.log('get all:', movies.data);
		yield put({ type: 'SET_MOVIES', payload: movies.data });
	} catch {
		console.log('get all error');
	}
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
	switch (action.type) {
		case 'SET_MOVIES':
			return action.payload;
		default:
			return state;
	}
};

// Used to store the movie genres
const genres = (state = [], action) => {
	switch (action.type) {
		case 'SET_GENRES':
			return action.payload;
		default:
			return state;
	}
};

// Used to store the movie details that were clicked
// Using an object because I am only working with 1 movie at a time
const details = (state = { title: '', description: '', poster: '' }, action) => {
	switch (action.type) {
		case 'SET_DETAILS':
			return {
				title: action.payload.title,
				description: action.payload.description,
				poster: action.payload.poster,
			};
		default:
			return state;
	}
};

// Create one store that all components can use
const storeInstance = createStore(
	combineReducers({
		movies,
		genres,
		details,
	}),
	// Add sagaMiddleware to our store
	applyMiddleware(sagaMiddleware, logger)
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={storeInstance}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
