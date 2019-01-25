/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-04-08 17:14:50
 * @version $Id$
 */

import {httpPost} from '../../services/HttpService';
import {config} from '../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';


export default {
    namespace: 'yggl',
    state: {
        restaurantId: 1,
        commentTypes: [1, 2, 3],
        // 分组
        groupList: [],
        id: '',
        // add or edit
        record: {},
        modalVisible: false,

        condition: "",
        page: 1,
        size: 10,
        total: 0,
        current: 10,
        list: [],
        //删除的id
        deleteId:'',
        isResetForm:true
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/yggl') {
                    dispatch({
                        type: 'queryWatiers',
                        payload: location.query,
                    });
                    dispatch({
                        type: 'queryGroupList',
                        payload: location.query,
                    });
                }
            });
        },
    },

    effects: {

        * queryGroupList({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const userWaiterGroupsUrl = config.userWaiterGroupsUrl;
            const {data} = yield call(httpPost, userWaiterGroupsUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            groupList: data.data,
                        }
                    });
                }else{
                    message.error(data.msg)
                }
            }

        },

        * queryWatiers({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const staffUrl = config.userWaitersListUrl;
            let page = yield select(({yggl}) => yggl.page);
            payload.size = yield select(({yggl}) => yggl.size);
            payload.offset = (page - 1) * payload.size;
            payload.condition = yield select(({yggl}) => yggl.condition);
            const {data} = yield call(httpPost, staffUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            list: data.data,
                            total: data.totalCount,
                        }
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },
        * addWatiers({payload}, {select, call, put}) {
            const userWaiterAddUrl = config.userWaiterAddUrl;
            const {data} = yield call(httpPost, userWaiterAddUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            condition: "",
                            size: 10,},
                    });
                    yield put({
                        type: 'queryWatiers',
                        payload: {},
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },
        * deleteWatiers({payload}, {select, call, put}) {
            let deleteUserId = yield select(({yggl}) => yggl.deleteId);
            const userWaiterDeleteUrl = config.userWaiterDeleteUrl + deleteUserId;

            const {data} = yield call(httpPost, userWaiterDeleteUrl, payload)
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(data)
                    yield put({
                        type: 'queryWatiers',
                        payload: {},
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },
        * getWatiers({payload}, {select, call, put}) {
            const userWaiterGetUrl = config.userWaiterGetUrl + payload.id;
            const {data} = yield call(httpPost, userWaiterGetUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let record = data.data;
                    record.waiterRealName = record.realName;
                    record.waiterUserName = record.userName;
                    record.waiterUserName = record.userName;
                    record.password = "";
                    record.groupId = record.powerGroup;
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            record: record,
                            modalVisible: true
                        },
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },

        * updateWatiers({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.userWaiterUpdateUrl + payload.id, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            condition: "",
                            size: 10,},
                    });
                    yield put({
                        type: 'queryWatiers',
                        payload: {},
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },
    },
    reducers: {
        updatePayload(state, action) {
            return {
                ...state, ...action.payload,
            };
        },

    }
}