import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';
import React, { PropTypes } from 'react';
import { Popover } from 'antd';

export default{
	namespace:'tczcmxb',
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
		restaurantIds:[],
		list1:[],
		choosedIndex:-1,
		Base:{},
		Detail:[],

		activeIndex:0,
		cate:[],
		
		obj1:[],
		value:[],
		autoExpand:false,

		static_days:'0',
		restaurantList:[],
		cateType:1,//搜索-退菜/赠菜
		columns:[],
		eatType:-1,

		scrollX:1560,

		//新增字段
		phone:'',
		retreatReason:'',
		giftReason:'',
		optPersonName:'',
		foodNames:[],

		cateList:[],
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/tczcmxb') {
				dispatch({
					type: 'updatePayload',
					payload: {
						//startTime:moment().startOf("day"),
						//endTime:moment().endOf("day"),
						cateType:1,
						autoExpand:false,
						//static_days:'0',

						//新增字段
						phone:'',
						retreatReason:'',
						giftReason:'',
						optPersonName:'',
						foodNames:[],
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
			const cateType=yield select(({tczcmxb}) => tczcmxb.cateType);
            const {data} = yield call(httpPost, config.userPower, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                
            	if(Object.keys(data.data).length>0){
                    let parent={
                        id: '-0',
                        nodeCode: '-0',
                        nodeName: '',
                        nodeType: '-0',
                        children:[]
                    }
                    for(var i=data.data.children.length-1;i>=0;i--){
                        if(!data.data.children[i].children){
                            let obj_yzy={}
                            for(var key in data.data.children[i]){
                                obj_yzy[key]=data.data.children[i][key]
                            }
                            parent.children.push(obj_yzy)
                            data.data.children.splice(i,1)
                        }
                    }
                    data.data.children.push(parent)

                    for(var i=data.data.children.length-1;i>=0;i--){
                        if(data.data.children[i].children&&data.data.children[i].children.length==0){
                            data.data.children.splice(i,1)
                        }
                    }
                }

				let arr=[],obj2={},value=[]
				let a=1
				function extend(target, source) {
				  for (var key in source) {
					if (Object.prototype.toString.call(source[key]) === '[object Object]') {
					  target[key] = {}
					  extend(target[key], source[key])
					} else if (Object.prototype.toString.call(source[key]) === '[object Array]') {
					  target[key] = []
					  extend(target[key], source[key])
					  a++
					} else {
					  if (key == "nodeName") {
						target["title"] = source[key];
					  }else{
						target[key] = source[key]
					  }
					  target["key"] = source["id"] + "-" + source["nodeName"]
					  target["value"] = source["id"] + "-" + source["nodeName"]
					  
					  if(Object.keys(source).indexOf('children')==-1&&arr.indexOf(source["id"])==-1&&a==1){
						  arr.push(source["id"])
						  value.push(source["id"] + "-" + source["nodeName"])
						  obj2[source["id"]]=source["nodeName"]
					  }
					}
				  }
				}
				
				let obj1=[]
				if(Object.keys(data.data).length>0&&data.data.children&&data.data.children.length>0){
					extend(obj1,data.data.children)
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
				console.log(obj1)
				if(obj1.length>1){
					yield put({
		                type:'foodList',
		                payload:{
		                    brandId:+obj1[0].children[0].brandId
		                }
		            })
				}else if(obj1.length==1){
					if(obj1[0].id=='-0'){
						var arr_1=[]
						obj1[0].children.map((v)=>{
                             arr_1.push(+v.id)
                        })
						yield put({
			                type:'foodList1',
			                payload:{
			                    restaurantIds:arr_1
			                }
			            })
					}else{
						yield put({
			                type:'foodList',
			                payload:{
			                    brandId:+obj1[0].children[0].brandId
			                }
			            })
					}
				}else{
					yield put({
		                type:'updatePayload',
		                payload:{
		                    cateList:[]
		                }
		            })
				}
				
				if(cateType==1){//退菜
					yield put({
						type:'getListRes',
						payload:{}
					})
				}else if(cateType==2){//赠菜
					yield put({
						type:'getList',
						payload:{}
					})
				}
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)  

            }
        },
        //查询品牌下菜品的名称
		*foodList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
	 
		      const { data } = yield call(httpPost,config.foodByBrandId+'?brandId='+payload.brandId, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			cateList:data.data?data.data:[]
			      		}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*foodList1({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
	 
		      const { data } = yield call(httpPost,config.foodByRestaurantIds, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			cateList:data.data?data.data:[]
			      		}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		//赠菜统计
		*getTotal({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.giftStat;

		      payload.startTime=new Date(yield select(({tczcmxb}) => tczcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tczcmxb}) => tczcmxb.endTime)).getTime();
	 		  payload.restaurantIds=yield select(({tczcmxb}) => tczcmxb.restaurantIds);
	 		  payload.resIdOrgNameMap=yield select(({tczcmxb}) => tczcmxb.resIdOrgNameMap);
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{Base:data.data,value1:[]}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		//赠菜明细
  		*getList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.giftDetail;
		      const tczcmxb=yield select(({tczcmxb}) => tczcmxb)
		      payload.startTime=new Date(yield select(({tczcmxb}) => tczcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tczcmxb}) => tczcmxb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({tczcmxb}) => tczcmxb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({tczcmxb}) => tczcmxb.restaurantIds);

	 		  payload.offset=yield select(({tczcmxb}) => tczcmxb.start);
		      payload.size=yield select(({tczcmxb}) => tczcmxb.size);

		      payload.foodNames=tczcmxb.foodNames
		      payload.phone=tczcmxb.phone
		      payload.giftReason=tczcmxb.giftReason
			  payload.optPersonName=tczcmxb.optPersonName
	 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})

		      		


		      		let columns=[
		      			{
				        	title:'序号',
				            dataIndex:'key',
				            key:'key',
				            fixed:tczcmxb.Detail.length==0?false:'left',
				            width:100,
				            className:common.right
				        },
				        {
				        	title:'门店名称',
				            dataIndex:'orgName',
				            key:'orgName',
				            fixed:tczcmxb.Detail.length==0?false:'left',
				            width:300,
				            className:common.left,
				            render:(text,record,index)=>(
	                            <Popover content={record.orgName}>
	                                <span className={common.yzy_line1}>{record.orgName}</span>
	                            </Popover>
	                        ),
				            //sorter:(a,b)=>a.orgName.localeCompare(b.orgName)
				        },
				        {
				            title:'操作时间',
				            dataIndex:'opTime',
				            key:'opTime',
				            width:200,
				            className:common.left,
				        },
				        {
				            title:'操作员',
				            dataIndex:'opName',
				            key:'opName',
				            width:150,
				            className:common.left,
				        },
				        {
				            title:'菜品名称',
				            dataIndex:'foodName',
				            key:'foodName',
				            width:300,
				            className:common.left,
				            //sorter:(a,b)=>a.foodName.localeCompare(b.foodName)
				        },
				        {
				            title:'赠菜数量',
				            dataIndex:'num',
				            key:'num',
				            width:100,
				            className:common.right,
				        },
				        {
				            title:'赠菜金额',
				            dataIndex:'singlePrice',
				            key:'singlePrice',
				            width:100,
				            className:common.right,
				        },
				        {
				            title:'赠菜原因',
				            dataIndex:'giftReason',
				            key:'giftReason',
				            width:300,
				            className:common.left,
				            render:(text,record,index)=>(
				            	<Popover content={record.giftReason}>
	                                <span className={common.yzy_line1}>{record.giftReason}</span>
	                            </Popover>
				            )
				        },
				        {
				            title:'会员手机号',
				            dataIndex:'phone',
				            key:'phone',
				            width:200,
				            className:common.left,
				        }
				    ]



			      	yield put({
			      		type:'updatePayload',
			      		payload:{columns:columns,Detail:data.data,total:data.totalCount,value1:[],scrollX:1750}
			      	})
			      	yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		//退菜统计
  		*getTotalRes({ payload }, { select, call, put }){
  			 yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbTotal;

		      payload.startTime=new Date(yield select(({tczcmxb}) => tczcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tczcmxb}) => tczcmxb.endTime)).getTime();
	 		  payload.restaurantIds=yield select(({tczcmxb}) => tczcmxb.restaurantIds);

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
  		//退菜明细
  		*getListRes({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbList;
		      const tczcmxb=yield select(({tczcmxb}) => tczcmxb)
		      payload.startTime=new Date(yield select(({tczcmxb}) => tczcmxb.startTime)).getTime();
		      payload.endTime=new Date(yield select(({tczcmxb}) => tczcmxb.endTime)).getTime();
	 		  payload.resIdOrgNameMap=yield select(({tczcmxb}) => tczcmxb.resIdOrgNameMap);
	 		  payload.restaurantIds=yield select(({tczcmxb}) => tczcmxb.restaurantIds);

	 		  payload.offset=yield select(({tczcmxb}) => tczcmxb.start);
		      payload.size=yield select(({tczcmxb}) => tczcmxb.size);

		      payload.foodNames=tczcmxb.foodNames
		      payload.phone=tczcmxb.phone
		      payload.retreatReason=tczcmxb.retreatReason
		      payload.optPersonName=tczcmxb.optPersonName
			  if(tczcmxb.eatType!=-1) payload.eatType=+tczcmxb.eatType

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      		})

		      		let retreatType=[]
		      		data.data.map((v,i)=>{
		      			if(retreatType.length==0){
		      				v.retreatPays.map((val,idx)=>{
		      					retreatType.push({
		      						ch:val.retreatName,
		      						en:'key_'+retreatType.length
		      					})
		      				})
		      			}else{
		      				v.retreatPays.map((val,idx)=>{
		      					let isCompared=false
		      					retreatType.map((val0,idx0)=>{
		      						if(val0.ch==val.retreatName){
		      							isCompared=true
		      						}
		      					})
		      					if(!isCompared){
		      						retreatType.push({
			      						ch:val.retreatName,
			      						en:'key_'+retreatType.length
			      					})
		      					}
		      				})
		      			}
		      		})


				    let columns=[
				    	{
				        	title:'序号',
				            dataIndex:'key',
				            key:'key',
				            fixed:tczcmxb.Detail.length==0?false:'left',
				            width:100,
				            className:common.right
				        },
		      			{
				            title:'门店名称',
				            dataIndex:'orgName',
				            key:'orgName',
				            fixed:tczcmxb.Detail.length==0?false:'left',
				            width:300,
				            className:common.left,
				            render:(text,record,index)=>(
	                            <Popover content={record.orgName}>
	                                <span className={common.yzy_line1}>{record.orgName}</span>
	                            </Popover>
	                        ),
				            //sorter:(a,b)=>a.orgName.localeCompare(b.orgName)
				        },
				        {
				            title:'操作时间',
				            dataIndex:'opTime',
				            key:'opTime',
				            width:200,
				            className:common.left,
				        },
				        {
				            title:'订单编号',
				            dataIndex:'orderNo',
				            key:'orderNo',
				            width:250,
				            className:common.left,
						},
						{
				            title:'就餐方式',
				            dataIndex:'eatType',
				            key:'eatType',
				            width:100,
				            className:common.left,
				        },
				        {
				            title:'操作员',
				            dataIndex:'opName',
				            key:'opName',
				            width:150,
				            className:common.left,
				        },
				        {
				            title:'菜品名称',
				            dataIndex:'foodName',
				            key:'foodName',
				            width:200,
				            className:common.left,
				            //sorter:(a,b)=>a.foodName.localeCompare(b.foodName)
				        },
				        {
				            title:'退菜数量',
				            dataIndex:'num',
				            key:'num',
				            width:100,
				            className:common.right,
				        },
				        {
				            title:'退菜金额',
				            dataIndex:'retreatMoney',
				            key:'retreatMoney',
				            width:100,
				            className:common.right,
				        },
				        {
				            title:'退菜原因',
				            dataIndex:'retreatReason',
				            key:'retreatReason',
				            width:300,
				            className:common.left,
				            render:(text,record,index)=>(
				            	<Popover content={record.retreatReason}>
	                                <span className={common.yzy_line1}>{record.retreatReason}</span>
	                            </Popover>
				            )
				        },
				        {
				            title:'会员手机号',
				            dataIndex:'phone',
				            key:'phone',
				            width:200,
				            className:common.left,
				        },
		      		]

		      		let scrollX=2000
		      		if(retreatType.length>0){
		      			scrollX+=100*retreatType.length
			      		for(let i=retreatType.length-1;i>=0;i--){
			      			columns.splice(7,0,{
			      				title:retreatType[i].ch,
					            dataIndex:retreatType[i].en,
					            key:retreatType[i].en,
					            className:common.right,
					            width:100,
			      			})
			      			data.data.map((val,idx)=>{
			      				if(val.retreatPays.length>0){
			      					let b=0
			      					val.retreatPays.map((val1,idx1)=>{
			      						if(val1.retreatName==retreatType[i].ch){
			      							b=val1.retreatMoney
			      						}
			      					})
			      					val[retreatType[i].en]=b
			      				}else{
			      					val[retreatType[i].en]=0
			      				}
			      			})
			      		}
		      		}


			      	yield put({
			      		type:'updatePayload',
			      		payload:{columns:columns,Detail:data.data,total:data.totalCount,value1:[],scrollX:scrollX}
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