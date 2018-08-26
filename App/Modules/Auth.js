import { handleActions, createAction } from 'redux-actions';
// import isEmpty from 'lodash/isEmpty';

export const SET_CURRENT_USER = 'Auth/SET_CURRENT_USER';
export const GET_CURRENT_USER = 'Auth/GET_CURRENT_USER';
export const setCurrentUser = createAction(SET_CURRENT_USER);
export const getCurrentUser = createAction(GET_CURRENT_USER);
// export function setCurrentUser(user){
// 	return {
// 		type : SET_CURRENT_USER,
// 		user : user
// 	}
// }

const initialState = {
  isAuthenticated : false,
  user : {},
}


export default handleActions({

	[SET_CURRENT_USER]: (state, action) =>{

    return { ...state,
      isAuthenticated : action.payload ? true : false,
      user : action.payload }
	},

  [GET_CURRENT_USER]:(state, action) =>{
		return state;
	},


},initialState)
