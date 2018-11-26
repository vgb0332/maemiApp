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
import { withLocalize, setActiveLanguage } from 'react-localize-redux';
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
      searchText: '',
      searchTextInit: false,
      languageText: '',
      activeLanguage: '',

      pickerInit : false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      // searchText: nextProps.translate('search'),
      languageText: nextProps.translate('languageSelect'),
      activeLanguage: nextProps.language.language,
    })
  }
  onSearchTextChange = (text) => {
    this.setState({
      searchText: text,
    })
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
        searchText : this.props.translate('search'),
        searchTextInit: false,
      })
    }
  }

  changeLanguage = (value, index) => {
    if(!this.state.pickerInit){
      this.props.LanguageActions.setCurrentLanguage(value);
      this.props.setActiveLanguage(value);
      this.setState({
        pickerInit: true,
      })
    }
    else{
      this.setState({
        pickerInit: false,
      })
    }
  }

  render() {
    const { translate } = this.props;
    return (
      <View style={{backgroundColor:'#fff', height:'100%'}}>
        <View style={{margin: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../../Public/Images/logo2.png')}
                resizeMode={"stretch"}
                resizeMethod="resize"
                style={{width:D.Width(40), height:D.Width(40)}}
          />
        </View>

        <View style={{marginVertical: 10, marginHorizontal: 20, padding: 10, borderWidth: 1, borderColor: C.header}}>
          <Text onPress={this.props.link2CreateIssue} style={{color: 'black', fontWeight:'900', fontSize:D.FontSize(3), textAlign: 'center'}}>
            { translate('newGroup') }
          </Text>
        </View>

        <View style={{marginVertical: 10, marginHorizontal: 20,  backgroundColor:C.header}}>
          <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.onSearchTextChange(text)}
            // onFocus = {this.onSearchTextFocus}
            // onBlur={this.onSearchTextBlur}
            style={{textAlign: 'center'}}
            placeholderTextColor="black"
            placeholder="주제, 장소 등 검색"
            value={this.state.searchText}
            onSubmitEditing={this.onSearchTextSubmit}
          />
        </View>

        <View style={{position:'relative', marginVertical: 10, marginHorizontal: 20,  backgroundColor:C.header, }}>
          <View style={{justifyContent: 'center',
          alignItems: 'center',position:'absolute', height: '100%', width:'100%', left: 0}}>
            <Text style={{textAlign:'center', color:'black'}}>{ translate('languageSelect') }</Text>
          </View>
          <Picker
            enabled={this.state.picker}
            style={{backgroundColor:'rgba(255, 255, 255, 0)', color:C.header}}
            selectedValue = {this.props.language.language}
            // mode={'dropdown'}
            itemStyle={{margin: 200}}
            prompt = {this.props.translate('languageSelect')}
            onValueChange = {(value, index)=>this.changeLanguage(value, index)}>
             <Picker.Item label = {translate('korean')} value = "kr" />
             <Picker.Item label = {translate('english')} value = "en" />
          </Picker>
        </View>

        <View style={{position:'relative', marginVertical: 10, marginHorizontal: 20,  backgroundColor:C.header, }}>
          <TouchableOpacity style={{paddingVertical: 10}} onPress={this.props.link2TermsNPolicy}>
            <Text style={{textAlign:'center', color:'black'}}>{ translate('Privacy') } 및 { translate('Terms') }</Text>
          </TouchableOpacity>
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
