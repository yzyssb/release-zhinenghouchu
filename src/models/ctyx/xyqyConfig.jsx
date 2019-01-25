import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import { getRestaurantId, getCompanyId, getWxToken, getWxState } from '../../services/CommonService';



export default {
    namespace: 'xyqyConfig',
    state: {
        way: "",
        total: 10, //数据总条数,默认初始为10条
        current: 1, //当前页码   
        offset: 0, //第几行开始
        size: 10, //请求行数
        dataSource: [], //

        staffTotal: 10, //数据总条数,默认初始为10条
        staffCurrent: 1, //当前页码   
        staffOffset: 0, //第几行开始
        staffSize: 10, //请求行数
        staffDataSource: [],
        currentZyCompanyId: "",
        conditions: "", //用户输入的内容

        enterpriseVisible: false,//添加企业modal的展示与隐藏
        staffListVisible: false, //员工列表modal的展示与隐藏
        filterConditions: {},
        currentEnterPrise: {}, //存储当前企业详情数据


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
                if (location.pathname === '/xyqy') {
                    // 重置数据
                    dispatch({
                        type: "updatePayload",
                        payload: {      
                            way: "",
                            total: 10, //数据总条数,默认初始为10条
                            current: 1, //当前页码   
                            offset: 0, //第几行开始
                            size: 10, //请求行数
                            dataSource: [], //

                            staffTotal: 10, //数据总条数,默认初始为10条
                            staffCurrent: 1, //当前页码   
                            staffOffset: 0, //第几行开始
                            staffSize: 10, //请求行数
                            staffDataSource: [],
                            currentZyCompanyId: "",
                            conditions: "", //用户输入的内容

                            enterpriseVisible: false,//添加企业modal的展示与隐藏
                            staffListVisible: false, //员工列表modal的展示与隐藏
                            filterConditions: {},
                            currentEnterPrise: {}, //存储当前企业详情数据  
                            
                        }
                    })

                    // 调取tab列表数据
                    dispatch({
                        type: "query",
                        payload: {}
                    })

                    dispatch({
                        type: 'deskQrCode/getWXState',
                        payload: {},
                    });


                }
            });
        },
    },

    effects: {

        //查询企业列表
        *query({ payload }, { select, call, put }) {
            const orderListUrl = config.getEnterpriseListUrl;
            // // 获取请求参数
            payload.offset = yield select(({ xyqyConfig }) => xyqyConfig.offset);  //第几行开始
            payload.size = yield select(({ xyqyConfig }) => xyqyConfig.size);       //请求几行
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            dataSource: data.data,
                            total: data.totalCount
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 添加/编辑企业保存
        *saveEnterprise({ payload }, { select, call, put }) {
            var way = yield select(({ xyqyConfig }) => xyqyConfig.way);  //第几行开始
            var currentEnterPrise = yield select(({ xyqyConfig }) => xyqyConfig.currentEnterPrise);  //拿到当前数据
            let orderListUrl;
            if (way == "add") {
                orderListUrl = config.addEnterpriseUrl;
            } else if (way == "edit") {
                orderListUrl = config.saveEditEnterpriseUrl + currentEnterPrise.id;
            }
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("保存成功！")
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            enterpriseVisible: false,
                            currentEnterPrise: {} //保存成功之后清空当前数据
                        }
                    });

                    // 重新请求列表数据
                    yield put({
                        type: 'query',
                        payload: {
                            dataSource: data.data,
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        // 拿到企业详情
        *getEnterpriseDetail({ payload }, { select, call, put }) {
            const orderListUrl = config.getEnterpriseDetailUrl + payload.id;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            currentEnterPrise: data.data,
                        }
                    });

                } else {
                    message.error(data.msg);
                }
            }
        },
        // 员工列表
        *staffQuery({ payload }, { select, call, put }) {
            const orderListUrl = config.getStaffListUrl;
            // 获取请求参数
            payload.start = yield select(({ xyqyConfig }) => xyqyConfig.staffOffset);  //第几行开始
            payload.size = yield select(({ xyqyConfig }) => xyqyConfig.staffSize);       //请求几行
            payload.zyCompanyId = yield select(({ xyqyConfig }) => xyqyConfig.currentZyCompanyId);       //请求几行
            payload.conditions = yield select(({ xyqyConfig }) => xyqyConfig.conditions);       //用户输入的查找值
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            staffDataSource: data.data,
                            staffTotal: data.totalCount
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },


        // 点击下载二维码调取下载链接之前先检测是否可以下载二维码
        *checkCanLoad({ payload }, { select, call, put }) {
            const orderListUrl = config.checkCanLoadUrl;
            console.log(payload)
            const { data } = yield call(httpPost, orderListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data == 0) {
                        message.error("无法下载");
                    } else if (data.data == 1) {
                        var prefixUrl;
                        const host = window.location.protocol + '//' + window.location.host;

                        if (host == 'http://localhost:8989') {

                            prefixUrl = "http://dev.saas.27aichi.cn/";

                        } else {
                            prefixUrl = window.location.protocol + '//' + window.location.host + '/';
                        }
                        window.location = prefixUrl + 'api/weixin/hq/in-zycompany.jpg/' + payload.id + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}`;
                    }
                } else {
                    message.error("无法下载");
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