import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default{
	namespace:'sydcppxPageConfig',
	state:{
		offset:0,
		size:0,
		total:0,
		sub_total:0,
		loading:false,
		visible: false,		//modal是否显示
		title:'',			//modal上提示的文字
		cpCateIndex:0,		//展开分类的index
		cpCateId:'',		//展开分类的id
		dataSource :[],		//菜品分类列表
		subDataSource:[],		//分类菜品列表
		typeOrigin:1
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpk') {
				// console.log(111)
			  // dispatch({
				// type: 'getList',
				// payload: {},
			  // });
				dispatch({
					type:'updatePayload',
					payload:{
						typeOrigin:1
					}
				})
			}else if(location.pathname === '/sydcppx'){
				dispatch({
					type:'updatePayload',
					payload:{
						typeOrigin:2
					}
				})
				dispatch({
					type:'getList',
					payload:{}
				})
			}
		  });
		},
    }, 
  
	effects:{
		//获取列表
		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
			  const sydcppxPageConfig=yield select(({sydcppxPageConfig})=>sydcppxPageConfig)
			  let type=sydcppxPageConfig.typeOrigin
		      const orderListUrl = type==1?config.foodCateList1:config.foodCateList;		 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
			      		data.data.map((value,index)=>{
			      			value.key=+index+1
			      		})
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            total:data.data.length
				          },
				        });
		      		}
			      	yield put({
			          type: 'updatePayload',
			          payload: {
			            dataSource:data.data
			          },
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		//排序
  		*move({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
			  const sydcppxPageConfig=yield select(({sydcppxPageConfig})=>sydcppxPageConfig)
			  let type=sydcppxPageConfig.typeOrigin
		      const orderListUrl = (type==1?config.foodCateSort1:config.foodCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId;
		      const { data } = yield call(httpPost,orderListUrl,payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }
  		},
  		//先排序再获取列表
  		*moveAndSort({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
			  const sydcppxPageConfig=yield select(({sydcppxPageConfig})=>sydcppxPageConfig)
			  let type=sydcppxPageConfig.typeOrigin
		      const orderListUrl = (type==1?config.foodCateSort1:config.foodCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId;
		      const { data } = yield call(httpPost,orderListUrl,payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
			          type: 'getList',
			          payload: {},
			        });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }
		},
		//展开分类
		*showCates({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
			  const sydcppxPageConfig=yield select(({sydcppxPageConfig})=>sydcppxPageConfig)
			  let type=sydcppxPageConfig.typeOrigin
		      const orderListUrl = (type==1?config.foodSubcateList1:config.foodSubcateList)+'?categoryId='+payload.categoryId;
		      const { data } = yield call(httpPost,orderListUrl,payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
		      			data.data.map((value,index)=>{
			      			value.key=+index+1
			      		})
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            sub_total:data.data.length
				          },
				        });
		      		}
		      		
		      		yield put({
			          type: 'updatePayload',
			          payload: {
			            subDataSource:data.data
			          },
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }
		},
		//modal 先排序再获取列表
  		*subMoveAndSort({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
			  const sydcppxPageConfig=yield select(({sydcppxPageConfig})=>sydcppxPageConfig)
			  let type=sydcppxPageConfig.typeOrigin
		      const orderListUrl = (type==1?config.foodSubCateSort1:config.foodSubCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId+'&foodId='+payload.foodId;
		      const { data } = yield call(httpPost,orderListUrl,payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
			          type: 'showCates',
			          payload: {categoryId:payload.categoryId},
			        });
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
		getListSuccess(state, action) {
            return {...state, ...action.payload,loading: false,visible:false};
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