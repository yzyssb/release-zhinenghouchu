import {config, httpPost} from '../../services/HttpService';

import moment from 'moment';
import message from 'antd/lib/message';
import {linkOrigin} from "../../services/HttpService";
const todayStart = moment().startOf("day");
// const todayStart = moment().subtract(7, 'days');
const todayEnd = moment().endOf("day");

export default {
    namespace: 'changeWorkTable',
    state: {
        linkOrigin:linkOrigin,
        resIdOrgNameMap:{},
        restaurantIds: [],
        startTime: todayStart,
        endTime: todayEnd,
        list:[],
        total: 0,
        page: 1,
        size: 10,
        start:0,
        modalVisible:false,
        listValue:[],
        rowSelectionDataLs:[],
        static_days:'0',
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/jbxxb') {
                    dispatch({
                        type:'getparm',
                        payload:{},
                    });
                }
            });
        },
    },

    effects: {
        //导出

        * getOut({payload},{select, call, put}){
            let changeWorkTable = yield select(({changeWorkTable}) => changeWorkTable);
            payload.restaurantIds = changeWorkTable.restaurantIds;
            payload.startTime = new Date(changeWorkTable.startTime).getTime();
            payload.endTime = new Date(changeWorkTable.endTime).getTime();
            payload.resIdOrgNameMap = changeWorkTable.resIdOrgNameMap;
            const baseGetUrl = config.ExportJBForm;
            const {data} = yield call(httpPost, baseGetUrl, payload);


        },
        * stat({payload}, {select, call, put}) {
            let changeWorkTable = yield select(({changeWorkTable}) => changeWorkTable);
            payload.restaurantIds = changeWorkTable.restaurantIds;
            payload.startTime = new Date(changeWorkTable.startTime).getTime();
            payload.endTime = new Date(changeWorkTable.endTime).getTime();
            payload.resIdOrgNameMap = changeWorkTable.resIdOrgNameMap;
            payload.size = changeWorkTable.size;
            payload.start = changeWorkTable.start;
            const {data} = yield call(httpPost, config.changeWorkUrk, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                var listValue = data.data;
                listValue.map(function (i,j) {
                    i.index = j*changeWorkTable.start + 1;
                    return i;
                });
                yield put({
                    type: 'updatePayload',
                    payload: {
                        list: data.data,
                    }
                });
            }else{
                message.error(data.msg)
            }
        },
        * getparm({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.getStoreParm, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                var value = data.data;
                var list = value.shopList;
                // var parmList = [];
                // var parmMap = {};
                // list.forEach(function (value) {
                //     parmList.push(value.id);
                //     parmMap[value.id] = value.name;
                // });
                /*yield put({
                    type: 'updatePayload',
                    payload: {
                        //restaurantIds: parmList,
                        //resIdOrgNameMap:parmMap,
                        listValue:list,
                    }
                });*/
                var restaurantList=[],restaurantIds=[],resIdOrgNameMap={},restaurantNames=[]
                data.data.shopList.forEach((value,index)=>{
                    restaurantIds.push(value.id)
                    resIdOrgNameMap[value.id]=value.name
                    restaurantNames.push(value.name)
                })
                yield put({
                    type:'updatePayload',
                    payload:{
                        listValue:list,
                        restaurantIds:restaurantIds,
                        resIdOrgNameMap:resIdOrgNameMap,
                        restaurantNames:restaurantNames
                    }
                })
                yield put({
                    type: 'stat',
                    payload: {

                    }
                });
            }else{
                message.error(data.msg)
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