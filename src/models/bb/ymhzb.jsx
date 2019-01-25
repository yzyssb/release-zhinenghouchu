import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import {postExportFile} from "../../services/CommonService";
import message from 'antd/lib/message';
import moment from 'moment';

export default{
	namespace:'ymhzb',
	state:{
		start:0,
		size:10,
		total:0,
		current:1,
		loading:false,
		startTime:moment().startOf("day"),
		endTime:moment().endOf("day"),
		resIdOrgNameMap:{},
		restaurantIds:null,
		
		obj1:{},
		value:[],
		autoExpand:false,

		static_days:'0',

		list:[],

		eatType:-1,
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/ymhzb') {
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
			const cateType=yield select(({ymhzb}) => ymhzb.cateType);
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
							resIdOrgNameMap1:obj2,
							restaurantIds1:arr,
							value:value
						}
					})
				}
				yield put({
					type:'discountRestaurant',
					payload:{}
				})
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data.msg)  

            }
        },
        * discountRestaurant({payload}, {select, call, put}) {
            yield put({type: 'showLoading'});

            const ymhzb=yield select(({ymhzb})=>ymhzb)
            payload.startTime=new Date(ymhzb.startTime).getTime()
            payload.endTime=new Date(ymhzb.endTime).getTime()
            payload.restaurantIds=ymhzb.restaurantIds
            payload.resIdOrgNameMap=ymhzb.resIdOrgNameMap

            payload.start=ymhzb.start
            payload.offset=ymhzb.start
						payload.size=ymhzb.size
						if(ymhzb.eatType!=-1)	payload.eatType=+ymhzb.eatType

            const {data} = yield call(httpPost, config.discountRestaurant, payload);
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
                message.error(data.msg)  

            }
        },
        * _export({payload}, {select, call, put}) {
            
        	const ymhzb=yield select(({ymhzb})=>ymhzb)
        	payload.startTime=new Date(ymhzb.startTime).getTime()
            payload.endTime=new Date(ymhzb.endTime).getTime()
            payload.restaurantIds=ymhzb.restaurantIds
            payload.resIdOrgNameMap=ymhzb.resIdOrgNameMap
						if(ymhzb.eatType!=-1)	payload.eatType=+ymhzb.eatType

            postExportFile(config.exportDiscountRestaurant, payload, "优免汇总.xlsx");
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