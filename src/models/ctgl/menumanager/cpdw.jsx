import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'cpdw',
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
			if (location.pathname === '/cdgl') {

			  dispatch({
				type: 'updatePayload',
				payload: {name:""},
			  });

			  dispatch({
				type: 'query',
				payload: {},
			  });

			   dispatch({
				type: 'queryCommentTypes',
				payload: location.query,
			  });

                dispatch({
                    type: 'queryAll',
                    payload: {},
                });


            }
		  });
		},
    }, 
  
	effects:{

        * queryAll({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.foodUnitAllUrl, payload);
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
			  
		      const orderListUrl = config.cpdwGetAllDWListUrl;
		      payload.offset = yield select(({ cpdw }) => cpdw.offset);
		      payload.size = yield select(({ cpdw }) => cpdw.size);
			 
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
			  
		      const orderListUrl = config.cpdwAddDwUrl;
		      console.log(payload);  
			 
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
			  
		      const orderListUrl = config.cpdwDeleteDWUrl;
		      console.log(payload);  
			 
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
            let isAdd = yield select(({ cpdw }) => cpdw.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.unitNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.unitNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
            let isAdd = yield select(({ cpdw }) => cpdw.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.unitCodeCheckUrl + `?code=${payload.value}`;
            }else{
                orderListUrl = config.unitCodeCheckUrl + `?code=${payload.value}` +`&id=${payload.id}`;
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