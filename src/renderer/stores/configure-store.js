import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';
import reducers from '../reducers';

export default function configureStore(initialState) {
  let rootReducers = combineReducers({
    ...reducers,
    routing: routerReducer
  });

  console.log('rootReducers', rootReducers);

  return createStore(rootReducers, initialState, applyMiddleware(thunk));
}
