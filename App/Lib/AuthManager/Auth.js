// import axios from 'axios';
// import jwt from 'jsonwebtoken';
import { setCurrentUser } from '../../Modules/Auth';
import setAuthorizationToken from '../../Util/setAuthorizationToken';
// import { sessionService } from 'redux-react-session';
import apiConfig from '../Api/config';
import * as HttpApi from '../Api/index';
import { AsyncStorage } from 'react-native';
const jwt = require('react-native-jwt');

export function signup(data){
  	return HttpApi.post('POST_AUTH_REGIST',data).then(async (res) => {

		console.log("[In Auth API]");
		console.log(res);
		if(res.data.success){
      //로그인 성공
			let result = res;
      const user_info = jwt.decode(res.data.token,apiConfig.cert);
      console.log(user_info); //=> { foo: 'bar' }
      AsyncStorage.setItem("token",res.data.token);
      setAuthorizationToken(res.data.token);
			return Object.assign(user_info, { success : true });

		}else{
			//아이디 및 비밀번호 오류

			return 'authAccountError';
		}

	}).catch((err)=>{
		console.log("[로그인 POST 요청 부분에서 에러]")
		console.log(err)
		return 'axiosError';
	})
}

// export function login(data){
//   console.log(data);
//   return dispatch =>{
//   	return HttpApi.post('POST_AUTH_LOGIN',data).then(async (res) => {
//     console.log(data);
// 		console.log("[In Auth API]");
// 		console.log(res);
// 		if(res.data.success){
// 			//로그인 성공
//       let result = res;
//       console.log(data.EMAIL);
//       AsyncStorage.setItem("token",res.data.token);
//       AsyncStorage.setItem("user", data.EMAIL);
//       setAuthorizationToken(res.data.token);
// 			return res;
//
// 		}else{
// 			//아이디 및 비밀번호 오류
//       if(res.data.message === 'There is no account\nPlz check you email')
//         return 'NO ACCOUNT';
//
//       if(res.data.message === 'Email and password not matched')
//         return 'NO PASSMATCH';
//
// 			return res.data.message;
// 		}
//
// 	}).catch((err)=>{
// 		console.log("[로그인 POST 요청 부분에서 에러]")
// 		console.log(err)
// 		return 'axiosError';
// 	})
//   }
// }

export function login(data){
  console.log(data);
  	return HttpApi.post('POST_AUTH_LOGIN',data).then(async (res) => {
    console.log(data);
		console.log("[In Auth API]");
		console.log(res);
		if(res.data.success){
			//로그인 성공
      let result = res;

      const user_info = jwt.decode(res.data.token,apiConfig.cert);
      console.log(user_info); //=> { foo: 'bar' }
      AsyncStorage.setItem("token",res.data.token);
      setAuthorizationToken(res.data.token);
			return Object.assign(user_info, { success : true });

		}else{
			//아이디 및 비밀번호 오류
      if(res.data.message === 'There is no account\nPlz check you email')
        return 'NO ACCOUNT';

      if(res.data.message === 'Email and password not matched')
        return 'NO PASSMATCH';

			return res.data.message;
		}

	}).catch((err)=>{
		console.log("[로그인 POST 요청 부분에서 에러]")
		console.log(err)
		return 'axiosError';
	})
}

export function logout(){
		console.log("[로그아웃 api]")
		setAuthorizationToken(false);
		AsyncStorage.removeItem('token');
		return "success";
}
//
// export function logout(){
// 	return dispatch =>{
// 		console.log("[로그아웃 api]")
// 		setAuthorizationToken(false);
// 		AsyncStorage.removeItem('token');
//     AsyncStorage.removeItem("user");
// 		// dispatch(setCurrentUser({}));
//     // sessionService.deleteSession();
//     // sessionService.deleteUser();
// 		return "success";
// 	}
// }

export function sessionCheck(){

	return dispatch =>{

		setAuthorizationToken(false);
		AsyncStorage.removeItem('token');
		dispatch(setCurrentUser({}));
		return "success"
	}
}
