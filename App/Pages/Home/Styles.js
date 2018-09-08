import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        // width: '100%',
        // height: '100%',
        // paddingLeft: D.Width(5),
        // paddingRight: D.Width(5),
        // paddingTop: D.Width(5),
        // margin: D.Width(5),
        flexDirection: 'column',
        backgroundColor: C.header,
    },
    flagButton: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 10
    }
});
