import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';
import React from 'react';
import Popover from 'antd/lib/popover';
import Select from 'antd/lib/select';

export default{
	namespace:'sdfx',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		activeKey:'1',

		size:10,
		current:1,
		offset:0,

		startTime:moment().subtract(6,'days').format('YYYY-MM-DD 00:00:00'),
		endTime:moment().endOf('day'),

		restaurantList:[],
		restaurantIds:[],
		resIdOrgNameMap:{},

		restaurantIds1:[],//餐厅分析
		resIdOrgNameMap1:{},//餐厅分析

		periods:[
			{startHour:9,endHour:14},
			{startHour:14,endHour:17},
			{startHour:17,endHour:22}
		],
		queryType:2,
		cpflList:[],
		foodNames:[],
		list:[],
		list1:[],
		
		obj1:{},
		value:[],
		value1:[],
		autoExpand:false,

		transferTotal:{},
		transferTotal1:{},

		scrollX:1700,
		idxArr:[],

		time1:'09:00',
		time2:'14:00',
		time3:'14:00',
		time4:'17:00',
		time5:'17:00',
		time6:'22:00',
		time7:'00:00',
		time8:'00:00',
		time9:'00:00',
		time10:'00:00',
		time11:'00:00',
		time12:'00:00',

		filteredInfo:null,

		eatType:-1,


		columns:[
	        {title:'序号',dataIndex:'key',key:'key',className:common.right},
	        {title:'菜品名称（规格）',dataIndex:'foodName',key:'foodName',className:common.left},
	        {title:'分类',dataIndex:'categoryName',key:'categoryName',className:common.left},
	        {title:'合计',children:
	            [
	                {title:'销量',dataIndex:'num',key:'num',className:common.right},
	                {title:'实收',dataIndex:'realMoney',key:'realMoney',className:common.right},
	                {title:'日均销量',dataIndex:'avgNum',key:'avgNum',className:common.right},
	                {title:'日均实收',dataIndex:'avgRealMoney',key:'avgRealMoney',className:common.right},
	            ]
	        }
	    ],
	    columns1:[
	        {title:'序号',dataIndex:'key',key:'key',className:common.right,fixed:'left',width:100},
	        {title:'餐厅',dataIndex:'restaurantName',key:'restaurantName',className:common.left,fixed:'left',width:300},
	        {title:'合计',children:
	            [
	                {title:'实收',dataIndex:'realMoney',key:'realMoney',className:common.right,width:100},
	                {title:'日均',dataIndex:'avgRealMoney',key:'avgRealMoney',className:common.right,width:100},
	                {title:'堂食',dataIndex:'realMoneyIn',key:'realMoneyIn',className:common.right,width:100},
									{title:'外带',dataIndex:'realMoneyOut',key:'realMoneyOut',className:common.right,width:100},
									{title:'自营外卖',dataIndex:'realMoneyZiYingOut',key:'realMoneyZiYingOut',className:common.right,width:100},
	            ]
	        }
	    ],

	    scrollX1:1750,
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/sdfx') {
				dispatch({
					type:'updatePayload',
					payload:{
						activeKey:'1',
						autoExpand:false,
						filteredInfo:null,
					}
				})
				dispatch({
					type:'userPower',
					payload:{}
				})
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
                let arr=[],obj2={},value=[],value1=[]
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
						  value1.push(source["id"] + "-" + source["nodeName"])
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
							value:value,
							value1:value1,
						}
					})
				}
				yield put({
					type:'brandAllFood',
					payload:{}
				})
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
  		*brandAllFood({ payload }, { select, call, put }) {

		      const { data } = yield call(httpPost,config.brandAllFood, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			cpflList:data.data
			      		}
			      	})
			      	yield put({
						type:'analyseFoodStat',
						payload:{}
					})
		      	}else{
					message.error(data.msg)
				} 
		  }  
  		},
  		*analyseFoodStat({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const sdfx=yield select(({sdfx})=>sdfx)
			  payload.periods=sdfx.periods
			  payload.queryType=sdfx.queryType
			  payload.restaurantIds=sdfx.restaurantIds
			  payload.resIdOrgNameMap=sdfx.resIdOrgNameMap
			  payload.startTime=new Date(sdfx.startTime).getTime()
			  payload.endTime=new Date(sdfx.endTime).getTime()
				if(sdfx.eatType!=-1) payload.eatType=+sdfx.eatType

		      const { data } = yield call(httpPost,config.analyseFoodStat, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
				    yield put({
			      		type:'updatePayload',
			      		payload:{
			      			transferTotal:data.data,
			      		}
			      	})
		      		yield put({
			      		type:'analyseFoodDetail',
			      		payload:{}
			      	})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*analyseFoodDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const sdfx=yield select(({sdfx})=>sdfx)
			  payload.periods=sdfx.periods
			  payload.queryType=sdfx.queryType
			  payload.restaurantIds=sdfx.restaurantIds
			  payload.resIdOrgNameMap=sdfx.resIdOrgNameMap
			  payload.startTime=new Date(sdfx.startTime).getTime()
				payload.endTime=new Date(sdfx.endTime).getTime()
				if(sdfx.eatType!=-1) payload.eatType=+sdfx.eatType

			  let columns=[],idxArr=sdfx.idxArr
			  if(sdfx.queryType==1||sdfx.queryType==2){
			  	columns=[
			        {title:'序号',dataIndex:'key',key:'key',className:common.right,width:100},
			        {title:'菜品名称（规格）',dataIndex:'foodName',key:'foodName',className:common.left,width:250,render:(text,record,index)=>(<span>{record.foodName==undefined?(<span className={common.center}>合计</span>):record.foodName}</span>)},
			        {title:'分类',dataIndex:'categoryName',key:'categoryName',width:200},
			        {title:'合计',width:400,children:
			            [
			                {title:'销量',dataIndex:'num',key:'num',className:common.right,width:100},
			                {title:'实收',dataIndex:'realMoney',key:'realMoney',className:common.right,width:100},
			                {title:'日均销量',dataIndex:'avgNum',key:'avgNum',className:common.right,width:100},
			                {title:'日均实收',dataIndex:'avgRealMoney',key:'avgRealMoney',className:common.right,width:100},
			            ]
			        }
			  	]
			  }else if(sdfx.queryType==3){
			  	columns=[
			        {title:'序号',dataIndex:'key',key:'key',className:common.right,width:100},
			        {title:'菜品分类',dataIndex:'categoryName',key:'categoryName',className:common.left,width:250,render:(text,record,index)=>(<span>{record.categoryName==undefined?(<span className={common.center}>合计</span>):record.categoryName.replace(/\s+/g, "")}</span>)},
			        {title:'合计',width:400,children:
			            [
			                {title:'销量',dataIndex:'num',key:'num',className:common.right,width:100},
			                {title:'实收',dataIndex:'realMoney',key:'realMoney',className:common.right,width:100},
			                {title:'日均销量',dataIndex:'avgNum',key:'avgNum',className:common.right,width:100},
			                {title:'日均实收',dataIndex:'avgRealMoney',key:'avgRealMoney',className:common.right,width:100},
			            ]
			        }
			  	]
			  }
			  
			  const periods=sdfx.periods
			  let total=sdfx.transferTotal,scrollX=sdfx.queryType==3?750:950

		      const { data } = yield call(httpPost,config.analyseFoodDetail, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){	

					if(Object.keys(total).length>0){
						data.data.push(total)
					}
					if(data.data.length>0){
						data.data.map((v,i)=>{
							v.key=+i
						})
					}

					/*data.data=[
						{key:1,categoryName:'11111'},
						{key:2,categoryName:'22222'},
						{key:3,categoryName:'33333'}
					]*/

					let fiterValue='菜品分类'
					if(sdfx.queryType==3){
						let cateArr=[]
						if(data.data&&data.data.length>0){
							data.data.map((v,i)=>{
								if(i!=data.data.length-1){
									cateArr.push({
										text:v.categoryName.replace(/\s+/g, ""),
										value:v.categoryName.replace(/\s+/g, "")
									})
								}
							})
						}
						columns[1].filters=cateArr
				    	columns[1].filteredValue=!sdfx.filteredInfo?{}.categoryName:sdfx.filteredInfo.categoryName || null
				    	columns[1].onFilter=(value, record) => {if(record.key!=''){return record.categoryName.includes(value)}}
				    	columns[1].filterMultiple=true
					}


					if(periods.length>0){
						periods.map((v,i)=>{
							let t=idxArr[i]==0?'一':idxArr[i]==1?'二':idxArr[i]==2?'三':idxArr[i]==3?'四':idxArr[i]==4?'五':idxArr[i]==5?'六':''
							let tt='时段'+t+'（'+(v.startHour<10?('0'+v.startHour+':00-'):(v.startHour+':00-'))+(v.endHour<10?('0'+v.endHour+':00'):(v.endHour+':00'))+'）'
							let changeA='num_'+i,changeB='numP_'+i,changeC='real_'+i,changeD='realP_'+i
							columns.push({
								title:tt,
								width:400,
					            children:[
					                {title:'销量',dataIndex:changeA,key:changeA,className:common.right,width:100},
					                {title:'销量占比',dataIndex:changeB,key:changeB,className:common.right,width:100},
					                {title:'实收',dataIndex:changeC,key:changeC,className:common.right,width:100},
					                {title:'实收占比',dataIndex:changeD,key:changeD,className:common.right,width:100},
					            ]
							})
						})
						scrollX+=400*periods.length

						if(periods.length==1){
							columns[0].width=100
							columns[1].width=450
							if(sdfx.queryType==3){
								columns[2].width=600
								columns[2].children[0].width=150
								columns[2].children[1].width=150
								columns[2].children[2].width=150
								columns[2].children[3].width=150
								columns[3].width=600
								columns[3].children[0].width=150
								columns[3].children[1].width=150
								columns[3].children[2].width=150
								columns[3].children[3].width=150
								scrollX=1750
							}else{
								columns[2].width=200
								columns[3].width=600
								columns[3].children[0].width=150
								columns[3].children[1].width=150
								columns[3].children[2].width=150
								columns[3].children[3].width=150
								columns[4].width=600
								columns[4].children[0].width=150
								columns[4].children[1].width=150
								columns[4].children[2].width=150
								columns[4].children[3].width=150
								scrollX=1950
							}
						}else if(periods.length==2){
							columns[0].width=100
							columns[1].width=320
							if(sdfx.queryType==3){

							}else{
								columns[2].width=200
								columns[3].width=400
								columns[3].children[0].width=150
								columns[3].children[1].width=150
								columns[3].children[2].width=150
								columns[3].children[3].width=150
								columns[4].width=400
								columns[4].children[0].width=150
								columns[4].children[1].width=150
								columns[4].children[2].width=150
								columns[4].children[3].width=150
								columns[5].width=400
								columns[5].children[0].width=150
								columns[5].children[1].width=150
								columns[5].children[2].width=150
								columns[5].children[3].width=150
								scrollX=2420
							}
						}
					}else{
						columns[0].width=100
						if(sdfx.queryType==3){
							columns[1].width=650
							columns[2].width=1000
							columns[2].children[0].width=250
							columns[2].children[1].width=250
							columns[2].children[2].width=250
							columns[2].children[3].width=250
							scrollX=1750
						}else{
							columns[1].width=450
							columns[2].width=200
							columns[3].width=1000
							columns[3].children[0].width=250
							columns[3].children[1].width=250
							columns[3].children[2].width=250
							columns[3].children[3].width=250
							scrollX=1750
						}
					}
					

					if(data.data.length>0){
						data.data.map((vv,ii)=>{
							let value=vv
							if(value.periodDetails&&value.periodDetails.length>0){
								value.periodDetails.map((v,i)=>{
									let changeA='num_'+i,changeB='numP_'+i,changeC='real_'+i,changeD='realP_'+i
									value[changeA]=v.num
									value[changeB]=v.numProportion
									value[changeC]=v.realMoney
									value[changeD]=v.realProportion
								})
							}
						})
					}

					if(data.data&&data.data.length>0){
						data.data.map((v,i)=>{
							if(i!=data.data.length-1){
								v.key=+i+1
							}else{
								v.key=''
							}
						})
					}
					columns[0].fixed=data.data.length==0?false:'left'
					columns[1].fixed=data.data.length==0?false:'left'
					yield put({
						type:'updatePayload',
						payload:{
							columns:columns,
							list:data.data,
							scrollX:scrollX,
							fiterValue:fiterValue,
						}
					})
					yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*analyseResStat({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const sdfx=yield select(({sdfx})=>sdfx)
			  payload.periods=sdfx.periods
			  payload.startTime=new Date(sdfx.startTime).getTime()
			  payload.endTime=new Date(sdfx.endTime).getTime()
			  payload.restaurantIds=sdfx.restaurantIds1
			  payload.resIdOrgNameMap=sdfx.resIdOrgNameMap1
			  if(sdfx.foodNames.length>0){
			  	payload.foodNames=sdfx.foodNames
				}
				if(sdfx.eatType!=-1) payload.eatType=+sdfx.eatType
			  

		      const { data } = yield call(httpPost,config.analyseResStat, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
					yield put({
			      		type:'updatePayload',
			      		payload:{
			      			transferTotal1:data.data,
			      		}
			      	})
		      		yield put({
			      		type:'analyseResDetail',
			      		payload:{}
			      	})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*analyseResDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const sdfx=yield select(({sdfx})=>sdfx)
			  payload.periods=sdfx.periods
			  payload.startTime=new Date(sdfx.startTime).getTime()
			  payload.endTime=new Date(sdfx.endTime).getTime()
			  payload.restaurantIds=sdfx.restaurantIds1
			  payload.resIdOrgNameMap=sdfx.resIdOrgNameMap1
			  if(sdfx.foodNames.length>0){
			  	payload.foodNames=sdfx.foodNames
				}
				if(sdfx.eatType!=-1) payload.eatType=+sdfx.eatType
			  
			  let columns1=[
		        {title:'序号',dataIndex:'key',key:'key',className:common.right,width:100},
		        {title:'餐厅',dataIndex:'restaurantName',key:'restaurantName',className:common.left,width:300,render:(text,record,index)=>(
		        	<Popover content={record.restaurantName==undefined?'合计':record.restaurantName}>
		        		<span className={common.yzy_line1}>{record.restaurantName==undefined?(<span className={common.center}>合计</span>):record.restaurantName}</span>
		        	</Popover>
		        )},
		        {title:'合计',width:600,children:
		            [
		                {title:'实收',dataIndex:'realMoney',key:'realMoney',className:common.right,width:120},
		                {title:'日均',dataIndex:'avgRealMoney',key:'avgRealMoney',className:common.right,width:120},
		                {title:'堂食',dataIndex:'realMoneyIn',key:'realMoneyIn',className:common.right,width:120},
										{title:'外带',dataIndex:'realMoneyOut',key:'realMoneyOut',className:common.right,width:120},
										{title:'自营外卖',dataIndex:'realMoneyZiYingOut',key:'realMoneyZiYingOut',className:common.right,width:120},
		            ]
		        }
		  	  ]
			  
			  const periods=sdfx.periods,idxArr=sdfx.idxArr
			  let total=sdfx.transferTotal1,scrollX1=1000

		      const { data } = yield call(httpPost,config.analyseResDetail, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){

					if(Object.keys(total).length>0){
						data.data.push(total)
					}


					if(periods.length>0){
						periods.map((v,i)=>{
							let t=idxArr[i]==0?'一':idxArr[i]==1?'二':idxArr[i]==2?'三':idxArr[i]==3?'四':idxArr[i]==4?'五':idxArr[i]==5?'六':''
							let tt='时段'+t+'（'+(v.startHour<10?('0'+v.startHour+':00-'):(v.startHour+':00-'))+(v.endHour<10?('0'+v.endHour+':00'):(v.endHour+':00'))+'）'
							let changeA='real_'+i,changeB='realP_'+i,changeC='in_'+i,changeD='inP_'+i,changeE='out_'+i,changeF='outP_'+i,changeG='realZY_'+i,changeH='realPZY'+i
							columns1.push({
								title:tt,
								width:850,
					            children:[
					                {title:'实收',dataIndex:changeA,key:changeA,className:common.right,width:100},
					                {title:'实收占比',dataIndex:changeB,key:changeB,className:common.right,width:100},
					                {title:'堂食',dataIndex:changeC,key:changeC,className:common.right,width:100},
					                {title:'堂食占比',dataIndex:changeD,key:changeD,className:common.right,width:100},
					                {title:'外带',dataIndex:changeE,key:changeE,className:common.right,width:100},
													{title:'外带占比',dataIndex:changeF,key:changeF,className:common.right,width:100},
													{title:'自营外卖',dataIndex:changeG,key:changeG,className:common.right,width:100},
					                {title:'自营外卖占比',dataIndex:changeH,key:changeH,className:common.right,width:150},
					            ]
							})

						})
						scrollX1+=850*periods.length
						if(periods.length==1){
							columns1[0].width=100
							columns1[1].width=300
							columns1[2].width=500
							columns1[2].children[0].width=100
							columns1[2].children[1].width=100
							columns1[2].children[2].width=100
							columns1[2].children[3].width=100
							columns1[2].children[4].width=100
							columns1[3].width=850
							columns1[3].children[0].width=100
							columns1[3].children[1].width=100
							columns1[3].children[2].width=100
							columns1[3].children[3].width=100
							columns1[3].children[4].width=100
							columns1[3].children[5].width=100
							columns1[3].children[6].width=100
							columns1[3].children[7].width=150
							scrollX1=1750
						}
					}else{
						columns1[0].width=100
						columns1[1].width=500
						columns1[2].width=900
						columns1[2].children[0].width=250
						columns1[2].children[1].width=250
						columns1[2].children[2].width=250
						columns1[2].children[3].width=250
						columns1[2].children[4].width=250
						scrollX1=1750
					}
					
					

					if(data.data.length>0){
						data.data.map((vv,ii)=>{
							let value=vv
							if(value.periodDetails.length>0){
								value.periodDetails.map((v,i)=>{
									let changeA='real_'+i,changeB='realP_'+i,changeC='in_'+i,changeD='inP_'+i,changeE='out_'+i,changeF='outP_'+i,changeG='realZY_'+i,changeH='realPZY'+i
									value[changeA]=v.realMoney
									value[changeB]=v.realProportion
									value[changeC]=v.realMoneyIn
									value[changeD]=v.realProportionIn
									value[changeE]=v.realMoneyOut
									value[changeF]=v.realProportionOut
									value[changeG]=v.realMoneyZiYingOut
									value[changeH]=v.realProportionZiYingOut
								})
							}
						})
					}

					if(data.data&&data.data.length>0){
						data.data.map((v,i)=>{
							if(i!=data.data.length-1){
								v.key=+i+1
							}else{
								v.key=''
							}
						})
					}

					columns1[0].fixed=data.data.length==0?false:'left'
					columns1[1].fixed=data.data.length==0?false:'left'
					yield put({
						type:'updatePayload',
						payload:{
							columns1:columns1,
							list1:data.data,
							scrollX1:scrollX1,
						}
					})
					yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		}
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