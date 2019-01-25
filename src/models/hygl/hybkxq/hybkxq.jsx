import { httpPost,httpPostByBase } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import moment from "moment/moment";
import {postVipExportFile} from '../../../services/CommonService';
import message from 'antd/lib/message';
const todaystart = moment().startOf("day");
const todayend = moment().endOf("day");


export default{
	namespace:'hybkxq',
	state:{
		offset:0,
		size:10,
        current:1,
        startTime: todaystart,
        endTime: todayend,
        postStartTime:new Date(todaystart.format('YYYY-MM-DD HH:mm:ss')).valueOf(),
        postEndTime:new Date(todayend.format('YYYY-MM-DD HH:mm:ss')).valueOf(),
		orgName:'',
		resIdOrgNameMap:{},
		restaurantIds:null,
        restaurantList:[],
		choosedIndex:null,
        postChoosedIndex:[],
		list:[],
        storeList:[],
        postMap:{},
        static_days:'0',
		
		obj1:{},
		value:[],
		autoExpand:false,
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/hybkxq') {
				dispatch({
					type: 'updatePayload',
					payload: {
						autoExpand:false,
					},
				});
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
					  if(arr.indexOf(source["id"])==-1){
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
					type: 'query',
					payload: {},
				});
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
		*query({ payload }, { select, call, put }) {
			  
		    const foodSellUrl = config.vipDetailUrl;

            payload.startDate=yield select(({hybkxq}) => hybkxq.postStartTime);
            payload.endDate=yield select(({hybkxq}) => hybkxq.postEndTime);
            payload.offset=yield select(({hybkxq}) => hybkxq.offset);
            payload.size=yield select(({hybkxq}) => hybkxq.size);
            var restaurantIds=yield select(({hybkxq}) => hybkxq.restaurantIds);
            if (restaurantIds.length == 0) {
                message.warning('请选择门店');
                return;
            }
            payload.resIdOrgNameMap = yield select(({hybkxq}) => hybkxq.resIdOrgNameMap);
            payload.restaurantIds  = restaurantIds;
            payload.mobile = yield select(({hybkxq}) => hybkxq.mobile);

            var current = yield select(({hybkxq}) => hybkxq.current);

            var size = yield select(({hybkxq}) => hybkxq.size);

		      const { data } = yield call(httpPostByBase,foodSellUrl, payload);
		      if (data && data.data) {
		      	if(data.code == config.MSGCODE_SUCCESS){

                     data.data.list.map((i,j)=>{

                        i.id = (current*size-size+j + 1)

                    })

                    yield put({
                        type:'updatePayload',
                        payload:{list:data.data.list,total:data.data.total,yesterdayTotal:data.data.yesterdayTotal,vipTotal:data.data.vipTotal,value1:[]}
                    })

		      	}else{
					console.log(data.msg)
				}
		  }
  		},
        * _export({payload}, {select, call, put}) {
            payload.startDate=yield select(({hybkxq}) => hybkxq.postStartTime);
            payload.endDate=yield select(({hybkxq}) => hybkxq.postEndTime);
            payload.offset=yield select(({hybkxq}) => hybkxq.offset);
            payload.size=yield select(({hybkxq}) => hybkxq.size);
            var restaurantIds=yield select(({hybkxq}) => hybkxq.restaurantIds);
            payload.resIdOrgNameMap = yield select(({hybkxq}) => hybkxq.resIdOrgNameMap);
            payload.restaurantIds  = restaurantIds;
            payload.mobile = yield select(({hybkxq}) => hybkxq.mobile);

            postVipExportFile(config.vipExportUrl, payload, "会员表.xlsx");
        },
        

	},
	reducers:{	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
	}
}