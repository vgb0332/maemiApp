import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  TextInput,
  Button,
  Modal,
  Alert,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNullOrWhiteSpace from '../../Util/isNullOrWhiteSpace';
import {login, logout} from '../../Lib/AuthManager/Auth';
import * as authActions from '../../Modules/Auth';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import styles from './Styles';

class Login extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      id: '이메일',
      password: '비밀번호',
      idInit: false,
      passInit: false,
      isLoggedIn: false,
    }
  }

  onIdChange = (id) => {this.setState({id:id})}
  onIdFocus = () => {this.state.idInit ? null : this.setState({id: '', idInit: true})}
  onIdBlur = () => {!this.state.id ? this.setState({id:'이메일', idInit: false}) : null}

  onPassChange = (password) => {this.setState({password:password})}
  onPassFocus = () => {this.state.passInit ? null : this.setState({password: '', passInit: true})}
  onPassBlur = () => {!this.state.password ? this.setState({password:'비밀번호', passInit: false}) : null}

  onSubmit = () => {
    console.log('submit button clicked');
    const { id, password } = this.state;

    // if(isNullOrWhiteSpace( id )){
    //   Alert.alert('No id');
    //   return false;
    // }
    //
    // if(isNullOrWhiteSpace( password )){
    //   Alert.alert(translate('LoginNoPassAlert'));
    //   return false;
    // }

    this.props.login( { EMAIL : id, PASSWORD: password} ).then((result)=>{
      console.log('login callback');
      console.log(result);
      if(result.success){
        Alert.alert('로그인 되었습니다');
        this.props.AuthActions.setCurrentUser(result);
        this.props.toggleLogin();
      }
      if(result === 'NO ACCOUNT'){
        Alert.alert(translate('LoginNoAccountAlert'));
        return false;
      }

      if(result === 'NO PASSMATCH'){
        Alert.alert(translate('LoginNoPassMatchAlert'));
        return false;
      }

    });
  }

  link2Profile = () => {
    console.log('will be linked to profile page');
    this.props.link2MyPage();
    this.props.toggleLogin();
  }

  logOut = () => {
    if(this.props.logout()){
      this.props.AuthActions.setCurrentUser(null);
      Alert.alert('로그아웃 되었습니다');
      this.props.toggleLogin();
    }

  }

  render(){
    const { state, props } = this;
    const {loginToggle} = props;
    const { isAuthenticated } = props.user;

    if(loginToggle && !isAuthenticated){
      return (
        <TouchableOpacity activeOpacity={1} style={ { position: 'absolute', width: D.Width(100), height: D.Height(100), backgroundColor: 'transparent' , zIndex:5,} }
        onPress={props.toggleLogin}>
          <View style={ styles.LoginContainer }>
            <TextInput
              style={styles.loginInput}
              onChangeText={(id) => this.onIdChange(id)}
              onFocus={this.onIdFocus}
              onBlur={this.onIdBlur}
              value={state.id}
              underlineColorAndroid= 'transparent'
            />

            <TextInput
              secureTextEntry={ state.passInit }
              style={styles.loginInput}
              onChangeText={(password) => this.onPassChange(password)}
              onFocus={this.onPassFocus}
              onBlur={this.onPassBlur}
              value={state.password}
              underlineColorAndroid= 'transparent'
            />

            <View style={styles.buttonContainer}>
              <View style={styles.text}>
                <TouchableHighlight >
                  <Text> 비밀번호 찾기 </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={props.toggleSignup}>
                  <View style={styles.button}>

                      <Text> 회원가입 </Text>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onSubmit}>
                  <View style={styles.button}>

                      <Text> 로그인 </Text>

                  </View>
                </TouchableOpacity>
              </View>
            </View>

        </View>
      </TouchableOpacity >
      )
    } else if(loginToggle && isAuthenticated){
      return (
        <TouchableOpacity activeOpacity={1} style={ { position: 'absolute', width: D.Width(100), height: D.Height(100), backgroundColor: 'transparent' , zIndex:5,} }
        onPress={props.toggleLogin}>
          <View style={ styles.UserContainer }>
            <View style={styles.UserButtonContainer}>
              <View style={styles.UserButtonWrapper}>
                <TouchableOpacity onPress={this.link2Profile}>
                  <View style={styles.UserButton}>

                      <Text> 프로필 </Text>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.logOut}>
                  <View style={styles.UserButton}>

                      <Text> 로그아웃 </Text>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </TouchableOpacity >
      );
    }
    else {
      return null;
    }
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}


let mapDispatchToProps = (dispatch) => {
    return {
        AuthActions: bindActionCreators(authActions, dispatch),
        login, logout
    }
}

// Login = connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(Login);
