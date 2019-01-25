import { httpPost, httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';

//乘法精度丢失
function numMulti(num1, num2) {  
	var baseNum = 0; 
	if(!num1)	num1=0;
    try {  
        baseNum += num1.toString().split(".")[1].length;  
    } catch (e) {  
    }  
    try {  
        baseNum += num2.toString().split(".")[1].length;  
    } catch (e) {  
    }  
    return Number(num1.toString().replace(".", ""))* Number(num2.toString().replace(".", ""))/ Math.pow(10, baseNum);  
}; 


export default {
	namespace: 'lstcxx',
	state: {
		way: "", //确认是新增还是修改
		recordId: "", //修改时存储id
		
		offset: 0,
		size: 10,
		restaurantId: 1,
		modalVisible: false,
		commentTypes: [],
		modalKey: 0,
		list: [],
		foodList: [],
		selectFoodList: [],
		selectedRows: [],
		currentSteps: 0,
		allFoodCombo: [],
		food: {
            cookGmtCreate:0,
			simples: [],
			id: 0,
			SpicyValue: 0,
			recommendValue: 0,
		},
		listItem: {
			count: 0,
			foodId: 0,
			orderNo: 0,
			parentId: 0,
			priceDiff: 0,
			specId: 0
		},
		isAdd: true,
		singleFoodCombo: {},
		type: 1,
		id: 0,
        tcxxDetailVisible:false,
        selectCategoryId:0,
        price1:0,
        vipPrice1:0,

        price2:0,
        vipPrice2:0,

        price3:0,
        vipPrice3:0,

        price4:0,
        vipPrice4:0,

        price5:0,
        vipPrice5:0,

        estimateCost:0,

        restaurantList:[],

        _selectedRowKeys: [],

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

		*query({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.hqFoodComboQueryUrl;
			payload.offset = yield select(({ lstcxx }) => lstcxx.offset);
			payload.size = yield select(({ lstcxx }) => lstcxx.size);


			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					var total = data.data.length;
					yield put({
						type: 'updatePayload',
						payload: {
							list: data.data,
							total: data.totalCount,

						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*queryFoodByCategory({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.hqFoodByCategoryUrl;



			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data && data.data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					yield put({
						type: 'updatePayload',
						payload: {
							foodList: data.data,

						},
					});
				} else {
					console.log(data.msg);
				}
			} else {
				yield put({
					type: 'updatePayload',
					payload: {
						foodList: [],

					},
				});
			}
		},
		*queryFoodByName({ payload }, { select, call, put }) {

			const orderListUrl = config.hqFoodqueryUrl;
			payload.offset = yield select(({ lstcxx }) => lstcxx.offset);
			payload.size = yield select(({ lstcxx }) => lstcxx.size);
			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					var total = data.data.length;
					yield put({
						type: 'updatePayload',
						payload: {
							foodList: data.data,

						},
					});
				} else {
					console.log(data.msg);
				}
			}
		},
		*queryFoodComboAdd({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.hqFoodComboAddUrl;

			payload = yield select(({ lstcxx }) => lstcxx.food);

            let lstcxx = yield select(({lstcxx}) => lstcxx);
            let newPrice = parseInt(numMulti(lstcxx.price1,100))+','+parseInt(numMulti(lstcxx.price2,100))+','+parseInt(numMulti(lstcxx.price3,100))+','+parseInt(numMulti(lstcxx.price4,100))+','+parseInt(numMulti(lstcxx.price5,100))
            payload.priceJson = newPrice;
            let newVipPrice = parseInt(numMulti(lstcxx.vipPrice1,100))+','+parseInt(numMulti(lstcxx.vipPrice2,100))+','+parseInt(numMulti(lstcxx.vipPrice3,100))+','+parseInt(numMulti(lstcxx.vipPrice4,100))+','+parseInt(numMulti(lstcxx.vipPrice5,100))
            payload.vipPriceJson = newVipPrice;

            payload.estimateCost = yield select(({lstcxx}) => numMulti(lstcxx.estimateCost,100));

            payload.isRanking = payload.isRanking ? 1 : 0;
			payload.type = yield select(({ lstcxx }) => lstcxx.type);
			payload.id = yield select(({ lstcxx }) => lstcxx.id);

			var select = yield select(({ lstcxx }) => lstcxx.selectFoodList);

			payload.simples = select;

            if(payload.isSay ==1 ){

                if (!payload.cookImgUrl){
                    message.warning('请选择厨师长照片');
                    return;
                }

                if (!payload.cookName){
                    message.warning('请填写厨师长姓名');
                    return;
                }
                if (!payload.cookTitle){
                    message.warning('请填写厨师长称号');
                    return;
                }
                if (!payload.cookSay){
                    message.warning('请填写厨师长说');
                    return;
                }

                if (!payload.cookGmtCreate || payload.cookGmtCreate ==0){
                    message.warning('请填写厨师长说创建时间');
                    return;
                }

            }

			const { data } = yield call(httpPost, orderListUrl, payload);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					message.success(data.msg);
                    window.history.back();
					yield put({
						type: 'query',
						payload: {


						},
					});

				} else {
					message.warning(data.msg);
				}
			}
		},
		*deleteFoodCombo({ payload }, { select, call, put }) {

			const orderListUrl = config.hqFoodComboDeleteUrl;
		
			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {
					message.success("删除成功");
					yield put({
						type: 'query',
						payload: {


						},
					});

				} else {
					message.error(data.msg);

				}
			}
		},
		*queryFoodComboById({ payload }, { select, call, put }) {

			const orderListUrl = config.hqFoodComboByIdUrl;

			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					if (data.code == config.MSGCODE_SUCCESS) {
						let food = data.data;

						if (!food.cookGmtCreate){
							food.cookGmtCreate = 0;
						} 
						yield put({
							type: 'updatePayload',
							payload: {
								food: food,
                                price1:food.priceJson.split(',')[0]/100,
                                price2:food.priceJson.split(',')[1]/100,
                                price3:food.priceJson.split(',')[2]/100,
                                price4:food.priceJson.split(',')[3]/100,
                                price5:food.priceJson.split(',')[4]/100,

                                vipPrice1:food.vipPriceJson.split(',')[0]/100,
                                vipPrice2:food.vipPriceJson.split(',')[1]/100,
                                vipPrice3:food.vipPriceJson.split(',')[2]/100,
                                vipPrice4:food.vipPriceJson.split(',')[3]/100,
                                vipPrice5:food.vipPriceJson.split(',')[4]/100,

                                estimateCost:food.estimateCost/100,

							},
						});
					} else {
						message.error(data.msg);
					}

					yield put({
						type: 'updatePayload',
						payload: {

							selectFoodList: data.data.simples,



						},
					});

                    yield put({
                        type: 'queryRestaurants',
                        payload: {},
                    });

				} else {
					message.error(data.msg);

				}
			}
		},

		// 验证套餐名称是否重复
		*checkPackageName({ payload }, { select, call, put }) {
			let way = yield select(({ lstcxx }) => lstcxx.way);

			let orderListUrl;

			if (way == "add") {
				orderListUrl = config.hqComboCheckPackageNameUrl + `?name=${payload.value}`;
			} else {
				orderListUrl = config.hqComboCheckPackageNameUrl + `?name=${payload.value}` +`&id=${payload.id}`;
			}

			const { data } = yield call(httpPost, orderListUrl, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					if(data.data) {
                        payload.callback(new Error('名称被使用！'));
                    } else {
                        payload.callback();
                    }
				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},
		// 验证套餐编码是否重复
		*checkPackageCode({ payload }, { select, call, put }) {
			
			let way = yield select(({ lstcxx }) => lstcxx.way);

			let orderListUrl;
			if (way == "add") {
				orderListUrl = config.hqComboCheckPackageCodeUrl + `?code=${payload.value}`;
			} else {
				orderListUrl = config.hqComboCheckPackageCodeUrl + `?code=${payload.value}` + `&id=${payload.id}`;
			}

			const { data } = yield call(httpPost, orderListUrl, {});
			if (data) {
				if (data.code == config.MSGCODE_SUCCESS) {
					if(data.data) {
                        payload.callback(new Error('编码被使用！'));
                    } else {
                        payload.callback();
                    }
				} else {
					message.error(data.msg);
					console.log(data.msg);
				}
			}
		},
		*foodComboGetMaxCodeUrl({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.hqFoodComboGetMaxCodeUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if(data.data) {
                       yield put({
                        type: 'updatePayload',
                        payload: {foodComboMaxCode:data.data},
                    });
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },
        *queryRestaurants({ payload }, { select, call, put }) {
            const { data } = yield call(httpPost,config.restaurants_yzy, payload);

            var specList = yield select(({lscpxx}) => lscpxx.specList);

            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){

                    var priceCheckedMap = [];
                    data.data.length>0&&data.data.map((i)=>{

                         priceCheckedMap.push({key:i.key,value:'0,0,0'});

                    })
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            restaurantList:data.data,
                            priceCheckedMap:priceCheckedMap,
                        },
                    });
                }else{
                    message.error(data.msg);
                }
            }
        },
        *queryAllot2restaurant({ payload }, { select, call, put }) {

            var _selectedRowKeys = yield select(({lstcxx}) => lstcxx._selectedRowKeys);
            var priceCheckedMap = yield select(({lstcxx}) => lstcxx.priceCheckedMap);
            var comboId = yield select(({lstcxx}) => lstcxx.food.id);
            var vo = {details:[]};

            if (_selectedRowKeys.length == 0 ){

                message.warning('请选择门店')
                return;

            }

            var array = [];

            _selectedRowKeys.map((i)=>{

                priceCheckedMap.map((j)=>{


                    if (i== j.key){

                        array.push({priceIndex:j.value.split(',')[0],vipPriceIndex:j.value.split(',')[1],restaurantId:i});

                    }
                })

                vo.details = array;
                vo.comboId = comboId;

            })



            const { data } = yield call(httpPost,config.hqFoodComboAllot2restaurantUrl, vo);

            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){

                    message.success(data.msg);
                    window.history.back();
                }else{
                    message.error(data.msg);
                }
            }
        },






    },
	reducers: {
		updateFood(state, action) {
			action.payload.food = { ...state.food, ...action.payload.food };
			return { ...state, ...action.payload, };
		},

		updatePayload(state, action) {
			return { ...state, ...action.payload, };
		},

	}
}