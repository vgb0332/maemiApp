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
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { InfiniteScroll } from 'react-native-infinite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getUserProfile } from '../../Lib/UserManager/getUserProfile';
import { uploadByUri } from '../../Lib/UploadManager/UploadManage';
import { updateUserProfile } from '../../Lib/UserManager/updateUserProfile';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import *  as util from '../../Util/util';
import { Dropdown } from 'react-native-material-dropdown';
import { AsyncStorage } from 'react-native';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';
import Reply from '../../Component/Reply/Reply';
import { withLocalize } from 'react-localize-redux';
// const imagePickerOptions = {
//   title: translate('pictureSelectTitle'),
//   cancelButtonTitle : translate('pictureCancelTitle'),
//   takePhotoButtonTitle : translate('pictureTakePhotoTitle'),
//   chooseFromLibraryButtonTitle : translate('pictureChooseTitle'),
//   storageOptions: {
//     skipBackup: true,
//     path: 'images'
//   }
// }

class MyPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      activeTab: 'issue',
      edit: false,

      description : '',
      fromMyPage: false,
      replyToggle: false,
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
          blocks : res.data.blocks,
          follows : res.data.follows,
          info : res.data.info[0],
          saves : res.data.saves,
          scraps : res.data.scraps,

          loading: false,
          description: res.data.info[0].USER_DESCRIPTION,
        })
      })
      .catch(err=>console.log(err));

    });

    this.props.navigation.setParams({
        edit: this.onEdit,
        editCancel: this.onEditCancel,
        editSubmit: this.onEditSubmit,
        isEditing: false,
    });
  }

  onEdit = () => {
    this.setState({ edit: true, })
    this.props.navigation.setParams({
      isEditing: true,
    })
  }

  onEditSubmit = () => {
    Alert.alert(this.props.translate('AlertEditTitle'), this.props.translate('AlertEditContent'),
      [
        {text: this.props.translate('yes'), onPress: this.submit},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  submit = () => {
    this.setState({loading:true});
    AsyncStorage.getItem('token').then( token => {
        const { USER_NAME, USER_NICK, USER_IMAGE, USER_DESCRIPTION } = this.state.info;
        let data = {
          TOKEN : token,
          USER_NAME : USER_NAME,
          USER_NICK : USER_NICK,
          USER_IMAGE : USER_IMAGE,
          USER_DESCRIPTION: this.state.description,
        }

        updateUserProfile(data)
        .then( (res) => {
          console.log(res);
          if(res.success){
            this.setState({ edit: false, loading: false, })
            this.props.navigation.setParams({
              isEditing: false,
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
  }

  onEditCancel = () => {
    Alert.alert(this.props.translate('AlertEditCancelTitle'), this.props.translate('AlertEditCancelContent'),
      [
        {text: this.props.translate('yes'), onPress: () => {
          this.setState({ edit: false, })
          this.props.navigation.setParams({
            isEditing: false,
          })
        }},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  onImagePress = () => {
    this.setState({loading: true});
    ImagePicker.showImagePicker({
      title: this.props.translate('pictureSelectTitle'),
      cancelButtonTitle : this.props.translate('pictureCancelTitle'),
      takePhotoButtonTitle : this.props.translate('pictureTakePhotoTitle'),
      chooseFromLibraryButtonTitle : this.props.translate('pictureChooseTitle'),
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }, async response => {
      let rotation = 0
      const {originalRotation} = response

      if (this.props.onResponse) this.props.onResponse(response)

      if (response.didCancel) {
        console.log('User cancelled image picker')
        if (this.props.onCancel) this.props.onCancel('User cancelled image picker')
        return
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
        if (this.props.onError) this.props.onError(response.error)
        return
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
        if (this.props.onTapCustomButton) this.props.onTapCustomButton(response.customButton)
        return
      }

      const ratio = Number(response.width) / Number(response.height);
      const width = D.Width(100) * ratio;
      const height = D.Width(100) * (1 - ratio);

      AsyncStorage.getItem('token', token => {
        uploadByUri( response.uri, 'image/jpeg', new Date().getTime() + '.jpg')
        .then((url) => {
          this.setState({
            info : {
              ...this.state.info,
              USER_IMAGE: url.replace(/\s/g,''),
            },
            loading: false,
          })
        })
      })
    })
  }

  onDescriptionChange = (text) => {
    this.setState({description: text})
  }

  componentWillUnmount() {

  }

  toggleReply = (block) => {
    if(block){
      this.setState({
        replyToggle: !this.state.replyToggle,
        savedBlock : block,
        fromMyPage: true,
      })
    }
    else {
      this.setState({
        replyToggle: !this.state.replyToggle,
        fromMyPage: false,
      })
    }
  }

  link2CreateIssue = (block) => {
    this.props.navigation.navigate('CreateIssue', { block : block, fromMyPage: true });
  }

  renderContent = ( {item, index} ) => {
    const {activeTab} = this.state;
    if(activeTab === 'add'){
      const regex = /(<([^>]+)>)|&nbsp;/ig;
      const nbsp = '&nbsp;';
      const gt = '&gt;';
      const lt = '&lt;';
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('Main', { block: { PID : item.PPID, PPID : null}})}>
                <Text style={styles.titleAdd} numberOfLines={1}>
                  { item.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<') }
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>
              <Text style={styles.contentAdd} numberOfLines={5}>
                {item.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
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
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('Main', { block: item})}>
                <Text style={styles.titleAdd} numberOfLines={1}>
                  { item.BLOCK_ISSUE_THEME }
                </Text>
              </TouchableOpacity>
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
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('Main', { block: item})}>
                <Text style={styles.titleAdd} numberOfLines={1}>
                  { item.BLOCK_ISSUE_THEME }
                </Text>
              </TouchableOpacity>
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
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('Main', { block: item})}>
              <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
                resizeMode="stretch"
                resizeMethod='resize'
                style={styles.contentAddImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    else if(activeTab === 'save') {
      const regex = /(<([^>]+)>)|&nbsp;/ig;
      const nbsp = '&nbsp;';
      const gt = '&gt;';
      const lt = '&lt;';
      return (
        <View style={styles.ContentAddWrapper}>
          <View style={styles.ContentAddLeft}>
            <View style={styles.ContentAddTitle}>
              <TouchableOpacity onPress={item.FLAG === 'reply' ? ()=>this.toggleReply(item) : ()=>this.link2CreateIssue(item)}>
                <Text style={styles.titleAdd} numberOfLines={1}>
                  { item.BLOCK_ISSUE_THEME.replace(regex, '').replace( gt , '>').replace( lt , '<') }
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ContentAddInfo}>
              <Text style={styles.infoAdd}>{item.CREATE_DATE.split(' ')[0]}</Text>
              <Text style={styles.infoAdd}>{item.BLOCK_ISSUE_LOCATION}</Text>
              <Text style={styles.infoAdd}>{item.VOTE_UP} UP</Text>
              <Text style={styles.infoAdd}>{item.VOTE_DOWN} DOWN</Text>
            </View>
            <View style={styles.ContentAddContent}>

                <Text style={styles.contentAdd} numberOfLines={5}>
                  {item.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
                </Text>

            </View>
          </View>
          <View style={styles.ContentAddRight}>
            <TouchableOpacity onPress={item.FLAG === 'reply' ? ()=>this.toggleReply(item) : ()=>this.link2CreateIssue(item)}>
              <Image source={{uri:item.BLOCK_ISSUE_IMAGE}}
                resizeMode="stretch"
                resizeMethod='resize'
                style={styles.contentAddImage}
              />
            </TouchableOpacity>
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

    if(state.data){
      const { blocks, follows, info, saves, scraps } = state;
      const { translate } = props;
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
              {state.loading ?
                <View style={styles.activityIndicator}>
                  <ActivityIndicator size="large" color="#000000" animating={state.loading}/>
                </View> : null
              }
              <View style={styles.Wrapper}>

                <View style={styles.Top}>

                  <View style={styles.UserInfo}>
                    <View style={styles.UserInfoImage}>
                      <TouchableOpacity style={styles.mainImage} onPress={ state.edit ? this.onImagePress : null }>
                        <Image source={{uri:info.USER_IMAGE ? info.USER_IMAGE : 'https://via.placeholder.com/350x150'}}
                          resizeMode="stretch"
                          resizeMethod='resize'
                          style={styles.mainImage}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.UserInfoId}>
                      <View>
                        <Text style={styles.id}> { info.USER_NICK } </Text>
                      </View>
                      <View style={styles.UserInfoFollow}>
                        <Text style={styles.follow}> { Number(info.FOLLOW_COUNT) } following </Text>
                        <Text style={styles.follow}> { Number( follows.length ) } follow </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.UserDesc}>
                    {
                      state.edit ?
                      <TextInput
                        style={styles.descriptionOnEdit}
                        underlineColorAndroid= 'transparent'
                        onChangeText={(text) => this.onDescriptionChange(text)}
                        value={ state.description }
                      />
                      :
                      <Text style={styles.description}> { state.description } </Text>
                    }

                  </View>

                </View>

                <View style={styles.Tab}>
                  <View style={styles.TabContainer}>
                    <Picker
                      selectedValue = {state.activeTab}
                      // mode={'dropdown'}
                      onValueChange = {(value)=>this.setState({activeTab: value})}>
                       <Picker.Item label = {translate('ProfileRequestedNews') + " (" + issue_blocks.length + ")"} value = "issue" />
                       <Picker.Item label = {translate('ProfileAddedNews') + " (" + add_blocks.length + ")"} value = "add" />
                       <Picker.Item label = {translate('ProfileScrapNews') + " (" + scraps.length + ")"} value = "scrap" />
                       <Picker.Item label = {translate('ProfileSavedNews') + " (" + saves.length + ")"} value = "save" />
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
            <Reply
              replyToggle={state.replyToggle}
              toggleReply={this.toggleReply}
              targetBlock={ state.savedBlock ? state.savedBlock : null }
              navigation={props.navigation}
              fromMyPage={state.fromMyPage}
            />

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


export default withLocalize(connect(mapStateToProps, null)(MyPage));
