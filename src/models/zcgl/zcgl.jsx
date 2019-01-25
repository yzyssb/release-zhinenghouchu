import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
	namespace: 'zcglPageConfig',
	state: {
		loading: false,
		visible: false,
		way: "", //标记是新增进入还是修改进入
		current: 1,
		totalCount: 10, //记录一共有多少条数据,默认给个十条
		// 请求列表数据data
		pageForm: {
			offset: 0, //起始行数
			size: 10 //每页数量,一进页面默认请求第一页的数量
		},
		//需要重置form标识
		isResetForm: false,
		checkName: 0, //校验折扣名称是否存在的字段,1存在，0不存在，默认不存在
		actionData: {
			"gmtFinish": "",  //结束时间
			"gmtStart": "",  //开始时间
			"id": "", // 如果是新增不需要传id，修改要传id
			"name": "", //方案名称
			"status": "1", //状态：1启用，2停 ,
			"type": "1", //折扣类型：1全单折2方案折,默认全单折扣
			"wholeRate": "" //全单折折扣0-100
		},
		defaultActionData: function () {
			let defaultActionData = {
				"gmtFinish": "",  //结束时间
				"gmtStart": "",  //开始时间
				"id": "", // 如果是新增不需要传id，修改要传id
				"name": "", //方案名称
				"status": "1", //状态：1启用，2停 ,
				"type": "1", //折扣类型：1全单折2方案折,默认全单折扣
				"wholeRate": "" //全单折折扣0-100
			};
			return defaultActionData
		},
		// 处理时间的函数
		formatDateTime: function (inputTime) {
			var date = new Date(inputTime);
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
		},
		discountDetails: "",//存储新增时展示的折扣列表数据
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/zcgl') {
					// 页面加载调用列表数据
					dispatch({
						type: 'query',
						payload: location.query,
					});
				}
			});
		},

	},

	effects: {
		//请求列表数据
		*query({ payload }, { select, call, put }) {
			// console.log("执行请求列表数据")
			yield put({ type: 'showLoading' });
			const orderListUrl = config.discountUrl;
			payload = yield select(({ zcglPageConfig }) => zcglPageConfig.pageForm);
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					
					// 更新数据
					yield put({
						type: 'updatePayload',
						payload: {
							dataSource: data.data,
							totalCount: data.totalCount
						}
					});

				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},

		//点击删除按钮删除对应的列表数据
		*delDiscountData({ payload }, { select, call, put }) {
			
			yield put({ type: 'showLoading' });
			const orderListUrl = config.delDiscountRowUrl + "?id=" + payload.id;
			const { data } = yield call(httpPost, orderListUrl, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					let pageForm = {
						offset: 0, //起始行数
						size: 10 //每页数量,一进页面默认请求第一页的数量 
					}
					// 重置数据
					yield put({
						type: 'updatePayload',
						payload: { pageForm, current: 1 }
					});

					//  删除成功后重新请求列表数据，回调
					yield put({
						type: 'query',
						payload: {}
					});
				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},
		//点击添加增加数据和修改是一个接口，区别就是一个传id，一个不传id，保存修改或者新增折扣
		*addDiscount({ payload }, { select, call, put }) {

			const orderListUrl = config.addDiscountUrl
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					let pageForm = {
						offset: 0, //起始行数
						size: 10 //每页数量,一进页面默认请求第一页的数量 
					}
					// 重置数据
					yield put({
						type: 'updatePayload',
						payload: { pageForm, current: 1 }
					});

					yield put({
						type: 'query',
						payload: {}
					});

					// 然后直接重置清空数据
					let defaultActionData = yield select(({ zcglPageConfig }) => zcglPageConfig.defaultActionData());
					yield put({
						type: 'zcglPageConfig/updatePayload',
						payload: { visible: false, actionData: defaultActionData }
					});


				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},

		// 点击新增或者修改时获取数据包含菜类菜品，注意是query的方式
		*discountGetData({ payload }, { select, call, put }) {
			const orderListUrl = config.getAllDiscountListUrl + "?id=" + payload.id
			const { data } = yield call(httpPost, orderListUrl, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					
					let discountDetails = data.data.discountDetails;
					// 循环所有菜数据，添加一个display属性，默认全部收起来
					if (discountDetails != null && discountDetails.length > 0) {
						// 给每一个父级和子级添加一个iconDisplay=“none”的属性
						discountDetails.map(function (item) {
							item.display = false;
							// 返回的数据中当套餐总数据有值时，套餐单品中的数据需要手动循环加上
							if (item.isCombo == 1 && item.discountRate > 0 && item.foods && item.foods != null && item.foods != "" && item.foods.length > 0) {
								item.foods.map(function (ele, k) {
									ele.discountRate = item.discountRate;
								})
							}
							// 菜大类时,父级有值，子集没有值
							if (item.isCombo == 0 && item.discountRate > 0 && item.foods != null && item.foods != "" && item.foods.length > 0) {
								item.foods.map(function (ele, i) {
									ele.discountRate = item.discountRate;
									// item.iconDisplay = "none"; // 后加的，给每一个input都加一个控制icon提示是否显示的属性
								})
							}
						})
					}
					// 清空原有的数据
					let defaultActionData = yield select(({ zcglPageConfig }) => zcglPageConfig.defaultActionData());
					yield put({
						type: 'updatePayload',
						payload: { actionData: defaultActionData, discountDetails }
					});
					if (payload.id != 0) {
						let actionData = {};
						actionData.gmtFinish = data.data.gmtFinish;  //结束时间
						actionData.gmtStart = data.data.gmtStart;  //开始时间
						actionData.id = data.data.id; // 
						actionData.name = data.data.name; //方案名称
						actionData.status = data.data.status; //状态：1启用，2停 ;
						actionData.type = data.data.type; //折扣类型：1全单折2方案折;默认全单折扣
						actionData.wholeRate = data.data.wholeRate; //全单折折扣0-100
						yield put({
							type: 'updatePayload',
							payload: { actionData }
						});
					}
				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},

		// 新增输入或者修改折扣名称时验证折扣名称是否已经存在,新增不传id，修改传id
		*checkName({ payload }, { select, call, put }) {
			let way = yield select(({ zcglPageConfig }) => zcglPageConfig.way);
			let name = yield select(({ zcglPageConfig }) => zcglPageConfig.actionData.name);
			let id = yield select(({ zcglPageConfig }) => zcglPageConfig.actionData.id);
			let orderListUrl;
			if (way == "add") {
				orderListUrl = config.checkNameUrl + "?name=" + name;
			} else if (way == "edit") {
				orderListUrl = config.checkNameUrl + "?name=" + name + "&id=" + id;
			}
			const { data } = yield call(httpPost, orderListUrl, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					// 1存在 ，0不存在
					
					yield put({
						type: 'updatePayload',
						payload: { checkName: data.data }
					});
				} else {
					message.error(data.msg);
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