import { httpPost, httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default {
	namespace: 'ksqd',
	state: {
		offset: 0,
		size: 10,
		modalVisible: false,
		week: [],
		list: [],
		startHour: '00',
		startMin: '00',
		endHour: '00',
		endMin: '00',
		foodDetail: [],
		comboDetail: [],
		isAdd: true,
		selectFoodDetail: [],
		selectComboDetail: [],
		timeName: '',
		id: 0,

		errorMsg: "",

		_checkedFoodKeys: [],
		_checkedFoodComboKeys: [],

	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/cdgl') {


					dispatch({
						type: 'query',
						payload: {},
					});

					dispatch({
						type: 'queryFoodDetail',
						payload: location.query,
					});

					dispatch({
						type: 'queryFoodComboDetail',
						payload: location.query,
					});

				}
			});
		},
	},

	effects: {

		*query({ payload }, { select, call, put }) {

			const orderListUrl = config.sellTimeUrl;
			payload.offset = yield select(({ ksqd }) => ksqd.offset);
			payload.size = yield select(({ ksqd }) => ksqd.size);
			payload.name = "%%";


			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					var total = data.data.length;
					yield put({
						type: 'updatePayload',
						payload: {
							list: data.data,
							total: data.totalCount,

						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*queryAdd({ payload }, { select, call, put }) {

			const orderListUrl = config.sellTimeAddUrl;
			payload.week = yield select(({ ksqd }) => ksqd.week);
			payload.startHour = yield select(({ ksqd }) => ksqd.startHour);

			payload.startMin = yield select(({ ksqd }) => ksqd.startMin);

			payload.endHour = yield select(({ ksqd }) => ksqd.endHour);

			payload.endMin = yield select(({ ksqd }) => ksqd.endMin);


			payload.foodDetial = yield select(({ ksqd }) => ksqd.selectFoodDetail);

			payload.comboDetail = yield select(({ ksqd }) => ksqd.selectComboDetail);

			payload.id = yield select(({ ksqd }) => ksqd.id);

			payload.timeName = yield select(({ ksqd }) => ksqd.timeName);

			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success("保存成功！");
					yield put({
						type: 'updatePayload',
						payload: {
							modalVisible: false,
							errorMsg: ""
						}
					});

					yield put({
						type: 'query',
						payload: {

						},
					});
				} else if (data.code == 95588) {  //不允许保存
					yield put({
						type: 'updatePayload',
						payload: {
							errorMsg: "当前已存在" + data.data.existSellTime + " 的可售清单",
						}
					});
				} else {
					console.log(data.msg);
					yield put({
						type: 'updatePayload',
						payload: {
							modalVisible: false,
							errorMsg: ""
						}
					});

				}
			}
		},
		*queryFoodDetail({ payload }, { select, call, put }) {

			const orderListUrl = config.sellFoodUrl;


			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					const convert = (data, i = 1) => {
						data.map((item) => {
							if (item.singles) {
								convert(item.singles, i + 1);
							}
							let prefix = i;
							if (item.categoryId) {
								item.key = item.categoryId + "-" + item.id;
							} else {
								item.key = item.id;
							}

							item.title = item.name;
							item.prefix = prefix;
						})
					};

					convert(data.data);

					yield put({
						type: 'updatePayload',
						payload: {
							foodDetail: data.data,
						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*queryFoodComboDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.sellFoodComboUrl;


			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					const convert = (data) => {
						data.map((item) => {
							if (item.children) {
								convert(item.children);
							}
							item.key = item.id;
							item.title = item.name;
						})
					};
					convert(data.data);

					yield put({
						type: 'updatePayload',
						payload: {
							comboDetail: data.data,

						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*deleteKsqd({ payload }, { select, call, put }) {

			const orderListUrl = config.sellFoodDeleteUrl;
			console.log(payload);

			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('删除成功');
					yield put({
						type: 'query',
						payload: {


						},
					});

				} else {
					message.error(data.msg);

				}
			}
		},
		*querySellFoodDetail({ payload }, { select, call, put }) {

			const orderListUrl = config.sellFoodSelectFoodUrl;

			var checkedFoodKeys = [];

			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					let foodDetail = yield select(({ ksqd }) => ksqd.foodDetail);

					data.data.map((i) => {

						if (i.details) {
							i.details.map((j) => {

								foodDetail.map((a) => {
									if (a.singles && a.singles.length > 0)
										a.singles.map((b) => {

											if (b.key == (i.id + '-' + j.id)) {
												checkedFoodKeys.push(i.id + '-' + j.id);
											}

										})


								})

							})

						}
					})


					yield put({
						type: 'updatePayload',
						payload: {
							_checkedFoodKeys: checkedFoodKeys,
						},
					});


					const convert = (data) => {
						data.map((item) => {
							if (item.singles) {
								convert(item.singles);
							}
							item.key = item.id;
							item.title = item.name;
						})
					};

					convert(data.data);

					yield put({
						type: 'updatePayload',
						payload: {
							sellFoodDetial: data.data,
							selectFoodDetail: data.data,
						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*querySellFoodComboDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.sellFoodSelectComboUrl;

			var checkedFoodComboKeys = [];

			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					data.data.map((i) => {

						if (i.id) {
							checkedFoodComboKeys.push(i.id + '');

						}

					})

					yield put({
						type: 'updatePayload',
						payload: {
							_checkedFoodComboKeys: checkedFoodComboKeys,
						},
					});

					const convert = (data) => {
						data.map((item) => {
							if (item.children) {
								convert(item.children);
							}
							item.key = item.id;
							item.title = item.name;
						})
					};
					convert(data.data);

					yield put({
						type: 'updatePayload',
						payload: {
							sellComboDetail: data.data,
							selectComboDetail: data.data,
						},
					});
				} else {
					console.log(data.msg);
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