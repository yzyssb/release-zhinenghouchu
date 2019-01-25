import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from "moment/moment";

const todayStart = moment().startOf("day");
const todayEnd = moment().endOf("day");



export default {
    namespace: 'yxhdConfig',
    state: {
        radioSelect: 1,
        restaurantData: {},//营业情况

        // 会员有礼活动===start
        modalVisible: false,  //rose---优惠券列表弹框      
        couponListData: [],  //会员有礼form页面优惠券列表
        // couponListDataInit: [],  //会员有礼form页面初始优惠券列表
        selectedRowKeys: [], //优惠券列表用户选中哪些数据的id
        selectedRows: [], //优惠券列表用户选中哪些数据
        selectedRowKeysBackups: [], //selectedRowKeys的备份
        selectedRowsBackups: [], //selectedRows的备份
        activityType: "3", //用户选中的类型
        restaurantDataMenDian: [], //餐厅数据
        restaurantValue: [], //选中的餐厅数据
        // 会员有礼活动===end


        activityStatData: {},
        name: "",  // 优惠券名称,
        type: "1",  //活动状态
        couponType: '',//优惠券类型 
        couponId: '2',//弹框选中的id
        couponItem: {},　//rose---存储当前数据    
        isPush: [],
        endTime: todayEnd,
        startTime: todayStart,
        cpfjf_pointsType: 3,
        timeArray: [],
        offset: 0,  //列表请求第几行页的数据
        size: 10000, //请求几行的数据
        cpfjfVo: {},
        cpfjf_startTime: moment().add(1, "days").format('YYYY-MM-DD 00:00:00'),
        cpfjf_endTime: moment().add(30, "days").format('YYYY-MM-DD 00:00:00'),
        postStartTime: new Date(moment().add(1, "days").format('YYYY-MM-DD 00:00:00')).valueOf(),
        postEndTime: new Date(moment().add(30, "days").format('YYYY-MM-DD 00:00:00')).valueOf(),
        cpfjf_disVipPercent: 0.5,
        cpfjf_vipPercent: 0.5,
        cpfjf_companyPercent: 0.5,
        cpfjf_foodInfos: [],
        cpfjf_restaurantInfos: [],
        cpfjf_useScene: 1,
        cpfjf_isPush: 1,
        cpfjf_week: 1,
        cpfjf_time: '',
        cpfjf_activityDesc: '',
        cpfjf_day: 17,


        formatDate: function (nows) {
            var date = new Date(nows);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/yxhdlist') {
                    // 页面加载调用列表数据
                    dispatch({
                        type: 'query',
                        payload: {},
                    });
                    dispatch({
                        type: 'activityStat',
                        payload: {},
                    });
                }

                if (location.pathname === '/cpfjfform') {
                    // 调用品牌餐厅数据
                    // 请求食物列表数据

                    dispatch({
                        type: 'getFoodList',
                        payload: {},
                    });

                    // 请求门店列表数据
                    dispatch({
                        type: 'getStoreList',
                        payload: {},
                    });

                    dispatch({
                        type: 'updatePayload',
                        payload: {
                            cpfjf_startTime: moment().add(1, "days").format('YYYY-MM-DD 00:00:00'),
                            cpfjf_endTime: moment().add(31, "days").format('YYYY-MM-DD 00:00:00'),
                            postStartTime: new Date(moment().add(1, "days").format('YYYY-MM-DD 00:00:00')).valueOf(),
                            postEndTime: new Date(moment().add(30, "days").format('YYYY-MM-DD 00:00:00')).valueOf(),
                            cpfjf_disVipPercent: 0.5,
                            cpfjf_vipPercent: 0.5,
                            cpfjf_companyPercent: 0.5,
                            cpfjf_foodInfos: [],
                            cpfjf_restaurantInfos: [],
                            cpfjf_useScene: 1,
                            cpfjf_isPush: 1,
                            cpfjf_week: 1,
                            cpfjf_time: "",
                            goodids: '',
                            storeids: '',
                            timeArray: [],
                            cpfjf_name: '',
                            cpfjf_pointsType: 3,
                            cpfjf_activityDesc: '',
                            cpfjf_day: 17,
                            goodSelectedRowKeys: [],
                            storeSelectedRowKeys: [],
                            goodInitSelectedRowKeys: [],
                            storeInitSelectedRowKeys: [],

                        },
                    });


                }

                if (location.pathname === "/yxhdform") {
                    // 初始数据
                    dispatch({
                        type: 'updatePayload',
                        payload: {
                            modalVisible: false,  //rose---优惠券列表弹框      
                            couponListData: [],  //会员有礼form页面优惠券列表
                            selectedRowKeys: [], //优惠券列表用户选中哪些数据的id
                            selectedRows: [], //优惠券列表用户选中哪些数据
                            selectedRowKeysBackups: [], //selectedRowKeys的备份
                            selectedRowsBackups: [], //selectedRows的备份
                            activityType: "3", //用户选中的类型
                            restaurantDataMenDian: [], //餐厅数据
                            restaurantValue: [], //选中的餐厅数据
                        },
                    });



                    // 调用品牌餐厅数据
                    dispatch({
                        type: 'getRestaurantData',
                        payload: {},
                    });
                }

            });
        },

    },

    effects: {
        //请求列表数据,按条件请求列表数据都走这一个接口
        * query({ payload }, { select, call, put }) {
            // 获取请求参数
            let startTime = yield select(({ yxhdConfig }) => yxhdConfig.startTime);
            let endTime = yield select(({ yxhdConfig }) => yxhdConfig.endTime);

            let dataJson = {
                "size": 10,
                'restaurantIds': [yield select(({ account }) => account.restaurantId)],
                "resIdOrgNameMap": { "1": "※有菜莱锦测试店※" },
                "offset": 0,
                "avgType": 1,
                "startTime": new Date(startTime).getTime(),
                "endTime": new Date(endTime).getTime()
            }
            //dataJson={"size":10,"restaurantIds":[1],"resIdOrgNameMap":{"1":"※有菜莱锦测试店※"},"offset":0,"avgType":1,"startTime":1528992000000,"endTime":1529078399999}
            const { data } = yield call(httpPost, config.bizRestaurant, dataJson);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (data.data.length > 0) {
                        let restaurantData = data.data[0]
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                restaurantData: restaurantData,
                            }
                        });
                    } else {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                restaurantData: [],
                            }
                        });
                    }

                    //message.success('查询成功');
                    // console.log( data.data[0])
                } else {
                    message.error(data.msg);
                    // console.log(data.msg);
                }
            }
        },
        * activityStat({ payload }, { select, call, put }) {
            // payload. = '111111';
            let dataJson = {

            }

            const { data } = yield call(httpPost, config.activityStatUrl, dataJson);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data.length > 0) {
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                activityStatData: data.data,

                            }
                        });
                    }

                } else {
                    message.error(data.msg);
                    // console.log(data.msg);
                }
            }
        },
        // 获取优惠券列表-- 电商和餐软的--注意id拼接，因为电商和餐软的券id有重复的，保存提交的时候再拆分
        * yhqhdList({ payload }, { select, call, put }) {//优惠券列表
            // 获取请求参数
            let activityType = yield select(({ yxhdConfig }) => yxhdConfig.activityType);

            payload.activityType = activityType;

            const { data } = yield call(httpPost, config.getYouHuiQuanListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let couponListData = data.data;
                    // 循环让id保持唯一
                    if (couponListData.length > 0) {
                        couponListData.map(function (item, index) {
                            item.id = item.platformType + "-" + item.id
                        })
                    }


                    // 如果当前有选中优惠券的情况需要把选中优惠券的值更新到数据中
                    let selectedRows = yield select(({ yxhdConfig }) => yxhdConfig.selectedRows);
                    if (selectedRows.length > 0 && couponListData.length > 0) {
                        couponListData.map(function (item, index) {
                            for (var i = 0; i < selectedRows.length; i++) {
                                if (item.id == selectedRows[i].id) {
                                    item.grantCount = selectedRows[i].grantCount;
                                }
                            }
                        })
                    }


                    yield put({
                        type: 'updatePayload',
                        payload: {
                            couponListData
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 获取品牌和餐厅数据
        *getRestaurantData({ payload }, { select, call, put }) {
            const orderListUrl = config.storeUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let restaurantDataMenDian = [];
                    if (data.data.length > 0) {
                        data.data.map(function (item, index) {
                            restaurantDataMenDian.push({
                                title: item.name,
                                value: item.id.toString(),
                                key: item.id.toString(),
                                children: []
                            })

                            if (item.restaurants.length > 0) {
                                item.restaurants.map(function (ele) {
                                    restaurantDataMenDian[index].children.push({
                                        title: ele.name,
                                        value: `${item.id}-${ele.id}`,
                                        key: `${item.id}-${ele.id}`,
                                        disabled: true
                                    })
                                })
                            } else {
                                restaurantDataMenDian[index].disabled = true;
                            }
                        })
                    }
                    yield put({
                        type: "updatePayload",
                        payload: { restaurantDataMenDian }
                    })
                } else {
                    message.error(data.msg);
                    console.log(data.msg);
                }
            }
        },
        // 保存会员有礼活动
        *saveHuiYuanYouLiHuoDong({ payload }, { select, call, put }) {
            const orderListUrl = config.activityCreateUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(payload);
                    console.log(data.data)
                    message.success("保存成功！")
                    // 跳转到营销活动页面
                    yield put(routerRedux.push({
                        pathname: "/yxhdlist",
                        query: {}
                    }));

                } else {
                    message.warning(data.msg);
                }
            }
        },
        // 菜品返积分创建活动
        * activityCpfjfCreate({ payload }, { select, call, put }) {
            // 创建活动
            payload.name = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_name);
            payload.activityTemplate = 2;
            payload.activityType = 2;
            payload.gmtStart = yield select(({ yxhdConfig }) => yxhdConfig.postStartTime);
            payload.gmtFinish = yield select(({ yxhdConfig }) => yxhdConfig.postEndTime);

            payload.activityDesc = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_activityDesc);
            payload.useScene = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_useScene);
            payload.isPush = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_isPush);

            let PointsActivityVO = {};
            PointsActivityVO.pointsType = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_pointsType);
            PointsActivityVO.disVipPercent = (yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_disVipPercent)) * 10;
            PointsActivityVO.vipPercent = (yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_vipPercent)) * 10;
            PointsActivityVO.companyPercent = (yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_companyPercent)) * 10;
            PointsActivityVO.day = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_day);
            PointsActivityVO.endTime = yield select(({ yxhdConfig }) => yxhdConfig.postEndTime);
            PointsActivityVO.startTime = yield select(({ yxhdConfig }) => yxhdConfig.postStartTime);
            PointsActivityVO.week = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_week);
            PointsActivityVO.time = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_time);
            PointsActivityVO.foodInfos = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_foodInfos);
            PointsActivityVO.restaurantInfos = yield select(({ yxhdConfig }) => yxhdConfig.cpfjf_restaurantInfos);

            payload.pointsActivityVO = PointsActivityVO;

            const { data } = yield call(httpPost, config.activityCreateUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    message.success('活动创建成功');

                    yield put(routerRedux.push({
                        pathname: '/hdgllist',
                        query: {},
                    }));
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            leftSelectKeys: ['607'],
                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        // 请求食物列表
        *getFoodList({ payload }, { select, call, put }) {
            const orderListUrl = config.foodListUrl;
            payload.offset = yield select(({ yxhdConfig }) => yxhdConfig.offset);
            payload.size = yield select(({ yxhdConfig }) => yxhdConfig.size);
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                yield put({ type: 'getSuccess', payload: { payload } });
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            goodList: data.data,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        // 获取门店列表
        *getStoreList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const storeListUrl = config.storeListUrl;
            // 不传参,不分页
            const { data } = yield call(httpPost, storeListUrl, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            storeList: data.data.shopList,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        * activityDetail({ payload }, { select, call, put }) {
            // 获取请求参数

            const { data } = yield call(httpPost, config.activityDetailUrl + payload.id, {});
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {


                    let newRestaurantInfos = data.data.pointsActivityVO.restaurantInfos;
                    let newStoreids = [];
                    let newStoreSelectedRowKeys = [];
                    newRestaurantInfos.map((i, j) => {
                        newStoreids.push(i.restaurantName);
                        newStoreSelectedRowKeys.push(i.restaurantId);
                    });

                    let newFoodInfos = data.data.pointsActivityVO.foodInfos;
                    let newGoodids = [];
                    let newGoodSelectedRowKeys = [];
                    newFoodInfos.map((i, j) => {
                        newGoodids.push(i.foodName);
                        newGoodSelectedRowKeys.push(i.foodId);
                    })

                    if (data.data.pointsActivityVO.time) {

                        var resTimeArray = data.data.pointsActivityVO.time.split(',');
                        var newTimeArray = [];
                        resTimeArray.map((i, j) => {

                            newTimeArray.push({ startTime: i.split('-')[0], endTime: i.split('-')[1] });

                        })
                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            cpfjf_name: data.data.name,
                            postStartTime: data.data.gmtStart,
                            postEndTime: data.data.gmtFinish,
                            cpfjf_isPush: data.data.isPush,
                            cpfjf_activityDesc: data.data.activityDesc,
                            cpfjf_useScene: data.data.useScene,
                            activityTemplate: data.data.activityTemplate,
                            activityType: data.data.activityType,
                            cpfjf_pointsType: data.data.pointsActivityVO.pointsType,
                            cpfjf_vipPercent: data.data.pointsActivityVO.vipPercent / 10,
                            cpfjf_disVipPercent: data.data.pointsActivityVO.disVipPercent / 10,
                            cpfjf_companyPercent: data.data.pointsActivityVO.companyPercent / 10,
                            cpfjf_startTime: new Date(data.data.gmtStart),
                            cpfjf_endTime: new Date(data.data.gmtFinish),
                            cpfjf_time: data.data.pointsActivityVO.time,
                            cpfjf_week: data.data.pointsActivityVO.week,
                            cpfjf_day: data.data.pointsActivityVO.day,
                            timeArray: newTimeArray,
                            storeids: newStoreids.join(','),
                            goodids: newGoodids,
                            cpfjf_restaurantInfos: data.data.pointsActivityVO.restaurantInfos,
                            cpfjf_foodInfos: data.data.pointsActivityVO.foodInfos,
                            goodSelectedRowKeys: newGoodSelectedRowKeys,
                            storeSelectedRowKeys: newStoreSelectedRowKeys,
                            goodInitSelectedRowKeys: newGoodSelectedRowKeys,
                            storeInitSelectedRowKeys: newStoreSelectedRowKeys,

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