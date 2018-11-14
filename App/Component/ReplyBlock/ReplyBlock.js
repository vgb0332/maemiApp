import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';

import { InfiniteScroll } from 'react-native-infinite';
import Lightbox from 'react-native-lightbox';
import { getDetailBlock } from '../../Lib/BlockManager/GetDetailBlock';
import { voteUp, voteDown, voteCheck, voteUpCancel, voteDownCancel } from '../../Lib/BlockManager/Vote';
import { Icon, Avatar } from 'react-native-elements';
import styles from './Styles';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';
import * as util from '../../Util/util';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { withNavigation } from 'react-navigation';

class ReplyBlock extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      // REPLIES: null,
      isDown: false,
      isUp: false,

      processing: false,
    }
  }

  link2UserPage = () => {
    const { BLOCK } = this.state;
    this.props.navigation.navigate('MyPage', {
      uid: BLOCK.UID,
    })
  }

  toggleReplyBlock = () => {
    console.log('toggle reply block', this.state);
    this.props.toggleReplyBlock( this.state.BLOCK );
  }

  UpClick = () => {
    const BLOCK = this.props.data;
    const { isAuthenticated } = this.props.user;

    const { PID, PPID } = BLOCK;
    const { isUp, isDown } = this.state;

    if(isDown) return false;


    if(!isAuthenticated){
      Alert.alert('', this.props.translate('AlertLogin'));
      return false;
    }

    this.setState({ processing: true, });
    const { uid } = this.props.user && this.props.user.user ? this.props.user.user.uid : '';
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
    const BLOCK = this.props.data;
    const { isAuthenticated } = this.props.user;

    const { PID, PPID } = BLOCK;
    const { isUp, isDown } = this.state;

    if(isUp) return false;

    if(!isAuthenticated){
      Alert.alert('', this.props.translate('AlertLogin'));
      return false;
    }

    this.setState({ processing: true, });
    const { uid } = this.props.user && this.props.user.user ? this.props.user.user.uid : '';
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

  componentWillReceiveProps(nextProps){
    if(nextProps.navigation.state.params.needRefresh){
      const BLOCK = nextProps.data;
      const { isAuthenticated } = this.props.user;

      const { PID, PPID } = BLOCK;
      getDetailBlock({PID: PID})
      .then( res => {
        this.setState({
          data : res.data[0],
          BLOCK : res.data[0].ParentBlocks,
          REPLIES: res.data[0].ChildBlocks
        })
      })
      .catch( err => {
        console.log(err);
      })

      if(isAuthenticated){
        const { uid } = this.props.user.user;
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
  }

  componentDidMount() {
    console.log('why???? reply did mount');
    const BLOCK = this.props.data;
    const { isAuthenticated } = this.props.user;

    const { PID, PPID } = BLOCK;
    getDetailBlock({PID: PID})
    .then( res => {
      this.setState({
        data : res.data[0],
        BLOCK : res.data[0].ParentBlocks,
        REPLIES: res.data[0].ChildBlocks
      })
    })
    .catch( err => {
      console.log(err);
    })

    if(isAuthenticated){
      const { uid } = this.props.user.user;
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

  render() {
    const {BLOCK, REPLIES, isUp, isDown } = this.state;
    const { translate } = this.props;
    // console.log('reply', this.state, this.props);
    const regex = /(<([^>]+)>)|&nbsp;/ig;
    const nbsp = '&nbsp;';
    const gt = '&gt;';
    const lt = '&lt;';
    if(BLOCK && REPLIES){
      return (
        <View style={styles.Container}>
          <View style={styles.Status.wrap}>
          <TouchableOpacity onPress={this.link2UserPage}>
            {
              BLOCK.USER_IMAGE ?
              <Avatar
                size="small"
                rounded
                source={{uri: BLOCK.USER_IMAGE}}
                // onPress={() => console.log("Works!")}
                // activeOpacity={0.7}
              />
              :
              <Avatar
                rounded
                icon={{name: 'user', type: 'font-awesome', color:"#333"}}
                containerStyle={{}}
              />

            }

          </TouchableOpacity>

            <TouchableOpacity onPress={this.link2UserPage}>
              <Text style={styles.Status.id}>
                {BLOCK.USER_NICK}
              </Text>
            </TouchableOpacity>
            <Text style={styles.Status.date}>
              {BLOCK.CREATE_DATE.split(' ')[0]}
            </Text>
            <Text style={styles.Status.location}>
              {BLOCK.BLOCK_ISSUE_LOCATION}
            </Text>
          </View>

          <View style={styles.Title.wrap}>
            <TouchableOpacity onPress={this.toggleReplyBlock}>
              <Text numberOfLines ={3} style={styles.Title.text}>
                {BLOCK.BLOCK_ISSUE_CONTENT.replace(regex, '').replace( gt , '>').replace( lt , '<')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.MainImage.wrap}>

            <View>
              <TouchableOpacity onPress={this.toggleReplyBlock}>
                {BLOCK.BLOCK_ISSUE_IMAGE ?
                  <Image source={{uri:BLOCK.BLOCK_ISSUE_IMAGE}}
                        resizeMode={"stretch"}
                        style={styles.MainImage.image}
                  />
                  : null
                }

              </TouchableOpacity>
            </View>

          </View>

          <View style={styles.Footer.wrap}>
            <View style={styles.Footer.content}>
              <TouchableOpacity onPress={this.toggleReplyBlock} disabled={this.state.processing}>
                <Text style={styles.Footer.text}>
                  <Text style={ REPLIES.length ? {'fontWeight': 'bold', color: 'black'} : { color:'#808080' } }> { translate('ReplyComments') } </Text>
                  <Text style={ REPLIES.length ? {'fontWeight': 'bold', color: 'black'} : { color:'#808080' } } > {Number(REPLIES.length)} </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Footer.content}>
              <TouchableOpacity onPress={this.UpClick} disabled={this.state.processing}>
                <Text style={styles.Footer.text}>
                  <Text style={ isUp ? {'fontWeight': 'bold'} : { color:'#808080' } } > { translate('ReplyUp') } </Text>
                  <Text style={ isUp ? {'fontWeight': 'bold'} : { color:'#808080' } } > {BLOCK.VOTE_UP} </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.Footer.content}>
              <TouchableOpacity onPress={this.DownClick} disabled={this.state.processing}>
                <Text style={styles.Footer.text}>
                  <Text style={ isDown ? {'fontWeight': 'bold'} : { color:'#808080' } }> { translate('ReplyDown') } </Text>
                  <Text style={ isDown ? {'fontWeight': 'bold'} : { color:'#808080' } }> {BLOCK.VOTE_DOWN} </Text>
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
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

export default withNavigation(withLocalize(connect(mapStateToProps, null)(ReplyBlock)));
