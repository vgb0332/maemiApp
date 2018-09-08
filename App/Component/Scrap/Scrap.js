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
import { withLocalize } from 'react-localize-redux';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

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
      Alert.alert('' ,this.props.translate('AlertLogin'));
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
                Alert.alert('', this.props.translate('AlertDuplicateScrap'));
              }
              else{
                Alert.alert('' , this.props.translate('AlertScrapFail'));
              }
            })
            .catch(err=>console.log(err));
        }

        else {
          Alert.alert('', this.props.translate('AlertDuplicateScrap'));
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
    const { translate } = this.props;

    return (
      <TouchableOpacity style={{marginRight:D.Width(3)}} onPress={ this.scrap }>
        <Text> { translate('Scrap')} </Text>
      </TouchableOpacity>
    );
  }
}

let mapStateToProps = (state) => {
    return {
        user: state.data.Auth,
      };
}

export default withLocalize(connect( mapStateToProps, null )(Scrap));
