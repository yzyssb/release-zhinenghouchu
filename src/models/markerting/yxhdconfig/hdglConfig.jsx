import {httpPost} from '../../../services/HttpService';
import {config} from '../../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';


export default {
    namespace: 'hdglConfig',
    state: {
        total: 0, //数据总条数,默认初始为10条
        current: 1, //当前页码
        page: 1, //第几页
        size: 10, //请求行数
        viewVisible: false, //控制活动管理列表页显示详情的modal
        filterConditions: {      //列表页初始化过滤条件
            couponName: "",  // 活动名字,
            state: "",  //活动状态 ,
        },
        hdlgListData: [],
        hdlgListDetail: {},
         formatDate: function (nows) {  
             var date = new Date(nows);  
            var y = date.getFullYear();    
            var m = date.getMonth() + 1;    
            m = m < 10 ? ('0' + m) : m;    
            var d = date.getDate();    
            d = d < 10 ? ('0' + d) : d;    
            var h = date.getHours();  
            h = h < 10 ? ('0' + h) : h;  
            var minute = date.getMinutes();  
            var second = date.getSeconds();  
            minute = minute < 10 ? ('0' + minute) : minute;    
            second = second < 10 ? ('0' + second) : second;   
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
        }

    },
    subscriptions: { 
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/hdgllist') {

                    // 页面加载调用列表数据
                    dispatch({
                        type: 'query',
                        payload: {},
                    });

                    dispatch({
                        type: 'yxhdConfig/getFoodList',
                        payload: {},
                    });

                    // 请求门店列表数据
                    dispatch({
                        type: 'yxhdConfig/getStoreList',
                        payload: {},
                    });

                }


            });
        },

    },

    effects: {
        //请求列表数据,按条件请求列表数据都走这一个接口
        * query({payload}, {select, call, put}) {
            // 获取请求参数
              let page=yield select(({hdglConfig}) => hdglConfig.page)
            payload.size =yield select(({hdglConfig}) => hdglConfig.size)
            payload.offset = (page-1)*payload.size;  
            payload.name = yield select(({hdglConfig}) => hdglConfig.filterConditions.couponName);
            payload.status = yield select(({hdglConfig}) => hdglConfig.filterConditions.state);
            const {data} = yield call(httpPost, config.activityQueryUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            hdlgListData: data.data,
                            total: data.totalCount 
                        }
                    }); 
                } else {
                    message.error(data.msg);
                    // console.log(data.msg);
                } 
            }
        },
        * activityDetail({payload}, {select, call, put}) {
            // 获取请求参数

            const {data} = yield call(httpPost, config.activityDetailUrl + payload.id, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            hdlgListDetail: data.data,
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        * activityOpenClose({payload}, {select, call, put}) {
            // 获取请求参数
            const {data} = yield call(httpPost, config.activityOpenCloseUrl +payload.id+'/'+payload.type, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                      type: 'query',
                        payload: {},
                    });
                } else {
                    message.error(data.msg);
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