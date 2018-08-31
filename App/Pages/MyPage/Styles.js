import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
    Container : {

    },

    activityIndicator : {
      position: 'absolute',
      width: D.Width(100),
      height: D.Height(100) - 60,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    },

    Wrapper: {

    },

    Top : {
      backgroundColor: 'black',
      padding: 30,
    },

    UserInfo : {
      flexDirection : 'row',
      flex: 1,
    },

    UserInfoImage: {
      flex: 0.4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: C.white,
    },

    mainImage: {
      // backgroundColor: 'transparent',
      width: '100%',
      height: D.Width(30),
      // height: '100%',
    },

    UserInfoId : {
      flex: 0.6,
      paddingLeft: 15,
    },

    id : {
      fontSize: D.FontSize(2),
      fontWeight : 'bold',
      color: C.white,
    },

    UserInfoFollow: {
      flexDirection: 'row',
    },

    follow: {
      color: C.white,
    },

    UserDesc : {
      marginTop: 20,
    },

    description : {
      color: C.white,
      textAlign : 'center',
    },

    descriptionOnEdit : {
      backgroundColor: C.white,
      color : 'black',
      textAlign: 'center',
    },

    Tab : {
      backgroundColor: C.header,
      justifyContent: 'center',
      padding: 10,
      flex: 1,
    },

    TabContainer : {
      backgroundColor : 'white',
      width: '50%',

    },
    TabText: {
      borderBottomColor: 'transparent'
    },
    ContentAddWrapper : {
      flexDirection: 'row',
      flex: 1,
      backgroundColor : 'white',
      marginBottom: 5,
      padding: 20,
    },

    ContentAddLeft : {
      flex: 0.7,
    },

    ContentAddTitle : {

    },

    titleAdd : {
      fontSize: D.FontSize(2),
      fontWeight: 'bold',
    },

    ContentAddInfo : {
      flexDirection : 'row',
    },

    infoAdd : {
      color: C.header,
      fontSize: D.FontSize(1.3)
    },

    ContentAddContent : {

    },

    contentAdd : {
      fontSize: D.FontSize(1.7),
      fontWeight : 'bold',
    },

    ContentAddRight : {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'center',
    },

    contentAddImage : {
      width: D.Width(20),
      height: D.Width(20),
    },

    ContentIssueWrapper : {
      flexDirection: 'row',
      flex: 1,
      backgroundColor : 'white',
      marginBottom: 5,
      padding: 20,
    },

    ContentIssueTop : {

    },

    ContentIssueTitle : {
      flexDirection : 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    titleIssue : {
      fontSize: D.FontSize(2),
      fontWeight: 'bold',
      paddingRight: 5,
    },

    infoIssue : {
      color: C.header,
      fontSize: D.FontSize(1.3),
      paddingRight: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },

    ContentIssueContent : {

    },

    contentIssue : {
      fontSize: D.FontSize(1.7),
      fontWeight : 'bold',
    }


});
