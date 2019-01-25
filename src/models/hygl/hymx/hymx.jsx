import {config, httpPost} from "../../../services/HttpService";
import message from "antd/lib/message/index";

/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-04-08 17:14:50
 * @version $Id$
 */

//将url中参数（或公共参数）转换为json对象
function getUrlParamsObj(href) {
    if (href.indexOf("?") == -1) {
        return {};
    }
    href = decodeURIComponent(href);
    var queryString = href.substring(href.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var all = {};
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        all[paraName] = paraValue;
    }
    return all;
}

export default {
    namespace: 'hymx',
    state: {
        data: [],
        xfjlData: [],
        jfqsData: [],
        //开始时间
        startDate: '',
        //结束时间
        endDate: '',
        //规则名称
        ruleName: '',
        hymxVisible: false,
        storeName: '',

        offset:0,
        size:10,
        total:0,
        current:0,

        offset1:0,
        size1:10,
        total1:0,
        current1:0,


        //积分清算参数
        searchWhere: {
            regStartTime: '',
            regEndTime: '',
            vipStartTime: '',
            vipEndTime: '',
            isBackCard: '0',
            cardCode: '',
            mobile: '',
            nickname: '',
            storeName: '',
            startDate: '',
            endDate: '',
            startTime:'',
            endTime:'',
            page:'',
            rows:'',


        },
        IsExport: '',
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/HymxPage') {
                    dispatch({
                        type: 'listConsume',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {
        //
        //消费列表
        * listConsume({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading',
            });
            payload.offset = yield select(({ hymx }) => hymx.offset);
            payload.size = yield select(({ hymx }) => hymx.size);
            const url = config.consumeList;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if (data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type: 'getConsumeListSuccess',
                    payload: {xfjlData: data.data.list,total:data.data.page.total_count}

                });
            } else {
                yield put({type: 'hideLoading'});
            }
        },
        //购卡记录
        * VipCardList({payload}, {select, call, put}) {

            yield put({
                type: 'showLoading',
            });
            payload.offset = yield select(({ hymx }) => hymx.offset1);
            payload.size = yield select(({ hymx }) => hymx.size1);
            const url = config.getVipCardList;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if (data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type: 'getVipCardListSuccess',
                    payload: {data: data.data.list,total1:data.data.page.total_count}

                });
            } else {
                yield put({type: 'hideLoading'});
            }
        },
        //积分清算
        * scoreList({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading',
            });
            const url = config.getScoreList;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if (data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type: 'getScoreListSuccess',
                    payload: {jfqsData: data.data.list}

                });
            } else {
                yield put({type: 'hideLoading'});
            }
        },
    },
    reducers: {
        updatePayload(state, action) {
            return {
                ...state, ...action.payload,
            };
            console.log(state.searchWhere)
        },
        //消费记录列表
        getConsumeListSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },
        //购卡记录列表
        getVipCardListSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },
        //积分清算
        getScoreListSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },
        /*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
        },
    }
}