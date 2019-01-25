import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default{
	namespace:'lsksqd',
	state:{
		offset:0,
		size:10,
		modalVisible:false,
		week:'',
		list:[],
		startHour:'00',
        startMin:'00',
        endHour:'00',
        endMin:'00',
		foodDetail:[],
		comboDetail :[],
		isAdd:true,
		selectFoodDetail:[],
		selectComboDetail:[],
		timeName:'',
		id:0,

		_checkedFoodKeys:[],
		_checkedFoodComboKeys:[],
		
		radioValue:'1',
		radioValue1:'1',
		visible_yzy:false,
		ssList:[],//全部门店组合
		restaurantIds:[],//传递的参数：门店id数组
		ssList_0:[],//选中未传递的门店id数组
		ssList_1:[],//选中的门店组合
		ssList_2:[],//未选中的门店组合
        indeterminate:false,

        type:1,//1pos 2oos
        restaurantList:[]
	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpk') {
			  dispatch({
				  type:'updatePayload',
				  payload:{
						radioValue:'1',
						radioValue1:'1',
						visible_yzy:false,
						ssList:[],//全部门店组合
						restaurantIds:[],//传递的参数：门店id数组
						ssList_0:[],//选中未传递的门店id数组
						ssList_1:[],//选中的门店组合
						ssList_2:[]
				  }
			  })
			  dispatch({
				  type:'restaurants_yzy',
				  payload:{}
			  })

			  /*dispatch({
				type: 'query',
				payload: {},
			  });

			   dispatch({
				type: 'queryFoodDetail',
				payload: location.query,
			  });

			    dispatch({
				type: 'queryFoodComboDetail',
				payload: location.query,
			  });*/

			}
		  });
		},
    }, 
  
	effects:{
		*restaurants_yzy({ payload }, { select, call, put }) {
		      const { data } = yield call(httpPost,config.restaurants_yzy, payload);
		      if (data) {
		      	if(data.code == config.MSGCODE_SUCCESS){
					let arr=[]
					if(data.data&&data.data.length>0){
						data.data.map((v)=>{
							arr.push(v)
						})
					}
			      	yield put({
			          type: 'updatePayload',
			          payload: {
			            ssList:data.data,
						ssList_2:arr,
			          },
			        });
		      	}else{
					message.error(data.msg);
				} 
		  }  
  		},

        *allot2restaurant_yzy({ payload }, { select, call, put }) {
            const lsksqd=yield select(({lsksqd})=>lsksqd)

			var infoVOS = [];
            lsksqd.restaurantList.map((i)=>{

            	if (i.infoList){

            		var info = {};

                    info.restaurantId = i.id;

                    var sellTimeIds = [];

            		i.infoList.map((j)=>{



            			if (j.checked){

                            sellTimeIds.push(j.id)

						}
					})

					info.sellTimeIds = sellTimeIds;
				}

				if (info.sellTimeIds.length >0){

                    infoVOS.push(info);
				}



			})

            payload.infoVOS=infoVOS;
            payload.type = lsksqd.type;

            const { data } = yield call(httpPost,config.allot2restaurant_yzy, payload);
            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    message.success('分配成功')
                }else{
                    message.error(data.msg);
                }
            }
        },
		
		
		
		*query({ payload }, { select, call, put }) {

		      const orderListUrl = config.sellTimeUrl;
		      payload.offset = yield select(({ lsksqd }) => lsksqd.offset);
		      payload.size = yield select(({ lsksqd }) => lsksqd.size);
		      payload.name = "%%";
		  
			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		var total= data.data.length;
			      		yield put({
			          type: 'updatePayload',
			          payload: {
			            list: data.data,
			            total: data.totalCount,
			          
			          },
			        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*queryAdd({ payload }, { select, call, put }) {

		      const orderListUrl = config.sellTimeAddUrl;
		      payload.week = yield select(({ lsksqd }) => lsksqd.week);
		      payload.startHour = yield select(({ lsksqd }) => lsksqd.startHour);
		      
		      payload.startMin = yield select(({ lsksqd }) => lsksqd.startMin);

	          payload.endHour = yield select(({ lsksqd }) => lsksqd.endHour);

		      payload.endMin = yield select(({ lsksqd }) => lsksqd.endMin);


		      payload.foodDetial = yield select(({ lsksqd }) => lsksqd.selectFoodDetail);

		      payload.comboDetail = yield select(({ lsksqd }) => lsksqd.selectComboDetail);

		      payload.id = yield select(({ lsksqd }) => lsksqd.id);

		      payload.timeName = yield select(({ lsksqd }) => lsksqd.timeName);
			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
			      		yield put({
				          type: 'query',
				          payload: {
				            
				          },
			        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*queryFoodDetail({ payload }, { select, call, put }) {

		      const orderListUrl = config.sellFoodUrl;
		      

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		const convert = (data, i = 1) => {
                        data.map((item) => {
                            if (item.singles) {
                                convert(item.singles, i + 1);
                            }
                            let prefix = i;
                            if (item.categoryId){
                                item.key = item.categoryId+"-" + item.id;
							}else {
                                item.key = item.id;
							}

                            item.title = item.name;
                            item.prefix = prefix;
                        })
                    };
                    
                    convert(data.data);
                    
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            foodDetail: data.data,
				          },
				        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*queryFoodComboDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.sellFoodComboUrl;
		
			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

		      		const convert = (data) => {
                        data.map((item) => {
                            if (item.children) {
                                convert(item.children);
                            }
                            item.key = item.id;
                            item.title = item.name;
                        })
                    };
                    convert(data.data);

			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            comboDetail: data.data,
			          
			          },
			        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*deleteKsqd({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.sellFoodDeleteUrl;
			 
		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		message.success('删除成功');
					yield put({
			          type: 'query',
			          payload: {
			           
			       
			          },
			        });

		 		}else{
		 			 message.error(data.msg);

		 		}
		 	}
  		},
  		*querySellFoodDetail({ payload }, { select, call, put }) {

		      const orderListUrl = config.sellFoodSelectFoodUrl;
		      
		      	var checkedFoodKeys= [];

		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

                    let foodDetail = yield select(({ lsksqd }) => lsksqd.foodDetail);

		      		data.data.map((i)=>{

		      			if (i.details) {
		      				i.details.map((j)=>{

                                foodDetail.map((a)=>{
                                	if (a.singles && a.singles.length>0)
                                	a.singles.map((b)=>{

                                        if (b.key == (i.id + '-' +j.id)) {
                                            checkedFoodKeys.push(i.id + '-' +j.id);
                                        }

									})


								})

				      		})

		      			}
		      		})


		      		yield put({
				          type: 'updatePayload',
				          payload: {
				            _checkedFoodKeys: checkedFoodKeys,
				          },
				        });
		      		

		      		const convert = (data) => {
                        data.map((item) => {
                            if (item.singles) {
                                convert(item.singles);
                            }
                            item.key = item.id;
                            item.title = item.name;
                        })
                    };
                    
                    convert(data.data);
                    
			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            sellFoodDetial: data.data,
				            selectFoodDetail:data.data,
				          },
				        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
  		*querySellFoodComboDetail({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.sellFoodSelectComboUrl;
			
				var checkedFoodComboKeys = [];
			 
		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

		      			data.data.map((i)=>{

			      			if (i.id) {
			      				checkedFoodComboKeys.push(i.id + '');

			      			}
		      			
		      		})

	      			yield put({
			          type: 'updatePayload',
			          payload: {
			            _checkedFoodComboKeys: checkedFoodComboKeys,
			          },
			        });

		      		const convert = (data) => {
                        data.map((item) => {
                            if (item.children) {
                                convert(item.children);
                            }
                            item.key = item.id;
                            item.title = item.name;
                        })
                    };
                    convert(data.data);

			      		yield put({
				          type: 'updatePayload',
				          payload: {
				            sellComboDetail: data.data,
			          		selectComboDetail:data.data,
			          },
			        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},
        *querySelectAllRestaurant({ payload }, { select, call, put }) {

            const orderListUrl = config.selectAllRestaurant;

            const { data } = yield call(httpPost,orderListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            restaurantList: data.data,
                        },
                    });

                }else{
                    console.log(data.msg);
                }
            }
        },




  		
  	
	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}