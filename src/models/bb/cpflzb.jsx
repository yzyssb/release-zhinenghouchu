import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default{
	namespace:'cpflzb',
	state:{
		linkOrigin:linkOrigin,
		start:0,
		size:10,
		total:0,
		current:1,
		loading:false,
		startTime:moment().startOf("month"),
		endTime:moment().endOf("day"),
		orgName:'',
		resIdOrgNameMap:{},
		restaurantIds:null,
		restaurantList:[],
		list1:[],
		choosedIndex:-1,
		choosedIndex1:1,
		Base:{},
		Detail:[],

		activeIndex:0,
		cate:[],
		
		obj1:{},
		value:[],
		autoExpand:false,

		static_days:'0',
		restaurantList:[],
		categoryName:'', //搜索-门店名称
		changeSearch:false
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpflzb') {
				dispatch({
					type:'updatePayload',
					payload:{
						categoryName:'',
						autoExpand:false,
					}
				})
				dispatch({
					type: 'userPower',
					payload: {},
				});
			}
		  });
		},
    }, 
  
	effects:{
		* userPower({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
			
			const startTime=yield select(({cpflzb}) => cpflzb.startTime);
		    const endTime=yield select(({cpflzb}) => cpflzb.endTime);
			
            const {data} = yield call(httpPost, config.userPower, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                
				let arr=[],obj2={},value=[]
				function extend(target, source) {
				  for (var key in source) {
					if (Object.prototype.toString.call(source[key]) === '[object Object]') {
					  target[key] = {}
					  extend(target[key], source[key])
					} else if (Object.prototype.toString.call(source[key]) === '[object Array]') {
					  target[key] = []
					  extend(target[key], source[key])
					} else {
					  if (key == "nodeName") {
						target["title"] = source[key];
					  }else{
						target[key] = source[key]
					  }
					  target["key"] = source["id"] + "-" + source["nodeName"]
					  target["value"] = source["id"] + "-" + source["nodeName"]
					  if(Object.keys(source).indexOf('children')==-1&&arr.indexOf(source["id"])==-1){
						  arr.push(source["id"])
						  value.push(source["id"] + "-" + source["nodeName"])
						  obj2[source["id"]]=source["nodeName"]
					  }
					}
				  }
				}
				
				let obj1={}
				if(Object.keys(data.data).length>0){
					extend(obj1,data.data)
					yield put({
						type:'updatePayload',
						payload:{
							obj1:obj1,
							resIdOrgNameMap:obj2,
							restaurantIds:arr,
							value:value
						}
					})
				}
				
				yield put({
					type:'getList',
					payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:obj2,restaurantIds:arr,queryType:1}
				})
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
  		*getTotalRes({ payload }, { select, call, put }){
  			 yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbTotal1;

		      payload.startTime=new Date(yield select(({cpflzb}) => cpflzb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({cpflzb}) => cpflzb.endTime)).getTime();
	 		  payload.restaurantIds=yield select(({cpflzb}) => cpflzb.restaurantIds);
	 		  payload.queryType=yield select(({cpflzb}) => cpflzb.choosedIndex1);
	 		  const categoryName=yield select(({cpflzb}) => cpflzb.categoryName);
	 		  if(categoryName.length>0){
	 		  	payload.categoryName=categoryName
	 		  }

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
		      const orderListUrl = config.tuiCaiMxbList1;

		      payload.startTime=new Date(yield select(({cpflzb}) => cpflzb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({cpflzb}) => cpflzb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({cpflzb}) => cpflzb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({cpflzb}) => cpflzb.restaurantIds);
	 		  payload.queryType=yield select(({cpflzb}) => cpflzb.choosedIndex1);
	 		  const categoryName=yield select(({cpflzb}) => cpflzb.categoryName);
	 		  if(categoryName.length>0){
	 		  	payload.categoryName=categoryName
	 		  }

		      const { data } = yield call(httpPost,orderListUrl, payload); 
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,total:data.data?data.data.length:0,value1:[]}
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
		      const orderListUrl = config.tuiCaiMxbTotal1;

	 		  payload.queryType=yield select(({cpflzb}) => cpflzb.choosedIndex1);
	 		  const categoryName=yield select(({cpflzb}) => cpflzb.categoryName);
	 		  if(categoryName.length>0){
	 		  	payload.categoryName=categoryName
	 		  }

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
		      const orderListUrl = config.tuiCaiMxbList1;

	 		  payload.queryType=yield select(({cpflzb}) => cpflzb.choosedIndex1);
	 		  const categoryName=yield select(({cpflzb}) => cpflzb.categoryName);
	 		  if(categoryName.length>0){
	 		  	payload.categoryName=categoryName
	 		  }

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,value1:[]}
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