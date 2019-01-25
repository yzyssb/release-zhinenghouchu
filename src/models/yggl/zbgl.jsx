/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-04-08 17:14:50
 * @version $Id$
 */

import {config, httpPost} from '../../services/HttpService';
import message from 'antd/lib/message';


export default {
    namespace: 'zbgl',
    state: {
        page: 1,
        size: 10,
        list: [],
        total: 0,
        modalVisible: false,
        powerModalVisible: false,

        commentTypes: [1, 2, 3],
        // add or edit
        record: {},
        checkedPowerCodes: [],
        // 云端权限
        powers: [],
        // pos权限
        posPowers: [],

        checkedPosKeys:[],

        checkedKeys:[],

        //删除id
        deleteId:'',
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/zbgl') {
                    dispatch({
                        type: 'queryGroup',
                        payload: location.query,
                    });
                    dispatch({type: 'getPowers', payload: {}});
                }
            });
        },
    },

    effects: {

        * getPowers({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const userGroupUrl = config.allPowerUrl;
            const {data} = yield call(httpPost, userGroupUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    const convert = (data) => {
                        data.map((item) => {
                            if (item.children) {
                                convert(item.children);
                            }
                            item.key = item.code;
                            item.title = item.name;
                        })
                    };
                    if(data.data) {
                        convert(data.data[0]);
                        convert(data.data[1]);

                        yield put({
                            type: 'updatePayload',
                            payload: {
                                powers: data.data[1],
                                posPowers: data.data[0],
                            },
                        });
                    }
                }else{
                    message.error(data.msg)
                }
            }

        },

        * queryGroup({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            payload.size = yield select(({zbgl}) => zbgl.size);
            let page = yield select(({zbgl}) => zbgl.page);
            payload.offset = (page - 1) * payload.size;
            // payload.condition = "string";
            const {data} = yield call(httpPost, config.userGroupUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    //console.log(data)
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            list: data.data,
                            total: data.totalCount,
                            current: data.pageNo,
                        },
                    });
                }else{
                    message.error(data.msg)
                }
            }

        },
        * addGroup({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const userGroupAddUrl = config.userGroupAddUrl;
            let record = yield select(({zbgl}) => zbgl.record);
            record.eraseLimit = record.eraseLimit *100;
            record.powers = yield select(({zbgl}) => zbgl.checkedPowerCodes);
            const {data} = yield call(httpPost, userGroupAddUrl, record);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalVisible: false,
                            page: 1,
                        }
                    });
                    yield put({type: 'queryGroup', payload: {}});
                }else{
                    message.error(data.msg)
                }
            }
        },
        * deleteGroup({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let deleteGroupId = yield select(({zbgl}) => zbgl.deleteId);

            const userGroupDeleteUrl = config.userGroupDeleteUrl + deleteGroupId;
            const {data} = yield call(httpPost, userGroupDeleteUrl, payload)
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({type: 'queryGroup', payload: {}});
                }else{
                    message.error(data.msg)
                }
            }
        },

        * getGroup({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const userGroupGetUrl = config.userGroupGetUrl;

            let powers = yield select(({zbgl}) => zbgl.powers);
            let posPowers = yield select(({zbgl}) => zbgl.posPowers);

            const {data} = yield call(httpPost, userGroupGetUrl + payload.id, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let record = data.data;
                    // to str
                    record.powerCodeList = record.powerCodeList.map((item) => {
                        return "" + item
                    });

                    let selectPower = [];
                    record.powerCodeList.map((i)=>{

                        powers.map((j)=>{

                            if (i == j.key){

                                selectPower.push(i);
                            }

                            if (j.children && j.children.length >0 ){
                                j.children.map((k)=>{

                                    if (i == k.key){
                                        selectPower.push(i);
                                    }
                                })
                            }
                        })

                    })

                    let selectPosPower = [];
                    record.powerCodeList.map((i)=>{

                        posPowers.map((j)=>{

                            if (i == j.key){

                                selectPosPower.push(i);
                            }

                            if (j.children && j.children.length >0 ){
                                j.children.map((k)=>{

                                    if (i == k.key){
                                        selectPosPower.push(i);
                                    }
                                })
                            }
                        })

                    })

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            record: record,
                            checkedKeys:selectPower,
                            defaultKeys:selectPower,
                            checkedPosKeys:selectPosPower,
                            defaultPosKeys:selectPosPower,
                        }
                    });
                }else{
                    message.error(data.msg)
                }
            }
        },
        * updataGroup({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            payload.powers = yield select(({zbgl}) => zbgl.checkedPowerCodes);
            payload.eraseLimit = payload.eraseLimit*100;
            const userGroupUpdateUrl = config.userGroupUpdateUrl;
            const {data} = yield call(httpPost, userGroupUpdateUrl + payload.id, payload)
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalVisible: false,
                            page: 1,
                        }
                    });
                    yield put({type: 'queryGroup', payload: {}});
                }else{
                    message.error(data.msg)
                }
            }
        }
    },
    reducers: {
        updatePayload(state, action) {
            return {
                ...state, ...action.payload,
            };
        },

    }
}