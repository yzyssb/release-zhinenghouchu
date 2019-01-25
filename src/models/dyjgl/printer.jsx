import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'printer',
	state:{
		offset:0,
		size:10,
		total:10,
		current:1,
		visible:false,
		baseInfoFormRest:1,
		modalIndex:1,
		loading:false,

		data:[],
		printerCate:[],
		record:{
			printType:'1',
			printName:'',
			printWidth:'1',
			printIp:'',
			printPort:'9100',
			printSort:'1',
			printSortList:[],
			printCategoryId:[]
		},
		printSortList:[],
		printCategoryId:[]
	},

	subscriptions: {
		
    }, 
  
	effects:{
		//获取table	
		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerTable;

		      payload.offset = yield select(({printer}) => printer.offset);
      		  payload.size = yield select(({printer}) => printer.size); 

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
		      		yield put({
		      			type:'updatePayload',
		      			payload:{data:data.data,total:data.totalCount}
		      		})
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		     }  
  		},
  		//获取出品部门
  		*getCate({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerList;

		      payload.offset = yield select(({printer}) => printer.offset);
      		  payload.size = yield select(({printer}) => printer.size); 

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'updatePayload',
		      			payload:{printerCate:data.data}
		      		})
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		     }  
  		},
  		//更新table
  		*UpdateList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerUpdate;

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			        yield put({ type: 'getList',payload:{} });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		     }  
  		},
  		//删除打印机
  		*DeletePrinter({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerDelete+payload.id;

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			        yield put({ type: 'getList',payload:{} });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		     }  
  		},
  		//查询已经选择的出品部门
  		*printerchoosedD({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerchoosedD+payload.id;

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		let list=[]
		      		if(data.data.length>0){
		      			data.data.map((value,index)=>{
		      				list.push(String(value.printCategoryId))
		      			})
		      		}
			        yield put({ type: 'updatePayload',payload:{printCategoryId:list} });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		     }  
  		},
  		//查询已经选择的打印类型
  		*printerchoosedL({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.printerchoosedL+payload.id;

		      let record=yield select(({printer})=>printer.record)

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		let list=[]
		      		if(data.data.length>0){
		      			data.data.map((value,index)=>{
		      				list.push(String(value.printSortId))
		      			})
		      		}
			        yield put({ type: 'updatePayload',payload:{printSortList:list} });
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