import { handleActions, createAction } from 'redux-actions';
// import isEmpty from 'lodash/isEmpty';

export const SET_CURRENT_LANGUAGE = 'Language/SET_CURRENT_LANGUAGE';
export const GET_CURRENT_LANGUAGE = 'Language/GET_CURRENT_LANGUAGE';
export const setCurrentLanguage = createAction(SET_CURRENT_LANGUAGE);
export const getCurrentLanguage = createAction(GET_CURRENT_LANGUAGE);
// export function setCurrentUser(user){
// 	return {
// 		type : SET_CURRENT_USER,
// 		user : user
// 	}
// }

const initialState = {
  language: 'kr',
}


export default handleActions({

	[SET_CURRENT_LANGUAGE]: (state, action) =>{

    return { ...state,
      language: action.payload }
	},

  [GET_CURRENT_LANGUAGE]:(state, action) =>{
		return state;
	},


},initialState)
