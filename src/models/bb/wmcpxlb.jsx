import { httpPost,config } from '../../services/HttpService';
import { postExportFile } from "../../services/CommonService";
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default {
	namespace: 'wmcpxlb',
	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/wmcpxlb') {
					dispatch({
						type: 'updatePayload',
						payload: {
							start: 0,	//需要传的参数
							size: 11,	//需要传的参数
							total: 0,
							current: 1,
							loading: false,
							startTime: moment().startOf("day"),	//需要传的参数
							endTime: moment().endOf("day"),	//需要传的参数
							resIdOrgNameMap: {},	//需要传的参数
							restaurantIds: null,	//需要传的参数
							static_days: '0',
							restaurantList: [],

							obj1: {},
							value: [],
							autoExpand: false,

							foodName: '',	//需要传的参数
							takeOutType: 0,	//需要传的参数
							orderByType: 1,	//需要传的参数

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
					type: 'takeoutFoodStat',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutFoodStat({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const wmcpxlb = yield select(({ wmcpxlb }) => wmcpxlb)
			payload.restaurantIds = wmcpxlb.restaurantIds
			payload.resIdOrgNameMap = wmcpxlb.resIdOrgNameMap
			payload.startTime = new Date(wmcpxlb.startTime).getTime()
			payload.endTime = new Date(wmcpxlb.endTime).getTime()
			payload.orderByType = +wmcpxlb.orderByType
			if (wmcpxlb.foodName.length > 0) payload.foodName = wmcpxlb.foodName
			if (wmcpxlb.takeOutType != 0) payload.takeOutType = +wmcpxlb.takeOutType

			const { data } = yield call(httpPost, config.takeoutFoodStat, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				let list = []
				list.push({
					rank: '总计',
					categoryName: '',
					foodName: '',
					moneyProportion: '',
					numProportion: '',
					resFoodName: '',
					sellMoney: data.data.sellMoney,
					sellNum: data.data.sellNum,
					spceName: '',
				})
				yield put({
					type: 'updatePayload',
					payload: {
						list: list
					}
				})
				yield put({
					type: 'takeoutFoodDetail',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutFoodDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const wmcpxlb = yield select(({ wmcpxlb }) => wmcpxlb)
			payload.offset = wmcpxlb.start
			payload.start = wmcpxlb.start
			payload.size = wmcpxlb.size - 1
			payload.restaurantIds = wmcpxlb.restaurantIds
			payload.resIdOrgNameMap = wmcpxlb.resIdOrgNameMap
			payload.startTime = new Date(wmcpxlb.startTime).getTime()
			payload.endTime = new Date(wmcpxlb.endTime).getTime()
			payload.orderByType = +wmcpxlb.orderByType
			if (wmcpxlb.foodName.length > 0) payload.foodName = wmcpxlb.foodName
			if (wmcpxlb.takeOutType != 0) payload.takeOutType = +wmcpxlb.takeOutType

			let list = wmcpxlb.list

			const { data } = yield call(httpPost, config.takeoutFoodDetail, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				if (data.data.length > 0) {
					data.data.map((v, i) => {
						v.rank = +i + 1
					})
				}
				list = list.concat(data.data)
				yield put({
					type: 'updatePayload',
					payload: {
						list: list,
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

			const wmcpxlb = yield select(({ wmcpxlb }) => wmcpxlb)
			payload.restaurantIds = wmcpxlb.restaurantIds
			payload.resIdOrgNameMap = wmcpxlb.resIdOrgNameMap
			payload.startTime = new Date(wmcpxlb.startTime).getTime()
			payload.endTime = new Date(wmcpxlb.endTime).getTime()
			payload.orderByType = +wmcpxlb.orderByType
			if (wmcpxlb.foodName.length > 0) payload.foodName = wmcpxlb.foodName
			if (wmcpxlb.takeOutType != 0) payload.takeOutType = +wmcpxlb.takeOutType

			postExportFile(config.exportTakeoutFood, payload, "外卖菜品销量表.xlsx");
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