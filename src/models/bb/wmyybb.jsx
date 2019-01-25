import { httpPost,config } from '../../services/HttpService';
import { postExportFile } from "../../services/CommonService";
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';
import React, { PropTypes } from 'react';

export default {
	namespace: 'wmyybb',
	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/wmyybb') {
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

							takeOutType: 0,	//需要传的参数
							list: [],

							columns:[
								{title:'序号',dataIndex:'key',key:'key',width:100,fixed:'left',className:common.right,render:(text,record,index)=>(
									<span>{index==0?'':record.key}</span>
								)},
								{title:'门店名称',dataIndex:'restaurantName',key:'restaurantName',width:300,fixed:'left'},
								{title:'外卖平台',dataIndex:'platform',key:'platform',width:100,fixed:'left'},
								// {title:'结算金额',dataIndex:'resultMoney',key:'resultMoney',width:100,className:common.right},
								{title:'净收入',dataIndex:'netIncome',key:'netIncome',width:100,className:common.right},
								{title:'营业收入',dataIndex:'bizIncome',key:'bizIncome',width:100,className:common.right},
								{title:'营业额',dataIndex:'bizMoney',key:'bizMoney',width:100,className:common.right},
								{title:'菜品金额',dataIndex:'foodMoney',key:'foodMoney',width:100,className:common.right},
								{title:'餐盒收入',dataIndex:'boxIncome',key:'boxIncome',width:100,className:common.right},
								{title:'平台佣金',dataIndex:'commision',key:'commision',width:100,className:common.right},
								{title:'优惠金额',dataIndex:'giftMoney',key:'giftMoney',width:100,className:common.right},
								{title:'平台补贴',dataIndex:'platformSubsidy',key:'platformSubsidy',width:100,className:common.right},
								{title:'商家补贴',dataIndex:'resSubsidy',key:'resSubsidy',width:100,className:common.right},
								{title:'有效订单数',dataIndex:'validOrderCount',key:'validOrderCount',width:100,className:common.right},
								{title:'客单价',dataIndex:'singleMoney',key:'singleMoney',width:100,className:common.right},
								{title:'净单价',dataIndex:'realSingleMoney',key:'realSingleMoney',width:100,className:common.right},
								{title:'退款订单数',dataIndex:'retreatOrderCount',key:'retreatOrderCount',width:100,className:common.right},
								{title:'净退款额',dataIndex:'retreatMoney',key:'retreatMoney',width:100,className:common.right}
							]
						},
					});
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
					type: 'takeoutBizStat',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutBizStat({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const wmyybb = yield select(({ wmyybb }) => wmyybb)
			payload.startTime = new Date(wmyybb.startTime).getTime()
			payload.endTime = new Date(wmyybb.endTime).getTime()
			payload.restaurantIds = wmyybb.restaurantIds
			payload.resIdOrgNameMap = wmyybb.resIdOrgNameMap
			if (wmyybb.takeOutType != 0) payload.takeOutType = +wmyybb.takeOutType

			const { data } = yield call(httpPost, config.takeoutBizStat, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {
				let list = [], totalData = data.data
				totalData.key = ''
				totalData.restaurantId = '-1'
				totalData.restaurantName = ''
				totalData.platform = '总计'
				list.push(totalData)

				yield put({
					type: 'updatePayload',
					payload: {
						list: list
					}
				})
				yield put({
					type: 'takeoutBizDetail',
					payload: {}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* takeoutBizDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const wmyybb = yield select(({ wmyybb }) => wmyybb)
			payload.offset = wmyybb.start
			payload.start = wmyybb.start
			payload.size = wmyybb.size - 1
			payload.startTime = new Date(wmyybb.startTime).getTime()
			payload.endTime = new Date(wmyybb.endTime).getTime()
			payload.restaurantIds = wmyybb.restaurantIds
			payload.resIdOrgNameMap = wmyybb.resIdOrgNameMap
			if (wmyybb.takeOutType != 0) payload.takeOutType = +wmyybb.takeOutType

			let list = wmyybb.list, columns = wmyybb.columns

			const { data } = yield call(httpPost, config.takeoutBizDetail, payload);
			if (data && data.code == config.MSGCODE_SUCCESS) {

				let nn = 1
				if (data.data && data.data.length > 0) {
					data.data.map(v => {
						nn += Object.keys(v.takeOutBizMap).length
					})
				}

				if (data.data.length > 0) {
					let obj = {}
					data.data.map((v, i) => {
						let map = Object.keys(v.takeOutBizMap)
						if (map.length > 0) {
							let arr = Object.keys(v.takeOutBizMap)
							for (var ii in v.takeOutBizMap) {
								obj = {}
								//obj.key=list.length
								obj['restaurantId'] = v.restaurantId
								obj['restaurantName'] = v.restaurantName
								obj['platform'] = ii == 1 ? '美团' : ii == 2 ? '饿了么' : ii == 3 ? '百度' : ''
								for (var iii in v.takeOutBizMap[ii]) {
									obj[iii] = v.takeOutBizMap[ii][iii]
								}
								obj.isFirst = ii == arr[0]
								obj.rank = 10 * (wmyybb.current - 1) + i + 1
								obj.maps = map.length
								list.push(obj)

								columns[0].render = (text, record, index) => {
									if (record.isFirst != undefined) {
										if (record.isFirst) {
											return {
												children: <span>{record.rank}</span>,
												props: {
													rowSpan: record.maps,
												},
											}
										} else {
											return {
												children: <span></span>,
												props: {
													rowSpan: 0,
												},
											}
										}
									}
								}
								columns[1].render = (text, record, index) => {
									if (record.isFirst != undefined) {
										if (record.isFirst) {
											return {
												children: <span>{text}</span>,
												props: {
													rowSpan: record.maps,
												},
											}
										} else {
											return {
												children: <span></span>,
												props: {
													rowSpan: 0,
												},
											}
										}
									}
								}

							}
						}
					})
				}
				if (list.length > 0) {
					list.map((v, i) => {
						v.key = (wmyybb.size - 1) * (wmyybb.current - 1) + i
					})
				}
				yield put({
					type: 'updatePayload',
					payload: {
						columns: columns,
						list: list,
						total: Math.ceil(data.totalCount / 10) * (nn - 1),
						size: nn
					}
				})
				yield put({ type: 'hideLoading' });
			} else {
				yield put({ type: 'hideLoading' });
				message.error(data.msg)
			}
		},
		* _export({ payload }, { select, call, put }) {

			const wmyybb = yield select(({ wmyybb }) => wmyybb)
			payload.startTime = new Date(wmyybb.startTime).getTime()
			payload.endTime = new Date(wmyybb.endTime).getTime()
			payload.restaurantIds = wmyybb.restaurantIds
			payload.resIdOrgNameMap = wmyybb.resIdOrgNameMap
			if (wmyybb.takeOutType != 0) payload.takeOutType = +wmyybb.takeOutType
			postExportFile(config.exportTakeoutBiz, payload, "外卖营业报表.xlsx");
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