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

class CreateIssue extends Component<Props> {
  constructor(props) {
    super(props);
		this.state = {
      tags: [],
      text: '',

      title: '제목을 입력해주세요',
      titleInit: false,

      content: '요청하고 싶은 뉴스에 대해 설명해주세요',
      contentInit: false,

      location: '입력',
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
    console.log(lastTyped);
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
      this.setState({title: '제목을 입력해주세요', titleInit:false,})
    }
  }

  onContentChange = (content)=> {
    this.setState({content: content})
  }

  onContentFocus = () => {
    this.state.contentInit ? null : this.setState({content: '', contentInit: true})
  }

  onContentBlur = () => {
    if(this.state.content === ''){ this.setState({content: '요청하고 싶은 뉴스에 대해 설명해주세요', contentInit:false,})}
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

  onSubmit = () => {
    console.log(this.state);
    Alert.alert(
      '요청하기',
      '요청하시겠습니까?',
      [
        {text: '예', onPress: () => this.verifyProcess('submit')},
        {text: '아니오', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  verifyProcess = (type) => {
    if(type === 'submit'){
      console.log('submit process');
      const { tags, title, content, location, image, time } = this.state;
      const { titleInit, contentInit, locationInit } = this.state;
      const { user } = this.props.user;
      if(isNullOrWhiteSpace(tags)){
        Alert.alert('오류', '태그(최소 1개)를 입력해주세요!');
        return false;
      }

      if(isNullOrWhiteSpace(image)){
        Alert.alert('오류', '이미지를 등록해주세요!');
        return false;
      }

      if(!titleInit){
        Alert.alert('오류', '제목을 입력해주세요!');
        return false;
      }

      if(!contentInit){
        Alert.alert('오류', '내용을 입력해주세요!');
        return false;
      }

      if(!locationInit){
        Alert.alert('오류', '위치를 입력해주세요!');
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
                  Alert.alert('', '등록되었습니다!',
                  [
                    {text: '확인', onPress: () => this.props.navigation.goBack()},
                  ]);
                }
                else {
                  Alert.alert('오류', '등록에 실패했습니다. 다시 시도해주세요');
                }
              })
              .catch((err) => {
                console.log(err);
              })

          })
          .catch((err) => {
            console.log(err);
            Alert.alert('오류', '등록에 실패했습니다. 다시 시도해주세요');
          })
      })

    }

    else if(type === 'save'){


    }

  }

  onSave = () => {
    console.log('onSave');
  }

  componentDidMount() {
    this.props.navigation.setParams({
        save: this.onSave,
        submit : this.onSubmit
    });

    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    Alert.alert(
      '돌아가기',
      '작성을 취소하시겠습니까?(작성 중이신 내용은 저장되지 않습니다)',
      [
        { text: '예', onPress: () => { this.props.navigation.goBack(null) } },
        { text: '아니오', onPress: () => {},  style: 'cancel' },

      ],
    );
    return true;
  }

  render() {
    const { props, state } = this;
    console.log(state, props);

    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {state.loading ?
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#0000ff" animating={state.loading}/>
            </View> : null
          }
          <View style={styles.tags}>
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
              onError={ () => Alert.alert('에러! 잠시 후 다시 시도해주세요')}
              promptOptions = {{
                title: "사진을 선택하세요",
                cancelButtonTitle : '취소',
                takePhotoButtonTitle : '사진 찍기',
                chooseFromLibraryButtonTitle : '갤러리에서 선택'
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
                 source={require('../../Public/Images/gallery.png')}
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
              underlineColorAndroid= 'transparent'
              maxLength = {200}
            />
          </View>

          <View style={styles.issueExtra}>
            <View style={styles.issueTime}>
              <Text> 시간 </Text>
              <Text> {new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())} </Text>
            </View>
            <View style={styles.issueLocation}>
              <Text> 장소 </Text>
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


export default connect(mapStateToProps, null)(CreateIssue);
