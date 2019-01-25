import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
    namespace: 'glwmcpConfig',
    state: {

        targetTab: "1", //展示第几个tab         
        erpFoodList: [], //存储erp菜品,饿了么和美团共用这个变量
        erpInitFoodList: [], //饿了么modal--erp菜品数据

        meituanYingSheUrl: "", //存储美团映射Url地址

        // ============以下是饿了么关联菜品的数据
        elmFilterState: [0, 1], //用户选中的条件----记录筛选已关联还是未关联
        elmFilterFoodName: "", //用户选中的条件----菜品名称
        elmFilterStateOptions: [  //可选择的条件
            { label: '未关联', value: 0 },
            { label: '已关联', value: 1 },
        ],
        elmDataSource: [], //饿了么展示在页面上的菜品数据
        elmInitialDataSource: [], //饿了么展示在页面上的菜品数据--初始留存用于筛选
        elmNotAssociated: 0,//饿了么未关联的数量
        elmModalFoodName: "", //modal中输入的菜品名称，模糊搜索
        elmVisible: false, //饿了么关联菜品modal 
        elmSelectedRows: [], //modal中选中的菜
        elmCurrentElmFood: {}, //modal饿了么选中的菜品

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
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/glwmcp') {
                    // 初始化数据
                    dispatch({
                        type: "updatePayload",
                        payload: {
                            targetTab: "1", //展示第几个tab         
                            erpFoodList: [], //存储erp菜品,饿了么和美团共用这个变量
                            erpInitFoodList: [], //饿了么modal--erp菜品数据

                            meituanYingSheUrl: "", //存储美团映射Url地址

                            // ============以下是饿了么关联菜品的数据
                            elmFilterState: [0, 1], //用户选中的条件----记录筛选已关联还是未关联
                            elmFilterFoodName: "", //用户选中的条件----菜品名称
                            elmFilterStateOptions: [  //可选择的条件
                                { label: '未关联', value: 0 },
                                { label: '已关联', value: 1 },
                            ],
                            elmDataSource: [], //饿了么展示在页面上的菜品数据
                            elmInitialDataSource: [], //饿了么展示在页面上的菜品数据--初始留存用于筛选
                            elmNotAssociated: 0,//饿了么未关联的数量
                            elmModalFoodName: "", //modal中输入的菜品名称，模糊搜索
                            elmVisible: false, //饿了么关联菜品modal 
                            elmSelectedRows: [], //modal中选中的菜
                            elmCurrentElmFood: {}, //modal饿了么选中的菜品
                        }
                    });
                    // targetTab==1时查询美团映射地址
                    dispatch({
                        type: "getMeiTuanYingShe",
                        payload: {}
                    });
                    // targetTab==1 查询erp菜品，然后传递给iframe
                    dispatch({
                        type: "getErpFoodList",
                        payload: { platformType: 1 }
                    });
                }
            });
        },
    },

    effects: {
        // targetTab==1||2 获取erp菜品
        *getErpFoodList({ payload }, { select, call, put }) {
            const orderListUrl = config.getErpFoodListUrl + "?platformType=" + payload.platformType;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (data.data && data.data != "" && data.data != null && data.data != undefined) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                erpFoodList: data.data,
                                erpInitFoodList: data.data
                            }
                        });
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },
        // targetTab==1 请求列表数据,按条件请求列表数据都走这一个接口
        *getMeiTuanYingShe({ payload }, { select, call, put }) {
            const orderListUrl = config.getMeiTuanYingSheUrl + "?platformType=1";
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (data.data && data.data != "" && data.data != null && data.data != undefined) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                meituanYingSheUrl: data.data,
                            }
                        });
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },

        // targetTab==2 查询饿了么关联外卖菜品主页面的菜品列表
        *getElmFoodList({ payload }, { select, call, put }) {
            const orderListUrl = config.getElmFoodListUrl + "?platformType=2";
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (data.data && data.data != "" && data.data != null && data.data != undefined) {
                        console.log(data)
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                elmInitialDataSource: data.data.itemVOS, //饿了么菜品数据---用于筛选留存
                                elmDataSource: data.data.itemVOS, //饿了么展示在页面上的菜品数据
                                elmNotAssociated: data.data.totalCount, //未关联的数量
                            }
                        });
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },

        // targetTab==2 饿了么删除关联外卖菜品
        *delFoodErpToElm({ payload }, { select, call, put }) {
            const orderListUrl = config.delFoodErpToElmUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("操作成功！");
                    // console.log(payload);
                    // console.log(data);
                    // 初始化数据重新调取接口渲染列表
                    yield put({
                        type: "updatePayload",
                        payload: {
                            elmFilterState: [0, 1], //用户选中的条件----记录筛选已关联还是未关联
                            elmFilterFoodName: "", //用户选中的条件----菜品名称
                        }
                    });

                    yield put({
                        type: "getElmFoodList",
                        payload: {}
                    });

                    yield put({
                        type: "getErpFoodList",
                        payload: { platformType: 2 }
                    });

                } else {
                    message.error(data.msg);
                }
            }
        },

        // 饿了么确认关联保存 saveFoodErpToElmUrl
        *saveFoodErpToElm({ payload }, { select, call, put }) {
            const orderListUrl = config.saveFoodErpToElmUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("保存成功！");
                    // 重置数据，隐藏modal，重新调取接口
                    yield put({
                        type: "updatePayload",
                        payload: {
                            targetTab: "2", //展示第几个tab         
                            erpFoodList: [], //存储erp菜品,饿了么和美团共用这个变量
                            erpInitFoodList: [], //饿了么modal--erp菜品数据

                            meituanYingSheUrl: "", //存储美团映射Url地址

                            // ============以下是饿了么关联菜品的数据
                            elmFilterState: [0, 1], //用户选中的条件----记录筛选已关联还是未关联
                            elmFilterFoodName: "", //用户选中的条件----菜品名称
                            elmFilterStateOptions: [  //可选择的条件
                                { label: '未关联', value: 0 },
                                { label: '已关联', value: 1 },
                            ],
                            elmDataSource: [], //饿了么展示在页面上的菜品数据
                            elmInitialDataSource: [], //饿了么展示在页面上的菜品数据--初始留存用于筛选
                            elmNotAssociated: 0,//饿了么未关联的数量
                            elmModalFoodName: "", //modal中输入的菜品名称，模糊搜索
                            elmVisible: false, //饿了么关联菜品modal 
                            elmSelectedRows: [], //modal中选中的菜
                            elmCurrentElmFood: {}, //modal饿了么选中的菜品
                        }
                    });

                    // 重新调取数据
                    yield put({
                        type: "getElmFoodList",
                        payload: {}
                    });

                    yield put({
                        type: "getErpFoodList",
                        payload: { platformType: 2 }
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