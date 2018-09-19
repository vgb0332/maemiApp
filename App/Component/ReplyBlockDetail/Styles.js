import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
  ReplyBlockDetailContainer : {
    flex: 1,
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

  ReplyBlockDetailWrapper :  {
    flex: 1,
    margin: 30,
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingBottom: 10,
  },

  ReplyBlockDetailHeader : {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },

  HeaderText : {
    color : 'black',

  },

  ReplyBlockDetailTag : {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  Tag : {
    padding:2,
    marginRight:5,
    marginBottom: 5,
    fontSize: D.FontSize(1.5),
    color: '#C0C0C0',
  },

  ReplyBlockDetailImage : {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  MainImage : {
    width: D.Width(80),
    height: D.Width(60),
  },

  ReplyBlockDetailContent : {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  MainContent : {
    textAlign: 'center',
    color: 'black',
  },

  ReplyBlockDetailEdit : {
    paddingVertical: 10, width: '100%', flexDirection: 'row',
  },

  EditContent : {
    flex: 1, justifyContent : 'center',
  },

  EditContentText : {
    color: 'black',
    textAlign : 'center',
  },

  ReplyBlockDetailStaus : {
    borderColor: C.header,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    // backgroundColor : 'blue',
    justifyContent: 'space-between',
  },

  StatusElement : {
    flex: 1,
    // backgroundColor: 'yellow',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  StatusText: {
    textAlign : 'center',
    color: 'black',
  },

  ReplyBlockDetailReplies : {
    // flexDirection : 'row',
    margin: 20,
    height: 400,
  },

  ReplyWrapper : {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ReplyUser : {
    flex: 0.15,
    justifyContent: 'center',
    alignItems: 'center',

  },

  ReplyContent: {
    flex: 0.85,
    flexDirection: 'column',
  },

  ReplyContentName : {
    fontWeight: 'bold',
    paddingRight: 10,
  },

  ReplyContentInfo : {
    flexDirection : 'row',
  },

  ReplyEdit : {
    flexDirection: 'row'
  },

  ReplyInput : {
    zIndex: 15,
    margin: 10,
  },

  ReplyInputText : {
    backgroundColor: C.header,
    color: 'black',
    textAlign: 'center',
  },


});
