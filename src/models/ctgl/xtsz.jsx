import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
	namespace: 'xtszPageConfig',
	state: {
		offset: 0,
		size: 0,
		loading: false,
		wipeType: 1,	//抹零类型
		isAutoCleanTable: true,	//结账是否自动清台
		isConnectCashier: 1,	//是否连接收银端
		isAutoOpenTable: true,	//是否自动开台
		isTempFoodEnable: true,	//是否开启临时菜
		isUseBoxCharge: 1,	//是否开启用餐盒
		boxCharge: '',	//餐盒价格
		clientHomePageType: 1,		//开台后自动进入页面
		isUseSaleList: 1,		//是否开启可售清单
		isOpenPos: 1,		//是否开启POS收银
		isReset: false,
        retireGoodsTime:0,
        isPrintTicket:1,
        isRequired:1,
        isRetireGoods:1,
        isGiftGoods:1,
        isExemption:1,
        isDiscount:1,
        reasonRemarks:1,
        prefabricateTime:1,
        timeArray:['00:00'],


    },

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/jcsz') {
					dispatch({
						type: 'getBase',
						payload: {},
					});
				}
			});
		},
	},

	effects: {
		*getBase({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.systemSettingBase;
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'updatePayload',
						payload: {
							boxCharge: data.data.boxCharge,
							clientHomePageType: data.data.clientHomePageType,
							isAutoCleanTable: data.data.isAutoCleanTable,
							isAutoOpenTable: data.data.isAutoOpenTable,
							isConnectCashier: data.data.isConnectCashier,
							isTempFoodEnable: data.data.isTempFoodEnable,
							isUseBoxCharge: data.data.isUseBoxCharge,
							isUseSaleList: data.data.isUseSaleList,
							isOpenPos: data.data.isOpenPos ? data.data.isOpenPos : 1,

                            retireGoodsTime: data.data.retireGoodsTime,
                            isPrintTicket: data.data.isPrintTicket,
                            isRequired: data.data.isRequired,
                            isRetireGoods: data.data.isRetireGoods,
                            isGiftGoods: data.data.isGiftGoods,
                            isExemption: data.data.isExemption,
                            isDiscount: data.data.isDiscount,
                            reasonRemarks:data.data.reasonRemarks,
                            prefabricateTime:data.data.prefabricateTime?data.data.prefabricateTime:0,
							timeArray:data.data.sendTimes?data.data.sendTimes.split(','):['00:00'],
                            cookYellowStart:data.data.cookYellowStart,
                            cookYellowEnd:data.data.cookYellowEnd,
                            cookRedStart:data.data.cookRedStart,
                            foodYellowStart:data.data.foodYellowStart,
                            foodYellowEnd:data.data.foodYellowEnd,
                            foodRedStart:data.data.foodRedStart,
                            waimaiYellowStart:data.data.waimaiYellowStart,
                            waimaiYellowEnd:data.data.waimaiYellowEnd,
                            waimaiRedStart:data.data.waimaiRedStart,

						}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				}
			}
		},
		*saveAction({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.systemSettingSave;
			payload.clientHomePageType = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.clientHomePageType));
			payload.isAutoCleanTable = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isAutoCleanTable));
			payload.isAutoOpenTable = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isAutoOpenTable));
			payload.isConnectCashier = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isConnectCashier));
			payload.isTempFoodEnable = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isTempFoodEnable));
			payload.isUseBoxCharge = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isUseBoxCharge));
			payload.isUseSaleList = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isUseSaleList));
			payload.isOpenPos = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isOpenPos));


			payload.wipeType = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.wipeType));

            payload.isPrintTicket = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isPrintTicket));

            payload.isRequired = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isRequired));

            payload.isGiftGoods = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isGiftGoods));

            payload.isRetireGoods = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isRetireGoods));

            payload.isOpenPos = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isOpenPos));

            payload.isExemption = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isExemption));

            payload.isDiscount = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.isDiscount));

            payload.reasonRemarks = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.reasonRemarks));

            payload.prefabricateTime = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.prefabricateTime));

            payload.sendTimes = (yield select(({ xtszPageConfig }) => xtszPageConfig.timeArray)).join(',')

            payload.cookYellowStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.cookYellowStart));

            payload.cookYellowEnd = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.cookYellowEnd));

            payload.cookRedStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.cookRedStart));

            payload.foodYellowStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.foodYellowStart));

            payload.foodYellowEnd = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.foodYellowEnd));

            payload.foodRedStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.foodRedStart));

            payload.waimaiYellowStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.waimaiYellowStart));

            payload.waimaiYellowEnd = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.waimaiYellowEnd));

            payload.waimaiRedStart = Number(yield select(({ xtszPageConfig }) => xtszPageConfig.waimaiRedStart));



            const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				console.log(data)
				if (data.code == config.MSGCODE_SUCCESS) {
					yield put({
						type: 'getBase',
						payload: {}
					})
                    message.success(data.msg)
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				}
			}
		},
		*resetAction({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.systemSettingReset;
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				console.log(data)
				if (data.code == config.MSGCODE_SUCCESS) {
					yield put({
						type: 'getBase',
						payload: {}
					})
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				}
			}
		},
	},
	reducers: {
		updatePayload(state, action) {
			return { ...state, ...action.payload, };
		},
		/*显示加载提示*/
		showLoading(state) {
			return { ...state, loading: true };
		},

		/*隐藏加载提示*/
		hideLoading(state) {
			return { ...state, loading: false };
		},
	}
}