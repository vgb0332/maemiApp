import * as D from '../../Styles/Dimensions';
import *  as C from '../../Styles/Colors';

const styles = {
  Container : {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: D.Height(2)
  },
  Status : {
    wrap: {flexDirection: 'row', marginLeft:D.Width(5)},

    id: {
      fontWeight: 'bold',
      color: '#000',
      padding: 10,
    },
    date: {
      // padding: 10,
      paddingLeft: 0,
      paddingRight: 10,
      paddingVertical: 10,
      color: '#000',
    },
    location : {
      padding: 10,
      color: '#000',
    }
  },

  Title : {
    wrap : {paddingVertical: 10,},

    text: {
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: D.FontSize(4),
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
      padding:2,
      marginRight:5,
      marginBottom: 5,
      fontSize: D.FontSize(1.5),
      color: '#C0C0C0',
    }
  },

  MainImage : {
    wrap : { flexDirection: 'column' },

    image : {
      width: '100%',
      height: D.Width(80),

      // marginHorizontal: 10,
    },
  },

  MainContent : {
    wrap: { marginTop: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },

    content : {
      textAlign: 'center',
      color: 'black',
      lineHeight: 20,
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
