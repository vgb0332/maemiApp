import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';

const styles = {
  Container : {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: D.Height(2)
  },
  Status : {
    wrap: {flexDirection: 'row'},

    id: {
      fontWeight: 'bold',
      color: '#000',
      padding: 10,
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
      fontWeight: 'bold',
      fontSize: D.FontSize(3),
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
    wrap : { flexDirection: 'column' },

    image : {
      width: D.Width(100),
      height: D.Width(80),
      marginHorizontal: 10,
    },
  },

  MainContent : {
    wrap: { marginVertical: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },

    content : {
      textAlign: 'center',
      // paddingLeft:10
    },
  },

  Replies: {
    wrap : { flexDirection:'row', paddingVertical: 10 },
    reply: {
      marginRight:5,
      width:D.Width(40),
      height:D.Width(40)
    },
  },


}

export default styles;
