import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import React, { PropTypes } from 'react';
import moment from 'moment';
import common from './common.less';

export default{
	namespace:'fjzbb',
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
		restaurantList:[],
		list1:[],
		choosedIndex:-1,
		Base:{},
		Detail:[],

		activeIndex:0,
		cate:[],

		static_days:'0',
		restaurantList:[],
		
		obj1:{},
		value:[],
		autoExpand:false,

		subList:[],
		visible:false,
		subColumns:[],

		modal_visible:false,
		record:{},
		info:{},
		foodSumPrice:0
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/fjzbb') {
				dispatch({
				type: 'userPower',
				payload: {autoExpand:false,},
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
			
			const startTime=yield select(({fjzbb}) => fjzbb.startTime);
		    const endTime=yield select(({fjzbb}) => fjzbb.endTime);
			
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
					payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:obj2,restaurantIds:arr}
				})
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
		*getData({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbDate;

		      const startTime=yield select(({fjzbb}) => fjzbb.startTime);
		      const endTime=yield select(({fjzbb}) => fjzbb.endTime);

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	var restaurantList=[],restaurantIds=[],resIdOrgNameMap={}
			      	data.data.shopList.forEach((value,index)=>{
			      		restaurantList.push(value)
			      		restaurantIds.push(String(value.id))
			      		resIdOrgNameMap[value.id]=value.name
			      	})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			restaurantList:restaurantList,
			      			restaurantIds:restaurantIds,
			      			resIdOrgNameMap:resIdOrgNameMap
			      		}
			      	})
			      	yield put({
			      		type:'getList',
			      		payload:{startTime:new Date(startTime).getTime(),endTime:new Date(endTime).getTime(),resIdOrgNameMap:resIdOrgNameMap,restaurantIds:restaurantIds}
			      	})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},

  		*getListRes({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.recashDetail;

		      payload.startTime=new Date(yield select(({fjzbb}) => fjzbb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({fjzbb}) => fjzbb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({fjzbb}) => fjzbb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({fjzbb}) => fjzbb.restaurantIds);

	 		  payload.offset=yield select(({fjzbb}) => fjzbb.start);
		      payload.size=yield select(({fjzbb}) => fjzbb.size);


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,total:data.totalCount,value1:[]}
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
		      const orderListUrl = config.recashDetail;

		      payload.offset=yield select(({fjzbb}) => fjzbb.start);
		      payload.size=yield select(({fjzbb}) => fjzbb.size);
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Detail:data.data,total:data.totalCount,value1:[]}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},

  		*recashInfo({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.recashInfo;
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		let arr=[]
		      		if(data.data&&data.data.length>0){
		      			data.data.map((val,idx)=>{
		      				val.key=idx
		      				if(val.payInfos.length>0){
		      					val.payInfos.map((v,i)=>{
		      						if(arr.length==0){
		      							arr.push({
		      								en:'key_'+arr.length,
		      								ch:v.payName
		      							})
		      						}else{
		      							let a=false
		      							arr.map((va,ia)=>{
		      								if(va.ch==v.payName){
		      									a=true
		      								}
		      							})
		      							if(!a){
		      								arr.push({
			      								en:'key_'+arr.length,
			      								ch:v.payName
			      							})
		      							}
		      						}
		      					})
		      				}
		      			})
		      		}
		      		console.log(arr)
		      		let subColumns=[
				        {
				            title:'序号',
				            dataIndex:'num',
				            key:'num',
				            className:common.right,
				        },
				        {
				            title:'账单类型',
				            dataIndex:'orderType',
				            key:'orderType',
				            className:common.left,
				        },
				        {
				            title:'结账时间',
				            dataIndex:'finishTime',
				            key:'finishTime',
				            className:common.left,
				        },
				        {
				            title:'应收',
				            dataIndex:'needMoney',
				            key:'needMoney',
				            className:common.right,
				        },
				        {
				            title:'实收',
				            dataIndex:'recieveMoney',
				            key:'recieveMoney',
				            className:common.right,
				        }
				    ]

				    if(arr.length>0){
				    	arr.map((v,i)=>{
				    		subColumns.push({
				    			title:v.ch,
					            dataIndex:v.en,
					            key:v.en,
					            className:common.right,
					            render:(text,record,index)=>(
					            	<span>{record[v.en]?record[v.en]:'--'}</span>
					            )
				    		})
				    		data.data.map((val,idx)=>{
				    			val.payInfos.map((va,ia)=>{
				    				if(va.payName==v.ch){
				    					val[v.en]=va.payMoney
				    				}
				    			})
				    			
				    		})
				    	})
				    }

			      	yield put({
			      		type:'updatePayload',
			      		payload:{subList:data.data,subColumns:subColumns,visible:true,value1:[]}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		* info({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const {data} = yield call(httpPost, config.billInfoUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                let foodSumPrice = 0;
                let info = data.data;
                if(info.foodInfos){
	                info.foodInfos.map((item,index) => {
	                	item.key=index
	                    foodSumPrice += item.totalPrice*100;
	                });
                }
                yield put({
                    type: 'updatePayload',
                    payload: {
                        info: info,
                        foodSumPrice: foodSumPrice,
						value1:[]
                    }
                });
                yield put({
                    type: 'hideLoading'
                });
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)
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