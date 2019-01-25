import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default {
    namespace: 'mdbdConfig',
    state: {
        // ================
        LookInfoChangeTimeModalVisible: false, //控制查看详情页面中修改营业时间modal的展示
        RestaurantStatusInfo: [], //对接状态列表
        shouquanPageUrl: "", //iframe中授权请求地址
        jiebangPageUrl: "", //解绑时iframe中的请求地址
        shouquanModalVisible: false, //控制授权包裹iframe的modal的显示
        jiebangModalVisible: false, //控制解绑包裹iframe的modal的显示
        currentStoreInfo: {}, //存储要查看的门店信息
        currentPlatformType: "", //存储查看信息时当前的platformType
        timeArray: [], //存储营业时间的数组:true
        checked: null, //美团外卖门店状态
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

        // =========以下是饿了么授权和选择门店部分=================================
        elmBdStoreVisible: false, //控制饿了么选择门店modal的展示
        elmModalStoreInfo: {}, //饿了么可选门店列表modal中可选项列表        
        elmBdStoreSelectedRows: [], //饿了么授权成功之后modal中已经选中的门店
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/mdbd') {
                    // 初始化数据
                    dispatch({
                        type: 'updatePayload',
                        payload: {
                            lookInfoModalVisible: false, //控制修改营业时间modal的展示
                            RestaurantStatusInfo: [], //对接状态列表
                            shouquanPageUrl: "", //iframe中美团页面请求地址
                            shouquanModalVisible: false, //控制iframe显示
                            checked: null, //美团外卖门店状态
                        }
                    });

                    // 获取美团外卖授权状态 
                    dispatch({
                        type: 'getChecked',
                        payload: {}
                    });

                    // 获取门店状态
                    dispatch({
                        type: 'getMenDianStatus',
                        payload: {}
                    });
                }


                // 查看门店信息,用传过来的门店号去调详情数据
                if (location.pathname === '/lookinfo') {
                    if (location.query.platformType != undefined) {
                        dispatch({
                            type: 'getStoreInfo',
                            payload: { platformType: location.query.platformType }
                        });
                    }
                }
            });
        },

    },

    effects: {
        //查询当前美团外卖授权模式状态
        *getChecked({ payload }, { select, call, put }) {
            const orderListUrl = config.getBdStateUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(data.data)
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            checked: data.data

                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },


        //门店状态信息查询
        * getMenDianStatus({ payload }, { select, call, put }) {
            const orderListUrl = config.getMenDianStatusUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);

            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            RestaurantStatusInfo: data.data
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 点击饿了么|美团外卖授权按钮，拿到iframe中的链接地址
        * getIframeStoreMap({ payload }, { select, call, put }) {
            let orderListUrl;
            if (payload.platformType == 1) { //美团授权
                orderListUrl = config.getIframeStoreMapUrl + "?platformType=" + payload.platformType;
            } else if (payload.platformType == 2) { //饿了么授权
                orderListUrl = config.getElmSqIframeUrl;
            }
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            shouquanPageUrl: data.data
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 切换门店营业或者休息
        * storeOpenOrClose({ payload }, { select, call, put }) {
            const orderListUrl = config.storeOpenOrCloseUrl + "?platformType=" + payload.platformType + "&isOpen=" + payload.isOpen;
            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    // 然后重新调取门店状态数据
                    yield put({
                        type: 'getMenDianStatus',
                        payload: {}
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 查看门店信息
        * getStoreInfo({ payload }, { select, call, put }) {
            const orderListUrl = config.getStoreInfoUrl + "?platformType=" + payload.platformType;
            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let timeArray = [];
                    if (data.data.openTime.length > 0) {
                        data.data.openTime.map(function (item, index) {
                            let obj = {};
                            for (var key in item) {
                                obj[key] = item[key]
                            }
                            timeArray.push(obj)
                        })
                    } else {
                        timeArray.push({ startTime: "", endTime: "" })
                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            currentStoreInfo: data.data,
                            timeArray
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 修改门店营业时间 changeStoreTimeUrl
        * changeStoreTime({ payload }, { select, call, put }) {
            const orderListUrl = config.changeStoreTimeUrl;
            let currentPlatformType = yield select(({ mdbdConfig }) => mdbdConfig.currentPlatformType);       //请求几行

            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    message.success("保存成功！");
                    // 关闭modal
                    yield put({
                        type: 'updatePayload',
                        payload: { LookInfoChangeTimeModalVisible: false }
                    });
                    // 重新调取详情数据
                    yield put({
                        type: 'getStoreInfo',
                        payload: { platformType: currentPlatformType }
                    });


                } else {
                    message.error(data.msg);
                }
            }
        },

        // 解除授权接口 jiebangStoreUrl
        * jiebangStore({ payload }, { select, call, put }) {
            const orderListUrl = config.jiebangStoreUrl + "?platformType=" + payload.platformType;
            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            jiebangPageUrl: data.data
                        }
                    });

                } else {
                    message.error(data.msg);
                }
            }
        },


        // ===================================饿了么接口开始=====================

        // 获取饿了么可选门店列表
        * getElmModalStoreList({ payload }, { select, call, put }) {
            const orderListUrl = config.elmModalStoreListUrl;
            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            elmModalStoreInfo: data.data
                        }
                    });

                } else {
                    message.error(data.msg);
                }
            }
        },

        // 保存绑定选中的门店
        // saveLinkStoreUrl
        * saveLinkStore({ payload }, { select, call, put }) {
            const orderListUrl = config.saveLinkStoreUrl;
            // 获取请求参数
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("绑定成功！")

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            elmBdStoreVisible: false, //控制饿了么选择门店modal的展示
                            elmModalStoreList: [], //饿了么可选门店列表modal中可选项列表
                            elmBdStoreSelectedRows: [], //饿了么授权成功之后modal中已经选中的门店
                        }
                    });

                    // 获取门店状态
                    yield put({
                        type: 'getMenDianStatus',
                        payload: {}
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