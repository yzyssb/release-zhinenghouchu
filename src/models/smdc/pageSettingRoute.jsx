import {httpPost} from '../../services/HttpService';
import {httpPostWXValue} from '../../services/HttpService';

import {config} from '../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';

export default {
    namespace: 'pageSettingRoute',
    state: {
        baseInfoFormRest: 0,
        baseInfo: {},
        loading: false,
        locationInfo: {},
        cityInfo: {},
        imgurl:'',
        activeTab:'fmsz',
        turnWxUrl:'',
        showAgree:"block",//是否显示同意授权
        showRemake:"none",//是否显示重新授权
        showImg:'',//显示的图片
        wxState:'0',//微信授权信息
        wxContent:"",//授权数据
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/smdcsz') {

                    dispatch({
                        type:'getImg',
                        payload:{},
                    });
                    
                }
            });
        },
    },

    effects: {

        //更新图片
        * sendImg({payload},{select, call, put}){
            let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
            const baseGetUrl = config.savePageImgUrl;
            payload.coverImageUrl = pageSettingRoute.imgurl;
            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (pageSettingRoute.imgurl == ''){
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                showImg: '',
                            }
                        });
                    }
                } else {
                    alert(data.msg);
                }
            }
        },

        //获取图片
       *getImg ({payload},{select, call, put}){
           let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
           const baseGetUrl = config.getPageImgUrl;
           const {data} = yield call(httpPost, baseGetUrl, payload);
           if (data) {
               if (data.code == config.MSGCODE_SUCCESS) {
                   yield put({
                       type: 'updatePayload',
                       payload: {
                           showImg: data.data.coverImageUrl,
                       }
                   });
               } else {
                   alert(data.msg);
               }
           }
       },

       //删除图片
       *deleteImg ({payload},{select, call, put}){
           let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
           const baseGetUrl = config.deletePageImgurl;
           const {data} = yield call(httpPost, baseGetUrl, payload);
           if (data) {
               if (data.code == config.MSGCODE_SUCCESS) {

               } else {
                   alert(data.msg);
               }
           }
       },

       *getWXState ({payload},{select, call, put}){
           let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
           const baseGetUrl = config.GetWXState;

           const {data} = yield call(httpPost, baseGetUrl, payload);
           if (data) {

               if (data.code == config.MSGCODE_SUCCESS) {
                   let agree = "";
                   let remake = "";
                   let content = "";
                   if (data.data.state == 0){
                       agree = "block";
                       remake = "none";
                       content = "";
                   }else {
                       agree = "none";
                       remake = "block";
                       if (data.data.state == 1){
                           content = "授权信息:"+data.data.name+"("+data.data.appid+")";
                       }else {
                           content = "授权信息:授权失败,您的公众号权限不足";
                       }
                   }
                   yield put({
                       type: 'updatePayload',
                       payload: {
                           wxState: data.data.state,
                           showAgree:agree,//是否显示同意授权
                           showRemake:remake,//是否显示重新授权
                           wxContent:content,
                       }
                   });
               } else {
                   alert(data.msg);
               }
           }
       },


       *getWX({payload},{select, call, put}){
           let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
           const baseGetUrl = config.NewGetWXUrl;

           const {data} = yield call(httpPost, baseGetUrl, payload);
           if (data) {

               if (data.code == config.MSGCODE_SUCCESS) {

                   yield put({
                       type: 'updatePayload',
                       payload: {
                           turnWxUrl: data.data.bindUrl,
                           activeTab:'fmsz'
                       }
                   });

               } else {
                   alert(data.msg);
               }
           }
       },

       *cancleWx ({payload},{select, call, put}){
           let pageSettingRoute = yield select(({pageSettingRoute}) => pageSettingRoute);
           const baseGetUrl = config.CancleWxUrl;

           const {data} = yield call(httpPost, baseGetUrl, payload);
           if (data) {

               if (data.code == config.MSGCODE_SUCCESS) {

                   yield put({
                       type: 'getWXState',
                       payload: {

                       }
                   });

               } else {
                   alert(data.msg);
               }
           }
       },

    },
    reducers: {
        updatePayload(state, action) {
            return {...state, ...action.payload,};
        },


    }
}