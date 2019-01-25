import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'cpfl',
	state:{
		offset:0,
		size:10,
		restaurantId:1,
		modalVisible:false,
		commentTypes:[],
		list:[],
		isAdd:true,
		code:'',
		english:'',
		name:'',
		remark:'',
		status:1,
		id:'',

	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cdgl') {


			  dispatch({
				type: 'query',
				payload: location.query,
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
		*query({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.foodCategoryQueryUrl;
		      payload.offset = yield select(({ cpfl }) => cpfl.offset);
		      payload.size = yield select(({ cpfl }) => cpfl.size);
		      payload.name = yield select(({cpfl}) => cpfl.keyword);
		  
			 
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
  		*addCPFL({ payload }, { select, call, put }) {
			  const orderListUrl = config.cpflAddUrl;
		   

		      const { data } = yield call(httpPost,orderListUrl, payload);
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){
		      	
			      	  yield put({
				          type: 'query',
				          payload:{},
				        });
		      	}else{
						console.log(data.msg);
				} 
		  }  
  		},

  		*deleteCPFL({ payload }, { select, call, put }) {
			  const orderListUrl = config.foodCategoryDeleteUrl;
		      

		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,yield select(({ cpfl }) => cpfl.id));
		      if (data) {
		      	
		      	if(data.code == config.MSGCODE_SUCCESS){

		              message.success("删除成功");
			      	  yield put({
				          type: 'query',
				          payload:{},
				        });
		      	}else{
                      message.success(data.msg);;
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