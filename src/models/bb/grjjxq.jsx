import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';

export default{
	namespace:'grjjxq',
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


		restaurantId:0, 
		employeeId:0,
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/grjjxq') {
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
			}
		  });
		},
    },
  
	effects:{
		*getData({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.employeeDetail;

		      payload.startTime=new Date(yield select(({grjjxq}) => grjjxq.startTime)).getTime();
		      payload.endTime=new Date(yield select(({grjjxq}) => grjjxq.endTime)).getTime();
		      payload.offset=yield select(({grjjxq}) => grjjxq.start);
		      payload.size=yield select(({grjjxq}) => grjjxq.size);
		      payload.restaurantId=Number(yield select(({grjjxq}) => grjjxq.restaurantId))
		      payload.employeeId=Number(yield select(({grjjxq}) => grjjxq.employeeId))

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