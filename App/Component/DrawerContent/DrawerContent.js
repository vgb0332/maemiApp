import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Picker,
} from 'react-native';
import { withLocalize } from 'react-localize-redux';
import * as styles from './Styles';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as languageActions from '../../Modules/Language';

class DrawerContent extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      searchText: '주제, 장소 등 검색',
      searchTextInit: false,
      languageText: '언어선택',
    }
  }

  onSearchTextChange = (text) => {
    this.setState({
      searchText: text,
    })
    console.log(text);

  }

  onSearchTextSubmit = () =>{
    const text = this.state.searchText;
    this.props.searchText(text);
  }

  onSearchTextFocus = () => {
    if(!this.state.searchTextInit){
      this.setState({
        searchTextInit: true,
        searchText: '',
      })
    }
  }

  onSearchTextBlur = () => {
    if(!this.state.searchText){
      this.setState({
        searchText : '주제, 장소 등 검색',
        searchTextInit: false,
      })
    }
  }

  changeLanguage = (value) => {
    this.props.setActiveLanguage(value);
    this.props.LanguageActions.setCurrentLanguage(value);
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
            onChangeText={(text) => this.onSearchTextChange(text)}
            onFocus = {this.onSearchTextFocus}
            onBlur={this.onSearchTextBlur}
            style={{textAlign: 'center'}}
            value={this.state.searchText}
            onSubmitEditing={this.onSearchTextSubmit}
          />
        </View>

        <View style={{position:'relative', margin: 10, backgroundColor:C.header, }}>
          <View style={{justifyContent: 'center',
          alignItems: 'center',position:'absolute', height: '100%', width:'100%', left: 0}}>
            <Text style={{textAlign:'center', color:'black'}}>언어 선택</Text>
          </View>
          <Picker
            enabled={this.state.picker}
            style={{backgroundColor:'rgba(255, 255, 255, 0)', color:C.header}}
            selectedValue = {this.state.activeLanguage}
            // mode={'dropdown'}
            prompt = {'언어 선택'}
            onValueChange = {(value)=>this.changeLanguage(value)}>
             <Picker.Item label = {"한국어"} value = "kr" />
             <Picker.Item label = {"영어"} value = "en" />
          </Picker>
        </View>

      </View>
    )
  }
}

let mapStateToProps = (state) => {
    return {
        language: state.data.Language,
      };
}


let mapDispatchToProps = (dispatch) => {
    return {
        LanguageActions: bindActionCreators(languageActions, dispatch),
    }
}


export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(DrawerContent));
