import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';

export default {
	namespace: 'pprwk',
	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/pprwk') {
					dispatch({
						type: 'updatePayload',
						payload: {
							loading: false,
							baseInfoFormRest: 1,

							total: 0,
							offset: 0,
							size: 10,
							current: 1,

							taskName: '',
							brandId: 0,

							brandList: [],//品牌列表
							list: [],

							//新增字段
							taskType: 0,
							foodId: 0,
							foodList:[],
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
			const pprwk = yield select(({ pprwk }) => pprwk)

			const { data } = yield call(httpPost, config.chooseBrandUrl + pprwk.brandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'chaintaskTaskPage',
						payload: {}
					})
					yield put({
						type: 'selectByBrandId',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*selectByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const pprwk = yield select(({ pprwk }) => pprwk)

			payload.id=pprwk.brandId

			const { data } = yield call(httpPost, config.selectByBrandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'updatePayload',
						payload: {
							foodList:data.data
						}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chaintaskTaskPage({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const pprwk = yield select(({ pprwk }) => pprwk)

			payload.offset = pprwk.offset
			payload.size = pprwk.size
			payload.taskName = pprwk.taskName
			payload.brandId = pprwk.brandId
			//新增字段
			payload.taskType = +pprwk.taskType
			if (pprwk.foodId > 0) payload.foodId = +pprwk.foodId

			const { data } = yield call(httpPost, config.chaintaskTaskPage, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					if (data.data && data.data.length > 0) {
						data.data.map((v, i) => {
							v.key = +i + 1
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
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chaintaskTaskDelete({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const pprwk = yield select(({ pprwk }) => pprwk)
			var url
			if(payload.taskType==1){
				url='?id='+payload.id+'&foodId=0'
			}else{
				url='?foodId='+payload.foodId+'&id='+payload.id
			}
			const { data } = yield call(httpPost, config.chaintaskTaskDelete + url, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('删除成功')
					yield put({
						type: 'chaintaskTaskPage',
						payload: {}
					})
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