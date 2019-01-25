import {config, httpPost} from '../../services/HttpService';
import moment from 'moment';
import {postExportFile} from "../../services/CommonService";
import message from 'antd/lib/message';
const todayStart = moment().startOf("day");
// const todayStart = moment().subtract(7, 'days');
const todayEnd = moment().endOf("day");

export default {
    namespace: 'payStat',
    state: {
        restaurantIds: [],
        // obj
        startTime: todayStart,
        endTime: todayEnd,

        // stat
        stat: {},
        list: [
        ],
        total: 0,
        page: 1,
        size: 10,
        static_days:'0'
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/fklxhzb') {
                    dispatch({
                        type: 'allStores',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {
        * allStores({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const {data} = yield call(httpPost, config.orgStoreAllUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                let idItem = {};
                data.data.shopList.map((item) => {
                    idItem[item.id] = item;
                });
                yield put({
                    type: 'updatePayload',
                    payload: {
                        all: data.data.shopList,
                        idItem: idItem,
                    }
                });


                var restaurantList=[],restaurantIds=[],resIdOrgNameMap={},restaurantNames=[]
                data.data.shopList.forEach((value,index)=>{
                    restaurantList.push(value)
                    restaurantIds.push(value.id)
                    resIdOrgNameMap[value.id]=value.name
                    restaurantNames.push(value.name)
                })
                yield put({
                    type:'updatePayload',
                    payload:{
                        restaurantList:restaurantList,
                        restaurantIds:restaurantIds,
                        resIdOrgNameMap:resIdOrgNameMap,
                        restaurantNames:restaurantNames
                    }
                })

                yield put({
                    type: 'list',
                    payload: {},
                });
                yield put({
                    type: 'stat',
                    payload: {},
                });
            }else{
                message.error(data.msg)
            }
        },
        * stat({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let payStat = yield select(({payStat}) => payStat);
            payload.restaurantIds = payStat.restaurantIds;
            payload.startTime = new Date(payStat.startTime).getTime();
            payload.endTime = new Date(payStat.endTime).getTime();
            const {data} = yield call(httpPost, config.payStatUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type: 'updatePayload',
                    payload: {
                        stat: data.data,
                    }
                });
            }else{
                message.error(data.msg)
            }
        },
        * list({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let payStat = yield select(({payStat}) => payStat);
            let store = yield select(({store}) => store);
            payload.size = payStat.size;
            payload.start = (payStat.page - 1) * payStat.size;
            payload.offset = (payStat.page - 1) * payStat.size;
            payload.restaurantIds = payStat.restaurantIds;
            payload.resIdOrgNameMap = {};
            payload.restaurantIds.map(item => {
                payload.resIdOrgNameMap[item] = payStat.idItem[item].name
            });
            payload.startTime = new Date(payStat.startTime).getTime();
            payload.endTime = new Date(payStat.endTime).getTime();
            const {data} = yield call(httpPost, config.payStatDetailUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
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
        },
        * _export({payload}, {select, call, put}) {
            let payStat = yield select(({payStat}) => payStat);
            let store = yield select(({store}) => store);
            payload.restaurantIds = payStat.restaurantIds;
            payload.resIdOrgNameMap = {};
            payload.restaurantIds.map(item => {
                payload.resIdOrgNameMap[item] = payStat.idItem[item].name
            });
            payload.startTime = new Date(payStat.startTime).getTime();
            payload.endTime = new Date(payStat.endTime).getTime();
            postExportFile(config.payStatExportUrl, payload, "付款类型汇总表.xlsx");
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