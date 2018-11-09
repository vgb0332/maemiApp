import React, { PureComponent , Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Button,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isNullOrWhiteSpace from '../../Util/isNullOrWhiteSpace';
import * as authActions from '../../Modules/Auth';
import { createReplyBlock } from '../../Lib/BlockManager/CreateReplyBlock';
import { getDetailBlock } from '../../Lib/BlockManager/GetDetailBlock';
import { deleteBlock } from '../../Lib/BlockManager/DeleteBlock';
import { voteUp, voteDown, voteCheck, voteUpCancel, voteDownCancel } from '../../Lib/BlockManager/Vote';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';
import styles from './Styles';
import Lightbox from 'react-native-lightbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AsyncStorage } from 'react-native';
import { withLocalize } from 'react-localize-redux';

class ReplyBlockDetail extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      replyInput: '',
      replyInit : false,

      isDown: false,
      isUp: false,

      loading: false,
      processing :false,

      replyEdit: false,
      replyEditInput : '',
    }

  }

  load = () => {
    const { PID, PPID } = this.props.block;
    const { isAuthenticated } = this.props.user;
    const { uid } = this.props.user;
    getDetailBlock({PID: PID})
    .then( res => {
      this.setState({
        BLOCK: res.data[0].ParentBlocks,
        REPLIES: res.data[0].ChildBlocks,
      })
    })
    .catch( err => {
      console.log(err);
    })

    if(isAuthenticated){
      AsyncStorage.getItem('token').then( token => {
        voteCheck({FLAG: 'DOWN', PID: PID, UID: uid, TOKEN : token })
        .then( res => {
          this.setState( { isDown : res.message !== '투표 가능한 블럭'})
        })

        voteCheck({FLAG: 'UP',PID: PID, UID: uid,TOKEN : token })
        .then( res => {
          this.setState( { isUp : res.message !== '투표 가능한 블럭'})
        })
      })
    }
  }

  componentDidMount() {
    this.load();
  }

  UpClick = () => {
    const { PID, PPID } = this.props.block;
    const { isAuthenticated } = this.props.user;
    const { uid } = this.props.user && this.props.user.user ? this.props.user.user.uid : '';
    const { isUp ,isDown } = this.state;

    if(isDown) return false;


    if(!isAuthenticated){
      Alert.alert('' ,this.props.translate('AlertLogin'));
      return;
    }

    this.setState({ processing: true, });
    AsyncStorage.getItem('token').then( token => {
      if(isUp){
        voteUpCancel({FLAG: 'UP', PID: PID, UID: uid, TOKEN : token })
        .then( res => {
          res.success ?
          this.setState({
            BLOCK : {
              ...this.state.BLOCK,
              VOTE_UP : Number(this.state.BLOCK.VOTE_UP) - 1,
            },
            isUp: false,
            processing: false,
          }) : null;
        })
      }
      else{
        voteUp({FLAG: 'UP', PID: PID, UID: uid, TOKEN : token })
        .then( res => {
          res.success ?
          this.setState({
            BLOCK : {
              ...this.state.BLOCK,
              VOTE_UP : Number(this.state.BLOCK.VOTE_UP) + 1,
            },
            isUp: true,
            processing: false,
          }) : null;
        })
      }
    })

  }

  DownClick = () => {
    const { PID, PPID } = this.props.block;
    const { isAuthenticated } = this.props.user;
    const { uid } = this.props.user && this.props.user.user ? this.props.user.user.uid : '';
    const { isUp, isDown } = this.state;

    if(isUp) return false;


    if(!isAuthenticated){
      Alert.alert('' ,this.props.translate('AlertLogin'));
      return;
    }
    this.setState({ processing: true, });
    AsyncStorage.getItem('token').then( token => {
      if(isDown){
        voteDownCancel({FLAG: 'DOWN', PID: PID, UID: uid, TOKEN : token })
        .then( res => {
          res.success ?
          this.setState({
            BLOCK : {
              ...this.state.BLOCK,
              VOTE_DOWN : Number(this.state.BLOCK.VOTE_DOWN) - 1,
            },
            isDown: false,
            processing: false,
          }) : null;
        })
      }
      else{
        voteDown({FLAG: 'DOWN', PID: PID, UID: uid, TOKEN : token })
        .then( res => {
          res.success ?
          this.setState({
            BLOCK : {
              ...this.state.BLOCK,
              VOTE_DOWN : Number(this.state.BLOCK.VOTE_DOWN) + 1,
            },
            isDown: true,
            processing: false,
          }) : null;
        })
      }
    })
  }

  onEdit = () => {
    console.log('edit', this.state);
    this.props.toggleReply(this.state.BLOCK);
    // this.props.navigation.setParams({wantEdit: true});
  }

  requestDeleteBlock = () => {
    console.log('deleteBlock', this.state);
    Alert.alert(
      this.props.translate('AlertDeleteTitle'),
      this.props.translate('AlertDeleteContent'),
      [
        {text: this.props.translate('yes'), onPress: this.deleteBlock},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  deleteBlock = () => {
    console.log('delete');
    const { BLOCK } = this.state;
    AsyncStorage.getItem('token').then( token => {
      deleteBlock( {TOKEN : token, PID: BLOCK.PID } )
      .then( (res) => {
        console.log(res);
        if(res.success){
          Alert.alert('', this.props.translate('AlertDeleteSuccess'),
          [
            {text: '확인', onPress: this.props.toggleReplyBlock},
          ]);
        }
        else{
          Alert.alert(this.props.translate('AlertDeleteFail'), this.props.translate('AlertSubmitFail'));
        }
      })
    })
  }

  onReplyEditInputChange = (text) => {
    this.setState({replyEditInput: text});
  }

  renderReplies = ( {item, index} ) => {
    return (
      <View style={styles.ReplyWrapper}>
        <View style={styles.ReplyUser}>
          {
            item.USER_IMAGE ?
            <Image source={{uri:item.USER_IMAGE}}
                  resizeMode={"contain"}
                  // style={styles.MainImage}
            />
            :
            <Icon name="user" size={20} color="#000" />
          }
        </View>

        <View style={styles.ReplyContent}>
          <View style={styles.ReplyContentInfo}>
            <Text style={styles.ReplyContentName}>{ item.USER_NICK }</Text>
            <Text>{ item.CREATE_DATE }</Text>

          </View>
          <View>
            <Text>
              {item.BLOCK_ISSUE_CONTENT}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  onReplyInputChange = (reply) => {
    const lastTyped = reply.charAt(reply.length - 1);
    const parseWhen = ['\n'];
    if (parseWhen.indexOf(lastTyped) > -1) {
      this.askSubmission(reply);
      return false;
    }
    else{
      this.setState({replyInput : reply})
    }

  }

  askSubmission = (reply) => {
    console.log(reply);
    Alert.alert(
      this.props.translate('AlertAddReplyTitle'),
      this.props.translate('AlertAddReplyContent'),
      [
        {text: this.props.translate('yes'), onPress: () => this.submit(reply)},
        {text: this.props.translate('no'), onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      ],
    )
  }

  submit(reply) {
    const { PID, PPID } = this.props.block;
    const { isAuthenticated } = this.props.user;
    const { uid } = this.props.user.user;
    this.setState({loading: true})
    AsyncStorage.getItem('token').then( token => {
      let data = {
        FLAG : 'reply',
        TOKEN : token,
        PPID : PID,
        BLOCK_ISSUE_THEME : reply,
        BLOCK_ISSUE_HASHTAG : null,
        BLOCK_ISSUE_CONTENT : reply,
        BLOCK_ISSUE_IMAGE : null,
        BLOCK_ISSUE_VIDEO : null,
        BLOCK_ISSUE_LOCATION : null,
      }

      createReplyBlock(data)
      .then( (res) => {
        console.log(res);
        this.setState({
          replyInput: '',
          replyInit : false,
          loading:false
        })
        if(res.success){
          Alert.alert('', this.props.translate('AlertSubmitSuccess'));
          this.load();
        }
      })
      .catch((err) => {
        this.setState({loading:false})
        console.log(err);
      })
    })
    .catch(err=>{
      this.setState({loading:false})
    })

  }

  onReplyInputFocus = () => {
    this.state.replyInit ? null : this.setState({replyInput:'',replyInit:true})
  }

  onReplyInputBlur = () => {
    if(this.state.replyInput === ''){ this.setState({replyInput: this.props.translate('AddReply'),replyInit:false,})}
  }

  render(){
    const { state, props } = this;
    const { BLOCK, REPLIES, isUp, isDown } = state;
    const { translate } = props;
    const regex = /(<([^>]+)>)|&nbsp;/ig;
    const nbsp = '&nbsp;';
    const gt = '&gt;';
    const lt = '&lt;';
    console.log('here', props, state);
    return (
          <Modal
          animationType="slide"
          transparent={true}
          hardwareAccelerated={true}
          visible={props.replyBlockToggle}
          onRequestClose={()=>props.toggleReplyBlock(null)}>

              <View style={styles.ReplyBlockDetailContainer}>
                {state.loading ?
                  <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color="#000000" animating={state.loading}/>
                  </View> : null
                }
                <View style={styles.ReplyBlockDetailWrapper}>
                    <View style={styles.ReplyBlockDetailHeader}>
                      <Text style={styles.HeaderText}> {BLOCK ? BLOCK.CREATE_DATE.split(' ')[0] : ''}</Text>
                      <Text style={styles.HeaderText}> {BLOCK ? BLOCK.BLOCK_ISSUE_LOCATION : ''} </Text>
                      <TouchableOpacity onPress={()=>props.toggleReplyBlock(null)}>
                        <Icon name="x" size={20} style={{alignSelf:'flex-end'}} color="black"/>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.ReplyBlockDetailTag}>
                      {
                        BLOCK && BLOCK.BLOCK_ISSUE_HASHTAG ?
                        BLOCK.BLOCK_ISSUE_HASHTAG.split(',').map( ( tag, index) =>
                          <Text key={index} style={styles.Tag}> { tag }</Text>
                      ) : null}
                    </View>

                    <View style={styles.ReplyBlockDetailImage}>
                      <Lightbox activeProps={{width:'100%', height:'100%'}} springConfig={{ tension: 30, friction: 7 }} swipeToDismiss={false}>
                          <Image source={{uri:BLOCK ? BLOCK.BLOCK_ISSUE_IMAGE : ''}}
                                resizeMode={"contain"}
                                style={styles.MainImage}
                          />
                      </Lightbox>
                    </View>

                    <View style={styles.ReplyBlockDetailContent}>
                      <Text numberOfLines ={6} style={styles.MainContent}>
                        {BLOCK ? BLOCK.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<') : ''}
                      </Text>
                    </View>

                    {
                      BLOCK && props.user && props.user.user && props.user.user.uid === BLOCK.UID ?
                      <View style={styles.ReplyBlockDetailEdit}>
                        <TouchableOpacity onPress={this.onEdit} style={styles.EditContent}>
                          <Text style={[styles.EditContentText, {borderRightWidth:1, borderColor: 'grey'}]}> 수정 </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.requestDeleteBlock} style={styles.EditContent}>
                          <Text style={styles.EditContentText}> 삭제 </Text>
                        </TouchableOpacity>
                      </View>
                      : null
                    }


                    <View style={styles.ReplyBlockDetailStaus}>
                      <View style={styles.StatusElement}>
                        <Text style={{fontWeight:'bold'}}> { translate('ReplyComments')} </Text>
                        <Text> { REPLIES ? REPLIES.length : 0 } </Text>
                      </View>

                      <View style={styles.StatusElement}>
                        <TouchableOpacity onPress={this.UpClick} disabled={this.state.processing}>
                          <Text style={styles.StatusText}>
                            <Text style={ isUp ? {'fontWeight': 'bold'} : {} }>{ translate('ReplyUp') } </Text>
                            <Text style={ isUp ? {'fontWeight': 'bold'} : {} }> { BLOCK ? BLOCK.VOTE_UP : 0 } </Text>
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.StatusElement}>
                        <TouchableOpacity onPress={this.DownClick} disabled={this.state.processing}>
                          <Text style={styles.StatusText}>
                            <Text style={ isDown ? {'fontWeight': 'bold'} : {} }> { translate('ReplyDown') } </Text>
                            <Text style={ isDown ? {'fontWeight': 'bold'} : {} }> { BLOCK ? BLOCK.VOTE_DOWN : 0 } </Text>
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>


                    <ScrollView>
                      <FlatList
                        data={REPLIES ? REPLIES : []}
                        removeClippedSubviews={true}
                        keyExtractor = {(item,index)=> item.PID}
                        renderItem={this.renderReplies}
                      />
                    </ScrollView>
                    <View style={styles.ReplyInput}>
                      <TextInput
                        style={styles.ReplyInputText}
                        multiline={true}
                        underlineColorAndroid= 'transparent'
                        onChangeText={(reply) => this.onReplyInputChange(reply)}
                        // onFocus={this.onReplyInputFocus}
                        // onBlur={this.onReplyInputBlur}
                        value={state.replyInput}
                        placeholder={translate('AddReply')}
                      />
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
export default withLocalize(connect(mapStateToProps, null)(ReplyBlockDetail));

// export default connect(mapStateToProps, mapDispatchToProps)(ReplyBlockDetail);
