import {
    StyleSheet,
} from 'react-native';
import * as D from '../../Styles/Dimensions';
import * as C from '../../Styles/Colors';

export default StyleSheet.create({
  TabContainer: {
    flexDirection : 'row',
  },

  Tab: {
    paddingVertical: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
    borderWidth: 2,
    borderColor: 'white',
  },

  TabText: {
    flex: 1,
    color: 'black',
    textAlign: 'center'
  },

  BodyContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: D.Width(6),
    backgroundColor: 'rgb(245,245,245)'
  }
});
