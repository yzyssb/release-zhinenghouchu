import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default{
	namespace:'lslabel',
	state:{
		offset:0,
		size:10,
		restaurantId:1,
		modalVisible:false,
        modalDetailVisible:false,
		commentTypes:[],
		list:[],
		isAdd:true,
		name:"",
		status:1,
		modalKey: 0,
        detailList:[],
        isDetailAdd:true,


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
            const {data} = yield call(httpPost, config.hqLabelAllUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data) {

                        yield put({
                            type: 'updatePayload',
                            payload: {
                                all: data.data,
                            },
                        });
                    }
                } else {
                }
            }
        },
		
		*query({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqFoodLabelQueryUrl;
		      payload.offset = yield select(({ lslabel }) => lslabel.offset);
		      payload.size = yield select(({ lslabel }) => lslabel.size);
			 
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
  		*addLabel({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqAddFoodLabelUrl;

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
  		*deleteLabel({ payload }, { select, call, put }) {
			  
		      const orderListUrl = config.hqFoodLabelDeleteUrl;
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
            let isAdd = yield select(({ lslabel }) => lslabel.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.hqLabelNameCheckUrl + `?name=${payload.value}`+ '&id=0';
            }else{
                orderListUrl = config.hqLabelNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
        *checkDetailName({payload}, {select, call, put}) {
            let isDetailAdd = yield select(({ lslabel }) => lslabel.isDetailAdd);

            let orderListUrl;

            if (isDetailAdd) {
                orderListUrl = config.hqLabelDetailNameCheckUrl + `?name=${payload.value}`+ '&id=0' + `&laberId=${payload.labelId}`;
            }else{
                orderListUrl = config.hqLabelDetailNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}` + `&laberId=${payload.labelId}`;
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
        *queryDetail({payload}, {select, call, put}) {

            const { data } = yield call(httpPostWithParam,config.hqLabelDetailUrl, payload,payload.id);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'updatePayload',
                        payload: {

                        	detailList:data.data,

                        },
                    });

                }
            }
        },
        *addLabelDetail({ payload }, { select, call, put }) {

            const orderListUrl = config.hqLabelDetailAddUrl;

            const { data } = yield call(httpPost,orderListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'queryDetail',
                        payload: {

                        	id:yield select(({ lslabel }) => lslabel.id),

                        },
                    });

                }
            }
        },
        *deleteLabelDetail({ payload }, { select, call, put }) {

            const orderListUrl = config.hqFoodLabelDetailDeleteUrl;

            const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    message.success("删除成功");
                    yield put({
                        type: 'queryDetail',
                        payload: {

                            id:yield select(({ lslabel }) => lslabel.id),
                        },
                    });

                }else{
                    message.error(data.msg);

                }
            }
        },
        *detailIsDefault({ payload }, { select, call, put }) {

            const orderListUrl = config.hqLabelDetailIsDefaultUrl;

            const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.id);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    message.success(data.msg);
                    yield put({
                        type: 'queryDetail',
                        payload: {

                            id:yield select(({ lslabel }) => lslabel.id),
                        },
                    });

                }else{
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