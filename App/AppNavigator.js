import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Alert
} from 'react-native';

import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  TabBarTop,
} from 'react-navigation';

import { Home, Main, CreateIssue, MyPage, TermsNPolicy } from './Pages';
import Header from './Common/Header';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import * as C from './Styles/Colors';
import * as D from './Styles/Dimensions';
import Status from './Component/Status/Status';
import Scrap from './Component/Scrap/Scrap';
import SNSShare from './Component/SNSShare/SNSShare';

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
    TermsNPolicy: {
        screen: TermsNPolicy,
        navigationOptions: ({ screenProps, navigation }) => ({
          header: <Header
                    left={
                      <View style={{marginLeft:D.Width(5)}}>
                        <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Icon
                          name="chevron-left" size={30} color="#000"/>
                        </TouchableOpacity>
                      </View>}
                    center= {
                      <View style={{width:D.Width(60)}}>
                        <Text style={{color:'black',fontSize:D.FontSize(2), fontWeight:'bold'}}>개인정보 및 이용약관</Text>
                      </View>}
                    right={
                      null
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
                          <TouchableOpacity style={{marginRight:D.Width(3)}} onPress={()=>{
                            Alert.alert(
                              '신고',
                              '신고 시 내부 검토 후 처리됩니다.\n신고하시겠습니까?',
                              [
                                { text: '예', onPress: ()=> Alert.alert('신고되었습니다!')},
                                { text: '아니오', onPress: () => {}}
                              ]
                            );
                          }}>
                            <Text>신고하기</Text>
                          </TouchableOpacity>
                          <Scrap
                            navigation={navigation}
                          />
                          <SNSShare
                            navigation={navigation}
                            />
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
                          <TouchableOpacity style={{marginRight:D.Width(3)}} onPress={navigation.state.params? navigation.state.params.save : null} >
                            <Text> { screenProps.translate('CreateIssueSave')} </Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={navigation.state.params? navigation.state.params.submit : null}>
                            <Text> {
                              navigation.state.params && navigation.state.params.wantEdit ?
                              screenProps.translate('CreateIssueEdit')
                              :screenProps.translate('CreateIssueSubmit')
                            } </Text>
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
                          <TouchableOpacity onPress={
                            navigation.state.params &&
                            navigation.state.params.isEditing ? navigation.state.params.editCancel : ()=>navigation.goBack()
                            }>
                          <Icon
                            name="chevron-left" size={30} color="#000"/>
                          </TouchableOpacity>
                        </View>}
                      center= { null }
                      right={
                        navigation.state.params && navigation.state.params.isMine ?
                        <View style={{flexDirection:'row', marginRight:D.Width(5)}}>
                          {
                            navigation.state.params ?
                            navigation.state.params.isEditing ?
                              <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={navigation.state.params.editSubmit} >
                                  <Text> { screenProps.translate('AlertEditTitle')} </Text>
                                </TouchableOpacity>
                              </View>
                              :
                              <TouchableOpacity onPress={navigation.state.params.edit} >
                                <Text> { screenProps.translate('PrfileEdit')}  </Text>
                              </TouchableOpacity>
                            : null
                          }

                      </View> : null}
                    />,
        }),
    },
}, {
    initialRouteName: 'Home',
    headerMode: 'float',
});
