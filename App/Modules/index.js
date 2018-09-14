import { combineReducers } from 'redux';
import Auth from './Auth';
import Data from './Data';
import Language from './Language';
import ShowApp from './ShowApp';
// import Grid from './Grid';

export const reducer = combineReducers({
  Auth,
  Data,
  ShowApp,
  Language,
});
