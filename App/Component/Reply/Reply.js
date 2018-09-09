import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Button,
  Modal,
  Alert,
  ActivityIndicator,
  Keyboard,
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
import TagInput from '../../Component/TagInput/TagInput';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { AsyncStorage } from 'react-native';
import { uploadByUri } from '../../Lib/UploadManager/UploadManage';
import { createReplyBlock } from '../../Lib/BlockManager/CreateReplyBlock';
import { saveBlock } from '../../Lib/BlockManager/SaveBlock';
import { withLocalize } from 'react-localize-redux';

// const tagProps = {
//   keyboardType: 'default',
//   // returnKeyType: 'search',
//   placeholder: this.props.translate('AddNewsTagInsert'),
//   style: {
//     fontSize: 14,
//     marginVertical: Platform.OS == 'ios' ? 10 : -2,
//     color: C.black,
//     width: '100%',
//   },
// }

// const imagePickerOptions = {
//   title: "사진을 선택하세요",
//   cancelButtonTitle : '취소',
//   takePhotoButtonTitle : '사진 찍기',
//   chooseFromLibraryButtonTitle : '갤러리에서 선택',
//   storageOptions: {
//     skipBackup: true,
//     path: 'images'
//   }
// }


class Reply extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      tags: [],
      text: '',

      image: '',

      time: Number(new Date().getFullYear())+'-'+Number(new Date().getMonth()+1)+'-'+Number(new Date().getDate())+" "+Number(new Date().getHours())+":"+Number(new Date().getMinutes()),
      height: this.props.height || 300,
      width: this.props.width || 300,
      format: this.props.format || 'JPEG',
      quality: this.props.quality || 80,
      buttonDisabled: false,

      isEditorReady: false,
      hasImage : false,
      location : '',

      loading: false,
    }

    this.keyboardDidShowListener = null;
    this.keyboardDidHideListener = null;
    this.richtext=null;
  }

  onLocationChange = (location) => {
    this.setState({location:location})
  }

  onLocationFocus = () => {
    this.state.locationInit ? null : this.setState({location:'',locationInit:true})
  }

  onLocationBlur = () => {
    if(this.state.location === ''){ this.setState({location: this.props.translate('AddNewsLocationInsert'),locationInit:false,})}
  }

  labelExtractor = ( text ) => ( "#"+text );

  onTagChange = ( text ) => {
    this.setState( { text } );
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

  onPressAddImage = () => {
    const { translate } = this.props;
    // get image from image picker
    ImagePicker.showImagePicker({
      title: translate('pictureSelectTitle'),
      cancelButtonTitle : translate('pictureCancelTitle'),
      takePhotoButtonTitle : translate('pictureTakePhotoTitle'),
      chooseFromLibraryButtonTitle : translate('pictureChooseTitle'),
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }, async response => {
      this.setState({buttonDisabled: false})
      console.log('Response = ', response)
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
      this.richtext.insertImage({ src: response.uri, width:width, height:height});
      if(!this.state.hasImage){
        this.setState({
          image : response,
          hasImage: true,
        })
      }

    })
  }

  save = () => {
    console.log('save');
    Alert.alert(
      this.props.translate('AlertSaveTitle'),
      this.props.translate('AlertSaveContent'),
      [
        {text: this.props.translate('yes'), onPress: () => this.submit('save')},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  add = () => {
    Alert.alert(
      this.props.translate('AlertAddNewsTitle'),
      this.props.translate('AlertAddNewsContent'),
      [
        {text: this.props.translate('yes'), onPress: () => this.submit('add')},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  submit = ( type ) => {
    this.setState({loading: true})
    const PPID = this.props.targetBlock.ParentBlockPID;

    if(type === 'save'){
      const { image, time, tags, location } = this.state;
      this.richtext.getContentHtml().then(content =>{
        AsyncStorage.getItem('token').then(token => {
          if(image){
            uploadByUri(image.uri, 'image/jpeg', new Date().getTime() + '.jpg')
              .then((url) => {
                  let block = {
                    FLAG : 'reply',
                    TOKEN : token,
                    PPID : PPID,
                    BLOCK_ISSUE_THEME : content,
                    BLOCK_ISSUE_HASHTAG : tags.join(),
                    BLOCK_ISSUE_CONTENT : content,
                    BLOCK_ISSUE_IMAGE : [url.replace(/\s/g, '')],
                    BLOCK_ISSUE_VIDEO : 'video_url',
                    BLOCK_ISSUE_LOCATION : location,
                    BLOCK_ISSUE_WRITE_TIME: time,
                  }

                  saveBlock(block).then( (res) => {
                    this.setState({loading:false})
                    if(res.success){
                      Alert.alert('', this.props.translate('AlertSaveSuccess'),
                      [
                        {text: this.props.translate('confirm'), onPress: () => {
                          this.props.toggleReply();
                          this.props.navigation.navigate("Main", {
                            block: this.props.targetBlock,
                            needRefresh: true,
                          })
                        }},
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
          }

          else{
            let block = {
              FLAG : 'reply',
              TOKEN : token,
              PPID : PPID,
              BLOCK_ISSUE_THEME : content,
              BLOCK_ISSUE_HASHTAG : tags.join(),
              BLOCK_ISSUE_CONTENT : content,
              BLOCK_ISSUE_IMAGE : '',
              BLOCK_ISSUE_VIDEO : 'video_url',
              BLOCK_ISSUE_LOCATION : location,
              BLOCK_ISSUE_WRITE_TIME: time,
            }

            saveBlock(block).then( (res) => {
              this.setState({loading:false})
              if(res.success){
                Alert.alert('', this.props.translate('AlertSaveSuccess'),
                [
                  {text: this.props.translate('confirm'), onPress: () => {
                    this.props.toggleReply();

                    this.props.navigation.navigate("Main", {
                      block: this.props.targetBlock,
                      needRefresh: true,
                    })
                  }},
                ]);
              }
              else {
                Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSubmitFail'));
              }
            })
            .catch((err) => {
              console.log(err);
            })
          }
        })
      })
      .catch(err=>{this.setState({loading:false}); console.log(err)});
    }


    else if(type === 'add'){
      const { image, time, tags, location } = this.state;
      this.richtext.getContentHtml().then(content =>{
        console.log(image, time, tags, location);
        AsyncStorage.getItem('token').then(token => {
          if(image){
            uploadByUri(image.uri, 'image/jpeg', new Date().getTime() + '.jpg')
              .then((url) => {
                  let block = {
                    FLAG : 'reply',
                    TOKEN : token,
                    PPID : PPID,
                    BLOCK_ISSUE_THEME : content,
                    BLOCK_ISSUE_HASHTAG : tags.join(),
                    BLOCK_ISSUE_CONTENT : content,
                    BLOCK_ISSUE_IMAGE : [url.replace(/\s/g, '')],
                    BLOCK_ISSUE_VIDEO : 'video_url',
                    BLOCK_ISSUE_LOCATION : location,
                    BLOCK_ISSUE_WRITE_TIME: time,
                  }

                  createReplyBlock(block).then( (res) => {
                    this.setState({loading:false})
                    if(res.success){
                      Alert.alert('', this.props.translate('AlertSubmitSuccess'),
                      [
                        {text: this.props.translate('confirm'), onPress: () => {
                          this.props.toggleReply();
                          this.props.navigation.navigate("Main", {
                            block: this.props.targetBlock,
                            needRefresh: true,
                          })
                        }},
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
          }

          else{
            let block = {
              FLAG : 'reply',
              TOKEN : token,
              PPID : PPID,
              BLOCK_ISSUE_THEME : content,
              BLOCK_ISSUE_HASHTAG : tags.join(),
              BLOCK_ISSUE_CONTENT : content,
              BLOCK_ISSUE_IMAGE : '',
              BLOCK_ISSUE_VIDEO : 'video_url',
              BLOCK_ISSUE_LOCATION : location,
              BLOCK_ISSUE_WRITE_TIME: time,
            }

            createReplyBlock(block).then( (res) => {
              this.setState({loading:false})
              if(res.success){
                Alert.alert('',  this.props.translate('AlertSubmitSuccess'),
                [
                  {text: this.props.translate('confirm'), onPress: () => {
                    this.props.toggleReply();
                    console.log('ever get here?');
                    this.props.navigation.navigate("Main", {
                      block: this.props.targetBlock,
                      needRefresh: true,
                    })
                  }},
                ]);
              }
              else {
                Alert.alert(this.props.translate('AlertError'), this.props.translate('AlertSubmitFail'));
              }
            })
            .catch((err) => {
              console.log(err);
            })
          }
        })
      })
      .catch(err=>{this.setState({loading:false}); console.log(err)});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fromMyPage){
      const { targetBlock } = nextProps;
      this.setState({
        tags: targetBlock.BLOCK_ISSUE_HASHTAG.split(","),
        location: targetBlock.BLOCK_ISSUE_LOCATION,
      })


    }
  }

  componentWillUnmount () {
    // if(this.keyboardDidShowListener) this.keyboardDidShowListener.remove();
    // if(this.keyboardDidHideListener) this.keyboardDidHideListener.remove();
  }

  componentDidUpdate() {
    const { fromMyPage } = this.props;
    if(fromMyPage){
        const { targetBlock } = this.props;
        this.richtext.setContentHTML(targetBlock.BLOCK_ISSUE_CONTENT);
    }


  }
  onEditorReady = () => {
    // console.log(something);
    this.setState({isEditorReady: true});
    // this.richtext.focusContent();
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  onEditorTouch = ()=>{
    console.log('please');
    if(this.richtext){
      this.richtext.focusContent();
    }

  }

  _keyboardDidHide() {
    console.log('keyboard hide')
    if(this.richtext){
      console.log(this.richtext);
      this.richtext.blurContentEditor();
    }
  }

  _keyboardDidShow() {
    console.log('keyboard show')
    if(this.richtext){
      this.richtext.blurContentEditor();
    }
  }

  onRequestClose = () => {

    this.setState({
      text : '',
      tags: [],
      location : '',
    })
    this.props.toggleReply();
  }

  render(){
    const { state, props } = this;
    const  { translate } = props;
    return (
          <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={props.replyToggle}
          onRequestClose={this.onRequestClose}>

              <View style={styles.ReplyContainer}>
                {state.loading ?
                  <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color="#000000" animating={state.loading}/>
                  </View> : null
                }
                <View style={styles.ReplyWrapper}>

                  <View style={styles.ReplyHeader}>
                    <Text style={styles.tagsTitle} >
                      { translate('AddNewsTag') }
                    </Text>
                    <TagInput
                      value={state.tags}
                      onChange={(tags) => this.setState({ tags })}
                      labelExtractor={ this.labelExtractor }
                      text={state.text}
                      onChangeText={ this.onTagChange }
                      inputProps={{
                        keyboardType: 'default',
                        // returnKeyType: 'search',
                        placeholder: translate('AddNewsTagInsert'),
                        style: {
                          fontSize: 14,
                          marginVertical: Platform.OS == 'ios' ? 10 : -2,
                          color: C.black,
                          width: '100%',
                        },
                      }}
                      tagTextStyle={ styles.tagText }
                      tagContainerStyle={styles.tagsInputContainer}
                      inputDefaultWidth={D.Width(100)}
                    />
                  </View>

                  <View style={styles.ReplyBody}>

                        <RichTextEditor
                          ref={(r) => this.richtext = r}
                          hiddenTitle={true}
                          editorInitializedCallback={this.onEditorReady}
                          contentPlaceholder={translate('AddNewsContentPlaceholder')}
                        />

                    <View style={{marginHorizontal: 10}}>
                      <RichTextToolbar
                        getEditor={() => this.richtext}
                        onPressAddImage={this.onPressAddImage}
                      />
                    </View>

                  </View>

                  <View style={styles.ReplyBottom}>
                    <View style={styles.issueTime}>
                      <Text style={{fontWeight:'bold'}}> {translate('AddNewsTime')} </Text>
                      <Text> {new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())} </Text>
                    </View>
                    <View style={styles.issueLocation}>
                      <Text style={{fontWeight:'bold'}}> {translate('AddNewsLocation')} </Text>
                      <TextInput
                        // underlineColorAndroid= 'transparent'
                        onChangeText={(location) => this.onLocationChange(location)}
                        onFocus={this.onLocationFocus}
                        onBlur={this.onLocationBlur}
                        value={state.location}
                        maxLength={20}
                      />
                    </View>
                  </View>

                </View>

                <View style={styles.ReplyButtonContainer}>
                  <View style={styles.ReplyButtonWrapper}>
                    <View style={styles.ReplyButton}>
                      <TouchableOpacity onPress={this.save}>
                        <Text style={styles.ReplyButtonText}> {translate('AddNewsSave')}</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.ReplyButton}>
                      <TouchableOpacity onPress={this.add}>
                        <Text style={styles.ReplyButtonTextAdd}> {translate('AddNewsSubmit')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

              </View>

          </Modal>
    )
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
      signup
    }
}


export default withLocalize(connect(mapStateToProps, null)(Reply));
