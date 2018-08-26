export default {

    url: 'http://52.79.128.87:3005',

    cert : "asldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134!@#!@#lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXaslaskldhjfklashjdolfjaosiur092834092384ulkhsdjlvmnzxc,mvnkszjdhfoqiw3yu09r8127304598uqwelkfnal,xmcnv,znxckvn2o398470w9d8g-89bpkwnm4,5merfgdf0-134!@#!@#lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<NLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134!@#!@#lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134!@#!@#lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134!@#!@#lrn9fasldjkhf12409uaslkjllkn23ADFSDFKJHVKJHKL<MNLKNKLJLKXCIOL98790218374LKZXmvlkasjdasdklj0-134!@#!@#lrn9f",

    /////////////// Authentification /////////////
    POST_AUTH_LOGIN: '/API/LOGIN', //{'idText': '아이디 (4자 이상, 20자 이하)','password': '비밀번호',}
    POST_AUTH_REGIST: '/API/REGIST',

    /////////////// Block /////////////////
    POST_BLOCK_ISSUE: '/API/CREATE_ISSUEBLOCK',
    POST_BLOCK_REPLY: '/API/CREATE_REPLYBLOCK',
    SAVE_BLOCK: '/API/CREATE_SAVE',
    GET_BLOCK_ISSUE: '/API/SPREAD_BLOCK',
    GET_DETAIL_BLOCK: '/API/DETAIL_BLOCK',

    /////////////// USER ///////////////////////
    GET_USER_PROFILE: '/API/USER_PROFILE',
    UPDATE_USER_PROFILE: '/API/USER_PROFILE_UPDATE',

    /////////////// Scrap //////////////////////
    SCRAP_BLOCK : '/API/BLOCK_SCRAP',
    SCRAP_CHECK: '/API/BLOCK_SCRAP_CHECK',
    SCRAP_CANCEL: '/API/BLOCK_SCRAP_CANCEL',

    /////////////// Follow /////////////////////
    USER_FOLLOW: '/API/FOLLOW',
    USER_UNFOLLOW: '/API/UNFOLLOW',
    USER_FOLLOW_CHECK: '/API/FOLLOW_CHECK',

    /////////////// Vote ///////////////////////
    VOTE_UP: '/API/VOTE_UP',
    VOTE_DOWN: '/API/VOTE_DOWN',
    VOTE_CHECK: '/API/VOTE_CHECK',
    VOTE_UP_CANCEL: '/API/VOTE_UP_CANCEL',
    VOTE_DOWN_CANCEL: '/API/VOTE_DOWN_CANCEL',

    ///////////// Upload ////////////////////////
    UPLOAD_IMAGE: '/API/IMAGE_UPLOAD',
};
