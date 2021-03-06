import { httpPost,httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message'


export default{
	namespace:'lszfgl',
	state:{
		offset:0,
		size:10,
		restaurantId:1,
		modalVisible:false,
		commentTypes:[],
		list:[],
        foodMethodAddItem:{status:1},
        foodMethodItemEdit:{},
        currentSelectValue:0,
        currentSelectValue1:0,
        all: [],
        idItem: {},
        id:0,
        modalEditVisible:false
	},

	 subscriptions: {
		setup({ dispatch, history }) {
		  history.listen(location => {
			if (location.pathname === '/cpk') {


                }
            });
        },
    },

    effects: {
        * queryAll({payload}, {select, call, put}) {
            payload.offset = 0;
            payload.size = 100;
            const {data} = yield call(httpPost, config.hqFoodMethodQueryUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let idItem = {};
                    // id, name, pricingType, pricingRate, pricingMoney
                    data.data.map((item) => {
                        idItem[item.id] = item
                    });
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            all: data.data,
                            idItem: idItem,
                        },
                    });
                } else {
                }
            }
        },

        * query({payload}, {select, call, put}) {

		      const orderListUrl = config.hqFoodMethodQueryUrl;
		      payload.offset = yield select(({ lszfgl }) => lszfgl.offset);
		      payload.size = yield select(({ lszfgl }) => lszfgl.size);
		      payload.name = yield select(({ lszfgl }) => lszfgl.keyword);


		      const { data } = yield call(httpPost,
				  orderListUrl, payload);
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
        // 新增做法
        * addFoodMethodUrl({payload}, {select, call, put}) {

            const addFoodMethodUrl = config.hqAddFoodMethodUrl;

            var foodMethodItem = yield select(({ lszfgl }) => lszfgl.foodMethodAddItem);

            payload.name  = foodMethodItem.name ;
            payload.id = 0;
            payload.pricingMoney  = foodMethodItem.pricingMoney *100;
            payload.pricingRate  = foodMethodItem.pricingRate ;
            payload.pricingType  = foodMethodItem.pricingType ;
            payload.remark  = foodMethodItem.remark ;
            payload.status  = foodMethodItem.state ;
            const {data} = yield call(httpPost, addFoodMethodUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'query',
                        payload: {}
                    });


                } else {
                    console.log(data.msg);
                }
            }
        },
        // 编辑做法
        * editFoodMethodUrl({payload}, {select, call, put}) {

            const addFoodMethodUrl = config.hqAddFoodMethodUrl;

            var foodMethodItem = yield select(({ lszfgl }) => lszfgl.foodMethodItemEdit);      
            
            payload.id =  yield select(({ lszfgl }) => lszfgl.id);

            payload.name  = foodMethodItem.name ;
            payload.pricingMoney  = foodMethodItem.pricingMoney *100 ;
            payload.pricingRate  = foodMethodItem.pricingRate ;
            payload.pricingType  = foodMethodItem.pricingType ;
            payload.remark  = foodMethodItem.remark ;
            payload.status  = foodMethodItem.state ;
            const {data} = yield call(httpPost, addFoodMethodUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'query',
                        payload: {}
                    });


                } else {
                    console.log(data.msg);
                }
            }
        },

  		
  		*deleteZF({ payload }, { select, call, put }) {

		      const orderListUrl = config.hqFoodMethodDeleteUrl;
			 
		      const { data } = yield call(httpPostWithParam,orderListUrl, payload,payload.deleteId);
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
            let isAdd = yield select(({ lszfgl }) => lszfgl.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.hqMethodNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.hqMethodNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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



	},
	reducers:{
	
	    updatePayload(state,action){
			return { ...state, ...action.payload,};
	 	},
		
	}
}