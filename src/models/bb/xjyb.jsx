import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';

export default{
	namespace:'xjyb',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		
		restaurantIds:[],
		restaurantList:[],

		get_restaurantId:null,
		get_targetTime:null,

		id:null,
		
		value:[],
		treeData:[],
		storeList:{},
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/xjyb') {
				dispatch({
					type:'updatePayload',
					payload:{
						targetTime:moment().startOf('Month'),
						get_restaurantId:null,
						get_targetTime:null,
						id:null,

						restaurantId:null,
						restaurantName:'',
						endStock:0,
						fixed:0,
						mark:'',
						realProfit:0,
						risk:0,
						startStock:0,
						targetTime:new Date()
					}
				})

				console.log(location.query.restaurantId)
				if(location.query.restaurantId){
			    	dispatch({
			    		type:'updatePayload',
			    		payload:{
			    			get_restaurantId:location.query.restaurantId,
			    			get_targetTime:location.query.targetTime
			    		}
			    	})
			    }
			    dispatch({
					type: 'list',
					payload: {},
			    });
			}
		  });
		},
    },
  
	effects:{
		*list({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbDate;

		      const get_restaurantId=yield select(({xjyb})=>xjyb.get_restaurantId)
		      const get_targetTime=yield select(({xjyb})=>xjyb.get_targetTime)

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var restaurantList=[],restaurantIds=[]
			      	data.data.shopList.forEach((value,index)=>{
			      		restaurantList.push(value)
			      		restaurantIds.push(String(value.id))
			      	})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			restaurantList:restaurantList,
			      			restaurantId:restaurantList.length==1?restaurantList[0].id:null,
			      			restaurantName:restaurantList.length==1?restaurantList[0].name:'',
			      		}
			      	})
			      	console.log(get_restaurantId)
			      	if(get_restaurantId&&get_targetTime){
			      		let get_restaurantName=''
			      		restaurantList.map((v,i)=>{
			      			if(v.id==get_restaurantId){
			      				get_restaurantName=v.name
			      			}
			      		})
			      		yield put({
				      		type:'updatePayload',
				      		payload:{
				      			restaurantId:get_restaurantId,
				      			restaurantName:get_restaurantName,
				      			targetTime:+get_targetTime
				      		}
				      	})	

				      	yield put({
				      		type:'financeMonthSelect',
				      		payload:{}
				      	})
			      	}else{
			      		yield put({ type: 'hideLoading' });
			      	}
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*financeMonthIn({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeMonthIn;

		      const id=yield select((xjyb)=>xjyb.id)

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(id){
						message.success('修改月报成功')
		      		}else{
		      			message.success('录入月报成功')
		      		}
		      		yield put({ type: 'hideLoading' });
		      		yield put(routerRedux.push({
			            pathname: '/xjbbInfo',
			            query: {tab:2}
			        }));
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*financeMonthSelect({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeMonthSelect;

		      const xjyb=yield select(({xjyb})=>xjyb)
		      payload.restaurantId=+xjyb.restaurantId
		      payload.targetTime=new Date(xjyb.targetTime).getTime()


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		console.log(data.data)
		      		yield put({
		      			type:'updatePayload',
		      			payload:{
		      				endStock:data.data.endStock/100,
		      				fixed:data.data.fixed/100,
		      				mark:data.data.mark,
		      				id:data.data.id,
		      				realProfit:data.data.realProfit/100,
		      				restaurantId:data.data.restaurantId,
		      				restaurantName:data.data.restaurantName,
		      				risk:data.data.risk/100,
		      				startStock:data.data.startStock/100,
		      				targetTime:data.data.targetTime,
		      			}
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