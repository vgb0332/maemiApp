import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import * as styles from './Styles';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

class DrawerContent extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      searchText: '주제, 장소 등 검색',
      languageText: '언어선택',
    }
  }

  render() {
    return (
      <View style={{backgroundColor:'#fff', height:'100%'}}>
        <View style={{margin: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../Public/Images/logo2.png')}
                resizeMode={"stretch"}
                resizeMethod="resize"
                style={{width:D.Width(40), height:D.Width(40)}}
          />
        </View>

        <View style={{margin: 10, padding: 10, borderWidth: 1, borderColor: '#000000'}}>
          <Text onPress={this.props.link2CreateIssue} style={{fontWeight:'900', fontSize:D.FontSize(3), textAlign: 'center'}}>
            뉴스 요청하기
          </Text>
        </View>

        <View style={{margin: 10, backgroundColor:C.header}}>
          <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({searchText: text})}
            onFocus = { () => this.setState({searchText: ''})}
            style={{textAlign: 'center'}}
            value={this.state.searchText}
          />
        </View>

        <View style={{margin: 10, backgroundColor:C.header}}>
          <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({languageText: text})}
            onFocus = { () => this.setState({languageText: ''})}
            style={{textAlign:'center'}}
            value={this.state.languageText}
          />
        </View>

      </View>
    )
  }
}

export default DrawerContent;
