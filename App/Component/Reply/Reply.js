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
import TagInput from 'react-native-tag-input';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

const tagProps = {
  keyboardType: 'default',
  // returnKeyType: 'search',
  placeholder: '#입력(최대 10개)',
  style: {
    fontSize: 14,
    marginVertical: Platform.OS == 'ios' ? 10 : -2,
    color: C.black,
    width: '100%',
  },
}

const imagePickerOptions = {
  title: "사진을 선택하세요",
  cancelButtonTitle : '취소',
  takePhotoButtonTitle : '사진 찍기',
  chooseFromLibraryButtonTitle : '갤러리에서 선택',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

class Reply extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      tags: [],
      text: '',

      height: this.props.height || 300,
      width: this.props.width || 300,
      format: this.props.format || 'JPEG',
      quality: this.props.quality || 80,
      buttonDisabled: false,

      isEditorReady: false,

      location : '',
    }

    this.richtext=null;
  }

  onLocationChange = (location) => {
    this.setState({location:location})
  }

  onLocationFocus = () => {
    this.state.locationInit ? null : this.setState({location:'',locationInit:true})
  }

  onLocationBlur = () => {
    if(this.state.location === ''){ this.setState({location: '입력',locationInit:false,})}
  }

  labelExtractor = ( text ) => ( "#"+text );

  onTagChange = ( text ) => {
    this.setState( { text } );
    if(this.state.tags.length > 10) return false;
    const lastTyped = text.charAt(text.length - 1);
    const parseWhen = [',', ' ', ';', '\n'];
    console.log(lastTyped);
    if (parseWhen.indexOf(lastTyped) > -1) {
      this.setState({
        tags: [...this.state.tags, this.state.text],
        text: "",
      });
    }
  }

  onPressAddImage = () => {
    // get image from image picker
    ImagePicker.showImagePicker(imagePickerOptions, async response => {
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
    })
  }

  render(){
    const { state, props } = this;
    // console.log(state, props);
    console.log(state.isEditorReady);
    return (
          <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={props.replyToggle}
          onRequestClose={props.toggleReply}>

              <View style={styles.ReplyContainer}>
                <View style={styles.ReplyWrapper}>

                  <View style={styles.ReplyHeader}>
                    <Text style={styles.tagsTitle} >
                      태그
                    </Text>
                    <TagInput
                      value={state.tags}
                      onChange={(tags) => this.setState({ tags })}
                      labelExtractor={ this.labelExtractor }
                      text={state.text}
                      onChangeText={ this.onTagChange }
                      inputProps={tagProps}
                      tagTextStyle={ styles.tagText }
                      tagContainerStyle={styles.tagsInputContainer}
                      inputDefaultWidth={D.Width(100)}
                    />
                  </View>

                  <View style={styles.ReplyBody}>
                    <RichTextEditor
                      ref={(r) => this.richtext = r}
                      // initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
                      hiddenTitle
                      editorInitializedCallback={() => {
                        this.richtext.blurContentEditor();
                        this.setState({isEditorReady: true})
                      }}
                      contentPlaceholder={"더하고 싶은 이야기를 자유롭게 적어주세요"}
                    />
                    <RichTextToolbar
                      getEditor={() => this.richtext}
                      onPressAddImage={this.onPressAddImage}
                    />
                  </View>

                  <View style={styles.ReplyBottom}>
                    <View style={styles.issueTime}>
                      <Text style={{fontWeight:'bold'}}> 시간 </Text>
                      <Text> {new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())} </Text>
                    </View>
                    <View style={styles.issueLocation}>
                      <Text style={{fontWeight:'bold'}}> 장소 </Text>
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

                <View style={styles.ReplyButtonContainer}>
                  <View style={styles.ReplyButtonWrapper}>
                    <View style={styles.ReplyButton}>
                      <TouchableOpacity onPress={()=>console.log('save')}>
                        <Text style={styles.ReplyButtonText}> 임시저장 </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.ReplyButton}>
                      <TouchableOpacity onPress={()=>console.log('add')}>
                        <Text style={styles.ReplyButtonText}> 더하기 </Text>
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
        user: state.user,
      };
}


let mapDispatchToProps = (dispatch) => {
    return {
      AuthActions: bindActionCreators(authActions, dispatch),
      signup
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Reply);
