/**
 * @flow
 */

import React, { Component } from 'react';

import {
  View,
  StatusBar,
  BackHandler,
  Alert,
  Platform,
    Text,
} from 'react-native';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer';
import DrawerContent from './Component/DrawerContent/DrawerContent';
import Login from './Component/Login/Login';
import Signup from './Component/Signup/Signup';
import { NavigationActions } from 'react-navigation';
import AppNavigator from './AppNavigator';
import { AsyncStorage } from 'react-native';
import * as C  from './Styles/Colors';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  mainOverlay: {backgroundColor: '#000000', opacity: 0},
  // main: { opacity: 1},
};

class Root extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loginToggle: false,
      signupToggle: false,
    }

    // 뒤로가기 버튼
    BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        '종료',
        '앱을 종료하시겠습니까?',
        [
          { text: '예', onPress: () => { BackHandler.exitApp(); } },
          { text: '아니오', onPress: () => {} },

        ],
      );
      return true;
    });
  }

  componentWillMount() {
    console.disableYellowBox = true;
  }

  getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  }

  link2CreateIssue = () => {
    const { isAuthenticated, user } = this.props.user;
    if(!isAuthenticated){
      Alert.alert('로그인 해주세요!');
      return false;
    }
    this.navigator && this.navigator.dispatch(
      NavigationActions.navigate({ routeName: 'CreateIssue' })
    );
    this.closeControlPanel();
  }

  link2MyPage = () => {
    const { isAuthenticated, user } = this.props.user;
    if(!isAuthenticated){
      Alert.alert('로그인 해주세요!');
      return false;
    }
    this.navigator && this.navigator.dispatch(
      NavigationActions.navigate({ routeName: 'MyPage' })
    );
  }

  openControlPanel = () => {
     this._drawer.open()
  };

  closeControlPanel = () => {
     this._drawer.close()
  };

  toggleLogin = () => {
    this.setState({loginToggle: !this.state.loginToggle})
  }

  toggleSignup = () => {
    console.log('show me signup')
    this.setState({signupToggle: !this.state.signupToggle})
  }

  render() {
    const { state, props } = this;
    console.log(state, props);
    return (
      <Drawer
        type="overlay"
        // open={true}
        ref={(ref) => this._drawer = ref}
        content={<DrawerContent
                    link2CreateIssue = {this.link2CreateIssue}
                  />}
        tapToClose={true}
        openDrawerOffset={0.2} // 20% gap on the right side of drawer
        panCloseMask={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        tweenHandler={(ratio) => ({
          mainOverlay: { opacity: ratio * 0.8 },
        })}
      >
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
            <AppNavigator
                ref={nav => { this.navigator = nav; }}
                screenProps= {{
                  openControlPanel : this.openControlPanel,
                  closeControlPanel: this.closeControlPanel,
                  toggleLogin: this.toggleLogin,
                }}
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = this.getCurrentRouteName(currentState);
                    const prevScreen = this.getCurrentRouteName(prevState);
                    console.log(currentScreen, prevScreen);
                    console.log(currentScreen === prevScreen)
                }}
            />
            <Login
              toggleLogin={this.toggleLogin}
              loginToggle={state.loginToggle}
              toggleSignup={this.toggleSignup}
              link2MyPage={this.link2MyPage}
              />
            <Signup
              toggleLogin={this.toggleLogin}
              signupToggle={state.signupToggle}
              toggleSignup={this.toggleSignup}
            />
        </View>
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
      user: state.data.Auth,
    };
}

export default connect(mapStateToProps, null)(Root);
