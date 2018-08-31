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
    margin: 20,
    backgroundColor: 'white',
    flexDirection: 'column',
  },

  ReplyBlockDetailHeader : {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },

  ReplyBlockDetailTag : {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  Tag : {
    backgroundColor:C.header,
    padding:5,
    marginRight:10,
    marginBottom: 10
  },

  ReplyBlockDetailImage : {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  MainImage : {
    width: D.Width(50),
    height: D.Width(50),
  },

  ReplyBlockDetailContent : {
    padding: 10,
  },

  MainContent : {
    textAlign: 'center',
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
    paddingBottom: 5,
    justifyContent: 'space-between',
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

  ReplyInput : {
    backgroundColor: 'white',
    zIndex: 15,
  }


});
