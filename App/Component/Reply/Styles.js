import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
  ReplyContainer : {
    width: '100%',
    height: '100%',
    backgroundColor: C.header,
  },

  activityIndicator : {
    position: 'absolute',
    width: D.Width(100),
    height: D.Height(100) - 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },

  ReplyWrapper : {
    flex: 0.9,
    margin: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
  },

  ReplyHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: C.header,
    borderBottomWidth : 1,
  },

  tagsTitle : {
    flex: 0.2,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: D.FontSize(1.5),
  },

  ReplyBody : {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 5,
  },

  ReplyBottom : {
    // flex: 0.1,
    // marginHorizontal: 10,
    flexDirection: 'row',
  },

  issueTime : {
    alignItems: 'center',
    flexDirection : 'row',
    marginLeft: 10,
  },

  issueLocation : {
    alignItems: 'center',
    flexDirection : 'row',
  },

  ReplyButtonContainer : {
    flex: 0.1,
    marginHorizontal: 20,
  },

  ReplyButtonWrapper : {
    flexDirection : 'row',
    justifyContent: 'space-between',
  },

  ReplyButton : {
    flex: 0.47,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor : C.white,
  },

  ReplyButtonText : {
    fontSize : D.FontSize(2),
    fontWeight: 'bold',
    textAlign : 'center',
  },

  ReplyButtonTextAdd: {
    fontSize : D.FontSize(2),
    fontWeight: 'bold',
    textAlign : 'center',
    color: 'black',
  },
});
