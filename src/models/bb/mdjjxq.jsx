import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default{
	namespace:'mdjjxq',
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

		static_days:'0',
		restaurantList:[],

		postId:0,
		employeeName:'',
		restaurantId:0, 
		list:[]
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/mdjjxq') {
			  dispatch({
				type: 'updatePayload',
				payload: location.query,
			  });
			  dispatch({
				type: 'updatePayload',
				payload: {
					startTime:moment(new Date(Number(location.query.startTime))),
					endTime:moment(new Date(Number(location.query.endTime))),
					static_days:'0'
				},
			  });
			  
			  dispatch({
				type: 'getData',
				payload: {},
			  });
			  dispatch({
				type: 'getList',
				payload: {},
			  });
			}
		  });
		},
    },
  
	effects:{
		*getData({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.resDetail;

		      payload.startTime=new Date(yield select(({mdjjxq}) => mdjjxq.startTime)).getTime();
		      payload.endTime=new Date(yield select(({mdjjxq}) => mdjjxq.endTime)).getTime();
		      payload.offset=yield select(({mdjjxq}) => mdjjxq.start);
		      payload.size=yield select(({mdjjxq}) => mdjjxq.size);
		      payload.restaurantId=Number(yield select(({mdjjxq}) => mdjjxq.restaurantId))

		      const postId=yield select(({mdjjxq}) => mdjjxq.postId)
		      const employeeName=yield select(({mdjjxq}) => mdjjxq.employeeName)

		      if(employeeName.length>0){
		      	payload.employeeName=employeeName
		      }
		      if(postId>0){
		      	payload.postId=postId
		      }

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
		      			data.data.map((val,idx)=>{
		      				val.key=+idx+1
		      			})
		      		}
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
  		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.selectWaiterGroup;

		      payload.restaurantId=Number(yield select(({mdjjxq}) => mdjjxq.restaurantId))

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'updatePayload',
		      			payload:{list:data.data}
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