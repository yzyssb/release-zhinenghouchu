import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'lscpdw',
	state:{
		offset:0,
		size:10,
		restaurantId:1,
		modalVisible:false,
		modalEditVisible:false,
		commentTypes:[],
		list:[],
		isAdd:true,
		name:"",
		status:1,
		modalKey: 0,


	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpk') {


            }
		  });
		},
    }, 
  
	effects:{

        * queryAll({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.hqFoodUnitAllUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let idItem = {};
                    // key, value
                    if (data.data) {
                        data.data.map((item) => {
                            idItem[item.key] = item
                        });
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                all: data.data,
                                idItem: idItem,
                            },
                        });
                    }
                } else {
                }
            }
        },
		
		*query({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqCpdwGetAllDWListUrl;
		      payload.offset = yield select(({ lscpdw }) => lscpdw.offset);
		      payload.size = yield select(({ lscpdw }) => lscpdw.size);
			 
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
  		*addDW({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqCpdwAddDwUrl;
			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

					yield put({
			          type: 'query',
			          payload: {
			           
			       
			          },
			        });

		 		}  
		 	}
  		},
  		*deleteDW({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqCpdwDeleteDWUrl;
			 
		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      		message.success("删除成功");
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
  		*checkName({payload}, {select, call, put}) {
            let isAdd = yield select(({ lscpdw }) => lscpdw.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.hqUnitNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.hqUnitNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
            }

            const {data} = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if(data.data) {
                        payload.callback(new Error('名称被使用！'));
                    } else {
                        payload.callback();
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },
        *checkQuickCode({payload}, {select, call, put}) {
            let isAdd = yield select(({ lscpdw }) => lscpdw.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.hqUnitCodeCheckUrl + `?code=${payload.value}`;
            }else{
                orderListUrl = config.hqUnitCodeCheckUrl + `?code=${payload.value}` +`&id=${payload.id}`;
            }


            const {data} = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if(data.data) {
                        payload.callback(new Error('编码被使用！'));
                    } else {
                        payload.callback();
                    }
                } else {
                    message.error(data.msg);
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