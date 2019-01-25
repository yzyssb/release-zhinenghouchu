import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';


export default{
	namespace:'xjbbInfo',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		start:0,
		size:10,
		total:0,
		current:1,
		loading:false,
		year:new Date().getFullYear(),
		month:+(new Date().getMonth())+1,

		year1:new Date().getFullYear(),
		yearList:[],
		
		restaurantIds:[],
		restaurantList:[],
		restaurantIds1:[],

		list1:[],
		list2:[],
		
		obj1:{},
		value:[],
		autoExpand:false,

		activeKey:'1',

		columns1:[
	        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
	        {title:'大类',dataIndex:'categoryName',key:'categoryName',className:common.left},
	        {title:'累计',dataIndex:'total',key:'total',className:common.right},
	        {title:'日均',dataIndex:'avgDay',key:'avgDay',className:common.right},
	        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
	    ],
	    columns2:[
	        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
	        {title:'项目',dataIndex:'categoryName',key:'categoryName',className:common.left},
	        {title:'合计',dataIndex:'total',key:'total',className:common.right},
	        {title:'月均',dataIndex:'avgMonth',key:'avgMonth',className:common.right},
	        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
	    ]
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/xjbbInfo') {
				console.log(location.query.tab)
				let yearList=[],year1=new Date().getFullYear()
				for(let i=2000;i<+year1+1;i++){
					yearList.push(i)
				}
				dispatch({
					type:'updatePayload',
					payload:{
						activeKey:location.query.tab?String(location.query.tab):'1',
						yearList:yearList,
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
			const activeKey=yield select(({xjbbInfo})=>xjbbInfo.activeKey)
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
				
				if(activeKey==1){
					yield put({
						type:'financeDay',
						payload:{}
					})
				}else if(activeKey==2){
					yield put({
						type:'financeMonth',
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
  		*financeDay({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeDay;

		      payload.restaurantIds=yield select(({xjbbInfo})=>xjbbInfo.restaurantIds)
		      const year=yield select(({xjbbInfo})=>xjbbInfo.year)
		      const month=yield select(({xjbbInfo})=>xjbbInfo.month)
		      console.log(year,month)
		      payload.targetTime=new Date(year+'-'+month+'-01 00:00:00').getTime()

		      let columns1=[
			        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
			        {title:'大类',dataIndex:'categoryName',key:'categoryName',className:common.left},
			        {title:'累计',dataIndex:'total',key:'total',className:common.right},
			        {title:'日均',dataIndex:'avgDay',key:'avgDay',className:common.right},
			        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
			  ]

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data.length>0){
		      			data.data[0].dayDetails.map((v,i)=>{
		      				columns1.push({
		      					title:v.day+v.week,
		      					dataIndex:'dw_'+i,
		      					key:'dw_'+i,
		      					className:common.right
		      				})
		      			})
		      			data.data.map((v,i)=>{
		      				v.dayDetails.map((vv,ii)=>{
		      					v['dw_'+ii]=vv.value
		      				})
		      				v.key=i
		      			})
		      		}
		      		yield put({
		      			type:'updatePayload',
		      			payload:{
		      				columns1:columns1,
		      				list1:data.data,
		      			}
		      		})
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*financeMonth({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeMonth;

		      let columns2=[
			        {title:'序号',dataIndex:'num',key:'num',width:60,className:common.right},
			        {title:'项目',dataIndex:'categoryName',key:'categoryName',className:common.left},
			        {title:'合计',dataIndex:'total',key:'total',className:common.right},
			        {title:'月均',dataIndex:'avgMonth',key:'avgMonth',className:common.right},
			        {title:'收入占比',dataIndex:'inProportion',key:'inProportion',className:common.right}
			  ]

			  payload.restaurantIds=yield select(({xjbbInfo})=>xjbbInfo.restaurantIds)
			  const year1=yield select(({xjbbInfo})=>xjbbInfo.year1)
			  payload.targetTime=new Date(year1+'-01-01 00:00:00').getTime()

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data.length>0){
		      			data.data[0].monthDetails.map((v,i)=>{
		      				columns2.push({
		      					title:v.month,
		      					dataIndex:'mon_'+i,
		      					key:'mon_'+i,
		      					className:common.right
		      				})
		      			})
		      			data.data.map((v,i)=>{
		      				v.monthDetails.map((vv,ii)=>{
		      					v['mon_'+ii]=vv.value
		      				})
		      				v.key=i
		      			})
		      		}
		      		yield put({
		      			type:'updatePayload',
		      			payload:{
		      				columns2:columns2,
		      				list2:data.data,
		      			}
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