import { httpPost, httpPostWithId } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default {
	namespace: 'lsyybz',
	state: {
		offset: 0,
		size: 10,
		modalVisible: false,
		commentTypes: [],
		isAdd: true,
		id: '',
		comment: '',
		commentType: 1,
		keyword: '',

		brandId: 0,
		brandList: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				if (location.pathname === '/lsyybz') {
					dispatch({
						type:'updatePayload',
						payload:{
							comment:'',

							allotModalVisible:false,
							allotModal_key1:'',
							allotModal_key2:'',
							allotModal_key3:'1',

							selectedRowKeys:[],
							selectedRows:[],

							resModalVisible:false,

							checkAll:false,
							indeterminate: true,
							checkedList:[],

							plainOptions:[],
						}
					})
					dispatch({
						type: 'brandListUrl',
						payload: {},
					});
					
					dispatch({
						type: 'queryCommentTypes',
						payload: {},
					});

				}
			});
		},
	},

	effects: {
		* brandListUrl({ payload }, { select, call, put }) {
			const { data } = yield call(httpPost, config.brandListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				yield put({
					type: 'updatePayload',
					payload: {
						brandList: data.data,
						brandId: !sessionStorage.getItem('brandId_lsyybz') ? (data.data.length > 0 ? data.data[0].key : 0) : +sessionStorage.getItem('brandId_lsyybz'),
					}
				});
				yield put({
					type: 'chooseBrandUrl',
					payload: {}
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*chooseBrandUrl({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz = yield select(({ lsyybz }) => lsyybz)

			const { data } = yield call(httpPost, config.chooseBrandUrl + lsyybz.brandId, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'query',
						payload: {}
					})
					yield put({
						type: 'storeByBrandId',
						payload: {}
					})
					yield put({ type: 'hideLoading' });
				} else {
					yield put({ type: 'hideLoading' });
					message.error(data ? data.msg : '接口报错')
				}
			}
		},
		*query({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.commentQuery;//替换
			payload.offset = yield select(({ lsyybz }) => lsyybz.offset);
			payload.size = yield select(({ lsyybz }) => lsyybz.size);

			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				var total = data.data.length;
				data.data.map((value, index) => {
					value.key = +index + 1
				})
				yield put({
					type: 'updatePayload',
					payload: {
						list: data.data,
						total: data.totalCount,
						selectedRowKeys:[],
						selectedRows:[],
					},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*queryCommentTypes({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.commentTypesUrl;
			payload.offset = yield select(({ lsyybz }) => lsyybz.offset);
			payload.size = yield select(({ lsyybz }) => lsyybz.size);
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				var total = data.data.length;
				yield put({
					type: 'updatePayload',
					payload: {
						commentTypes: data.data,
						commentType: data.data[0].value,
					},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*updateComment({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz=yield select(({ lsyybz }) => lsyybz);
			const orderListUrl = config.commentPost;//替换
			payload.content = lsyybz.comment
			payload.commentType = lsyybz.commentType
			payload.id=lsyybz.id
			for(var i=0;i<lsyybz.commentTypes.length;i++){
				if(lsyybz.commentType==lsyybz.commentTypes[i].value){
					payload.comment=lsyybz.commentTypes[i].key
				}
			}

			const { data } = yield call(httpPost, orderListUrl, payload, );
			if (data&&data.code == config.MSGCODE_SUCCESS) {

				yield put({
					type: 'query',
					payload: {},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*addComment({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz=yield select(({ lsyybz }) => lsyybz);
			const orderListUrl = config.commentPost;//替换
			payload.content = lsyybz.comment
			payload.commentType = lsyybz.commentType
			for(var i=0;i<lsyybz.commentTypes.length;i++){
				if(lsyybz.commentType==lsyybz.commentTypes[i].value){
					payload.comment=lsyybz.commentTypes[i].key
				}
			}

			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {

				yield put({
					type: 'query',
					payload: {},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*deleteAction({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			// 注意链接地址要加一个要删除的原因备注的id
			const orderListUrl = config.commentDeleteById+'?id='+ payload.id;//替换
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				yield put({
					type: 'query',
					payload: {},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*storeByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz=yield select(({ lsyybz }) => lsyybz);
			const { data } = yield call(httpPost, config.storeByBrandId+lsyybz.brandId, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {

				var arr=[]
				if(data.data&&data.data.length>0){
					data.data.map(v=>{
						arr.push({
							label:v.value,
							value:v.key
						})
					})
				}

				yield put({
					type: 'updatePayload',
					payload: {
						plainOptions:arr
					},
				});
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*commentAllotComments({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz=yield select(({ lsyybz }) => lsyybz);
			payload.ids=lsyybz.selectedRowKeys
			payload.restaurantIds=lsyybz.checkedList
			payload.type=+lsyybz.allotModal_key3
			const { data } = yield call(httpPost, config.commentAllotComments, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				message.success('分配成功')
				yield put({
					type:'updatePayload',
					payload:{
						selectedRowKeys:[],
					}
				})
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		},
		*commentCheckName({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const lsyybz=yield select(({ lsyybz }) => lsyybz);
			const url=config.commentCheckName+'?name='+lsyybz.comment+'&id='+(lsyybz.isAdd?'0':lsyybz.id)+'&type='+lsyybz.commentType
			const { data } = yield call(httpPost, url, payload);
			if (data&&data.code == config.MSGCODE_SUCCESS) {
				if(data.data==1){
					message.error('同一备注分类下面不能有重复的备注原因名称');
					return;
				}
				if (lsyybz.isAdd) {
					yield put({
						type: 'addComment',
						payload: {}
					});
		
				} else {
					yield put({
						type: 'updateComment',
						payload: {}
					});
				}
			} else {
				message.error(data ? data.msg : '接口报错')
			}
		}
	},
	reducers: {

		updatePayload(state, action) {
			return { ...state, ...action.payload, };
		},

	}
}