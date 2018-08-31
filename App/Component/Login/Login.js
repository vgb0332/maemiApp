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
import { withLocalize } from 'react-localize-redux';

class Login extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      id: '',
      password: '',
      idInit: false,
      passInit: false,
      isLoggedIn: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.translate('LoginDropdownEmail'),
      password: nextProps.translate('LoginDropdownPassword'),
    })
  }
  onIdChange = (id) => {this.setState({id:id})}
  onIdFocus = () => {this.state.idInit ? null : this.setState({id: '', idInit: true})}
  onIdBlur = () => {!this.state.id ? this.setState({id:this.props.translate('LoginDropdownEmail'), idInit: false}) : null}

  onPassChange = (password) => {this.setState({password:password})}
  onPassFocus = () => {this.state.passInit ? null : this.setState({password: '', passInit: true})}
  onPassBlur = () => {!this.state.password ? this.setState({password:this.props.translate('LoginDropdownPassword'), passInit: false}) : null}

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
      if(result.success){
        Alert.alert('', this.props.translate('LoginSuccessAlert'));
        this.props.AuthActions.setCurrentUser(result);
        this.props.toggleLogin();
      }
      if(result === 'NO ACCOUNT'){
        Alert.alert(this.props.translate('LoginNoAccountAlert'));
        return false;
      }

      if(result === 'NO PASSMATCH'){
        Alert.alert(this.props.translate('LoginNoPassMatchAlert'));
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
      Alert.alert('', this.props.translate('LogoutAlert'));
      this.props.toggleLogin();
    }

  }

  render(){
    const { state, props } = this;
    const {loginToggle} = props;
    const { isAuthenticated } = props.user;
    const { translate } = props;
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
                <TouchableHighlight onPress={()=>Alert.alert('', '준비중입니다')} >
                  <Text> {translate('FindPassword')} </Text>
                </TouchableHighlight>
              </View>
              <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={props.toggleSignup}>
                  <View style={styles.button}>

                      <Text>{ translate('SignUpHeader')} </Text>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.onSubmit}>
                  <View style={styles.button}>

                      <Text> { translate('LoginDropdownLogin')} </Text>

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

                      <Text> {translate('UserDropdownProfile')} </Text>

                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.logOut}>
                  <View style={styles.UserButton}>

                      <Text> {translate('UserDropdownLogout')} </Text>

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
export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Login));
