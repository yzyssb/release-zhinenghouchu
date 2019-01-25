import { httpPost, httpPostWithId, httpPostWithOnlyId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import message from "antd/lib/message/index";

const todaystart = moment().startOf("day");
const todayend = moment().endOf("day");

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + '00' + seperator2 + '00'
        + seperator2 + '00';
    return currentdate;
}

function getEndFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + '23' + seperator2 + '59'
        + seperator2 + '59';
    return currentdate;
}

export default {
    namespace: 'yhqlb',
    state: {
        bEditItem: "", //标记评论返红包中是新增还是修改false是新增，true是修改
        ealuationList: [], //评论返红包红包列表数据
        ealuationListCount: 2,//评论返红包数据总条数，初始默认最多2条
        isResetForm: false, //重置form的标识
        flag: false, //开关，控制暴力点击
        timeRadio: 1, //默认的时间类型
        rowSelectionDataProLs: [], //存储选modal中的 food
        offset: 0,
        size: 10,
        restaurantId: 1,
        modalVisible: false,
        modaladdVisible: false,
        commentTypes: [],
        list: [],
        regionList: [],
        currentSteps: 0,
        item: {},
        lsItem: {},
        currentEditSelectValue: "",
        lastChangeTableId: 0,
        cttotal: 0,
        regiontotal: 0,
        current: 0,
        addRegionItem: {},
        editRegionItem: {},
        waiters: [],
        tableDeleteId: "",
        regionDeleteId: "",
        place: [],
        startTime: todaystart,  //开始时间
        endTime: todayend,  //结束时间
        cTime: {},
        couponUpdate: {},
        dishesIntergrationUpdate: {}, //修改时存储要修改的那一项的数据
        intergrationUpdate: {},
        storeList: [],
        foodList: [], //选择合适的产品列表数据
        couponId: "",

        evalutionDeleteId: "",
        getCouponRecordListCount: 0,
        getCouponRecordListCurrent: 0,
        searchCouponId: "",
        searchCouponName: "",
        readyGoBack: false,
        value: "添加固定信息",
        valueS: 1,
        postStartTime: getNowFormatDate(),
        postEndTime: getEndFormatDate(),
        postProId: "", //modal中食品id
        postShopId: "", //modal中门店id
        activeTotal: 0,
        currentActive: 0,  //当前选中第几页
        weekStr: "",
        dataReady: false,
        ruleType: 0,

    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                dispatch({
                    type: 'updatePayload',
                    payload: { readyGoBack: false },

                });
                if (location.pathname === '/yhqlb') {
                    dispatch({
                        type: 'query',
                        payload: location.query,

                    });


                }
                if (location.pathname === '/plfhb') {
                    dispatch({ type: 'getEaluationList', payload: location.query });
                }
                if (location.pathname === '/cpfjf') {
                    dispatch({
                        type: 'updatePayload',
                        payload: { currentActive: 1, offset: 0, size: 10, ruleType: 10 },

                    });
                    dispatch({ type: 'getActivityList', payload: location.query });
                    dispatch({ type: 'queryStoreList', payload: {} });
                }

       

                if (location.pathname === '/gzscp') {
                    dispatch({
                        type: 'updatePayload',
                        payload: { currentActive: 0, offset: 0, size: 10, ruleType: 11 },

                    });
                    dispatch({ type: 'getActivityList', payload: location.query });
                    dispatch({ type: 'queryStoreList', payload: {} });
                }


                // if (location.pathname === '/gzscpAddIntegrationDetail') {
                //     dispatch({ type: 'getActivity', payload: {} });
                // }


            });

        },
    },
    effects: {
        // 菜品返积分列表页请求list
        *getActivityList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const getActivityList = config.getActivityList;
            payload.ruleType = yield select(({ yhqlb }) => yhqlb.ruleType);
            payload.offset = yield select(({ yhqlb }) => yhqlb.offset);
            payload.size = yield select(({ yhqlb }) => yhqlb.size);

            payload.activityName = yield select(({ yhqlb }) => yhqlb.activityName);

            const { data } = yield call(httpPost, getActivityList, payload);

            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            list: data.data,
                            activeTotal: data.totalCount,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },
        *query({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const getCouponListUrl = config.getCouponListUrl;
            payload.offset = yield select(({ yhqlb }) => yhqlb.offset);
            payload.size = yield select(({ yhqlb }) => yhqlb.size);
            payload.searchCouponId = yield select(({ yhqlb }) => yhqlb.searchCouponId);
            payload.searchCouponName = yield select(({ yhqlb }) => yhqlb.searchCouponName);
            payload.name = "";

            const { data } = yield call(httpPost, getCouponListUrl, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            list: data.data,
                            cttotal: data.totalCount,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        // 获取门店列表
        *queryStoreList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const storeListUrl = config.storeListUrl;

            const { data } = yield call(httpPost, storeListUrl, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            storeList: data.data,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        // 请求食物列表
        *queryFoodList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const foodListUrl = config.foodListUrl;

            payload.offset = yield select(({ yhqlb }) => yhqlb.offset);
            payload.size = 100;

            const { data } = yield call(httpPost, foodListUrl, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            foodList: data.data,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        *getCoupon({ payload }, { select, call, put }) {
            const getCouponUrl = config.getCouponUrl;

            var item = yield select(({ yhqlb }) => yhqlb.item);


            const { data } = yield call(httpPostWithOnlyId, getCouponUrl, payload, item.id);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            item: data.data,
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        *addCoupon({ payload }, { select, call, put }) {
            const addCouponUrl = config.addCouponUrl;

            var item = yield select(({ yhqlb }) => yhqlb.couponUpdate);
            var storeIds = yield select(({ yhqlb }) => yhqlb.storeIds);

            payload.arriveamount = item.arriveamount;
            payload.categoryLimit = item.categoryLimit;
            payload.couponLevel = item.couponLevel;
            payload.dayBeginTime = item.postStartTime;
            payload.dayEndTime = item.postEndTime;

            payload.effectiveate = item.effectiveate;
            payload.faceValue = item.faceValue;
            payload.giveType = item.giveType;
            payload.name = item.name;
            payload.state = item.state;

            payload.storeIds = storeIds;
            payload.totalAmount = item.totalAmount;


            const { data } = yield call(httpPost, addCouponUrl, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'query', payload: { payload }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        *updateCoupon({ payload }, { select, call, put }) {
            const updateCoupon = config.updateCoupon;
            var item = yield select(({ yhqlb }) => yhqlb.item);

            payload.id = item.id;
            payload.state = item.state == 1 ? 0 : 1;

            const { data } = yield call(httpPost, updateCoupon, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'query', payload: { payload }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        *getCouponRecordList({ payload }, { select, call, put }) {
            const getCouponRecordList = config.getCouponRecordList;
            payload.offset = yield select(({ yhqlb }) => yhqlb.offset);
            payload.size = yield select(({ yhqlb }) => yhqlb.size);

            payload.couponCode = yield select(({ yhqlb }) => yhqlb.couponCode);
            payload.memberhone = yield select(({ yhqlb }) => yhqlb.memberhone);
            payload.number = yield select(({ yhqlb }) => yhqlb.number);
            payload.state = yield select(({ yhqlb }) => yhqlb.state);
            const { data } = yield call(httpPost, getCouponRecordList, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            couponRecordList: data.data,
                            getCouponRecordListCount: data.totalCount
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },
        // 获取评论返红包的列表数据
        *getEaluationList({ payload }, { select, call, put }) {
            const evaluationList = config.evaluationList;

            payload.offset = 0;
            payload.size = 10;

            payload.name = yield select(({ yhqlb }) => yhqlb.name);
            payload.number = yield select(({ yhqlb }) => yhqlb.number);
            payload.state = yield select(({ yhqlb }) => yhqlb.state);


            const { data } = yield call(httpPost, evaluationList, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            ealuationList: data.data, //红包列表数据
                            ealuationListCount: data.totalCount
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        *delEvaluation({ payload }, { select, call, put }) {
            const delEvaluation = config.delEvaluation;

            var evalutionDeleteId = yield select(({ yhqlb }) => yhqlb.evalutionDeleteId);
            payload.id = evalutionDeleteId + "";


            const { data } = yield call(httpPost, delEvaluation, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'getEaluationList', payload: { payload }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },
        *addEvaluation({ payload }, { select, call, put }) {
            const addEvaluation = config.addEvaluation;

            var dishesIntergrationUpdate = yield select(({ yhqlb }) => yhqlb.dishesIntergrationUpdate);
            payload.maxProportion = dishesIntergrationUpdate.maxProportion;
            payload.minProportion = dishesIntergrationUpdate.minProportion;
            payload.name = dishesIntergrationUpdate.name;
            payload.remark = dishesIntergrationUpdate.remark;
            payload.state = dishesIntergrationUpdate.state;
            payload.type = dishesIntergrationUpdate.type;
            payload.id = dishesIntergrationUpdate.id;
            const { data } = yield call(httpPost, addEvaluation, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            readyGoBack: true,
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },

        // 更新调用接口
        *updateEvaluation({ payload }, { select, call, put }) {
            const updateEvaluation = config.updateEvaluation;
            var dishesIntergrationUpdate = yield select(({ yhqlb }) => yhqlb.dishesIntergrationUpdate);
            payload.maxProportion = dishesIntergrationUpdate.maxProportion;
            payload.minProportion = dishesIntergrationUpdate.minProportion;
            payload.name = dishesIntergrationUpdate.name;
            payload.remark = dishesIntergrationUpdate.remark;
            payload.state = dishesIntergrationUpdate.state;
            payload.type = dishesIntergrationUpdate.type;
            payload.id = dishesIntergrationUpdate.id;
            const { data } = yield call(httpPost, updateEvaluation, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            readyGoBack: true,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },
        *updateActivity({ payload }, { select, call, put }) {
            const updateActivity = config.updateActivity;
            var item = yield select(({ yhqlb }) => yhqlb.item);

            payload.id = item.id;
            payload.state = item.state == 1 ? 0 : 1;

            const { data } = yield call(httpPost, updateActivity, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'getActivityList', payload: { payload }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        // 点击详情获取详情数据,和点击修改获取详情数据一模一样
        *getActivity({ payload }, { select, call, put }) {
            const getActivity = config.getActivity;
            var item = yield select(({ yhqlb }) => yhqlb.intergrationUpdate);

            payload.id = item.id;

            const { data } = yield call(httpPost, getActivity, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {

                    // 初始化展示哪一个时间类型rose新增
                    if (data.data.inDay) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                timeRadio: 1,
                            }
                        });
                    } else if (data.data.inWeek) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                timeRadio: 2,
                            }
                        });
                    } else if (data.data.activityEndtime && data.data.activityStarttime) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                timeRadio: 3,
                                postStartTime: data.data.activityStarttime,
                                postEndTime: data.data.activityEndtime
                            }
                        });
                    }











                    yield put({
                        type: 'updatePayload', payload: {
                            payload,
                            intergrationUpdate: data.data,
                            // postStartTime: data.data.activityStarttime,
                            // postEndTime: data.data.activityEndtime,
                            postShopId: data.data.storeids,
                            postProId: data.data.goodids
                        }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },
        // 新增菜品返积分
        *addIntegration({ payload }, { select, call, put }) {
            const addActivity = config.addActivity;

            var intergrationUpdate = yield select(({ yhqlb }) => yhqlb.intergrationUpdate);
            var postStartTime = yield select(({ yhqlb }) => yhqlb.postStartTime);
            var postEndTime = yield select(({ yhqlb }) => yhqlb.postEndTime);
            var postShopId = yield select(({ yhqlb }) => yhqlb.postShopId);
            var postProId = yield select(({ yhqlb }) => yhqlb.postProId);
            var weekStr = yield select(({ yhqlb }) => yhqlb.weekStr);
            var timeRadio = yield select(({ yhqlb }) => yhqlb.timeRadio);

            // 校验门店id 和 食品id是否存在
            if (postProId == "" || postProId == undefined) {
                message.error("请选择合适的产品！")
            }
            if (postShopId == "" || postShopId == undefined) {
                message.error("请选择合适的门店！")
            }
            if (postProId == "" || postProId == undefined || postShopId == "" || postShopId == undefined) {
                return
            }


            payload.activity_name = intergrationUpdate.activeName;
            // payload.in_day = intergrationUpdate.date; //天
            // payload.in_week = weekStr; //周
            // payload.activity_starttime = postStartTime;  //开始时间
            // payload.activity_endtime = postEndTime;  //结束时间

            if (timeRadio == 1) {
                payload.in_day = intergrationUpdate.date; //天
                payload.in_week = ""; //周
                payload.activity_starttime = "";  //开始时间
                payload.activity_endtime = "";  //结束时间
            } else if (timeRadio == 2) {
                payload.in_day = ""; //天
                payload.in_week = weekStr; //周
                payload.activity_starttime = "";  //开始时间
                payload.activity_endtime = "";  //结束时间
            } else if (timeRadio == 3) {
                payload.in_day = ""; //天
                payload.in_week = ""; //周
                payload.activity_starttime = postStartTime;  //开始时间
                payload.activity_endtime = postEndTime;  //结束时间
            }

            payload.dis_count = intergrationUpdate.backPre1; //非会员积分返还比例
            // payload.dismember_take_in = intergrationUpdate.state;  //非会员是否参与活动
            payload.goodids = postProId;  //食品id
            payload.ruleType = yield select(({ yhqlb }) => yhqlb.ruleType);
            payload.mem_count = intergrationUpdate.backPre; //会员积分返还比例
            payload.member_take_in = intergrationUpdate.joinActive; //会员参与活动
            payload.dismember_take_in = intergrationUpdate.joinActive1;//非会员是否参与活动

            payload.state = intergrationUpdate.id; //启用还是停用
            payload.storeids = postShopId; // 门店id

            console.log(payload)

            // return

            const { data } = yield call(httpPost, addActivity, payload);
            console.log(data)
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            readyGoBack: true,
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        // 关注送菜品添加按钮
        *addGZSCPIntegration({ payload }, { select, call, put }) {




            const addActivity = config.addActivity;

            var intergrationUpdate = yield select(({ yhqlb }) => yhqlb.intergrationUpdate);
            var postStartTime = yield select(({ yhqlb }) => yhqlb.postStartTime);
            var postEndTime = yield select(({ yhqlb }) => yhqlb.postEndTime);
            var postShopId = yield select(({ yhqlb }) => yhqlb.postShopId);
            var postProId = yield select(({ yhqlb }) => yhqlb.postProId);
            var weekStr = yield select(({ yhqlb }) => yhqlb.weekStr);
            payload.ruleType = yield select(({ yhqlb }) => yhqlb.ruleType);

        
            // 校验门店id 和 食品id是否存在
            if (postProId == "" || postProId == undefined) {
                message.error("请选择合适的产品！")
            }
            if (postShopId == "" || postShopId == undefined) {
                message.error("请选择合适的门店！")
            }
            if (postProId == "" || postProId == undefined || postShopId == "" || postShopId == undefined) {
                return
            }

            payload.activity_name = intergrationUpdate.activeName;
            payload.activity_starttime = postStartTime;
            payload.activity_endtime = postEndTime;
            payload.goodids = postProId;
            payload.in_day = intergrationUpdate.date;
            payload.in_week = weekStr;

            payload.state = intergrationUpdate.id;
            payload.storeids = postShopId;

            const { data } = yield call(httpPost, addActivity, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            readyGoBack: true,
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },

    },
    reducers: {

        updatePayload(state, action) {
            return { ...state, ...action.payload, };
        },
        getSuccess(state, action) {
            return { ...state, ...action.payload, loading: false };
        },
        showLoading(state) {
            return { ...state, loading: true };
        },

    }
}