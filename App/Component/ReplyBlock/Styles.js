import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';

const styles = {
  Container : {
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 20,
    // marginBottom: D.Height(2),
    // shadowColor: '#000',
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 1,
    // shadowRadius: 2,
    // elevation: 3,
    zIndex: 5,
    borderWidth: 1,
    // borderRadius: 2,
    borderColor: C.header,
    // padding: 10,
  },
  Status : {
    wrap: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10},

    id: {
      fontWeight: 'bold',
      color: '#000',
      padding: 10,
      fontSize: D.FontSize(2),
    },
    date: {
      padding: 10,
      color: '#000',
    },
    location : {
      padding: 10,
      color: '#000',
    }
  },

  Title : {
    wrap : {padding: D.Width(5)},

    text: {
      color: '#000',
      // fontWeight: 'bold',
      // fontSize: D.FontSize(3),
    }
  },

  Tags: {
    wrap : {
      flexWrap: 'wrap',
      flexDirection:'row',
      paddingLeft:D.Width(5),
      paddingRight:D.Width(5),
    },

    tag: {
      backgroundColor:C.header,
      padding:5,
      marginRight:10,
      marginBottom: 10
    }
  },

  MainImage : {
    wrap : { flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: D.Width(5),
            },

    image : {
      width: D.Width(60),
      height: D.Width(50),
    },
  },

  MainContent : {
    wrap: { marginVertical: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },

    content : {
      textAlign: 'center',
      // paddingLeft:10
    },
  },

  Edit: {
    rap : { flexDirection:'row', paddingVertical: 10, borderTopWidth: 1, borderColor: C.header },
    view: { flex: 1, justifyContent: 'center'},
    text : {
      color: 'black',
      textAlign: 'center',
    },
  },

  Footer: {
    wrap : { flexDirection:'row', paddingVertical: 10, borderTopWidth: 1, borderColor: C.header },
    content: {
      flex: 1,
    },
    text: {
      textAlign: 'center',
      color: 'black',
    }
  },


}

export default styles;
