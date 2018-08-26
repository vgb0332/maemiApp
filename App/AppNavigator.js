import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  TabBarTop,
} from 'react-navigation';

import { Home, Main, CreateIssue, MyPage } from './Pages';
import Header from './Common/Header';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import * as C from './Styles/Colors';
import * as D from './Styles/Dimensions';
import Status from './Component/Status/Status';
import Scrap from './Component/Scrap/Scrap';

export default StackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({ screenProps, navigation }) => ({
          header: <Header
                    left={
                      <View style={{marginLeft:D.Width(5)}}>
                        <TouchableOpacity onPress={screenProps.openControlPanel}>
                        <Icon
                          name="menu" size={30} color="#000"/>
                        </TouchableOpacity>
                      </View>}
                    center= {
                      <View>
                        <Text style={{textAlign: 'center', color:'black',fontSize:D.FontSize(4), fontWeight:'bold'}}> MAEMI </Text>
                      </View>}
                    right={
                      <View style={{marginRight:D.Width(5)}}>
                        <TouchableOpacity onPress={screenProps.toggleLogin} >
                          <Status />
                        </TouchableOpacity>
                      </View>
                      }
                  />,

        }),
    },
    Main: {
        screen: Main,
        navigationOptions: ({ screenProps, navigation }) => ({
            header: <Header
                      left={
                        <View style={{marginLeft:D.Width(5)}}>
                          <TouchableOpacity onPress={()=>navigation.goBack()}>
                          <Icon
                            name="chevron-left" size={30} color="#000"/>
                          </TouchableOpacity>
                        </View>}
                      center= { null }
                      right={
                        <View style={{flexDirection:'row', marginRight:D.Width(5)}}>
                          <Scrap
                            navigation={navigation}
                          />
                          <TouchableOpacity >
                            <Text> 공유하기 </Text>
                          </TouchableOpacity>
                      </View>}
                    />,

        }),
    },
    CreateIssue: {
        screen: CreateIssue,
        navigationOptions: ({ screenProps, navigation }) => ({
            header: <Header
                      left={
                        <View style={{marginLeft:D.Width(5)}}>
                          <TouchableOpacity onPress={()=>navigation.goBack()}>
                          <Icon
                            name="chevron-left" size={30} color="#000"/>
                          </TouchableOpacity>
                        </View>}
                      center= { null }
                      right={
                        <View style={{flexDirection:'row', marginRight:D.Width(5)}}>
                          <TouchableOpacity onPress={navigation.state.params? navigation.state.params.save : null} >
                            <Text> 임시저장 </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={navigation.state.params? navigation.state.params.submit : null}>
                            <Text> 요청하기 </Text>
                          </TouchableOpacity>
                      </View>}
                    />,
        }),
    },
    MyPage : {
        screen: MyPage,
        navigationOptions: ({ screenProps, navigation }) => ({
            header: <Header
                      left={
                        <View style={{marginLeft:D.Width(5)}}>
                          <TouchableOpacity onPress={()=>navigation.goBack()}>
                          <Icon
                            name="chevron-left" size={30} color="#000"/>
                          </TouchableOpacity>
                        </View>}
                      center= { null }
                      right={
                        <View style={{flexDirection:'row', marginRight:D.Width(5)}}>
                          <TouchableOpacity >
                            <Text> 편집 </Text>
                          </TouchableOpacity>
                      </View>}
                    />,
        }),
    },
}, {
    initialRouteName: 'Home',
    headerMode: 'float',
});
