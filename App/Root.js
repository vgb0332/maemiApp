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
import { withLocalize } from 'react-localize-redux';
import { languageConfigure as translation, languages } from './Lib/Locale';
// import { languages } from './Lib/Locale';

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

      searchText : '',
    }

    this.props.initialize({
        languages: languages,
        translation:translation,
        options: {
          defaultLanguage: this.props.language.language ? this.props.language.language : 'kr',
          renderToStaticMarkup: false }
      });

    // 뒤로가기 버튼
    BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        this.props.translate('AlertAppExitTitle'),
        this.props.translate('AlertAppExitContent'),
        [
          { text: this.props.translate('yes'), onPress: () => { BackHandler.exitApp(); } },
          { text: this.props.translate('no'), onPress: () => {} },

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
      Alert.alert('',this.props.translate('AlertLogin'));
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
      Alert.alert('',this.props.translate('AlertLogin'));
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

  searchText = ( text ) => {
    console.log('from root', text);
    this.setState({searchText : text})
    this._drawer.close();
  }

  resetSearchText = () => {
    console.log('reseting');
    this.setState({searchText : ''})
  }

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
                    searchText = {this.searchText}
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
                  searchText: this.state.searchText,
                  translate: this.props.translate,
                }}
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = this.getCurrentRouteName(currentState);
                    const prevScreen = this.getCurrentRouteName(prevState);
                    this.resetSearchText();
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
      language: state.data.Language,
    };
}

export default withLocalize(connect(mapStateToProps, null)(Root));
