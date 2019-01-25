import { httpPost,linkOrigin } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';


export default{
	namespace:'xjrb',
	state:{
		linkOrigin:linkOrigin,
		loading:false,
		start:0,
		size:10,
		total:0,
		current:1,
		loading:false,

		restaurantList:[],

		Base:{},
		Detail:[],
		
		value:[],
		treeData:[],

		baseInfoFormRest:true,
		
		get_restaurantId:null,
		get_targetTime:null,

		id:null,
	},

	subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/xjrb') {
				dispatch({
					type:'updatePayload',
					payload:{
						get_restaurantId:null,
						get_targetTime:null,
						id:null,

						//需要上传的数段
						targetTime:moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
						restaurantId:null,
						restaurantName:'',

						businessIn:0,//营业收入
						businessInMark:'',

						costOut:0,//成本支出
						costOutMark:'',

						chargeOut:0,//费用支出

						salary:0,//工资薪酬
						salaryMark:'',

						houseRent:0,//经营房租
						houseRentMark:'',

						energy:0,//能源费
						energyMark:'',

						recruit:0,//招聘猎头费
						recruitMark:'',

						travel:0,//差旅费
						travelMark:'',

						entertain:0,//招待费
						entertainMark:'',

						train:0,//咨询培训顾问
						trainMark:'',

						marketing:0,//市场营销费
						marketingMark:'',

						itService:0,//IT服务费
						itServiceMark:'',

						otherOut:0,//其他费用
						otherOutMark:'',

						finance:0,//财务费用
						financeMark:'',

						checkProfit:0,//考核利润

						depreciation:0,//折旧摊销
						depreciationMark:'',

						dividend:0,//分红
						dividendMark:'',

						realProfit:0,//净利润

						account:0,//账户资金
						accountMark:'',

						totalRecv:0,//总应收款
						totalRecvMark:'',

						totalNeed:0,//总应付款
						totalNeedMark:'',

						balance:0,//资金余额
					}
				})
			    

			    if(location.query.restaurantId){
			    	dispatch({
			    		type:'updatePayload',
			    		payload:{
			    			get_restaurantId:location.query.restaurantId,
			    			get_targetTime:location.query.targetTime
			    		}
			    	})
			    }

			    dispatch({
					type: 'list',
					payload: {},
			    });
			}
		  });
		},
    },
  
	effects:{
		*list({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.tuiCaiMxbDate;

		      const get_restaurantId=yield select(({xjrb})=>xjrb.get_restaurantId)
		      const get_targetTime=yield select(({xjrb})=>xjrb.get_targetTime)

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var restaurantList=[]
			      	data.data.shopList.forEach((value,index)=>{
			      		restaurantList.push(value)
			      	})
			      	yield put({
			      		type:'updatePayload',
			      		payload:{
			      			restaurantList:restaurantList,
			      			restaurantId:restaurantList.length==1?restaurantList[0].id:null,
			      			restaurantName:restaurantList.length==1?restaurantList[0].name:'',
			      		}
			      	})
			      	if(get_restaurantId&&get_targetTime){
			      		let get_restaurantName=''
			      		restaurantList.map((v,i)=>{
			      			if(v.id==get_restaurantId){
			      				get_restaurantName=v.name
			      			}
			      		})
			      		yield put({
				      		type:'updatePayload',
				      		payload:{
				      			restaurantId:get_restaurantId,
				      			restaurantName:get_restaurantName,
				      			targetTime:+get_targetTime
				      		}
				      	})	

				      	yield put({
				      		type:'financeDaySelect',
				      		payload:{}
				      	})
			      	}else{
			      		yield put({ type: 'hideLoading' });
			      	}
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*financeDayIn({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeDayIn;

		      const xjrb=yield select(({xjrb})=>xjrb)

		      payload.targetTime=new Date(xjrb.targetTime).getTime()
		      payload.restaurantId=+xjrb.restaurantId     
		      payload.restaurantName=xjrb.restaurantName

		      payload.businessIn=Math.round(+xjrb.businessIn*100)
		      payload.businessInMark=xjrb.businessInMark 
		      payload.costOut=Math.round(+xjrb.costOut*100)
		      payload.costOutMark=xjrb.costOutMark
		      payload.chargeOut=Math.round(+xjrb.salary*100)+Math.round(+xjrb.houseRent*100)+Math.round(+xjrb.energy*100)+Math.round(+xjrb.recruit*100)+Math.round(+xjrb.travel*100)+Math.round(+xjrb.entertain*100)+Math.round(+xjrb.train*100)+Math.round(+xjrb.marketing*100)+Math.round(+xjrb.itService*100)+Math.round(+xjrb.otherOut*100)

		      payload.salary=Math.round(+xjrb.salary*100)
		      payload.salaryMark=xjrb.salaryMark 
		      payload.houseRent=Math.round(+xjrb.houseRent*100)
		      payload.houseRentMark=xjrb.houseRentMark 
		      payload.energy=Math.round(+xjrb.energy*100)
		      payload.energyMark=xjrb.energyMark 
		      payload.recruit=Math.round(+xjrb.recruit*100)
		      payload.recruitMark=xjrb.recruitMark 
		      payload.travel=Math.round(+xjrb.travel*100)
		      payload.travelMark=xjrb.travelMark 
		      payload.entertain=Math.round(+xjrb.entertain*100)
		      payload.entertainMark=xjrb.entertainMark 
		      payload.train=Math.round(+xjrb.train*100)
		      payload.trainMark=xjrb.trainMark
		      payload.marketing=Math.round(+xjrb.marketing*100)
		      payload.marketingMark=xjrb.marketingMark
		      payload.itService=Math.round(+xjrb.itService*100)
		      payload.itServiceMark=xjrb.itServiceMark
		      payload.otherOut=Math.round(+xjrb.otherOut*100)
		      payload.otherOutMark=xjrb.otherOutMark

		      payload.finance=Math.round(+xjrb.finance*100)
		      payload.financeMark=xjrb.financeMark
		      payload.checkProfit=Math.round(+xjrb.businessIn*100)-Math.round(+xjrb.costOut*100)-Math.round(+payload.chargeOut)-Math.round(+xjrb.finance*100)
		      payload.depreciation=Math.round(+xjrb.depreciation*100)
		      payload.depreciationMark=xjrb.depreciationMark
		      payload.dividend=Math.round(+xjrb.dividend*100)
		      payload.dividendMark=xjrb.dividendMark
		      payload.realProfit=Math.round(+payload.checkProfit)-Math.round(+payload.depreciation)-Math.round(+payload.dividend)
		      payload.account=Math.round(+xjrb.account*100)
		      payload.accountMark=xjrb.accountMark

		      payload.totalRecv=Math.round(+xjrb.totalRecv*100)
		      payload.totalRecvMark=xjrb.totalRecvMark
		      payload.totalNeed=Math.round(+xjrb.totalNeed*100)
		      payload.totalNeedMark=xjrb.totalNeedMark
		      payload.balance=Math.round(+payload.account)+Math.round(+payload.totalRecv)-Math.round(+payload.totalNeed)

		      const id=+xjrb.id
		      if(id){
		      	payload.id=id
		      }


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(id){
		      			message.success('修改日报成功')
		      		}else{
		      			message.success('录入日报成功')
		      		}
		      		yield put(routerRedux.push({
			            pathname: '/xjbbInfo',
			            query: {tab:1}
			        }));
			        yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  }  
  		},
  		*financeDaySelect({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.financeDaySelect;

		      const xjrb=yield select(({xjrb})=>xjrb)
		      payload.restaurantId=+xjrb.restaurantId
		      payload.targetTime=new Date(xjrb.targetTime).getTime()


		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		console.log(data.data)
		      		for(var ii in data.data){
	      				if(ii!='id'&&ii!='restaurantId'&&ii!='restaurantName'&&ii!='targetTime'&&ii.indexOf('Mark')==-1){
	      					data.data[ii]=data.data[ii]/100
	      				}
	      			}
		      		yield put({
		      			type:'updatePayload',
		      			payload:data.data
		      		})
		      		console.log(data.data)
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