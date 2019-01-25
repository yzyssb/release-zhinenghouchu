import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default {
	namespace: 'newFangan',
	state: {},
	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/newFangan') {
					dispatch({
						type: 'updatePayload',
						payload: {
							loading: false,
							baseInfoFormRest: 1,
							activeStop: 1,
							brandId: +location.query.brandId,
							//重置数据
							mockData: [],
							targetKeys: [],
							selectedRowKeys: [],
							list: [],
							modal_show: false,
							editTimeModal: false,
							changeTimes: [{ key: 1, timeOne: '', timeTwo: '', timeThree: '', timeFour: '', timeFive: '' }],
							values: {},//第一步数据
							pushTimes: [],//第二步数据
							storeIds: [],//第三步数据
							mockData1: [],
							targetKeys1: [],
							id: null,
							disabled: false,
							copy: false,
							static_programmeName: '',
							static_targetKeys: [],

							leftData:[],
							rightData:[],
						}
					})
					//查看时不可点击
					if (location.query.disabled) {
						dispatch({
							type: 'updatePayload',
							payload: {
								disabled: true
							}
						})
					}
					//是否是点击复制进入该页面
					if (location.query.copy) {
						dispatch({
							type: 'updatePayload',
							payload: {
								copy: true
							}
						})
					}

					if (location.query.id) {//编辑方案时
						dispatch({
							type: 'updatePayload',
							payload: {
								id: location.query.id
							}
						})
						dispatch({
							type: 'chainprogrammeQuery',
							payload: {
								id: location.query.id
							}
						})
					} else {//新增方案时
						dispatch({
							type: 'chaintaskTaskList',
							payload: {}
						})
						dispatch({
							type: 'queryRestaurantInfo',
							payload: {}
						})
					}
				}
			});
		},
	},

	effects: {
		//不分页任务列表
		*chaintaskTaskList({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const newFangan = yield select(({ newFangan }) => newFangan)

			const { data } = yield call(httpPost, config.chaintaskTaskList + '?brandId=' + newFangan.brandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					if(data.data){
						if (!newFangan.id) {//创建方案时
							var leftData=[],cacheForKeys=[]
							if(data.data.length>0){
								data.data.map(v=>{
									let obj={}
									obj['key']=v.id+'S'
									obj['title']=(v.taskType==1||v.taskModality==2)?v.taskDetails[0].taskName:v.foodName
									leftData.push(obj)
									if(v.taskDetails&&v.taskDetails.length>0){
										v.taskDetails.map(vv=>{
											if(v.taskType==2&&v.taskModality==1){
												let obj1={}
												obj1['key']=vv.id+''
												obj1['parentKey']=v.id+'S'
												obj1['title']=vv.taskName
												for(var key in vv){
													obj1[key]=vv[key]
												}
												obj1['disableCheckbox']=v.taskModality==1?true:false
												leftData.push(obj1)
											}
											cacheForKeys.push(v.id+'S'+'-'+vv.id)
										})
									}
								})
							}
							sessionStorage.setItem('selectedRightKeys_yzy',[])
							sessionStorage.setItem('cacheForKeys',cacheForKeys)
							yield put({
								type: 'updatePayload',
								payload: {
									leftData,
									mockData:data.data
								}
							});

						} else {//编辑方案时
							let targetKeys = [], static_targetKeys = []
							if (data.data.length > 0) {
								data.data.map((v, i) => {
									v.key = +i + 1
								})
							}

							var cacheForKeys=[]
							if(data.data.length>0){
								data.data.map(v=>{
									if(v.taskDetails&&v.taskDetails.length>0){
										v.taskDetails.map(vv=>{
											cacheForKeys.push(v.id+'S'+'-'+vv.id)
										})
									}
								})
							}
							
							sessionStorage.setItem('cacheForKeys',cacheForKeys)

							var rightKeys=[]
							for(var i=0;i<newFangan.pushTimes.length;i++){
								rightKeys.push(newFangan.pushTimes[i].taskId+'S')
							}
							sessionStorage.setItem('selectedRightKeys_yzy',rightKeys)
							var leftData=[],rightData=[],isExist=false
							if(data.data.length>0){
								data.data.map(v=>{
									isExist=false

									for(var i=0;i<rightKeys.length;i++){
										if(v.id+ 'S'==rightKeys[i]){
											isExist=true
											break
										}
									}

									function leftDataOrRight(newObj){
										let obj={}
										obj['key']=v.id+'S'
										obj['title']=(v.taskType==1||v.taskModality==2)?v.taskDetails[0].taskName:v.foodName
										newObj.push(obj)
										if(v.taskDetails&&v.taskDetails.length>0&&v.taskType==2&&v.taskModality==1){
											v.taskDetails.map(vv=>{
												let obj1={}
												obj1['key']=vv.id+''
												obj1['parentKey']=v.id+'S'
												obj1['title']=vv.taskName
												for(var key in vv){
													obj1[key]=vv[key]
												}
												obj1['disableCheckbox']=v.taskModality==1?true:false
												newObj.push(obj1)
											})
										}
									}
								
									leftDataOrRight(isExist?rightData:leftData)
								})
							}

							leftData.sort(function(a,b){return parseFloat(a.key)-parseFloat(b.key)})
							rightData.sort(function(a,b){return parseFloat(a.key)-parseFloat(b.key)})

							yield put({
								type: 'updatePayload',
								payload: {
									mockData: data.data,
									leftData,
									rightData
								}
							});
						}
					}
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//品牌下的门店
		*queryRestaurantInfo({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const newFangan = yield select(({ newFangan }) => newFangan)
			const { data } = yield call(httpPost, config.queryRestaurantInfo + newFangan.brandId, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					if (!newFangan.id) {//创建方案时
						if (data.data.length > 0) {
							data.data.map((v, i) => {
								v.key = v.restaurantId
							})
						}
						yield put({
							type: 'updatePayload',
							payload: {
								mockData1: data.data
							}
						});
					} else {//编辑方案时
						let targetKeys = []
						if (data.data.length > 0) {
							data.data.map((v, i) => {
								v.key = v.restaurantId
								v.disabled = newFangan.disabled ? true : false
							})
						}
						if (newFangan.values.storeIds && newFangan.values.storeIds.length > 0) {
							newFangan.values.storeIds.map(v => {
								if (data.data.length > 0) {
									data.data.map(vv => {
										if (v == vv.restaurantId && targetKeys.indexOf(v) == -1) {
											targetKeys.push(v)
										}
									})
								}
							})
						}
						yield put({
							type: 'updatePayload',
							payload: {
								mockData1: data.data,
								targetKeys1: targetKeys,
								storeIds: targetKeys
							}
						});
					}
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//创建方案
		*chainprogrammeAdd({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const newFangan = yield select(({ newFangan }) => newFangan)
			payload.brandId = +newFangan.brandId

			const { data } = yield call(httpPost, config.chainprogrammeAdd, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('保存成功')
					window.history.go(-1)
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//修改方案  
		*chainprogrammeUpdate({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const newFangan = yield select(({ newFangan }) => newFangan)
			payload.brandId = +newFangan.brandId
			payload.programmeId = +newFangan.id

			const { data } = yield call(httpPost, config.chainprogrammeUpdate, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					message.success('修改成功')
					window.history.go(-1)
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//查看方案详情
		*chainprogrammeQuery({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const newFangan = yield select(({ newFangan }) => newFangan)

			const { data } = yield call(httpPost, config.chainprogrammeQuery + payload.id, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					let values = [], pushTimes = []
					values.programmeName = newFangan.copy ? (data.data.programmeName + '【复制】') : data.data.programmeName
					values.programmeDescribe = data.data.programmeDescribe
					values.programmeIsNow = data.data.programmeIsNow
					if (data.data.programmeIsNow == 2) {
						values.programmeStartTime = data.data.programmeStartTime <= new Date(moment().startOf('day').format('YYYY-MM-DD 03:00:00')).getTime() ? new Date(moment().add(1, 'day').format('YYYY-MM-DD 03:00:00')) : data.data.programmeStartTime
					}
					values.storeIds = data.data.storeIds
	
					var arr=[],taskIds=[],pushTimes=data.data.pushTimes
					for(var i=0;i<pushTimes.length;i++){
						if(taskIds.indexOf(pushTimes[i].taskId)==-1){
							taskIds.push(pushTimes[i].taskId)
							let obj={}
							for(var key in pushTimes[i]){
								obj[key]=pushTimes[i][key]
							}
							obj['taskDetails']=[]
							let obj1={}
							obj1['id']=pushTimes[i].id
							obj1['taskName']=pushTimes[i].taskName
							obj['taskDetails'].push(obj1)
							arr.push(obj)
						}else{
							for(var j=0;j<arr.length;j++){
								if(pushTimes[i].taskId==arr[j].taskId){
									let obj1={}
									obj1['id']=pushTimes[i].id
									obj1['taskName']=pushTimes[i].taskName
									arr[j]['taskDetails'].push(obj1)
								}
							}
						}
					}
					let static_programmeName = data.data.programmeName

					arr.sort(function(a,b){return a.id-b.id})
					if (arr.length > 0) {
						arr.map((v, i) => {
							v.key = (+i + 1)<10?('0'+(+i + 1)):(+i + 1)
						})
					}

					yield put({
						type: 'updatePayload',
						payload: {
							values: values,
							// pushTimes: pushTimes,
							pushTimes: arr,
							static_programmeName: static_programmeName
						}
					})

					yield put({
						type: 'chaintaskTaskList',
						payload: {}
					})
					yield put({
						type: 'queryRestaurantInfo',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		//方案名称的校验
		*restaurantChoseCheckName({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

			const newFangan = yield select(({ newFangan }) => newFangan)

			const { data } = yield call(httpPost, config.restaurantChoseCheckName + '?name=' + payload.name, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					if (data.data == true) {
						message.error('方案名称重复了')
					} else {
						yield put({
							type: 'updatePayload',
							payload: {
								activeStop: (++newFangan.activeStop > 3 ? 3 : newFangan.activeStop)
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