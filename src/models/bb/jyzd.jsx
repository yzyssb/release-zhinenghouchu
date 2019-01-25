import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import { postVipExportFile } from "../../services/CommonService";

export default{
	namespace:'jyzd',
	state:{
		loading:false,
		offset:0,
		size:10,
		total:0,
		current:1,
		loading:false,

		activeKey:"1",
		selectList:[],

		//传的参数
		// receivablesTypeId:'-1',
		restaurantId:0,
		startTime:new Date().getHours()>=10?moment().subtract(1,'days').format('YYYY-MM-DD 00:00:00'):moment().subtract(2,'days').format('YYYY-MM-DD 00:00:00'),
		endTime:new Date().getHours()>=10?moment().subtract(1,'days').format('YYYY-MM-DD 23:59:59'):moment().subtract(2,'days').format('YYYY-MM-DD 23:59:59'),

		endOpen:false,
		name:'',

		timeParse:function(t){
			t=new Date(Number(t))
			let year=t.getFullYear(),
				month=t.getMonth()+1,
				day=t.getDate()
			return year+'-'+(month<10?('0'+month):month)+'-'+(day<10?('0'+day):day)
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  	history.listen(location => {
				if (location.pathname === '/jyzd') {
					dispatch({
						type:'updatePayload',
						payload:{
							list1:[],
							list2:[],

							//修改
							options:[],//联动数据
							choosedArr:[],//联动框选中的数据
						} 
					})
					dispatch({
						type:'choseRestaurantListUrl',
						payload:{}
					})
					dispatch({
						type:'receivablesList',
						payload:{}
					})
				}
		  	});
		},
    },
  
	effects:{
		*choseRestaurantListUrl({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const jyzd=yield select(({jyzd}) => jyzd);
			  
            const {data} = yield call(httpPost, config.choseRestaurantListUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
				
				var options=[],arr=[],restaurantId=0,name=''
				var res_yzy=sessionStorage.getItem('res_yzy')?JSON.parse(sessionStorage.getItem('res_yzy')):0,
					resName_yzy=sessionStorage.getItem('resName_yzy')?JSON.parse(sessionStorage.getItem('resName_yzy')):''
				var isExist=false
				if(data.data&&data.data.brandList&&data.data.brandList.length>0){
					arr.push(data.data.brandList[0].brandId)
					if(data.data.brandList[0].restaurantList&&data.data.brandList[0].restaurantList.length>0){
						restaurantId=data.data.brandList[0].restaurantList[0].restaurantId
						arr.push(restaurantId)
						name=data.data.brandList[0].restaurantList[0].restaurantName
						if(res_yzy!=0){
							data.data.brandList.map(v=>{
								v.restaurantList.map(vv=>{
									if(vv.restaurantId==res_yzy[1]){
										isExist=true
										resName_yzy=vv.restaurantName
										sessionStorage.setItem('resName_yzy',JSON.stringify(vv.restaurantName))
									}
								})
							})
						}
					}
					if(!isExist){
						resName_yzy=false,res_yzy=false
						sessionStorage.removeItem('resName_yzy')
						sessionStorage.removeItem('res_yzy')
					}
					data.data.brandList.map(v=>{
						options.push({
							label:v.brandName,
							value:v.brandId,
						})
						if(v.restaurantList&&v.restaurantList.length>0){
							var arr=[]
							v.restaurantList.map(vv=>{
								arr.push({
									label:vv.restaurantName,
									value:vv.restaurantId
								})
								options[options.length-1].children=arr
							})
						}
					})
				}
				
				yield put({
					type:'updatePayload',
					payload:{
						options,
						choosedArr:res_yzy&&res_yzy.length>0?res_yzy:arr,
						restaurantId:res_yzy&&res_yzy.length>0?res_yzy[1]:restaurantId,
						name:resName_yzy&&resName_yzy.length>0?resName_yzy:name
					}
				})
				yield put({
					type:'storeByTheDay',
					payload:{}
				})
				yield put({
					type:'storeMemshipByTheDay',
					payload:{}
				})
				
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
            }
  		},
  		*storeByTheDay({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const jyzd=yield select(({jyzd}) => jyzd);
			// if(jyzd.receivablesTypeId!=-1){
			// 	payload.receivablesTypeId=jyzd.receivablesTypeId
			// }
			payload.restaurantId=+jyzd.restaurantId
			payload.startTime=new Date(jyzd.startTime).getTime()
			payload.endTime=new Date(jyzd.endTime).getTime()
			  
            const {data} = yield call(httpPost, config.storeByTheDay, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
            	if(data.data&&data.data.length>0){
            		data.data.map((v,i)=>{
            			v.key=+i+1
            		})
            	}
                yield put({
                	type:'updatePayload',
                	payload:{
                		list1:data.data
                	}
                })
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
            }
  		},
  		*storeMemshipByTheDay({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			
			const jyzd=yield select(({jyzd}) => jyzd);
			payload.startTime=new Date(jyzd.startTime).getTime()
			payload.endTime=new Date(jyzd.endTime).getTime()
			payload.restaurantId=+jyzd.restaurantId
			// if(jyzd.receivablesTypeId!=-1){
			// 	payload.receivablesTypeId=jyzd.receivablesTypeId
			// }
			  
            const {data} = yield call(httpPost, config.storeMemshipByTheDay, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
            	if(data.data&&data.data.length>0){
            		data.data.map((v,i)=>{
            			v.key=+i+1
            		})
            	}
                yield put({
                	type:'updatePayload',
                	payload:{
                		list2:data.data
                	}
                })
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')

            }
  		},
  		//获取所有的收款类型
  		*receivablesList({ payload }, { select, call, put }) {
			yield put({type: 'showLoading'});
			  
            const {data} = yield call(httpPost, config.receivablesList, payload);

            if (data && data.code == config.MSGCODE_SUCCESS) {
                yield put({
                	type:'updatePayload',
                	payload:{
                		selectList:data.data
                	}
                })
				yield put({type: 'hideLoading'});
            }else{
                yield put({type: 'hideLoading'});
                message.error(data?data.msg:'接口报错')
            }
		},
		* _export({ payload }, { select, call, put }) {

			const jyzd=yield select(({jyzd}) => jyzd)
			payload.startTime=String(new Date(jyzd.startTime).getTime())
			payload.endTime=String(new Date(jyzd.endTime).getTime())
			payload.transactionScene=''
			payload.costType=jyzd.activeKey==1?51:52
			payload.restaurantId=+jyzd.restaurantId

			var excelName1=jyzd.activeKey==1?'商户收银账单明细':'会籍费分佣账单明细',
				excelTime=moment(new Date(jyzd.startTime).getTime()).format('MMDD')+'-'+moment(new Date(jyzd.endTime).getTime()).format('MMDD')
			postVipExportFile(config.auditBillsExportDetail, payload, jyzd.name+'-'+excelName1+'('+excelTime+").xlsx");
		},
		* _export1({ payload }, { select, call, put }) {

			const jyzd=yield select(({jyzd}) => jyzd)
			payload.startTime=String(new Date(jyzd.startTime).getTime())
			payload.endTime=String(new Date(jyzd.endTime).getTime())
			payload.transactionScene=''
			payload.costType=jyzd.activeKey==1?51:52
			payload.restaurantId=+jyzd.restaurantId

			var excelName2=jyzd.activeKey==1?'商户收银退款对账单明细':'会籍费分佣退款账单明细',
				excelTime=moment(new Date(jyzd.startTime).getTime()).format('MMDD')+'-'+moment(new Date(jyzd.endTime).getTime()).format('MMDD')
			postVipExportFile(config.auditBillsExportRefundDetail, payload, jyzd.name+'-'+excelName2+'('+excelTime+").xlsx");
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