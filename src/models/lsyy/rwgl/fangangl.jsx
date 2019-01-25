import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
	namespace: 'fangangl',
	state: {
		list: [],
		brandList: [],//品牌列表
		brandId: 0,
		programmeName: '',
		programmeState: '0',
		offset: 0,
		size: 10,
		total: 0,
		current: 1,


		DateParse: function (str) {
			let now = new Date(str)
			let year = now.getFullYear(),
				month = now.getMonth() + 1,
				day = now.getDate()
			return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
		},
		DateParse1: function (str) {
			let now = new Date(str)
			let year = now.getFullYear(),
				month = now.getMonth() + 1,
				day = now.getDate()
			return year + '年' + month + '月' + day + '日'
		},
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/rwfa') {
					dispatch({
						type: 'updatePayload',
						payload: {
							list: [],
							brandList: [],//品牌列表
							brandId: 0,
							programmeName: '',
							programmeState: '0',
							offset: 0,
							size: 10,
							total: 0,
							current: 1
						}
					})
					dispatch({
						type: 'listByUserPower',
						payload: {}
					})
				}
			});
		},
	},

	effects: {
		*listByUserPower({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const { data } = yield call(httpPost, config.listByUserPower, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					yield put({
						type: 'updatePayload',
						payload: {
							brandList: data.data,
							brandId: !sessionStorage.getItem('brandId_yzy') ? (data.data.length > 0 ? data.data[0].key : 0) : +sessionStorage.getItem('brandId_yzy')
						}
					})
					yield put({
						type: 'chooseBrandUrl',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chooseBrandUrl({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const fangangl = yield select(({ fangangl }) => fangangl)

			const { data } = yield call(httpPost, config.chooseBrandUrl + fangangl.brandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'chainprogrammeList',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chainprogrammeList({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const fangangl = yield select(({ fangangl }) => fangangl)
			payload.offset = fangangl.offset
			payload.size = fangangl.size
			payload.brandId = fangangl.brandId
			payload.programmeName = fangangl.programmeName
			if (fangangl.programmeState > 0) payload.programmeState = fangangl.programmeState

			const { data } = yield call(httpPost, config.chainprogrammeList, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					yield put({
						type: 'updatePayload',
						payload: { list: data.data, total: data.totalCount },
					});
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chainprogrammeDetele({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const { data } = yield call(httpPost, config.chainprogrammeDetele + payload.id, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('删除成功')
					yield put({
						type: 'chainprogrammeList',
						payload: {},
					});
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
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