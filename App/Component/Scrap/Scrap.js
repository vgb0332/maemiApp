import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { scrapCheck, scrapBlock } from '../../Lib/UserManager/scrapBlock';
import { connect } from 'react-redux';

class Scrap extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      user: '',
    }
  }


  scrap = ( ) => {
    const { isAuthenticated, user } = this.props.user;
    if(!isAuthenticated){
      Alert.alert('로그인이 필요합니다!');
      return false;
    }

    const { block } = this.props.navigation.state.params;
    const PID = block.ParentBlockPID;

    AsyncStorage.getItem('token').then((token)=>{
      scrapCheck({
        PID: PID,
        TOKEN :token,
      }).then(res=>{
        if(res.message === "스크랩 가능한 블럭"){
            scrapBlock({
              PID: PID,
              TOKEN : token,
            })
            .then((res)=>{
              if(res.success){
                Alert.alert('스크랩되었습니다!');
              }
              else{
                Alert.alert('스크랩에 실패했습니다. 다시 시도해주세요');
              }
            })
            .catch(err=>console.log(err));
        }

        else {
          Alert.alert('이미 스크랩된 기사입니다');
        }
      })
      .catch(err=>console.log(err))
    })
    .catch( err=>console.log(err))
  }

  componentDidMount() {
  }

  render() {
    const { isAuthenticated, user } = this.props.user;
    return (
      <TouchableOpacity onPress={ this.scrap }>
        <Text> 스크랩 </Text>
      </TouchableOpacity>
    );
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}

export default connect( mapStateToProps, null )(Scrap);
