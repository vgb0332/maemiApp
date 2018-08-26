import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: C.white,
    },

    activityIndicator : {
      position: 'absolute',
      width: D.Width(100),
      height: D.Height(100) - 60,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    },

    tags: {
      flexDirection:'row',
      borderBottomColor: C.header,
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',

    },

    tagsTitle : {
      fontWeight: 'bold',
      flex: 0.2,
      textAlign: 'center',

    },

    issueTitle: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    titleInput : {
      textAlign: 'center',
      color: '#000',
      fontWeight: 'bold',
      fontSize: D.FontSize(3),
    },

    issueImage : {
      width: D.Width(90),
      height: D.Width(70),
      margin: D.Width(5),
    },

    issueContent: {
      flex: 1,
      marginHorizontal:10,
      // borderWidth: 1,
      // borderColor: 'black',

    },

    contentInput : {
      textAlign: 'center',
      height: D.Height(30),
    },

    issueExtra : {
      // position: 'absolute',
      // bottom : 0,
      // width: D.Width(100),
      // height: D.Height(5),
      flexDirection: 'row',
      paddingHorizontal: 10,
      // borderWidth: 1,
      // borderColor: 'blue',
      // justifyContent: 'center',

    },

    issueTime : {
      alignItems: 'center',
      flexDirection : 'row',
    },

    issueLocation : {
      alignItems: 'center',
      flexDirection : 'row',
    }

});
