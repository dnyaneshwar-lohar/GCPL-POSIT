import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../modules/reducers';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const history = createBrowserHistory();
let store;

export function configureStore(preloadedState) {
  const middlewares = [
    thunkMiddleware,
    routerMiddleware(history),
  ].filter(Boolean);

  store = createStore(
   createRootReducer(history),
   preloadedState,
   composeWithDevTools(applyMiddleware(...middlewares)),
 );
  return store;
}

export default function getStore() {
  return store;
}
export function getHistory() {
  return history;
}
