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
  StyleSheet,
  Text,
  Image,
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
import * as D  from './Styles/Dimensions';
import { withLocalize } from 'react-localize-redux';
import { languageConfigure as translation, languages } from './Lib/Locale';
import AppIntroSlider from 'react-native-app-intro-slider';
import SplashScreen from 'react-native-splash-screen';
import { CheckBox } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import * as showAppActions from './Modules/ShowApp';

const drawerStyles = {
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  mainOverlay: {backgroundColor: '#000000', opacity: 0},
  // main: { opacity: 1},
};

// const isIphoneX = (
//   Platform.OS === 'ios' &&
//   !Platform.isPad &&
//   !Platform.isTVOS &&
//   (height === 812 || width === 812)
// );

const styles = StyleSheet.create({
  mainContent: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, .7)',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    color: 'rgba(255, 255, 255, .7)',
    fontWeight: '300',
    paddingHorizontal: 16,
  },
  image: {
    width: D.Width(100),
    height: '100%',
  }
});

const slides = [
  {
    key: 'splash1',
    image: require('./Public/Images/splash1.png'),
    imageStyle: styles.image,
    backgroundColor: 'white',
  },
  {
    key: 'splash2',
    image: require('./Public/Images/splash2.png'),
    imageStyle: styles.image,
    backgroundColor: 'white',
  },
  {
    key: 'splash3',
    image: require('./Public/Images/splash3.png'),
    imageStyle: styles.image,
    backgroundColor: 'white',
  },
  {
    key: 'splash4',
    image: require('./Public/Images/splash4.png'),
    imageStyle: styles.image,
    backgroundColor: 'white',
  }
];

class Root extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      loginToggle: false,
      signupToggle: false,

      searchText : '',

      never: false,
      currentIndex: 0,

      showRealApp :false,
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

  onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    if(this.state.never) {
      this.props.ShowAppActions.setShowApp(true);
    }
    this.setState({ showRealApp: true });
  }

  onSkip = () => {
    this.setState({ showRealApp: true });
  }

  onCheck = () => {
    this.setState({never:!this.state.never});
  }

  onSlideChange = ( index ) => {
    this.setState({currentIndex: index})
  }

  _renderSkipButton = () => {
    return (
      <View style={{backgroundColor: C.header, justifyContent: 'center', flex:1}}>
        <Text style={{textAlign: 'center', color: 'black', fontSize: D.FontSize(2)}}>
          {this.props.translate('Skip')}
        </Text>
      </View>
    )
  }

  _renderDoneButton = () => {
    return (
      <View style={{backgroundColor: C.header, justifyContent: 'center', flex:1}}>
        <Text style={{textAlign: 'center', color: 'black', fontSize: D.FontSize(2)}}>
          {this.props.translate('Done')}
        </Text>
      </View>
    );
  }

  _renderItem = (props) => {
    const style = {
      backgroundColor: props.backgroundColor,
      paddingTop: props.topSpacer,
      paddingBottom: props.bottomSpacer,
      width: props.width,
      height: props.height,
    }

    return (
      <View style={[styles.mainContent, style]}>
        <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
        <Image source={props.image} style={props.imageStyle} />
        <Text style={[styles.text, props.textStyle]}>{props.text}</Text>
      </View>
    );
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  componentWillMount() {
    console.disableYellowBox = true;
    SplashScreen.hide();
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

  link2TermsNPolicy = () => {
    console.log('les go!');
    this.navigator && this.navigator.dispatch(
      NavigationActions.navigate({ routeName: 'TermsNPolicy' })
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
      NavigationActions.navigate({ routeName: 'MyPage', params: {uid: user.uid }})
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
    if(state.showRealApp || props.showApp){
      return (
        <Drawer
          type="overlay"
          // open={true}
          ref={(ref) => this._drawer = ref}
          content={<DrawerContent
                      link2TermsNPolicy = {this.link2TermsNPolicy}
                      link2CreateIssue = {this.link2CreateIssue}
                      searchText = {this.searchText}
                      setActiveLanguage={this.props.setActiveLanguage}
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
          <View style={{ flex: 1, backgroundColor: C.header }}>
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
    } else {
      return (
        <View style={{flex:1}}>
          <AppIntroSlider
            activeDotStyle={{backgroundColor:'black'}}
            slides={slides}
            onDone={this.onDone}
            renderItem={this._renderItem}
            renderDoneButton={this._renderDoneButton}
            bottomButton
            hideNextButton
            // hideDoneButton
            showSkipButton
            onSkip={this.onSkip}
            renderSkipButton={this._renderSkipButton}
            skipLabel={'건너뛰기'}
            onSlideChange={this.onSlideChange}
          />
          {
            state.currentIndex == 3 ?
            <View style={{position :'absolute', bottom: 120, right: 30}}>
              <CheckBox
                right
                title={this.props.translate('Never')}
                checked={this.state.never}
                onIconPress={this.onCheck}
                onPress={this.onCheck}
                checkedColor='black'
                containerStyle={{borderWidth:0, backgroundColor:'white'}}
              />
            </View>
            :
            null
          }

        </View>
      );
    }

  }
}

function mapStateToProps(state) {
  return {
      user: state.data.Auth,
      language: state.data.Language,
      showApp: state.data.ShowApp.showApp,
    };
}

let mapDispatchToProps = (dispatch) => {
    return {
        ShowAppActions: bindActionCreators(showAppActions, dispatch),
    }
}

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(Root));
