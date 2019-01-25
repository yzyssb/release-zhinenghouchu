import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default{
	namespace:'setRenwu',
	state:{
		offset:0,
		size:10,
		current:1,
		total:0,

		//模拟数据
		mockData:[],
		targetKeys:[],
		
		selectedRowKeys:[],
		visible:false,

		kitchenId:'',

		taskName:'',


		list:[],

		taskIds:[],
		ids:[],
		foodList:[],
		foodId:'-1',

		static_targetKeys:[],
		static_taskIds:[],
	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  	history.listen(location => {
				if (location.pathname === '/setRenwu') {
					dispatch({
						type:'updatePayload',
						payload:{
							//模拟数据
							mockData:[],
							targetKeys:[],
							
							selectedRowKeys:[],
							visible:false,

							kitchenId:'',

							taskName:'',


							list:[],

							taskIds:[],
							ids:[],
							foodList:[],
							foodId:'-1',
							static_targetKeys:[],
							static_taskIds:[],

							kitchenId:location.query.kitchen_id,
						}
					})
					dispatch({
						type:'selectProgrammeKitchenId',
						payload:{}
					})
					
					dispatch({
						type:'selectByBrandId',
						payload:{}
					})
				}
		  	});
		},
    }, 
  
	effects:{
		*selectByBrandId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
		    //const { data } = yield call(httpPost,config.selectByBrandId+'?id=0', payload);
		    const { data } = yield call(httpPost,config.selectByBrandId, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'updatePayload',
		      			payload:{
		      				foodList:data.data
		      			}
		      		})
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		}, 	
		//查看厨房已有任务
		*selectProgrammeKitchenId({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

		    const setRenwu = yield select(({ setRenwu }) => setRenwu);
		    if(setRenwu.taskName.length>0){
		    	payload.taskName=setRenwu.taskName
		    }
		    if(setRenwu.foodId!=-1){
		    	payload.foodId=+setRenwu.foodId
		    }
		    payload.kitchenId=+setRenwu.kitchenId
		      			 
		    const { data } = yield call(httpPost,config.selectProgrammeKitchenId, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){

		      		if(data.data&&data.data.length>0){
		      			data.data.map((v,i)=>{
		      				v.key=+i+1
		      			})
		      		}
		      		yield put({
	      				type:'updatePayload',
	      				payload:{
	      					list:data.data
	      				}
	      			})
	      			yield put({
						type:'restaurantChoseSeleteTask',
						payload:{}
					})
	      			yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	}  
  		},
  		//保存厨房配置的任务
  		*restaurantChoseChoseProgrammeKitchen({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

		    const setRenwu = yield select(({ setRenwu }) => setRenwu);
		    payload.kitchenId=+setRenwu.kitchenId
		    payload.taskIds=setRenwu.taskIds
		      			 
		    const { data } = yield call(httpPost,config.restaurantChoseChoseProgrammeKitchen, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		message.success('保存成功')
		      		yield put({
	      				type:'updatePayload',
	      				payload:{visible:false}
	      			})
		      		yield put({
	      				type:'selectProgrammeKitchenId',
	      				payload:{}
	      			})
	      			yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					yield put({
	      				type:'updatePayload',
	      				payload:{visible:false}
	      			})
					message.error(data.msg)
				} 
		  	}  
  		},
  		//厨房可选择的任务
  		*restaurantChoseSeleteTask({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

		    const setRenwu = yield select(({ setRenwu }) => setRenwu);
		      			 
		    const { data } = yield call(httpPost,config.restaurantChoseSeleteTask, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){

		      		if(data.data&&data.data.length>0){
		      			data.data.map((v,i)=>{
		      				v.key=+i+1
		      			})
		      		}
		      		let targetKeys=[],taskIds=[],static_targetKeys=[],static_taskIds=[]
		      		if(setRenwu.list.length>0){
		      			setRenwu.list.map((v,i)=>{
		      				if(data.data.length>0){
		      					data.data.map((vv,ii)=>{
		      						if(vv.id==v.taskId&&targetKeys.indexOf(vv.id)==-1){
		      							targetKeys.push(ii+1)
		      							taskIds.push(v.taskId)
		      							static_targetKeys.push(ii+1)
		      							static_taskIds.push(v.taskId)
		      						}
		      					})
		      				}
		      			})
		      		}

		      		yield put({
	      				type:'updatePayload',
	      				payload:{
	      					mockData:data.data,
	      					targetKeys:targetKeys,
	      					taskIds:taskIds,
	      					static_targetKeys:static_targetKeys,
	      					static_taskIds:static_taskIds
	      				}
	      			})
	      			console.log(targetKeys)
	      			yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	}  
  		},
  		//删除厨房配置的任务
  		*deleteChoseProgrammeKitchen({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });

		    const setRenwu = yield select(({ setRenwu }) => setRenwu);
		      			 
		    const { data } = yield call(httpPost,config.deleteChoseProgrammeKitchen+'?ids='+setRenwu.ids, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){

		      		message.success('删除成功')  

		      		yield put({
	      				type:'updatePayload',
	      				payload:{
	      					selectedRowKeys:[]
	      				}
	      			})
		      		yield put({
	      				type:'selectProgrammeKitchenId',
	      				payload:{}
	      			})
	      			yield put({
	      				type:'restaurantChoseSeleteTask',
	      				payload:{}
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