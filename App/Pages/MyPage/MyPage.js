/**
 * @flow
 */

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Picker,
} from 'react-native';

import { InfiniteScroll } from 'react-native-infinite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProfile } from '../../Lib/UserManager/getUserProfile';
// import { getDetailBlock } from '../../Lib/BlockManager/GetDetailBlock';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import *  as util from '../../Util/util';
import { Dropdown } from 'react-native-material-dropdown';
import { AsyncStorage } from 'react-native';

class MyPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: null,
      activeTab: 'issue',
    }
  }

  componentDidMount() {
    const { isAuthenticated, user } = this.props.user;
    console.log(isAuthenticated, user);
    AsyncStorage.getItem('token').then( token => {
      if(!token) {
        Alert.alert('how did you get here?');
        return false;
      }

      getUserProfile({
      	UID: user.uid ? user.uid: '',
        TOKEN : token,
      })
      .then((res)=>{
      	console.log(res);
        this.setState( {
          data : res.data,
        })
      })
      .catch(err=>console.log(err));

    });
  }

  componentWillUnmount() {

  }

  renderContent = ( {item, index} ) => {
    console.log(item, index);
    const {activeTab} = this.state;
    console.log(activeTab);
    if(activeTab === 'add'){
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <Text style={styles.titleAdd} numberOfLines={1}>
                { item.BLOCK_ISSUE_CONTENT }
              </Text>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>
              <Text style={styles.contentAdd} numberOfLines={5}>
                {item.BLOCK_ISSUE_CONTENT}
              </Text>
            </View>
          </View>
          <View style={styles.ContentAddRight}>
            <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
              resizeMode="stretch"
              resizeMethod='resize'
              style={styles.contentAddImage}
            />
          </View>
        </View>
      );
    }
    else if(activeTab === 'issue'){
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <Text style={styles.titleAdd} numberOfLines={1}>
                { item.BLOCK_ISSUE_THEME }
              </Text>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>
              <Text style={styles.contentAdd} numberOfLines={5}>
                {item.BLOCK_ISSUE_CONTENT}
              </Text>
            </View>
          </View>
          <View style={styles.ContentAddRight}>
            <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
              resizeMode="stretch"
              resizeMethod='resize'
              style={styles.contentAddImage}
            />
          </View>
        </View>
      );
    }
    else if(activeTab === 'scrap'){
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <Text style={styles.titleAdd} numberOfLines={1}>
                { item.BLOCK_ISSUE_THEME }
              </Text>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>
              <Text style={styles.contentAdd} numberOfLines={5}>
                {item.BLOCK_ISSUE_CONTENT}
              </Text>
            </View>
          </View>
          <View style={styles.ContentAddRight}>
            <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
              resizeMode="stretch"
              resizeMethod='resize'
              style={styles.contentAddImage}
            />
          </View>
        </View>
      );
    }
    else if(activeTab === 'save') {
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <Text style={styles.titleAdd} numberOfLines={1}>
                { item.BLOCK_ISSUE_THEME }
              </Text>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>
              <Text style={styles.contentAdd} numberOfLines={5}>
                {item.BLOCK_ISSUE_CONTENT}
              </Text>
            </View>
          </View>
          <View style={styles.ContentAddRight}>
            <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
              resizeMode="stretch"
              resizeMethod='resize'
              style={styles.contentAddImage}
            />
          </View>
        </View>
      );
    }
    else{
      return null;
    }

  }
  render() {
    const { props, state } = this;
    console.log(props, state);

    if(state.data){
      const { blocks, follows, info, saves, scraps } = state.data;
      let issue_blocks = [];
      let add_blocks = [];

      blocks.map( (block, i) => {
        (block.FLAG === 'issue') ? issue_blocks.push(block) : add_blocks.push(block)
      });

      let targetData;
      if(state.activeTab === 'add') targetData = add_blocks;
      else if(state.activeTab === 'issue') targetData = issue_blocks;
      else if(state.activeTab === 'scrap') targetData = scraps;
      else if(state.activeTab === 'save') targetData = saves;
      else targetData = [];

      return (
          <ScrollView>
            <View style={styles.Container}>

              <View style={styles.Wrapper}>

                <View style={styles.Top}>

                  <View style={styles.UserInfo}>
                    <View style={styles.UserInfoImage}>
                      <Image source={{uri:info[0].USER_IMAGE ? info[0].USER_IMAGE : 'https://via.placeholder.com/350x150'}}
                        resizeMode="stretch"
                        resizeMethod='resize'
                        style={styles.mainImage}
                      />
                    </View>
                    <View style={styles.UserInfoId}>
                      <View>
                        <Text style={styles.id}> { info[0].USER_NICK } </Text>
                      </View>
                      <View style={styles.UserInfoFollow}>
                        <Text style={styles.follow}> { Number(info[0].FOLLOW_COUNT) } following </Text>
                        <Text style={styles.follow}> { Number( follows.length ) } follow </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.UserDesc}>
                    <Text style={styles.description}> { info[0].USER_DESCRIPTION } </Text>
                  </View>

                </View>

                <View style={styles.Tab}>
                  <View style={styles.TabContainer}>
                    <Picker
                      selectedValue = {state.activeTab}
                      // mode={'dropdown'}
                      onValueChange = {(value)=>this.setState({activeTab: value})}>
                       <Picker.Item label = {"요청한 뉴스 " + "(" + issue_blocks.length + ")"} value = "issue" />
                       <Picker.Item label = {"더한 뉴스 " + "(" + add_blocks.length + ")"} value = "add" />
                       <Picker.Item label = {"스크랩한 뉴스 " + "(" + scraps.length + ")"} value = "scrap" />
                       <Picker.Item label = {"저장한 글 " + "(" + saves.length + ")"} value = "save" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.TabContent}>
                <FlatList
                  data={targetData}
                  removeClippedSubviews={true}
                  keyExtractor = {(item,index)=> index.toString()}
                  renderItem={this.renderContent}
                />
              </View>

            </View>

          </ScrollView>
      );
    }
    else{
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
        DataActions: bindActionCreators(dataActions, dispatch),
    }
}


export default connect(mapStateToProps, null)(MyPage);
