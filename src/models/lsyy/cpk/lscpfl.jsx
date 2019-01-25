import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'lscpfl',
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
			if (location.pathname === '/cpk') {


			}
		  });
		},
    }, 
  
	effects:{

        * queryAll({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.hqFoodCategoryAllUrl, payload);
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
			  
		      const orderListUrl = config.hqFoodCategoryQueryUrl;
		      payload.offset = yield select(({ lscpfl }) => lscpfl.offset);
		      payload.size = yield select(({ lscpfl }) => lscpfl.size);
		      payload.name = yield select(({lscpfl}) => lscpfl.keyword);
		  
			 
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
			  const orderListUrl = config.hqCpflAddUrl;
		   

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
			  const orderListUrl = config.hqFoodCategoryDeleteUrl;
		      

		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,yield select(({ lscpfl }) => lscpfl.id));
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