import { httpPost,config } from '../../services/HttpService';
import { postExportFile } from "../../services/CommonService";
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default {
	namespace: 'wmcpssb',
	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/wmcpssb') {
					dispatch({
						type: 'updatePayload',
						payload: {
							start: 0,	//需要传的参数
							size: 10,	//需要传的参数
							total: 0,
							current: 1,
							loading: false,
							startTime: moment().startOf("month"),	//需要传的参数
							endTime: moment().endOf("day"),	//需要传的参数
							resIdOrgNameMap: {},	//需要传的参数
							restaurantIds: null,	//需要传的参数
							static_days: '0',
							restaurantList: [],

							obj1: {},
							value: [],
							autoExpand: false,

							foodName: '',	//需要传的参数
							//foodNames:[],	//需要传的参数
							takeOutType: 0,	//需要传的参数
							foodType:'1',
							orderByType:0,

							list: [],
						}
					})
					dispatch({
						type: 'userPower',
						payload: {},
					});
				}
			});
		},
	},

	effects: {
		* userPower({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const startTime = yield select(({ jjtjb }) => jjtjb.startTime);
			const endTime = yield select(({ jjtjb }) => jjtjb.endTime);

			const { data } = yield call(httpPost, config.userPower, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				let arr = [], obj2 = {}, value = []
				function extend(target, source) {
					for (var key in source) {
						if (Object.prototype.toString.call(source[key]) === '[object Object]') {
							target[key] = {}
							extend(target[key], source[key])
						} else if (Object.prototype.toString.call(source[key]) === '[object Array]') {
							target[key] = []
							extend(target[key], source[key])
						} else {
							if (key == "nodeName") {
								target["title"] = source[key];
							} else {
								target[key] = source[key]
							}
							target["key"] = source["id"] + "-" + source["nodeName"]
							target["value"] = source["id"] + "-" + source["nodeName"]
							if (Object.keys(source).indexOf('children') == -1 && arr.indexOf(source["id"]) == -1) {
								arr.push(source["id"])
								value.push(source["id"] + "-" + source["nodeName"])
								obj2[source["id"]] = source["nodeName"]
							}
						}
					}
				}

				let obj1 = {}
				if (Object.keys(data.data).length > 0) {
					extend(obj1, data.data)
					yield put({
						type: 'updatePayload',
						payload: {
							obj1: obj1,
							resIdOrgNameMap: obj2,
							restaurantIds: arr,
							value: value
						}
					})
				}
				yield put({
					type: 'takeoutFoodRealRecv',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutFoodRealRecv({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const wmcpssb = yield select(({ wmcpssb }) => wmcpssb)
			payload.offset = wmcpssb.start
			payload.start = wmcpssb.start
			payload.size = wmcpssb.size
			payload.restaurantIds = wmcpssb.restaurantIds
			payload.resIdOrgNameMap = wmcpssb.resIdOrgNameMap
			payload.startTime = new Date(wmcpssb.startTime).getTime()
			payload.endTime = new Date(wmcpssb.endTime).getTime()
			payload.foodType=wmcpssb.foodType
			payload.orderByType=+wmcpssb.orderByType
			if (wmcpssb.foodName.length > 0) payload.foodName = wmcpssb.foodName
			if (wmcpssb.takeOutType != 0) payload.takeOutType = +wmcpssb.takeOutType

			const { data } = yield call(httpPost, config.takeoutFoodRealRecv, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				if (data.data.length > 0) {
					data.data.map((v, i) => {
						v.rank = +i + 1
					})
				}
				yield put({
					type: 'updatePayload',
					payload: {
						list: data.data,
						total: data.totalCount
					}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* _export({ payload }, { select, call, put }) {

			const wmcpssb = yield select(({ wmcpssb }) => wmcpssb)
			payload.restaurantIds = wmcpssb.restaurantIds
			payload.resIdOrgNameMap = wmcpssb.resIdOrgNameMap
			payload.startTime = new Date(wmcpssb.startTime).getTime()
			payload.endTime = new Date(wmcpssb.endTime).getTime()
			payload.foodType=wmcpssb.foodType
			payload.orderByType=+wmcpssb.orderByType
			if (wmcpssb.foodName.length > 0) payload.foodName = wmcpssb.foodName
			if (wmcpssb.takeOutType != 0) payload.takeOutType = +wmcpssb.takeOutType

			postExportFile(config.exportTakeoutFoodRealRecv, payload, "外卖菜品实收表.xlsx");
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