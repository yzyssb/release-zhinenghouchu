import { httpPost,httpPostWithId } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';


export default{
	namespace:'cpyylb',
	state:{
		offset:0,
		size:10,
		modalVisible:false,
		name:'',
        listFoods:[],
		num:0,

	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpyylb') {
			  dispatch({
				type: 'query',
				payload: location.query,
			  });

                dispatch({
                    type: 'queryFoodList',
                    payload: location.query,
                });


			}
		  });
		},
    }, 
  
	effects:{		
		*query({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.operateCategoryList;
		      payload.offset = yield select(({ cpyylb }) => cpyylb.offset);
		      payload.size = yield select(({ cpyylb }) => cpyylb.size);
		      			 
		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

			      		yield put({
						  type: 'updatePayload',
						  payload: {
							list: data.data,
							total: data.totalCount,
			         	 },
			        });
		      	}else{
                    message.warning(data.msg);
				} 
		  }  
  		},
        * queryAll({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.foodCategoryAllUrl, payload);
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
        *queryFoodList({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const orderListUrl = config.operateCategorySelectFoods;
            payload.offset = yield select(({ cpyylb }) => cpyylb.offset);
            payload.size = 10000;

            const { data } = yield call(httpPost,orderListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            foodList: data.data,
                            foodListTotal: data.totalCount,
                        },
                    });
                }else{
                    message.warning(data.msg);
                }
            }
        },

  		*operateCategoryAddOrEdit({ payload }, { select, call, put }) {
			  yield put({ type: 'showLoading' });
		      const orderListUrl = config.operateCategoryAddOrEdit;
		      payload.id = yield select(({ cpyylb }) => cpyylb.id);
		      payload.name = yield select(({ cpyylb }) => cpyylb.name);
		      payload.num = yield select(({ cpyylb }) => cpyylb.num);
              payload.listFoods = yield select(({ cpyylb }) => cpyylb.listFoods);

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      	
			      	  yield put({
				          type: 'query',
				          payload:{},
				        });
                    message.warning("保存成功");
                    window.history.back();
		      	}else{
                    message.warning(data.msg);
				} 
		  }  
  		},
		*deleteAction({ payload }, { select, call, put }) {

			// 注意链接地址要加一个要删除的原因备注的id
			const orderListUrl = config.operateCategoryDeleteById + payload.id;
			const { data } = yield call(httpPost,orderListUrl, payload);
			if (data) {
				if(data.code == config.MSGCODE_SUCCESS){
					yield put({
						type: 'query',
						payload: {},
					});
				}else{
					message.warning(data.msg);
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