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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNullOrWhiteSpace from '../../Util/isNullOrWhiteSpace';
import { login } from '../../Lib/AuthManager/Auth';
import * as authActions from '../../Modules/Auth';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import styles from './Styles';
import { signup } from '../../Lib/AuthManager/Auth';

class Signup extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      name: '이름',
      id: '이메일',
      password: '비밀번호',
      passcheck: '비밀번호 확인',
      nickname: '닉네임',

      nameInit: false,
      idInit: false,
      passwordInit: false,
      passcheckInit: false,
      nicknameInit: false,

    }

    this.labels = {
      name: '이름',
      id: '이메일',
      password: '비밀번호',
      passcheck: '비밀번호 확인',
      nickname: '닉네임',
    }
  }

  onInputChange = (type, value) => {
    this.setState({
      [type] : value,
    })
  }

  onInputFocus = (type) => {
    if(!this.state[type+'Init']){
      this.setState({
        [type+'Init'] : true,
        [type]: '',
      })
    }
  }

  onInputBlur = (type) => {
    const typeInit = type+'Init';
    if(!this.state[type]){
      this.setState({
        [type+'Init'] : false,
        [type] : this.labels[type],
      })
    }
  }

  onSubmit = async () => {
    console.log('on submit');
    const {
      name, id, password, passcheck, nickname
    } = this.state;

    let isValid = true;

    //check for emptiness
    for (const key of Object.keys(this.labels)) {
      if(!this.state[key+'Init']){
        Alert.alert(this.labels[key] + '를 입력해주세요^^');
        isValid = false;
        return false;
      }
    }

    //check if the passwrods match
    if(password !== passcheck){
      Alert.alert('비밀번호가 일치하지 않습니다!');
      isValie = true;
      return false;
    }

    if(!isValid) return false;
    console.log(this.state);

    const data = {
      EMAIL : id,
      PASSWORD: password,
      PASSWORD_CHECK: passcheck,
      USER_NAME: name,
      USER_NICK: nickname,
    };

    this.props.signup(data).then( result => {
      console.log("[SIGNUP CALLBACK]")
      console.log(result);
      if(result.success){
        Alert.alert('가입이 완료되었습니다!');
        this.props.AuthActions.setCurrentUser(result);
        this.props.toggleSignup();
        this.props.toggleLogin();
      }
      else{
        Alert.alert('뭔가 문제가  생김. 나중에 다시해주길');
      }
    })


  }

  render(){
    const { state, props } = this;
    // console.log(state, props);

    return (
          <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={props.signupToggle}
          onRequestClose={props.toggleSignup}>
          <KeyboardAwareScrollView>
            <View style={styles.SignupContainer}>
              <View style={styles.SignupWrapper}>
                <View style={styles.SignupHeader}>
                  <Text style={styles.SignupHeaderText}>회원가입</Text>
                  <TouchableHighlight onPress={props.toggleSignup}>
                    <Icon style={{alignSelf:'flex-end'}} name="x" size={30} color="#ffffff" />
                  </TouchableHighlight>
                </View>

                <View style={styles.SignupBody}>
                  <View style={styles.SignupBodyInputWrapper}>
                    <Text style={styles.SignupLabel}> 이름 </Text>
                    <TextInput
                      style={[styles.SignupInput, state.nameInit ? styles.SignUpInputActive : null]}
                      onChangeText={(name) => this.onInputChange('name', name)}
                      onFocus={()=>this.onInputFocus('name')}
                      onBlur={()=>this.onInputBlur('name')}
                      value={state.name}
                      underlineColorAndroid= 'transparent'
                    />
                  </View>

                  <View style={styles.SignupBodyInputWrapper}>
                      <Text style={styles.SignupLabel}> 이메일 </Text>
                      <TextInput
                        style={[styles.SignupInput, state.idInit ? styles.SignUpInputActive : null]}
                        onChangeText={(id) => this.onInputChange('id', id)}
                        onFocus={()=>this.onInputFocus('id')}
                        onBlur={()=>this.onInputBlur('id')}
                        value={state.id}
                        underlineColorAndroid= 'transparent'
                      />
                  </View>

                  <View style={styles.SignupBodyInputWrapper}>
                      <Text style={styles.SignupLabel}> 비밀번호 </Text>
                      <TextInput
                        secureTextEntry={ state.passwordInit }
                        style={[styles.SignupInput, state.passwordInit ? styles.SignUpInputActive : null]}
                        onChangeText={(password) => this.onInputChange('password', password)}
                        onFocus={()=>this.onInputFocus('password')}
                        onBlur={()=>this.onInputBlur('password')}
                        value={state.password}
                        underlineColorAndroid= 'transparent'
                      />
                  </View>

                  <View style={styles.SignupBodyInputWrapper}>
                      <Text style={styles.SignupLabel}> 비밀번호 확인 </Text>
                      <TextInput
                        secureTextEntry={ state.passcheckInit }
                        style={[styles.SignupInput, state.passcheckInit ? styles.SignUpInputActive : null]}
                        onChangeText={(passcheck) => this.onInputChange('passcheck', passcheck)}
                        onFocus={()=>this.onInputFocus('passcheck')}
                        onBlur={()=>this.onInputBlur('passcheck')}
                        value={state.passcheck}
                        underlineColorAndroid= 'transparent'
                      />
                  </View>

                  <View style={styles.SignupBodyInputWrapper}>
                      <Text style={styles.SignupLabel}> 닉네임 </Text>
                      <TextInput
                        style={[styles.SignupInput, state.nicknameInit ? styles.SignUpInputActive : null]}
                        onChangeText={(nickname) => this.onInputChange('nickname', nickname)}
                        onFocus={()=>this.onInputFocus('nickname')}
                        onBlur={()=>this.onInputBlur('nickname')}
                        value={state.nickname}
                        underlineColorAndroid= 'transparent'
                      />
                  </View>
                </View>

                <View style={styles.SignupFooter}>
                  <TouchableOpacity onPress={this.onSubmit}>
                    <View style={styles.SignupButton}>
                      <Text style={styles.SingupButtonText}> 가입 </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </Modal>
    )
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.user,
      };
}


let mapDispatchToProps = (dispatch) => {
    return {
      AuthActions: bindActionCreators(authActions, dispatch),
      signup
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Signup);
