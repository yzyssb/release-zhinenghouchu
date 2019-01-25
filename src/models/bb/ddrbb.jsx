import { httpPost,config } from '../../services/HttpService';
import { postExportFile } from "../../services/CommonService";
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';
import React, { PropTypes } from 'react';

export default {
	namespace: 'ddrbb',
	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/ddrbb') {
					dispatch({
						type: 'updatePayload',
						payload: {
							start: 0,	//需要传的参数
							size: 11,	//需要传的参数
							total: 0,
							current: 1,
							loading: false,
							year: new Date().getFullYear(),	//需要传的参数
							month: +(new Date().getMonth()) + 1,	//需要传的参数
							resIdOrgNameMap: {},	//需要传的参数
							restaurantIds: null,	//需要传的参数
							static_days: '2',
							restaurantList: [],

							obj1: {},
							value: [],
							autoExpand: false,

							takeOutType: 0,	//需要传的参数

							scrollX: 610,

							list: [],

							columns: [
								//{title:'门店编号',dataIndex:'restaurantCode',key:'restaurantCode',width:100,fixed:'left',className:common.right},
								{
									title: '序号', dataIndex: 'key', key: 'key', width: 50, fixed: 'left', className: common.right, render: (text, record, index) => (
										<span>{index == 0 ? '' : record.key}</span>
									)
								},
								{ title: '门店名称', dataIndex: 'restaurantName', key: 'restaurantName', width: 160, fixed: 'left' },
								{ title: '营业额', dataIndex: 'orderMoney', key: 'orderMoney', width: 100, fixed: 'left', className: common.right },
								{ title: '客付价', dataIndex: 'guestPrice', key: 'guestPrice', width: 100, fixed: 'left', className: common.right },
								{ title: '有效订单数', dataIndex: 'validOrderCount', key: 'validOrderCount', width: 100, fixed: 'left', className: common.right },
								{ title: '净收入', dataIndex: 'netIncome', key: 'netIncome', width: 100, fixed: 'left', className: common.right },
							]
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
					type: 'takeoutOrderDayStat',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutOrderDayStat({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const ddrbb = yield select(({ ddrbb }) => ddrbb)
			payload.restaurantIds = ddrbb.restaurantIds
			payload.resIdOrgNameMap = ddrbb.resIdOrgNameMap
			payload.year = +ddrbb.year
			payload.month = +ddrbb.month
			if (ddrbb.takeOutType != 0) payload.takeOutType = +ddrbb.takeOutType

			let columns = [
				//{title:'门店编号',dataIndex:'restaurantCode',key:'restaurantCode',width:100,fixed:'left',className:common.right},
				{
					title: '序号', dataIndex: 'key', key: 'key', width: 50, fixed: 'left', className: common.right, render: (text, record, index) => (
						<span>{index == 0 ? '' : record.key}</span>
					)
				},
				{ title: '门店名称', dataIndex: 'restaurantName', key: 'restaurantName', width: 160, fixed: 'left' },
				{ title: '营业额', dataIndex: 'orderMoney', key: 'orderMoney', width: 100, fixed: 'left', className: common.right },
				{ title: '客付价', dataIndex: 'guestPrice', key: 'guestPrice', width: 100, fixed: 'left', className: common.right },
				{ title: '有效订单数', dataIndex: 'validOrderCount', key: 'validOrderCount', width: 100, fixed: 'left', className: common.right },
				{ title: '净收入', dataIndex: 'netIncome', key: 'netIncome', width: 100, fixed: 'left', className: common.right },
			]

			const { data } = yield call(httpPost, config.takeoutOrderDayStat, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				let list = [{ restaurantCode: '', restaurantName: '总计', restaurantId: '-1' }]
				for (var i in data.data.takeOutOrderStat) {
					list[0][i] = data.data.takeOutOrderStat[i]
				}

				let scrollX = 610
				if (data.data.takeOutOrders.length > 0) {
					data.data.takeOutOrders.map((v, i) => {
						columns.push({
							title: ddrbb.year + '-' + (ddrbb.month < 10 ? ('0' + ddrbb.month) : ddrbb.month) + '-' + (((i + 1) < 10) ? ('0' + (+i + 1)) : (+i + 1)),
							dataIndex: 'yzy_' + i,
							key: 'yzy_' + i,
							width: 360,
							children: [
								{ title: '营业额', dataIndex: 'orderMoney_' + i, key: 'orderMoney_' + i, width: 90, className: common.right },
								{ title: '客付价', dataIndex: 'guestPrice_' + i, key: 'guestPrice_' + i, width: 90, className: common.right },
								{ title: '有效订单数', dataIndex: 'validOrderCount_' + i, key: 'validOrderCount_' + i, width: 90, className: common.right },
								{ title: '净收入', dataIndex: 'netIncome_' + i, key: 'netIncome_' + i, width: 90, className: common.right },
							]
						})
						list[0]['orderMoney_' + i] = v.orderMoney
						list[0]['guestPrice_' + i] = v.guestPrice
						list[0]['validOrderCount_' + i] = v.validOrderCount
						list[0]['netIncome_' + i] = v.netIncome
						list[0]['key'] = ''
					})
					scrollX += 360 * data.data.takeOutOrders.length

					//处理数据少的时候
					if(document.getElementById('yzy')){
						columns.map((v,i)=>{
							if(i<6){
								v.fixed=scrollX<document.getElementById('yzy').offsetWidth?false:true
							}
						})
					}
				}

				yield put({
					type: 'updatePayload',
					payload: {
						columns: columns,
						list: list,
						scrollX: scrollX
					}
				})

				yield put({
					type: 'takeoutOrderDayDetail',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutOrderDayDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const ddrbb = yield select(({ ddrbb }) => ddrbb)
			payload.offset = ddrbb.start
			payload.start = ddrbb.start
			payload.size = ddrbb.size - 1
			payload.restaurantIds = ddrbb.restaurantIds
			payload.resIdOrgNameMap = ddrbb.resIdOrgNameMap
			payload.year = +ddrbb.year
			payload.month = +ddrbb.month
			if (ddrbb.takeOutType != 0) payload.takeOutType = +ddrbb.takeOutType

			let list = ddrbb.list

			const { data } = yield call(httpPost, config.takeoutOrderDayDetail, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				if (data.data.length > 0) {
					data.data.map((v, i) => {
						for (var ii in v.takeOutOrderStat) {
							v[ii] = v.takeOutOrderStat[ii]
						}
						if (v.takeOutOrders.length > 0) {
							v.takeOutOrders.map((vv, iii) => {
								v['orderMoney_' + iii] = vv.orderMoney
								v['guestPrice_' + iii] = vv.guestPrice
								v['validOrderCount_' + iii] = vv.validOrderCount
								v['netIncome_' + iii] = vv.netIncome
							})
						}
					})
				}

				list = list.concat(data.data)

				if (list.length > 0) {
					list.map((v, i) => {
						v.key = (ddrbb.size - 1) * (ddrbb.current - 1) + i
					})
				}

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

			const ddrbb = yield select(({ ddrbb }) => ddrbb)
			payload.restaurantIds = ddrbb.restaurantIds
			payload.resIdOrgNameMap = ddrbb.resIdOrgNameMap
			payload.year = +ddrbb.year
			payload.month = +ddrbb.month
			if (ddrbb.takeOutType != 0) payload.takeOutType = +ddrbb.takeOutType

			postExportFile(config.exportTakeoutDayOrder, payload, "外卖订单日报表.xlsx");
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