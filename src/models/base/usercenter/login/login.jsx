import { httpPostNoParam,httpPostByIds,httpPostWithParam } from '../../../../services/HttpService';
import { config } from '../../../../services/HttpService';
import { routerRedux } from 'dva/router';
import key from 'keymaster';
import Message from 'antd/lib/message';

//将url中参数（或公共参数）转换为json对象
function getUrlParamsObj(href) {
    if (href.indexOf("?") == -1){
        return {};
    }
    href = decodeURIComponent(href);
    var queryString = href.substring(href.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var all={};
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) { continue; }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        all[paraName]=paraValue;
    }
    return all;
}

export default{
    namespace:'login',
    state:{
        username:'',	// 用户名
        password:'',	// 密码
        captchaKey:'',	// 验证码key
        captchBase:'',	// base64图片地址
        msg:'',	// 错误信息
        captchstatus:'',// 验证码错误信息显示隐藏
        loadingstatus:'', // loading显示隐藏状态
        btnstatus:'true', // 按钮状态
        bok:'none',
        captchaId:'',
        modalVisible:false,

    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/login') {
                    dispatch({
                        type: 'queryLogin',
                        payload: location.query,
                    });
                }
            });
        },
    },

    effects:{
        // 登录按钮点击
        *queryLogin({ payload },{select,call,put}){

            // yield put({
            // 	type:'showLoading',
            // });
            //
            // payload.captchaKey=yield select(({ login }) => login.captchaKey);
            // // payload.captcha = 'lsls';
            // payload.captchaId = yield select(({ login }) => login.captchaId);
            // if(getUrlParamsObj(window.location.href).authCode){
            // 	const authCode = getUrlParamsObj(window.location.href).authCode;
            // 	payload.authCode = authCode.substring(0,authCode.lastIndexOf('#'));
            // }
            // 	const url = config.loginUrl;
            // 	const { data } = yield call(httpPostNoParam,url,payload);


            const url = config.getPermissionsUrl;
            const { data } = yield call(httpPostWithParam,url,{},3);

            if(data){
                if(data.code == config.MSGCODE_SUCCESS){

                    //一期先去掉权限
                    // 权限列表
                    //if(data.data.powers)
                    //{

                    // 用户名、token
                    yield put({
                        type:'account/initAccount',
                        payload:{
                            username:data.data.userName,
                            token:data.data.token,
                            userid:data.data.userId,
                            userType:data.data.userType,
                            companyId:data.data.companyId,
                            restaurantId:data.data.restaurantId,
                            phone:data.data.phone,
                        }

                    });

                    var mainmenu =  yield select(({ menu }) => menu.mainmenu);



                    yield put({
                        type:'menu/initData',
                        payload:{
                            permission:data.data.powers,

                        }
                    });


                    yield put({
                        type:'menu/queryRestaurantList',
                        payload:{

                        }
                    });

                }else{
                    Message.warn(data.msg);

                }
            }
        },

        *queryCaptchaCode({ payload }, {select, call, put}) {
            const url = config.captchaCodeUrl;
            const { data } = yield call(httpPostNoParam, url, payload);
            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'queryCaptchaCodeSuccess',
                        payload: {
                            captchaKey: data.captchaKey,
                            captchaId:data.data.captchaId,
                            code: data.code,
                            captchBase:data.data.base64,
                        },
                    });
                }
            }
        },



    },
    reducers:{

        showLoading(state,action){
            var loadingstatus = 'block';
            return  { ...state, ...action.payload,loadingstatus:loadingstatus};

        },
        hideLoading(state,action){
            var loadingstatus = 'none';
            return  { ...state, ...action.payload,loadingstatus:loadingstatus};

        },

        queryCaptchaCodeSuccess(state,action){
            var btnstatus = '';
            return  { ...state, ...action.payload,btnstatus:btnstatus};
        },

        failinfo(state,action){
            var captchstatus = 'block';
            return  { ...state, ...action.payload,captchstatus:captchstatus};

        },

        onblurSuccess(state,action){
            var captchstatus = 'none';
            return  { ...state, ...action.payload,captchstatus:captchstatus};

        },
        updatePayload(state, action) {

            return { ...state, ...action.payload };
        },
    }
}