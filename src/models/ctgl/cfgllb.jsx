import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default{
	namespace:'cfgllb',
	state:{
		offset:0,
		size:10,
		current:1,
		total:0,

		offset1:0,
		size1:10,
		current1:1,
		total1:0,

		visible:false,
		loading:false,

		list:[],
		baseInfoFormRest:1,

		kitchen_id:'',
		comment:'',
		kitchenName:'',
		printerName:'',
		touchscreenId:[],
		touchscreen:[],

  		list1:[],
  		show_list:[],
  		allFood:[],
  		tempAllFood:[],
  		food:[],
  		choosedFood:[],
  		tempChoosedFood:[],

  		choosedIndex:[],

  		rooter:'cfgllb',
	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cfgllb'||location.pathname === '/znhc') {
			  dispatch({
				type: 'updatePayload',
				payload: {
					rooter:location.pathname === '/cfgllb'?'cfgllb':location.pathname === '/znhc'&&'znhc'
				}
			  });
			  dispatch({
				type: 'query',
				payload: {},
			  });
			  dispatch({
				type: 'touchscreenList',       
				payload: {},
			  });
			}else if (location.pathname === '/kitchenNew'&&location.search.indexOf('edit')>-1) {
			  dispatch({
				type: 'touchscreenSearch',
				payload: {},
			  });
			}else if (location.pathname === '/productsSet') {
			  dispatch({
				type: 'kitchenFoodAll',
				payload: {},
			  });
			}
		  });
		},
    }, 
  
	effects:{		
		*query({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.kitchenList;
		      payload.offset = yield select(({ cfgllb }) => cfgllb.offset);
		      payload.size = yield select(({ cfgllb }) => cfgllb.size);
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length){
		      			data.data.map((value,index)=>{
		      				value.key=+index+1
		      			})
		      		}
		      		yield put({
	      				type:'updatePayload',
	      				payload:{total:data.totalCount,list:data.data}
	      			})
	      			yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  }  
  		},
  		*deleteInList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.kitchenDelete+payload.id;
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
	      				type:'query',
	      				payload:{}
	      			})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  }  
  		},
  		//获取厨房详情
  		*getDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const kitchen_id=yield select(({ cfgllb }) => cfgllb.kitchen_id);
		      const orderListUrl = config.kitchenGet+kitchen_id;
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  }  
  		},
  		//修改厨房
  		*update({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const kitchen_id=yield select(({ cfgllb }) => cfgllb.kitchen_id);
		      const orderListUrl = config.kitchenUpdate+kitchen_id;

		      payload.comment=yield select(({ cfgllb }) => cfgllb.comment);
		      payload.kitchenName=yield select(({ cfgllb }) => cfgllb.kitchenName);
		      payload.printerName=yield select(({ cfgllb }) => cfgllb.printerName);
		      payload.touchscreenId=yield select(({ cfgllb }) => cfgllb.touchscreenId);
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({ type: 'hideLoading' });
		      		history.go(-1)
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  }  
  		},
  		//新增厨房
  		*addKitchen({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const orderListUrl = config.kitchenNew;

		      payload.comment=yield select(({ cfgllb }) => cfgllb.comment);
		      payload.kitchenName=yield select(({ cfgllb }) => cfgllb.kitchenName);
		      payload.printerName=yield select(({ cfgllb }) => cfgllb.printerName);
		      payload.touchscreenId=yield select(({ cfgllb }) => cfgllb.touchscreenId);
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({ type: 'hideLoading' });
		      		history.go(-1)
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  }
  		},
  		//根据厨房查询触摸屏
  		*touchscreenSearch({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const kitchen_id=yield select(({ cfgllb }) => cfgllb.kitchen_id);
		      const orderListUrl = config.touchscreenList+'?kitchenId='+kitchen_id;
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		if(data.data&&data.data.length>0){
		      			var touchscreenId=[]
		      			data.data.map((value,index)=>{
		      				touchscreenId.push(String(value.id))
		      			})
		      			yield put({
			      			type:'updatePayload',
			      			payload:{
			      				touchscreenId:touchscreenId
			      			}
			      		})
		      		}else if(data.data&&data.data.length==0){
		      			yield put({
			      			type:'updatePayload',
			      			payload:{
			      				touchscreenId:[]
			      			}
			      		})
		      		}
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  } 
  		},
  		//根据厨房查询触摸屏
  		*touchscreenList({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const orderListUrl = config.touchscreenList
      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'updatePayload',
		      			payload:{
		      				touchscreen:data.data
		      			}
		      		})
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  } 
  		},


  		//门店所有产品
  		*storeFoodAll({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const orderListUrl = config.storeFoodAll;
      		  const choosedFood=yield select(({ cfgllb }) => cfgllb.choosedFood); 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var tempAllFood=[],food=[],tempFood=[]
		      		data.data.map((value,index)=>{
		      			tempAllFood[index]=value
		      			if(value.singles&&value.singles.length>0){
		      				value.singles.forEach((val,idx)=>{
			      				food.push(val)
			      				tempFood.push(val)
			      			})
		      			}
		      		})
		      		choosedFood.forEach((val,idx)=>{
		      			food.forEach((value,index)=>{
		      				if(val.id==value.id){
		      					food.splice(index,1)
		      					tempFood.splice(index,1)
		      				}
		      			})
		      		})
		      		yield put({
		      			type:'updatePayload',
		      			payload:{allFood:data.data,tempAllFood:tempAllFood,food:food,tempFood:tempFood}
		      		})
		      		yield put({ type: 'hideLoading' });
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  } 
  		},
  		//菜品选择查询不分页
  		*kitchenFoodAll({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const kitchen_id=yield select(({ cfgllb }) => cfgllb.kitchen_id);
		      const orderListUrl = config.kitchenFoodAll+'?kitchenId='+kitchen_id;
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var show_list=[],choosedFood=[],tempChoosedFood=[]
		      		data.data.map((value,index)=>{
		      			value.key=+index+1
		      			if(index<=9){
		      				show_list.push(value)
		      			}
		      			tempChoosedFood[index]=value
		      			choosedFood[index]=value
		      		})
		      		yield put({
		      			type:'updatePayload',
		      			payload:{list1:data.data,show_list:show_list,choosedFood:choosedFood,tempChoosedFood:tempChoosedFood}
		      		})
		      		yield put({
						type: 'storeFoodAll',
						payload: {},
					});
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  } 
  		},
  		//添加产品与厨房关系
  		*addKitchenFood({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

		      const orderListUrl = config.addKitchenFood;
		      var choosedFood=yield select(({ cfgllb }) => cfgllb.choosedFood),foodId=[],foodType=[]
		      choosedFood.map((value,index)=>{
		      	foodId.push(value.id)
		      	foodType.push(value.type)
		      })
      		  payload.foodId=foodId
      		  payload.kitchenId=yield select(({ cfgllb }) => cfgllb.kitchen_id)
      		  payload.foodType=foodType
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'updatePayload',
		      			payload:{visible:false}
		      		})
		      		
		      		yield put({
		      			type:'kitchenFoodAll',
		      			payload:{}
		      		})
		      	}else{
					yield put({ type: 'hideLoading' });
					message.error(data.msg)
				} 
		  	  } 
  		},
  		//根据产品id删除产品
  		*deleteFood({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });

			  const kitchenId=yield select(({ cfgllb }) => cfgllb.kitchen_id)
		      const orderListUrl = config.deleteFood+payload.foodId+'/'+kitchenId;
      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		yield put({
		      			type:'kitchenFoodAll',
		      			payload:{}
		      		})
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