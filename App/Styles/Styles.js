import * as StyleSheet from './StyleSheet';
import * as D from './Dimensions';
import * as C from './Colors';

export const StylesCommon = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: C.background,
    },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: C.header,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ios: {
      height: 70,
      marginTop: 20,
    },
    android: {
      height: 70,
    },
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
    modalContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor:'rgba(0, 0, 0, 0.2)'
    },
});
