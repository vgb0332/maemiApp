import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';

export default StyleSheet.create({
  Container : {
    backgroundColor: '#fff',
    // padding: 10,
    marginBottom: D.Height(2),
    marginTop: 0,
    // marginHorizontal: 10,
  },
  ContainerWrapper : {
    padding: 20,
  },
  Status : {
    flexDirection : 'row',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  StatusId : {
    fontWeight: 'bold',
    color: '#000',
    padding: 10,
  },
  StatusDate: {
    padding: 10,
    color: '#000',
  },
  StatusLocation : {
    padding: 10,
    color: '#000',
  },
  Title : {
    paddingHorizontal: D.Width(5),
    paddingVertical: 5,
    // paddingBottom: 0,
  },
  TitleText : {
    color: '#000',
    fontWeight: 'bold',
    fontSize: D.FontSize(3),
  },
  Tags : {
    flexWrap: 'wrap',
    flexDirection:'row',
    paddingLeft:D.Width(5),
    paddingRight:D.Width(5),
  },
  TagsTag : {
    // backgroundColor:C.header,
    padding:2,
    marginRight:5,
    // marginBottom: 5,
    fontSize: D.FontSize(1.5),
    color: '#808080',
  },
  MainImage: {
    paddingTop: 5,
    flexDirection: 'row'
  },
  MainImageImage : {
    width: D.Width(55),
    height: D.Width(40),
    borderWidth: 1,
    borderColor: C.header,
  },
  MainContent : {
    flex:1, paddingVertical: 10, justifyContent: 'center', alignItems: 'center',

  },
  MainContentContent : {
    textAlign: 'left',
    paddingLeft:10,
    color:'black',
  },
  Replies : {
     flex: 1,flexDirection:'row', paddingVertical: 10
  },
  RepliesReply : {
    borderWidth: 1,
    borderColor: C.header,
    width:D.Width(30),
    height:D.Width(25)
  },
  Bottom : {
    flexDirection:'row', borderColor: C.header, borderTopWidth: 1, borderBottomWidth: 0,
  },
  BottomShareWrapper : {
    flex:0.5, borderColor: C.header, borderRightWidth:1, borderLeftWidth: 1, paddingVertical: 10
  },
  BottomShareWrapperShare : {
    textAlign: 'center', fontSize:D.FontSize(2), color:'black',
  },
  BottomShareAddNewsWrapper : {
    flex:0.5, paddingVertical: 10, borderColor: C.header, borderRightWidth:1,
  },
  BottomShareAddNewsWrapperAddNews : {
    textAlign: 'center', fontSize:D.FontSize(2), color:'black',
  }
});
