import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import { getRestaurantId, getCompanyId, getWxToken, getWxState } from '../../../services/CommonService';



export default {
    namespace: 'lsxyqyConfig',
    state: {
        way: "",
        total: 0, //数据总条数,默认初始为10条
        current: 1, //当前页码   
        offset: 0, //第几行开始
        size: 10, //请求行数
        dataSource: [], //

        staffTotal: 0, //数据总条数,默认初始为10条
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

        brandList: [], //可选品牌数据列表
        checkedBrandId: "", //默认选中的品牌ID
        storeList: [], // 可选的门店列表
        restaurantIds: [], //选中的门店id列表
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
                if (location.pathname === '/lsxyqy') {
                    // 重置数据
                    dispatch({
                        type: "updatePayload",
                        payload: {
                            way: "",
                            total: 0, //数据总条数,默认初始为10条
                            current: 1, //当前页码   
                            offset: 0, //第几行开始
                            size: 10, //请求行数
                            dataSource: [], //

                            staffTotal: 0, //数据总条数,默认初始为10条
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



                    // 调用品牌餐厅数据
                    dispatch({
                        type: 'getBrandList',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {

        //查询企业列表
        *query({ payload }, { select, call, put }) {
            const orderListUrl = config.getLsEnterpriseListUrl;
            // // 获取请求参数
            payload.offset = yield select(({ lsxyqyConfig }) => lsxyqyConfig.offset);  //第几行开始
            payload.size = yield select(({ lsxyqyConfig }) => lsxyqyConfig.size);       //请求几行
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
        // 拿到企业详情
        *getEnterpriseDetail({ payload }, { select, call, put }) {
            const orderListUrl = config.getLsEnterpriseDetailUrl + payload.id;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            currentEnterPrise: data.data,
                            restaurantIds: data.data.restaurantIds
                        }
                    });

                } else {
                    message.error(data.msg);
                }
            }
        },
        // 员工列表
        *staffQuery({ payload }, { select, call, put }) {
            const orderListUrl = config.getLsStaffListUrl;
            // 获取请求参数
            payload.start = yield select(({ lsxyqyConfig }) => lsxyqyConfig.staffOffset);  //第几行开始
            payload.size = yield select(({ lsxyqyConfig }) => lsxyqyConfig.staffSize);       //请求几行
            payload.zyCompanyId = yield select(({ lsxyqyConfig }) => lsxyqyConfig.currentZyCompanyId);       //请求几行
            payload.conditions = yield select(({ lsxyqyConfig }) => lsxyqyConfig.conditions);       //用户输入的查找值
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
        // 每次切换品牌都需要去网关中刷新品牌Id
        *updateBrandIdWangGuan({ payload }, { select, call, put }) {
            const orderListUrl = config.chooseBrandUrl + payload.brandId;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 调取tab列表数据
                    yield put({
                        type: "query",
                        payload: {}
                    })
                }

            } else {
                message.error(data.msg);
            }
        },  
        // 获取品牌列表，只在页面刚进入时调取一次
        *getBrandList({ payload }, { select, call, put }) {
            const orderListUrl = config.brandListUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            brandList: data.data,
                            checkedBrandId: data.data.length > 0 ? data.data[0].key : ""
                        }
                    });

                    // 用初始选中的品牌(默认第一个)去调取门店                    
                    if (data.data.length > 0) {
                        yield put({
                            type: 'getStoreList',
                            payload: {
                                brandId: data.data[0].key,
                            }
                        });

                        // 去网关中刷品牌id,在updateBrandIdWangGuan成功后去调取query列表数据
                        yield put({
                            type: "updateBrandIdWangGuan",
                            payload: { brandId: data.data[0].key, }
                        })
                    }

                } else {
                    message.error(data.msg);
                }
            }
        },
        // 根据选中的品牌调取对应的门店
        *getStoreList({ payload }, { select, call, put }) {
            const orderListUrl = config.getStoreListByBrandIdUrl + payload.brandId;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(data)
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            storeList: data.data
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 新增或者编辑保存连锁企业
        *saveLsEnterprise({ payload }, { select, call, put }) {
            const orderListUrl = config.saveLsEnterpriseUrl;
            var way = yield select(({ lsxyqyConfig }) => lsxyqyConfig.way);  //确定是否是新增
            var currentEnterPrise = yield select(({ lsxyqyConfig }) => lsxyqyConfig.currentEnterPrise);  //当前企业的详情数据
            if (way == "add" && !currentEnterPrise.id) {
                payload.id = 0;  //新增id传0
            } else if (way == "edit" && currentEnterPrise.id) {
                payload.id = currentEnterPrise.id;
            }
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("保存成功！")
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            enterpriseVisible: false,
                            currentEnterPrise: {}, //保存成功之后清空当前数据
                         
                        }
                    });

                    // 重新请求列表数据
                    yield put({
                        type: 'query',
                        payload: {}
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