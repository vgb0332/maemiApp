import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    Platform,
    BackHandler,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { AsyncStorage } from 'react-native';
// import PhotoUpload from 'react-native-photo-upload';
import TagInput from 'react-native-tag-input';
import { InfiniteScroll } from 'react-native-infinite';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dataActions from '../../Modules/Data';

import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';
import *  as util from '../../Util/util';

import PhotoUpload from '../../Component/PhotoUpload/PhotoUpload';
import { getIssueBlock } from '../../Lib/BlockManager/GetIssueBlocks';
import { uploadByUri } from '../../Lib/UploadManager/UploadManage';
import { createIssueBlock } from '../../Lib/BlockManager/CreateIssueBlock';
import { saveBlock } from '../../Lib/BlockManager/SaveBlock';
import isNullOrWhiteSpace from '../../Util/isNullOrWhiteSpace';
import { withLocalize } from 'react-localize-redux';


class CreateIssue extends Component<Props> {
  constructor(props) {
    super(props);
		this.state = {
      tags: [],
      text: '',

      title: this.props.translate('CreateIssueTitle'),
      titleInit: false,

      content: this.props.translate('CreateIssueContentPlaceholder'),
      contentInit: false,

      location: this.props.translate('CreateIssueLocationInsert'),
      locationInit: false,

      image: '',
      imageUrl: '',

      time: Number(new Date().getFullYear())+'-'+Number(new Date().getMonth()+1)+'-'+Number(new Date().getDate())+" "+Number(new Date().getHours())+":"+Number(new Date().getMinutes()),

      loading: false,
		};
  }

  onTagChange = ( text ) => {
    this.setState( { text } );
    console.log(text);
    if(this.state.tags.length > 10) return false;
    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];

    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: "",
      });
    }
  }

  onPhotoSelect = ( file, imageUrl ) => {
    // console.log(file, imageUrl);
     if (imageUrl) {
       this.setState({
         image: file,
         loading: false})
       // console.log('Image base64 string: ', imageUrl)
     }
  }

  labelExtractor = ( text ) => ( "#"+text );

  onTitleChange = (title) => {
    this.setState({title: title});
  }

  onTitleFocus = () => {
    this.state.titleInit ? null :  this.setState({ title: '', titleInit: true, })
  }

  onTitleBlur = () => {
    if(this.state.title === ''){
      this.setState({title: this.props.translate('CreateIssueNoTitleAlert'), titleInit:false,})
    }
  }

  onContentChange = (content)=> {
    this.setState({content: content})
  }

  onContentFocus = () => {
    this.state.contentInit ? null : this.setState({content: '', contentInit: true})
  }

  onContentBlur = () => {
    if(this.state.content === ''){ this.setState({content: this.props.translate('CreateIssueContentPlaceholder'), contentInit:false,})}
  }

  onLocationChange = (location) => {
    this.setState({location:location})
  }

  onLocationFocus = () => {
    this.state.locationInit ? null : this.setState({location:'',locationInit:true})
  }

  onLocationBlur = () => {
    if(this.state.location === ''){ this.setState({location: this.props.translate('CreateIssueLocationInsert'),locationInit:false,})}
  }

  onSubmit = () => {
    Alert.alert(
      this.props.translate('AlertCreateIssueTitle'),
      this.props.translate('AlertCreateIssueContent'),
      [
        {text: this.props.translate('yes'), onPress: () => this.verifyProcess('submit')},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }


  onSave = () => {
    Alert.alert(
      this.props.translate('AlertSaveTitle'),
      this.props.translate('AlertSaveContent'),
      [
        {text: this.props.translate('yes'), onPress: () => this.verifyProcess('save')},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  verifyProcess = (type) => {
    if(type === 'submit'){
      const { tags, title, content, location, image, time } = this.state;
      const { titleInit, contentInit, locationInit } = this.state;
      const { user } = this.props.user;
      if(isNullOrWhiteSpace(tags)){
        Alert.alert(
          this.props.translate('AlertError'),
          this.props.translate('CreateIssueNoTagsAlert'));
        return false;
      }

      if(isNullOrWhiteSpace(image)){
        Alert.alert(
          this.props.translate('AlertError'),
          this.props.translate('CreateIssueNoImageAlert'));
        return false;
      }

      if(!titleInit){
        Alert.alert(this.props.translate('AlertError'),
                    this.props.translate('CreateIssueNoTitleAlert'),);
        return false;
      }

      if(!contentInit){
        Alert.alert(this.props.translate('AlertError'),
                    this.props.translate('CreateIssueNoContentAlert'));
        return false;
      }

      if(!locationInit){
        Alert.alert(this.props.translate('AlertError'),
                    this.props.translate('CreateIssueNoLocationAlert'));
        return false;
      }

      this.setState({ loading: true });
      AsyncStorage.getItem('token').then( token => {
        uploadByUri(image.uri, 'image/jpeg', new Date().getTime() + '.jpg')
          .then((url) => {
              let block = {
                FLAG : 'issue',
                TOKEN : token,
                UID: user.uid,
                PPID : 'root',
                BLOCK_ISSUE_THEME : title,
                BLOCK_ISSUE_HASHTAG : tags.join(),
                BLOCK_ISSUE_CONTENT : content,
                BLOCK_ISSUE_IMAGE : [url.replace(/\s/g, '')],
                BLOCK_ISSUE_VIDEO : 'video_url',
                BLOCK_ISSUE_LOCATION : location,
                BLOCK_ISSUE_WRITE_TIME: time,
              }

              createIssueBlock(block).then( (res) => {
                this.setState({loading:false})
                if(res.success){
                  Alert.alert('', this.props.translate('AlertSubmitSuccess'),
                  [
                    {text: '확인', onPress: () => this.props.navigation.navigate('Home', { needRefresh: true })},
                  ]);
                }
                else {
                  Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSubmitFail'));
                }
              })
              .catch((err) => {
                console.log(err);
              })

          })
          .catch((err) => {
            console.log(err);
            Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSubmitFail'));
          })
      })

    }

    else if(type === 'save'){
      const { tags, title, content, location, image, time } = this.state;
      const { titleInit, contentInit, locationInit } = this.state;
      const { user } = this.props.user;

      if(image){
        this.setState({ loading: true });
        AsyncStorage.getItem('token').then( token => {
          uploadByUri(image.uri, 'image/jpeg', new Date().getTime() + '.jpg')
            .then((url) => {
                let block = {
                  FLAG : 'issue',
                  TOKEN : token,
                  UID: user.uid,
                  PPID : 'root',
                  BLOCK_ISSUE_THEME : title,
                  BLOCK_ISSUE_HASHTAG : tags.join(),
                  BLOCK_ISSUE_CONTENT : content,
                  BLOCK_ISSUE_IMAGE : [url.replace(/\s/g, '')],
                  BLOCK_ISSUE_VIDEO : 'video_url',
                  BLOCK_ISSUE_LOCATION : location,
                  BLOCK_ISSUE_WRITE_TIME: time,
                }

                createIssueBlock(block).then( (res) => {
                  this.setState({loading:false})
                  if(res.success){
                    Alert.alert('', this.props.translate('AlertSaveSuccess'),
                    [
                      {text: '확인', onPress: () => this.props.navigation.navigate('Home', { needRefresh: true })},
                    ]);
                  }
                  else {
                    Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSaveFail'));
                  }
                })
                .catch((err) => {
                  console.log(err);
                })

            })
            .catch((err) => {
              console.log(err);
              Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSaveFail'));
            })
        })
      }
      else {
        this.setState({ loading: true });
        let block = {
          FLAG : 'issue',
          TOKEN : token,
          UID: user.uid,
          PPID : 'root',
          BLOCK_ISSUE_THEME : title,
          BLOCK_ISSUE_HASHTAG : tags.join(),
          BLOCK_ISSUE_CONTENT : content,
          BLOCK_ISSUE_IMAGE : [url.replace(/\s/g, '')],
          BLOCK_ISSUE_VIDEO : 'video_url',
          BLOCK_ISSUE_LOCATION : location,
          BLOCK_ISSUE_WRITE_TIME: time,
        }

        createIssueBlock(block).then( (res) => {
          this.setState({loading:false})
          if(res.success){
            Alert.alert('', this.props.translate('AlertSaveSuccess'),
            [
              {text: this.props.translate('confirm'), onPress: () => this.props.navigation.navigate('Home', { needRefresh: true })},
            ]);
          }
          else {
            Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSaveFail'));
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }

    }
  }


  componentDidMount() {
    this.props.navigation.setParams({
        save: this.onSave,
        submit : this.onSubmit
    });

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.navigation.state && nextProps.navigation.state.params.fromMyPage){
      console.log(nextProps);
      const { block } = nextProps.navigation.state.params;

      this.setState({
        tags : block.BLOCK_ISSUE_HASHTAG.split(','),
        title: block.BLOCK_ISSUE_THEME,
        titleInit: true,
        content: block.BLOCK_ISSUE_CONTENT,
        contentInit: true,
        location: block.BLOCK_ISSUE_LOCATION,
        locationInit: true,
        image: block.BLOCK_ISSUE_IMAGE,
      })
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    Alert.alert(
      this.props.translate('AlertAppBackTitle'),
      this.props.translate('AlertCancel'),
      [
        { text: this.props.translate('yes'), onPress: () => { this.props.navigation.goBack(null) } },
        { text: this.props.translate('no'), onPress: () => {},  style: 'cancel' },

      ],
    );
    return true;
  }

  render() {
    const { props, state } = this;
    console.log(state, props);
    const { translate } = props;

    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {state.loading ?
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#000000" animating={state.loading}/>
            </View> : null
          }
          <View style={styles.tags}>
            <Text style={styles.tagsTitle} >
              { translate('CreateIssueTag') }
            </Text>
            <TagInput
              value={state.tags}
              onChange={(tags) => this.setState({ tags })}
              labelExtractor={ this.labelExtractor }
              text={state.text}
              onChangeText={ this.onTagChange }
              inputProps={{
                keyboardType: 'default',
                returnKeyType: 'search',
                placeholder: this.props.translate('CreateIssueTagInsert'),
                style: {
                  fontSize: 14,
                  marginVertical: Platform.OS == 'ios' ? 10 : -2,
                  color: C.black,
                  width: '100%',
                }}}
              tagTextStyle={ styles.tagText }
              tagContainerStyle={styles.tagsInputContainer}
              inputDefaultWidth={D.Width(100)}
            />
          </View>

          <View style={styles.issueTitle}>
            <TextInput
              style={styles.titleInput}
              onChangeText={(title) => this.onTitleChange(title)}
              onFocus={this.onTitleFocus}
              onBlur={this.onTitleBlur}
              value={state.title}

              underlineColorAndroid= 'transparent'
            />
          </View>

          <View style={styles.issueImage}>
            <PhotoUpload
              onPhotoSelect={this.onPhotoSelect}

              onStart={ ()=> this.setState({loading: true}) }
              onCancel= { () => this.setState({loading: false}) }
              onError={ () => Alert.alert(translate('error'))}
              promptOptions = {{
                title: translate('pictureSelectTitle'),
                cancelButtonTitle : translate('pictureCancelTitle'),
                takePhotoButtonTitle : translate('pictureTakePhotoTitle'),
                chooseFromLibraryButtonTitle : translate('pictureChooseTitle')
              }}
              containerStyle= {{
                backgroundColor: C.header,
              }} >
               <Image
                 style={{
                   width: D.Width(90),
                   height: D.Width(80),
                 }}
                 resizeMode='cover'
                 source={state.image ? {uri:state.image} : require('../../Public/Images/gallery.png')}
               />
            </PhotoUpload>
          </View>

          <View style={styles.issueContent}>
            <TextInput
              style={styles.contentInput}
              onChangeText={(content) => this.onContentChange(content)}
              onFocus={this.onContentFocus}
              onBlur={this.onContentBlur}
              value={state.content}
              multiline={true}
              underlineColorAndroid= 'transparent'
              maxLength = {200}
            />
          </View>

          <View style={styles.issueExtra}>
            <View style={styles.issueTime}>
              <Text> {translate('CreateIssueTime')} </Text>
              <Text> {new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())} </Text>
            </View>
            <View style={styles.issueLocation}>
              <Text> {translate('CreateIssueLocation')} </Text>
              <TextInput
                underlineColorAndroid= 'transparent'
                onChangeText={(location) => this.onLocationChange(location)}
                onFocus={this.onLocationFocus}
                onBlur={this.onLocationBlur}
                value={state.location}
                maxLength={20}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
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


export default withLocalize(connect(mapStateToProps, null)(CreateIssue));
