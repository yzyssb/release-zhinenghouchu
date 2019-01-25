import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default{
	namespace:'jyzdDetail',
	state:{
		loading:false,
		offset:0,
		size:10,
		total:0,
		current:1,
		loading:false,

		startTime:null,
	    endTime:null,
	    restaurantId:0,
	    // transactionScene:1,
	    costType:4,
	    dates:null,
	    type:1,

	    list:[],
		

		timeParse:function(t){
			t=new Date(String(t))
			let year=t.getFullYear(),
				month=t.getMonth()+1,
				day=t.getDate()
			return year+'-'+(month<10?('0'+month):month)+'-'+(day<10?('0'+day):day)
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  	history.listen(location => {
				if (location.pathname === '/jyzdDetail') {
					dispatch({
						type:'updatePayload',
						payload:{
							startTime:location.query.startTime,
							endTime:location.query.endTime,
							restaurantId:location.query.restaurantId,
							// transactionScene:location.query.transactionScene,
							costType:location.query.costType,
							dates:location.query.dates,
							type:location.query.type,
							name:location.query.name,

							offset:0,
							size:10,
							total:0,
							current:1,
							list:[],
						} 
					})
					let type=location.query.type

					if(type==1){
						dispatch({
							type:'auditBillsPayDetail',
							payload:{}
						})
					}else if(type==2){
						dispatch({
							type:'auditBillsRefundDetail',
							payload:{}
						})
					}
				}
		  	});
		},
    },
  
	effects:{
		*auditBillsPayDetail({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const jyzdDetail=yield select(({jyzdDetail}) => jyzdDetail);

			payload.startTime=String(jyzdDetail.startTime)
			payload.endTime=String(jyzdDetail.endTime)
			// payload.transactionScene=jyzdDetail.transactionScene!=-1?String(jyzdDetail.transactionScene):''
			payload.transactionScene=''
			payload.costType=+jyzdDetail.costType
			payload.restaurantId=+jyzdDetail.restaurantId
			payload.offset=jyzdDetail.offset
			payload.size=jyzdDetail.size

            const {data} = yield call(httpPost, config.auditBillsPayDetail, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                if(data.data&&data.data.length>0){
            		data.data.map((v,i)=>{
            			v.key=+i+1
            		})
            	}
                yield put({
                	type:'updatePayload',
                	payload:{
                		list:data.data,
                		total:data.totalCount
                	}
                })
				
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
            }
  		},
  		*auditBillsRefundDetail({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const jyzdDetail=yield select(({jyzdDetail}) => jyzdDetail);

			payload.startTime=String(jyzdDetail.startTime)
			payload.endTime=String(jyzdDetail.endTime)
			// payload.transactionScene=jyzdDetail.transactionScene!=-1?String(jyzdDetail.transactionScene):''
			payload.transactionScene=''
			payload.costType=+jyzdDetail.costType
			payload.restaurantId=+jyzdDetail.restaurantId
			payload.offset=jyzdDetail.offset
			payload.size=jyzdDetail.size

            const {data} = yield call(httpPost, config.auditBillsRefundDetail, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                if(data.data&&data.data.length>0){
            		data.data.map((v,i)=>{
            			v.key=+i+1
            		})
            	}
                yield put({
                	type:'updatePayload',
                	payload:{
                		list:data.data,
                		total:data.totalCount
                	}
                })
				
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
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