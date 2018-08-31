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
    // marginHorizontal: 10,
  },
  ContainerWrapper : {
    padding: 20,
  },
  Status : {
    flexDirection : 'row',
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
    padding: D.Width(5),
    paddingTop: 0,
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
    backgroundColor:C.header,
    padding:5,
    marginRight:5,
    marginBottom: 5
  },
  MainImage: {
    flexDirection: 'row'
  },
  MainImageImage : {
    width: D.Width(55),
    height: D.Width(40),
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
    marginRight:5,
    width:D.Width(40),
    height:D.Width(40)
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
