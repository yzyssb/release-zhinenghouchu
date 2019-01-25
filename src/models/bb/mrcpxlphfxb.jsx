import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import common from './common.less';


export default{
	namespace:'mrcpxlphfxb',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		startTime:moment().startOf("month"),
		endTime:moment().add(1,"days").format('YYYY-MM-DD 00:00:00'),
		orgName:'',
		resIdOrgNameMap:{},
		restaurantIds:null,
		restaurantList:[],
		list1:[],
		Detail:[],
		size:10,
		current:1,
		
		obj1:{},
		value:[],
		autoExpand:false,

		scrollX:1350,


		restaurantList:[],
		categoryName:'全部',

		numType:2,//1.金额2.数量
		queryType:1,//1.单品+套餐明细2.单品+套餐主项 
		year:new Date().getFullYear(),
		month:+(new Date().getMonth())+1,
		cateList:[],
		columns:[
	        {
	            title:'序号',
	            dataIndex:'key',
	            key:'key',
	            width:100,
	            className:common.right,
	        },
	        {
	            title:'分类',
	            dataIndex:'categoryName',
	            key:'categoryName',
	            width:200,
	            className:common.left,
	        },
	        {
	            title:'菜品名称',
	            dataIndex:'foodName',
	            key:'foodName',
	            width:250,
	            className:common.left,
            	sorter:(a,b)=>a.foodName.localeCompare(b.foodName,'zh')
	        },
	        {
	        	title:'规格',
	        	dataIndex:'specName',
	        	key:'specName',
	        	width:100,
	        	className:common.left
	        },
	        {
	            title:'单位',
	            dataIndex:'unitName',
	            key:'unitName',
	            width:100,
	            className:common.left,
	        },
	        {
	            title:'原价',
	            dataIndex:'singlePrice',
	            key:'singlePrice',
	            width:100,
	            className:common.right
	        },
	        {
	            title:'会员价',
	            dataIndex:'vipPrice',
	            key:'vipPrice',
	            width:100,
	            className:common.right
	        },
	        {
	            title:'实售单价',
	            dataIndex:'realPrice',
	            key:'realPrice',
	            width:100,
	            className:common.right,
	            sorter:(a,b)=>a.realPrice-b.realPrice
	        },
	        {
	            title:'单品成本',
	            dataIndex:'amtCost',
	            key:'amtCost',
	            width:100,
	            className:common.right
	        },
	        {
	            title:'单品占比',
	            dataIndex:'singleProportion',
	            key:'singleProportion',
	            width:100,
	            className:common.right,
	            sorter:(a,b)=>a.singleProportion.split('%')[0]-b.singleProportion.split('%')[0]
	        },
	        {
	            title:'日均',
	            dataIndex:'avgDay',
	            key:'avgDay',
	            width:100,
	            className:common.right,
	            sorter:(a,b)=>a.avgDay-b.avgDay
	        },
	        {
	            title:'合计',
	            dataIndex:'total',
	            key:'total',
	            width:100,
	            className:common.right,
	            sorter:(a,b)=>a.total-b.total
	        }
	    ]
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/mrcpxlphfxb') {
				dispatch({
					type:'updatePayload',
					payload:{
						autoExpand:false,
					}
				})
				dispatch({
					type:'userPower',
					payload:{}
				})
				dispatch({
					type:'caiPinSelectUrl',
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
			
			const startTime=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.startTime);
		      const endTime=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.endTime);
			
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
					type:'fooddayDetail',
					payload:{}
				})
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
  		*caiPinSelectUrl({ payload }, { select, call, put }) {
            const caiPinSelectUrl = config.caiPinSelectUrl;
            const { data } = yield call(httpPost,caiPinSelectUrl, payload);
            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type:'updatePayload',
                        payload:{
                            cateList:data.data
                        }
                    })
                }else{
                	yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                }
            }
        },
  		*fooddayDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.fooddayDetail;
		      const mrcpxlphfxb=yield select(({mrcpxlphfxb}) => mrcpxlphfxb)
		      const categoryName=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.categoryName);
		      if(categoryName!='全部'){
		      	payload.categoryName=categoryName
		      }
		      const month=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.month);
		      payload.month=+month
		      const year=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.year);
		      payload.year=+year
		      payload.numType=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.numType);
		      payload.queryType=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.queryType);
			  payload.restaurantIds=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.restaurantIds);
			  payload.resIdOrgNameMap=yield select(({mrcpxlphfxb}) => mrcpxlphfxb.resIdOrgNameMap);

		      let columns=[
		        {
		            title:'序号',
		            dataIndex:'key',
		            key:'key',
		            width:100,
		            className:common.right,
		            fixed:mrcpxlphfxb.Detail.length==0?false:'left'
		        },
		        {
		            title:'分类',
		            dataIndex:'categoryName',
		            key:'categoryName',
		            width:200,
		            className:common.left,
		            fixed:mrcpxlphfxb.Detail.length==0?false:'left'
		        },
		        {
		            title:'菜品名称',
		            dataIndex:'foodName',
		            key:'foodName',
		            width:250,
		            className:common.left,
		            fixed:mrcpxlphfxb.Detail.length==0?false:'left',
	            	sorter:(a,b)=>a.foodName.localeCompare(b.foodName,'zh')
		        },
		        {
		        	title:'规格',
		        	dataIndex:'specName',
		        	key:'specName',
		        	width:100,
		        	className:common.left
		        },
		        {
		            title:'单位',
		            dataIndex:'unitName',
		            key:'unitName',
		            width:100,
		            className:common.left,
		        },
		        {
		            title:'原价',
		            dataIndex:'singlePrice',
		            key:'singlePrice',
		            width:100,
		            className:common.right
		        },
		        {
		            title:'会员价',
		            dataIndex:'vipPrice',
		            key:'vipPrice',
		            width:100,
		            className:common.right
		        },
		        {
		            title:'实售单价',
		            dataIndex:'realPrice',
		            key:'realPrice',
		            width:100,
		            className:common.right,
		            sorter:(a,b)=>a.realPrice-b.realPrice
		        },
		        {
		            title:'单品成本',
		            dataIndex:'amtCost',
		            key:'amtCost',
		            width:100,
		            className:common.right
		        },
		        {
		            title:'单品占比',
		            dataIndex:'singleProportion',
		            key:'singleProportion',
		            width:100,
		            className:common.right,
		            sorter:(a,b)=>a.singleProportion.split('%')[0]-b.singleProportion.split('%')[0]
		        },
		        {
		            title:'日均',
		            dataIndex:'avgDay',
		            key:'avgDay',
		            width:100,
		            className:common.right,
		            sorter:(a,b)=>a.avgDay-b.avgDay
		        },
		        {
		            title:'合计',
		            dataIndex:'total',
		            key:'total',
		            width:100,
		            className:common.right,
		            sorter:(a,b)=>a.total-b.total
		        }
		    ]

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		columns=columns.slice(0,11)
		      		if(data.data&&data.data.length>0){
		      			data.data.map((v,i)=>{
		      				v.key=+i+1
		      				v.dayDetails.map((val,idx)=>{
		      					v['day_'+idx]=val.value
		      				})
		      			})
		      			
		      			if(columns.length<28){
			      			data.data[0].dayDetails.map((val,idx)=>{
	      						columns.push({
		      						title:val.day,
		      						dataIndex:'day_'+idx,
		      						key:'day_'+idx,
		      						width:80,
		      						className:common.right
		      					})
		      				})
	      				}
		      		}
		      		columns[0].fixed=data.data.length==0?false:'left'
		      		columns[1].fixed=data.data.length==0?false:'left'
		      		columns[2].fixed=data.data.length==0?false:'left'
		      		yield put({
	      				type:'updatePayload',
	      				payload:{Detail:data.data,columns:columns,value1:[],scrollX:1350+(data.data[0]?data.data[0].dayDetails.length*80:0)}
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