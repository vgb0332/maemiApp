import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
  SignupContainer : {
    width: D.Width(100),
    height: D.Height(100),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  SignupWrapper: {
    marginHorizontal: D.Width(5),
    marginVertical: D.Height(5),
    width: D.Width(90),
    height: D.Height(80),
    backgroundColor: C.white,
  },

  SignupHeader : {
    backgroundColor: '#000000',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  SignupHeaderText : {
    color: '#ffffff',
    alignSelf: 'flex-start',
    fontSize: D.FontSize(2.5),
    paddingLeft: 10,
  },

  SignupBody : {
    flexDirection: 'column',
    padding: D.Width(5),
  },

  SignupBodyInputWrapper : {
    marginBottom: 10,
  },

  SignupLabel : {
    fontSize: D.FontSize(2),
    marginBottom: 5,
  },

  SignupInput : {
    fontSize: D.FontSize(2),
    borderWidth: 1,
    borderColor: '#ced4da',
    paddingLeft: 10,
    color: '#ced4da',
  },

  SignUpInputActive: {
    color: C.black,
  },

  SignupFooter : {
    flex: 1,
    paddingRight: 20,
  },

  SignupButton : {
    alignSelf : 'flex-end',
    borderWidth : 1,
    borderColor: C.black,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  SingupButtonText : {
    fontSize: D.FontSize(2),
  }
});
