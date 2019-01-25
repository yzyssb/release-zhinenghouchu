import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';

export default{
	namespace:'tcmxb',
	state:{
		linkOrigin:linkOrigin,
		start:0,
		size:10,
		total:0,
		current:1,
		loading:false,
		startTime:moment().startOf("day"),
		endTime:moment().endOf("day"),
		orgName:'',
		resIdOrgNameMap:{},
		restaurantIds:null,
		list1:[],
		choosedIndex:-1,
		Base:{},
		Detail:[],

		activeIndex:0,
		cate:[],
		defaultCheckedKeys:[],
		defaultExpandedKeys:[],
		tempCheckedKeys:[],
		tempResIdOrgNameMap:{},
		tempRestaurantIds:[],

		static_days:'0',
		restaurantList:[]
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/tcmxb') {
			  dispatch({
				type: 'getData',
				payload: {},
			  });
			}
		  });
		},
    },
  
	effects:{
		*getData({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbDate;

		      const startTime=yield select(({tcmxb}) => tcmxb.startTime);
		      const endTime=yield select(({tcmxb}) => tcmxb.endTime);

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var restaurantList=[],restaurantIds=[],resIdOrgNameMap={},restaurantNames=[]
			      	data.data.shopList.forEach((value,index)=>{
			      		restaurantList.push(value)
			      		restaurantIds.push(value.id)
			      		resIdOrgNameMap[value.id]=value.name
			      		restaurantNames.push(value.name)
			      	})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			restaurantList:restaurantList,
			      			restaurantIds:restaurantIds,
			      			resIdOrgNameMap:resIdOrgNameMap,
			      			restaurantNames:restaurantNames
			      		}
			      	})
			      	yield put({
			      		type:'getTotal',
			      		payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:resIdOrgNameMap,restaurantIds:restaurantIds}
			      	})
			      	yield put({
			      		type:'getList',
			      		payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:resIdOrgNameMap,restaurantIds:restaurantIds}
			      	})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
		*getData1({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbBase;

		      const startTime=yield select(({tcmxb}) => tcmxb.startTime);
		      const endTime=yield select(({tcmxb}) => tcmxb.endTime);

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var cate=[]
			      	var resIdOrgNameMap={},restaurantIds=[],defaultCheckedKeys=[],tempCheckedKeys=[],tempResIdOrgNameMap={},tempRestaurantIds=[]
			      	data.data.lsCompany.brandList.forEach((value,index)=>{
			      		cate.push({
			      			key:'0-'+index,
			      			name:value.name,
			      			restaurantList:[]
			      		})
			      		
			      		value.restaurantList.forEach((val,idx)=>{
			      			cate[cate.length-1].restaurantList.push({
			      				key:'0-'+index+'-'+idx,
			      				name:val.name,
			      				id:val.id
			      			})
			      			defaultCheckedKeys.push('0-'+index+'-'+idx)
			      			tempCheckedKeys.push('0-'+index+'-'+idx)
			      			resIdOrgNameMap[val.id]=val.name
			      			tempResIdOrgNameMap[val.id]=val.name
			      			restaurantIds.push(val.id)
			      			tempRestaurantIds.push(val.id)
			      		})
			      		defaultCheckedKeys.push('0-'+index)
			      		tempCheckedKeys.push('0-'+index)
			      	})
			      	defaultCheckedKeys.push('0')
			      	tempCheckedKeys.push('0')

			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			cate:cate,
			      			restaurantIds:[],
			      			tempRestaurantIds:tempRestaurantIds,
			      			resIdOrgNameMap:{},
			      			tempResIdOrgNameMap:resIdOrgNameMap,
			      			defaultCheckedKeys:defaultCheckedKeys,
			      			tempCheckedKeys:tempCheckedKeys
			      		}
			      	})


			      	//第二种做法
			      	var restaurantList=[]
			      	data.data.lsCompany.brandList.forEach((value,index)=>{
			      		value.restaurantList.forEach((val,idx)=>{
			      			restaurantList.push(val)
			      		})
			      	})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			restaurantList:restaurantList
			      		}
			      	})

			      	yield put({
			      		type:'getTotal',
			      		payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:{},restaurantIds:[]}
			      	})
			      	yield put({
			      		type:'getList',
			      		payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:{},restaurantIds:[]}
			      	})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*getTotalRes({ payload }, { select, call, put }){
  			 yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbTotal;

		      payload.startTime=new Date(yield select(({tcmxb}) => tcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tcmxb}) => tcmxb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({tcmxb}) => tcmxb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({tcmxb}) => tcmxb.restaurantIds);
	 		  payload.start=yield select(({tcmxb}) => tcmxb.start);
		      payload.size=yield select(({tcmxb}) => tcmxb.size);
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Base:data.data}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
			}
  		},

  		*getListRes({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbList;

		      payload.startTime=new Date(yield select(({tcmxb}) => tcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tcmxb}) => tcmxb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({tcmxb}) => tcmxb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({tcmxb}) => tcmxb.restaurantIds);

	 		  payload.start=yield select(({tcmxb}) => tcmxb.start);
		      payload.size=yield select(({tcmxb}) => tcmxb.size);


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,total:data.totalCount}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
		*getTotal({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbTotal;

		      payload.start=yield select(({tcmxb}) => tcmxb.start);
		      payload.size=yield select(({tcmxb}) => tcmxb.size);
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Base:data.data}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbList;

		      payload.start=yield select(({tcmxb}) => tcmxb.start);
		      payload.size=yield select(({tcmxb}) => tcmxb.size);
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,total:data.totalCount}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
	},
	reducers:{	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
	 	/*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
        },
	}
}