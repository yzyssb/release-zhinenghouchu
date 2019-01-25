import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'sbgl',
	state:{
		offset:0,
		size:10,
		list:[],

	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/sbgl') {


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

  		



	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}