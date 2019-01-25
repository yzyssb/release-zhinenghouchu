import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';

function addyzyLevel(arr) {
	for (var i = 0; i < arr.length; i++) {
		arr[i].code = String(arr[i].code)
		if (arr[i].code.length < 3) {
			arr[i].yzyLevel = 1
		} else if (arr[i].code.length < 5) {
			arr[i].yzyLevel = 2
		} else if (arr[i].code.length < 7) {
			arr[i].yzyLevel = 3
		} else if (arr[i].code.length < 9) {
			arr[i].yzyLevel = 4
		} else if (arr[i].code.length < 11) {
			arr[i].yzyLevel = 5
		}
	}
}

function addyzyId(arr, randArr = []) {
	for (var i = 0; i < arr.length; i++) {
		var rand = parseInt(Math.random() * 100000000)
		while (randArr.indexOf(rand) > -1) {
			rand = parseInt(Math.random() * 100000000)
		}
		randArr.push(rand)
		arr[i].yzyId = rand
	}
}

export default {
	namespace: 'renwuAdd',
	state: {},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/renwuAdd') {
					dispatch({
						type: 'updatePayload',
						payload: {
							loading: false,
							baseInfoFormRest: 1,
							addType: 1,

							foodList: [],

							hasData: false,
							renwuObj: {},
							brandId: null,

							//新增
							chainTaskDetailVos: [],
							baseInfoFormRest1: 1,
							baseInfoFormRest2: 1,//刷新某一项
							visible: false,
							executeType: 1,//执行方式
							staffState: false,//是否指定岗位员工
							targetCode: 0,//添加子级工序层级
							targetYzyId: 0,//点击的工序yzyId
							targetLevel: 0,//层级
							disabledChange: false,//执行方式是否可以改变
							taskModality: '1',//任务类型是：1、流水线任务，2:、普通任务
							randArr: [],//记录了随机的yzyId的数组，保证唯一性
							editStep: {},//点击工序的编辑

							hasData: sessionStorage.getItem('renwuObj') ? true : false,
							renwuObj: sessionStorage.getItem('renwuObj') ? JSON.parse(sessionStorage.getItem('renwuObj')) : {},
							renwuObj1: sessionStorage.getItem('renwuObj') ? JSON.parse(sessionStorage.getItem('renwuObj')) : {},
							brandId: location.query.brandId ? +(location.query.brandId) : 0,
							foodId: location.query.foodId ? +(location.query.foodId) : 0,
							id: location.query.id ? +(location.query.id) : 0,
							taskType: location.query.taskType ? location.query.taskType : 0,

							nameExist: false,

							modalBtnIsDisabled: false,//工序弹窗保存是否可以点击
							qiantingBtnIsDisabled: false,//前厅任务创建按钮是否点击
							isQianTing: true,
						}
					})
					dispatch({
						type: 'selectByBrandId',
						payload: {}
					})
					if (sessionStorage.getItem('renwuObj')) {
						dispatch({
							type: 'chaintaskTaskDetail',
							payload: {}
						})
					}
				}
			});
		},
	},

	effects: {
		*selectByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const renwuAdd = yield select(({ renwuAdd }) => renwuAdd)
			payload.id = renwuAdd.brandId

			const { data } = yield call(httpPost, config.selectByBrandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					yield put({
						type: 'updatePayload',
						payload: {
							foodList: data.data
						}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chaintaskTaskDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const renwuAdd = yield select(({ renwuAdd }) => renwuAdd)

			var url
			if (renwuAdd.taskType == 1) {
				url = '?id=' + renwuAdd.id + '&foodId=0'
			} else {
				url = '?foodId=' + renwuAdd.foodId + '&id=' + renwuAdd.id
			}

			const { data } = yield call(httpPost, config.chaintaskTaskDetail + url, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					if (renwuAdd.foodId) {
						var arr = data.data && data.data.chainTaskDetailVos || [], randArr = renwuAdd.randArr
						if (arr.length > 0) {
							addyzyLevel(arr)
							addyzyId(arr, randArr)
						}
						yield put({
							type: 'updatePayload',
							payload: {
								chainTaskDetailVos: arr,
								renwuObj: data.data || Object.assign({}, renwuAdd.renwuObj1),
								hasData: data.data ? true : false,
								taskModality: data.data && data.data.taskModality || '1',
								randArr,
								baseInfoFormRest2: 1
							}
						})
					} else {
						if (data.data) {
							data.data.taskName = data.data.chainTaskDetailVos[0].taskName
							data.data.taskReckonNum = data.data.chainTaskDetailVos[0].taskReckonNum
						}
						yield put({
							type: 'updatePayload',
							payload: {
								renwuObj: data.data,
								hasData: data.data ? true : false,
							}
						})
					}


					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chaintaskTaskAdd({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const renwuAdd = yield select(({ renwuAdd }) => renwuAdd)
			payload.brandId = renwuAdd.brandId

			const { data } = yield call(httpPost, config.chaintaskTaskAdd, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('创建成功')
					yield put(routerRedux.push({
						pathname: "/pprwk",
						query: {}
					}))
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*chaintaskTaskUpdate({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const renwuAdd = yield select(({ renwuAdd }) => renwuAdd)
			payload.brandId = renwuAdd.brandId
			const { data } = yield call(httpPost, config.chaintaskTaskUpdate, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('修改成功')
					yield put(routerRedux.push({
						pathname: "/pprwk",
						query: {}
					}))
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//任务名称的校验
		*chaintaskTaskCheckName({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const renwuAdd = yield select(({ renwuAdd }) => renwuAdd)
			var a=payload.name,localExist=false
			const { data } = yield call(httpPost, config.chaintaskTaskCheckName + '?name=' + payload.name + '&id=' + payload.id, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					if (renwuAdd.isQianTing) {
						yield put({
							type: 'updatePayload',
							payload: {
								nameExist: data.data ? true : false,
								qiantingBtnIsDisabled: data.data ? true : false,
							}
						})
					} else {
						if(!data.data){
							//本地数据监测名称是否重复
							var chainTaskDetailVos=renwuAdd.chainTaskDetailVos
							for(var i=0;i<chainTaskDetailVos.length;i++){
								if(chainTaskDetailVos[i].taskName==a){
									localExist=true
									break
								}
							}
						}
						if (localExist) {
							message.error('名称重复了')
						}
						yield put({
							type: 'updatePayload',
							payload: {
								nameExist: (data.data||localExist) ? true : false,
								modalBtnIsDisabled: (data.data||localExist) ? true : false,
							}
						})
					}

					if (data.data == true) {
						message.error('名称重复了')
					}
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