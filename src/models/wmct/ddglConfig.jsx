import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
    namespace: 'ddglConfig',
    state: {
        isResetForm: false,
        orderDetailModalVisible: false,
        total: 10, //数据总条数,默认初始为10条
        current: 1, //当前页码   
        offset: 0, //第几行开始
        size: 10, //请求行数
        dataSource: [], //订单管理table统计表
        orderData: [], //tab列表下方的订单数据
        currentRecord: {}, //存储当前数据
        currentOrderDetail: {},//存储当前订单详情
        filterConditions: {
            orderStatus: 0,//订单状态
            platform: 0, //外卖平台
            endTime: new Date().setHours(23, 59, 59, 0),
            startTime: new Date().setHours(0, 0, 0, 0),
            deliveryStatus: 0, //配送状态
            daySeq: "",
            selectTime: null
        }, //差寻条件
        // 筛选条件--订单列表选项
        filterOrderStatusList: [],
        // 筛选条件--外卖平台
        filterOrderPlatformList: [],
        // 筛选条件--配送状态
        filterOrderDeliveryStatusList: [],
        // 时间戳转换为时间格式
        formatDate: function (nows) {
            var now = new Date(nows);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            month = month >= 10 ? month : "0" + month;
            date = date >= 10 ? date : "0" + date;
            hour = hour >= 10 ? hour : "0" + hour;
            minute = minute >= 10 ? minute : "0" + minute;
            second = second >= 10 ? second : "0" + second;
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        },
        filterSelectTimeList: [
            { value: null, label: "请选择时间跨度" },
            { value: 0, label: "今天" },
            { value: 1, label: "昨天" },
            { value: 7, label: "近7天" },
            { value: 15, label: "近15天" },
            { value: 30, label: "近30天" },

        ]

    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/ddgl') {
                    // 重置数据
                    dispatch({
                        type: "updatePayload",
                        payload: {
                            isResetForm: true,
                            orderDetailModalVisible: false,
                            total: 10, //数据总条数,默认初始为10条
                            current: 1, //当前页码   
                            offset: 0, //第几行开始
                            size: 10, //请求行数
                            dataSource: [], //订单管理table统计表
                            orderData: [], //tab列表下方的订单数据
                            currentRecord: {}, //存储当前数据
                            currentOrderDetail: {},//存储当前订单详情
                            filterConditions: {
                                orderStatus: 0,//订单状态
                                platform: 0, //外卖平台
                                endTime: new Date().setHours(23, 59, 59, 0),
                                startTime: new Date().setHours(0, 0, 0, 0),
                                deliveryStatus: 0, //配送状态
                                daySeq: "",
                                selectTime: null
                            }, //差寻条件
                            filterOrderPlatformList: [],
                            filterOrderStatusList: [],//初始化订单状态可选列表
                            filterOrderDeliveryStatusList: []//  初始化配送状态可选列表
                        }
                    })

                    // 调取tab列表数据
                    dispatch({
                        type: "query",
                        payload: {}
                    })
                    // 调取订单列表数据
                    dispatch({
                        type: "getOrderList",
                        payload: {}
                    })
                    // 调取可选项
                    dispatch({
                        type: "getOrderPlatformList",
                        payload: {}
                    })
                    // 调取订单状态可选列表
                    dispatch({
                        type: "getOrderStateList",
                        payload: {}
                    })
                    // 调取配送状态可选列表
                    dispatch({
                        type: "getDeliveryStateList",
                        payload: {}
                    })

                }
            });
        },
    },

    effects: {
        // 根据网关里获取
        *getOrderPlatformList({ payload }, { select, call, put }) {
            const orderListUrl = config.getOrderPlatformListUrl;
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            filterOrderPlatformList: data.data
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        //请求列表数据,按条件请求列表数据都走这一个接口
        *query({ payload }, { select, call, put }) {
            const orderListUrl = config.getStatisticsDataUrl;
            // 获取请求参数
            payload.offset = yield select(({ ddglConfig }) => ddglConfig.offset);  //第几行开始
            payload.size = yield select(({ ddglConfig }) => ddglConfig.size);       //请求几行
            payload.daySeq = yield select(({ ddglConfig }) => ddglConfig.filterConditions.daySeq);       //顾客电话 ,
            payload.deliveryState = yield select(({ ddglConfig }) => ddglConfig.filterConditions.deliveryStatus);       //配送状态 ,
            payload.orderState = yield select(({ ddglConfig }) => ddglConfig.filterConditions.orderStatus);       //订单状态 ,
            payload.platformType = yield select(({ ddglConfig }) => ddglConfig.filterConditions.platform);       //平台类型 ,
            payload.startTime = yield select(({ ddglConfig }) => ddglConfig.filterConditions.startTime);       //开始时间 ,
            payload.endTime = yield select(({ ddglConfig }) => ddglConfig.filterConditions.endTime);       //结束时间 ,
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            dataSource: data.data,
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 订单列表数据
        *getOrderList({ payload }, { select, call, put }) {
            const orderListUrl = config.getOrderListUrl;
            // 获取请求参数
            payload.offset = yield select(({ ddglConfig }) => ddglConfig.offset);  //第几行开始
            payload.size = yield select(({ ddglConfig }) => ddglConfig.size);       //请求几行
            payload.daySeq = yield select(({ ddglConfig }) => ddglConfig.filterConditions.daySeq);       //顾客电话 ,
            payload.deliveryState = yield select(({ ddglConfig }) => ddglConfig.filterConditions.deliveryStatus);       //配送状态 ,
            payload.orderState = yield select(({ ddglConfig }) => ddglConfig.filterConditions.orderStatus);       //订单状态 ,
            payload.platformType = yield select(({ ddglConfig }) => ddglConfig.filterConditions.platform);       //平台类型 ,
            payload.startTime = yield select(({ ddglConfig }) => ddglConfig.filterConditions.startTime);       //开始时间 ,
            payload.endTime = yield select(({ ddglConfig }) => ddglConfig.filterConditions.endTime);       //结束时间 ,
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            orderData: data.data,
                            total: data.totalCount
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 获取订单详情
        *getOrderDetail({ payload }, { select, call, put }) {
            const orderListUrl = config.getOrderDetailUrl + "?orderId=" + payload.platformOrderId;
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            currentOrderDetail: data.data,
                            orderDetailModalVisible: true //展开modal
                        }
                    });


                } else {
                    message.error(data.msg);
                }
            }
        },
        // 获取订单状态列表选项 
        *getOrderStateList({ payload }, { select, call, put }) {
            const orderListUrl = config.getOrderStateListUrl;
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            filterOrderStatusList: data.data,
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 获取配送状态列表选项 
        *getDeliveryStateList({ payload }, { select, call, put }) {
            const orderListUrl = config.getDeliveryStateListUrl;
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            filterOrderDeliveryStatusList: data.data,
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },


    },
    reducers: {
        updatePayload(state, action) {
            return { ...state, ...action.payload, };
        },

    }
}