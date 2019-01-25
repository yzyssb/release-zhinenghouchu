import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'dyjglPageConfig',
	state:{
		offset:0,
		size:10,
		total:0,
		current:1,

		sub_offset:0,
		sub_size:10,
		sub_total:0,
		sub_current:1,

		visible:false,
		visible1:false,
		loading:false,
		baseInfoFormRest:1,
		ModalOrigin:1,
		listIndex:0,
		dataSource:[],	//打印机列表
		cpCate:[],		//菜品分类
		cpData:[],

		id:0,		//菜品id
		type:0,		//全部/未分配/已分配
		printCategoryId:0,		//出品部门id
		isChoosed:0,
		chooseAll:0,
		choosedFoodId:[],
		choosedIndex:[],
		printIndex:0,
		defaultChecked:false,
		selectedKeys:[],
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/dyjgl') {
			  dispatch({
				type: 'getList',
				payload: {},
			  });
			}
		  });
		},
    }, 
  
	effects:{		
		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printCategoryList;
		      payload.offset = yield select(({dyjglPageConfig}) => dyjglPageConfig.offset);
      		  payload.size = yield select(({dyjglPageConfig}) => dyjglPageConfig.size); 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
		      		yield put({
			          type: 'updatePayload',
			          payload: {dataSource:data.data,total:data.totalCount},
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},  
  		*checkN({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const ModalOrigin=yield select(({dyjglPageConfig}) => dyjglPageConfig.ModalOrigin);
		      const name = yield select(({dyjglPageConfig}) => dyjglPageConfig.name);
		      const code=yield select(({dyjglPageConfig}) => dyjglPageConfig.code);
		      let orderListUrl = config.printCategoryCheck;
		      let id,status
		      if(ModalOrigin==1){
		      	orderListUrl = config.printCategoryCheckN+'?name='+name;
		      	id=0
		      	status=1
		      }else if(ModalOrigin==2){
		      	const dataSource=yield select(({dyjglPageConfig}) => dyjglPageConfig.dataSource);
		      	const listIndex=yield select(({dyjglPageConfig}) => dyjglPageConfig.listIndex);
		      	const defaultChecked=yield select(({dyjglPageConfig}) => dyjglPageConfig.defaultChecked);
		      	id=dataSource[listIndex].id
		      	status=defaultChecked?'1':'2'
		      	orderListUrl = config.printCategoryCheckN+'?name='+name+'&id='+id;
		      	
		      }
		      
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data>=1){
		      			yield put({ type: 'hideLoading' });
		      			message.error('出品部门名称已存在！')
		      		}else if(data.data==0){
		      			yield put({
		      				type:'checkC',
		      				payload:{}
		      			})
		      			
		      		}
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*checkC({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const ModalOrigin=yield select(({dyjglPageConfig}) => dyjglPageConfig.ModalOrigin);
		      const name = yield select(({dyjglPageConfig}) => dyjglPageConfig.name);
		      const code=yield select(({dyjglPageConfig}) => dyjglPageConfig.code);
		      let orderListUrl = config.printCategoryCheck;
		      let id,status
		      if(ModalOrigin==1){
		      	orderListUrl = config.printCategoryCheckC+'?code='+code;
		      	id=0
		      	status=1
		      }else if(ModalOrigin==2){
		      	const dataSource=yield select(({dyjglPageConfig}) => dyjglPageConfig.dataSource);
		      	const listIndex=yield select(({dyjglPageConfig}) => dyjglPageConfig.listIndex);
		      	const defaultChecked=yield select(({dyjglPageConfig}) => dyjglPageConfig.defaultChecked);
		      	id=dataSource[listIndex].id
		      	status=defaultChecked?'1':'2'
		      	orderListUrl = config.printCategoryCheckC+'?code='+code+'&id='+id;
		      	
		      }
		      
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data>=1){
		      			yield put({ type: 'hideLoading' });
		      			message.error('出品部门编码已存在！')
		      		}else if(data.data==0){
						yield put({
							type:'addOrEdit',
							payload:{code:code,name:name,id:id,status:status}
						})
						yield put({
							type:'updatePayload',
							payload:{baseInfoFormRest:1,visible:false}
						})
						yield put({ type: 'hideLoading' });
		      		}
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*getListAll({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printCategoryList;
		      payload.offset = 0;
      		  payload.size = 0; 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
		      		yield put({
			          type: 'updatePayload',
			          payload: {dataSource:data.data,total:data.totalCount},
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*addOrEdit({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printCategoryNew;	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
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
  		*deleteAction({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printCategoryDelete+'?id='+payload.id;	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
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
  		//获取菜品分类
  		*getCpList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.foodCateList; 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			          type: 'updatePayload',
			          payload: {
			            cpCate:data.data
			          },
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*getFoodList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printFoodList;

		      payload.offset = yield select(({dyjglPageConfig}) => dyjglPageConfig.sub_offset);
      		  payload.size = yield select(({dyjglPageConfig}) => dyjglPageConfig.sub_size);
      		  payload.id = yield select(({dyjglPageConfig}) => dyjglPageConfig.id);
      		  payload.printCategoryId = yield select(({dyjglPageConfig}) => dyjglPageConfig.printCategoryId);
      		  payload.type = yield select(({dyjglPageConfig}) => dyjglPageConfig.type);


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			          type: 'updatePayload',
			          payload: {
			            cpData:data.data,
			            sub_total:+data.totalCount
			          },
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},

  		*printFoodEdit({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printFoodEdit;
		      const id = yield select(({dyjglPageConfig}) => dyjglPageConfig.id);		 
		      const printCategoryId = yield select(({dyjglPageConfig}) => dyjglPageConfig.printCategoryId);		 
		      const type = yield select(({dyjglPageConfig}) => dyjglPageConfig.type);	
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      			
			      	yield put({
			          type: 'getFoodList',
			          payload: {id:id,printCategoryId:printCategoryId,type:type},
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