import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'dprw',
	state:{
		loading:false,
		list:[],
		detailList:[],

		restaurantName:'',


		total:0,
		size:10,
		offset:0,
		current:1,

		total_1:0,
		size_1:10,
		offset_1:0,
		current_1:1,


		DateParse:function(str){
			let now=new Date(str)
			let year=now.getFullYear(),
				month=now.getMonth()+1,
				day=now.getDate()
			return year+'-'+(month<10?('0'+month):month)+'-'+(day<10?('0'+day):day)
		},
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/dprw') {
				dispatch({
					type:'updatePayload',
					payload:{
						restaurantName:'',
						list:[]
					}
				})
				dispatch({
					type:'chainprogrammeRestaurantList',
					payload:{}
				})
			}
			if (location.pathname === '/dprwDetail') {
				dispatch({
					type:'updatePayload',
					payload:{
						detailList:[]
					}
				})
				dispatch({
					type:'programmeDetail',
					payload:{
						restaurantId:+location.query.restaurantId,
						type:String(location.query.type)
					}
				})
			}
		  });
		},
    }, 
  
	effects:{	
		*chainprogrammeRestaurantList({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
		      
		    const dprw=yield select(({dprw})=>dprw)
		    payload.name=dprw.restaurantName

		    const { data } = yield call(httpPost,config.chainprogrammeRestaurantList, payload);
		    if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
		      			data.data.map((v,i)=>{
		      				v.key=+i+1
		      			})
		      		}
		      		yield put({
			          type: 'updatePayload',
			          payload: {list:data.data},
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data?data.msg:'接口报错')
				} 
		  	}  
  		},
  		*programmeDetail({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
		      
		    const dprw=yield select(({dprw})=>dprw)

		    const { data } = yield call(httpPost,config.programmeDetail, payload);
		    if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
		      			data.data.map((v,i)=>{
		      				v.key=(+i+1)<10?('0'+(+i+1)):(+i+1)
		      			})
		      		}
		      		yield put({
			          type: 'updatePayload',
			          payload: {detailList:data.data},
			        });
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data?data.msg:'接口报错')
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