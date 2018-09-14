import { handleActions, createAction } from 'redux-actions';
// import isEmpty from 'lodash/isEmpty';

export const SET_SHOW_APP = 'ShowApp/SET_SHOW_APP';
export const setShowApp = createAction(SET_SHOW_APP);

const initialState = {
  showApp: false,
}


export default handleActions({

	[SET_SHOW_APP]: (state, action) =>{

    return { ...state,
      showApp : action.payload }
	},

},initialState)
