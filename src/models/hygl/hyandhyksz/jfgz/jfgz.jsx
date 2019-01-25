import {config, httpPost} from "../../../../services/HttpService";
import message from "antd/lib/message/index";
import moment from "moment";

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
    namespace: 'jfgz',
    state: {
        data: [],
        tksqData: [],
        hydjData: [],
        tkshData: [],
        //门店列表
        storeList: [],
        //已选择门店列表
        checkedStoreList: [],
        //消费记录
        xfjlData: [],
        //开始时间
        startDate: '',
        //结束时间
        endDate: '',
        //规则名称
        ruleName: '',
        jfgzVisible: false,
        hydjVisible: false,
        sqtkVisible: false,
        applyAdmin: '',
        //根据手机号查询会员信息
        mobile: '',
        //上传审核资料所需的图片地址
        fileInfo:'',
        //等级id
        levelId: '',
        //会员等级新增修改判断
        hydjAdd: false,
        //积分规则新增修改判断
        jfgzAdd: false,
        //规则id
        ruleId: '',
        //规则名字
        rule_name:'',
        //适用客户端
        client:'1',
        //适用会员等级
        level_id:'',
        //选择的门店id
        store_id:'',
        //积分是否可用于消费
        isToMoney:'',

        levelInfo: {
            level_name: '',
            level_pay: '',
        },
        baseInfo: {
            valid_day: 0,
            limit_pay: '',
            level_num: '',
            is_ck: 0,
            explain: '',
        },
        searchWhere: {
            mobile: '',
            cardCode: '',
            opType: '',
            opDate: '',
            opAdmin: '',
            vipTime: '',
            backCardType: '',
            applyStartTime: '',
            applyEndTime: '',
            applyAdmin: '',

        },
        scoreRule: {
            consume_score: '',
            birth_score: '',
            first_score: '',
            second_score: '',
            share_score: '',

        },
        extraRule: {
            sendPay: 0,
            scorePay: 0,
            couponPay: 0,
            scoreLifeVal: moment() .format('YYYY-MM-DD HH:mm:ss'),
            scoreLifeType:1,

        },
        checkedList: [],
        indeterminate: false,
        checkAll: false,
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/hyandhyksz') {
                    dispatch({
                        type: 'listScoreRule',
                        payload: {},
                    });
                    //查看门店列表，并保存起来,在添加积分规则的时候需要
                    dispatch({
                        type: 'queryStoreList',
                        payload: {},
                    });
                    //查看会员等级列表，并保存起来，在添加积分规则的时候需要
                    dispatch({
                        type: 'listVipLevel',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {
        //
        * listScoreRule({payload}, {select, call, put}) {
            const url = config.getListScoreRule;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 积分规则列表
                    yield put({
                        type: 'updatePayload',
                        payload: {data: data.data}

                    });
                } else {
                    yield put({type: 'hideLoading'});

                }
            }
        },
        //删除1条积分规则
        * deleteScoreRule({payload}, {select, call, put}) {

            const url = config.getDelScoreRule;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 积分规则列表
                    yield put({
                        type: 'listScoreRule',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //添加积分规则
        * addScoreRule({payload}, {select, call, put}) {

            const url = config.getAddScoreRule;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 积分规则列表
                    yield put({
                        type: 'listScoreRule',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //修改积分规则
        * modifyScoreRule({payload}, {select, call, put}) {

            const url = config.getModifyScoreRule;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {


                    // 积分规则列表
                    yield put({
                        type: 'listScoreRule',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //查看积分返利规则详细信息
        * scoreRule({payload}, {select, call, put}) {
            const url = config.getScoreRule;
            const storeList=yield select(({jfgz}) => jfgz.storeList);
            // let checkedStoreList=yield select(({jfgz}) => jfgz.checkedStoreList);
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    var storeIds=data.data.store_id
                    var arrayStoreIds=storeIds.split(",");
                    // checkedStoreList=arrayStoreIds;

                    // yield put({
                    //     type: 'updatePayload',
                    //     payload: {
                    //
                    //     },
                    // });
                    // for (let i = 0; i < storeList.length; i++) {
                    //     for (let j = 0; j < arrayStoreIds.length; j++) {
                    //         if(arrayStoreIds[j]==storeList[i].value){
                    //             checkedStoreList.push({
                    //                 label:storeList[i].label,
                    //                 value:storeList[i].value,
                    //             })
                    //         }
                    //     }
                    // }
                     console.log(arrayStoreIds);
                    yield put({
                        type: 'updatePayload',
                        payload: {rule_name:data.data.rule_name,
                            store_id:data.data.store_id,
                            level_id:data.data.level_id,
                            client:data.data.client,
                            scoreRule:data.data.scoreRule,
                            extraRule:data.data.extraRule,
                            checkedStoreList: arrayStoreIds,
                        }
                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //查看门店列表
        *queryStoreList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const storeListUrl = config.storeListUrl;

            const { data } = yield call(httpPost,storeListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    var options=[]
                    data.data.shopList.map(function(val,i){
                        options.push({
                            label:val.name,
                            value:val.id +'',
                        })

                    })
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            storeList: options,
                        },
                    });
                }else{
                    console.log(data.msg);
                }
            }
        },
        //会员等级列表
        * listVipLevel({payload}, {select, call, put}) {

            // yield put({
            //     type: 'showLoading',
            // });

            const url = config.getListVipLevel;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    //
                    yield put({
                        type: 'updatePayload',
                        payload: {hydjData: data.data},
                    });
                    yield put({
                        type: 'hideLoading',
                    })
                } else {

                    yield put({type: 'hideLoading'});
                }
            }
        },
        //增加会员等级
        * addVipLevel({payload}, {select, call, put}) {

            const url = config.getAddVipLevel;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'listVipLevel',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //查看会员等级详细信息
        * getVipLevel({payload}, {select, call, put}) {
            const url = config.getVipLevel;
            const {data} = yield call(httpPost, url, payload);
            console.log(data.data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    const levelInfo = {
                        level_name: data.data.level_name,
                        level_pay: data.data.level_pay,
                    }, baseInfo = {
                        valid_day: data.data.valid_date,
                        limit_pay: data.data.use_limit,
                        level_num: data.data.limit_num,
                        is_ck: data.data.is_ck,
                    }
                    yield put({
                        type: 'updatePayload',
                        payload: {levelInfo: levelInfo, baseInfo: baseInfo},
                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //修改会员等级
        * modifyVipLevel({payload}, {select, call, put}) {

            const url = config.getModifyVipLevel;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'listVipLevel',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //删除会员等级
        * deleteVipLevel({payload}, {select, call, put}) {

            const url = config.getDeleteVipLevel;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'listVipLevel',
                        payload: {}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //退卡申请列表
        * memberInfo({payload}, {select, call, put}) {


            const url = config.getMemberInfo;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 退卡申请列表
                    yield put({
                        type: 'getListBackCardSuccess',
                        payload: {tksqData: data.data}

                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //根据手机号查询会员消费记录
        * consumeList({payload}, {select, call, put}) {

            const url = config.getConsumeList;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {xfjlData: data.data},
                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //上传审核文件
        * uploadImg({payload}, {select, call, put}) {


            const url = config.getUploadImg;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {},
                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //退卡申请
        * applyBackCard({payload}, {select, call, put}) {


            const url = config.getApplyBackCard;
            const {data} = yield call(httpPost, url, payload);
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success(data.msg)
                    yield put({
                        type: 'updatePayload',
                        payload: {},
                    });
                } else {
                    yield put({type: 'hideLoading'});
                }
            }

        },
        //退卡审核列表
        * listOpBackCard({payload}, {select, call, put}) {


            const url = config.getListOpBackCard;
            const {data} = yield call(httpPost, url, payload);
            console.log(data)
            if(data){
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 退卡申请列表
                    yield put({
                        type: 'getListBackCardSuccess',
                        payload: {tkshData: data.data.list}

                    });
                } else {
                    yield put({type: 'hideLoading'});
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
        //积分规则列表
        getScoreListSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },
        //退卡申请列表
        getListBackCardSuccess(state, action) {
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