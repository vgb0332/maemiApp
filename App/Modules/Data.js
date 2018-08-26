import { handleActions, createAction } from 'redux-actions';

export const SET_CURRENT_DATA = 'Data/SET_CURRENT_DATA';
export const GET_CURRENT_DATA = 'Data/GET_CURRENT_DATA';
export const PUSH_CURRENT_DATA ='Data/PUSH_CURRENT_DATA';

export const setCurrentData = createAction(SET_CURRENT_DATA);
export const getCurrentData = createAction(GET_CURRENT_DATA);
export const pushCurrentData = createAction(PUSH_CURRENT_DATA);


const initialState = {
	data : []
}

export default handleActions({

	[SET_CURRENT_DATA]:(state, action) =>{

		return { ...state, data: action.payload };

	},

	[GET_CURRENT_DATA]:(state, action) =>{
		return state;
	},

},initialState)
