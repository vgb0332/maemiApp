import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
  LoginContainer : {
    top: 76,
    right: 0,
    // height: 200,
    width: D.Width(80),
    position: 'absolute',
    zIndex: 9999,
    opacity: 1,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
  },

  loginInput : {
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
  },

  buttonContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },

  text : {
    padding: 5,
  },

  buttonWrapper :{
    // flex:0.7,
    alignSelf: 'flex-end',
    flexDirection:'row'
  },

  button : {
    borderWidth: 1,
    borderColor: '#ced4da',
    alignItems: 'flex-end',
    // flex: 1,
    padding: 5,
    margin: 2,
  },

  UserContainer: {
    top: 76,
    right: 0,
    // height: 200,
    // width: D.Width(80),
    position: 'absolute',
    zIndex: 9999,
    opacity: 1,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: '#ced4da',
    // padding: 10,
  },

  UserButtonContainer : {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // marginHorizontal: 10,
  },

  UserButtonWrapper : {

  },

  UserButton : {
    borderBottomWidth: 1,
    borderColor: '#ced4da',
    // flex: 1,
    // width: '100%',
    padding: 15,
    margin: 2,
  }

});
