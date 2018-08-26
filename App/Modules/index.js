import { combineReducers } from 'redux';
// import { localeReducer as locale } from 'react-localize-redux';
import Auth from './Auth';
import Data from './Data';
// import Grid from './Grid';

export const reducer = combineReducers({
  Auth,
  Data,
  // Grid,
  // locale,
});
