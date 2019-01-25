import { httpPost, httpPostWithParam } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';



export default {
	namespace: 'tcxx',
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
        /*连锁菜品弹框 start*/
        // companyId:myApp._store.getState().account.companyId,
        // restaurantId:myApp._store.getState().account.restaurantId,
        // brandId:myApp._store.getState().account.brandId,
        modalStepTcVisiable:false,
        pullFoodList:[],
        pullToRestaurant:[]
        /*连锁菜品弹框   end*/
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
						type: 'queryPrintCategory',
						payload: location.query,
					})



				}
			});
		},
	},

	effects: {
        * queryPullFoodList({payload}, {select, call, put}) {
            const pullFoodListUrl = config.comboFoodList;
            // companyId:myApp._store.getState().account.companyId,
            // restaurantId:myApp._store.getState().account.restaurantId,
            // brandId:myApp._store.getState().account.brandId,
            payload.restaurantId = myApp._store.getState().menu.currentRestaurantId
            payload.companyId = myApp._store.getState().account.companyId
            payload.brandId = 17
            //myApp._store.getState().menu.brandId
            const {data} = yield call(httpPost, pullFoodListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    var pullFoodList = data.data;
                    var newData=[] ;
                    var nextData=[] ;
                    pullFoodList && pullFoodList.map(function (item) {
                        item.title = item.categoryName;
                        item.key = item.categoryId+"S";
                        newData.push(item);
                        item.foods.map(function (itemChild) {
                            itemChild.key = itemChild.id+"";
                            itemChild.title = itemChild.name;
                            itemChild.parentKey = item.categoryId+"S";
                            newData.push(itemChild);
                            itemChild.foodSpecs.map(function (specs) {
                                console.log(specs.specId)
                                var itemChildChild={};
                                itemChildChild.priceJson = specs.priceJson;
                                itemChildChild.key = itemChild.id+"";
                                itemChildChild.parentKey = item.categoryId+"";
                                itemChildChild.specId = specs.specId;
                                itemChildChild.specName = specs.specName;
                                itemChildChild.staffPriceJson = specs.staffPriceJson;
                                itemChildChild.vipPriceJson = specs.vipPriceJson;
                                itemChildChild.title = itemChild.name;
                                itemChildChild.name = itemChild.name;
                                itemChildChild.id = itemChild.id;
                                itemChildChild.categoryId = item.categoryId;
                                itemChildChild.onlyKey= itemChild.id+"-"+specs.specId;
                                nextData.push(itemChildChild);
                            });

                        });
                    });
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            pullFoodList: pullFoodList,newData:newData,nextData:nextData

                        },
                    });
                } else {
                    console.log(data.msg);
                }
            }
        },

        * pullToRestaurant({payload}, {select, call, put}) {

            const pullToRestaurant = config.comboPullToRestaurant;

            var pullFoods = yield select(({tcxx}) => tcxx.pullAfter);
            var pullComboFoods = [];
            pullFoods.map(function (item) {
            	var ls = {};
                ls.comboFoodId = item.foodId;
                ls.details = item.foodSpecs[0];
                pullComboFoods.push(ls);
            });
            payload.pullComboFoods = pullComboFoods;
            const {data} = yield call(httpPost, pullToRestaurant, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(data.msg);
                    message.success(data.msg)
                    localStorage.setItem("selectedRightKeys","");
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalStepTcVisiable: false,currentSteps:0,rightTree:[],sendNextData:{},pullToRestaurant:[]
                        },
                    });
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                } else {
                	message.error(data.msg)
                    console.log(data.msg);
                }
            }
        },
		*query({ payload }, { select, call, put }) {
			yield put({ type: 'showLoading' });
			const orderListUrl = config.foodComboQueryUrl;
			payload.offset = yield select(({ tcxx }) => tcxx.offset);
			payload.size = yield select(({ tcxx }) => tcxx.size);


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
			const orderListUrl = config.foodByCategoryUrl;



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

			const orderListUrl = config.foodqueryUrl;
			payload.offset = yield select(({ tcxx }) => tcxx.offset);
			payload.size = yield select(({ tcxx }) => tcxx.size);
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
			const orderListUrl = config.foodComboAddUrl;

			payload = yield select(({ tcxx }) => tcxx.food);

			payload.price = payload.price * 100;
			payload.vipPrice = payload.vipPrice * 100;
			payload.estimateCost = payload.estimateCost *100;

            payload.staffPrice = payload.staffPrice? payload.staffPrice*100:0;

            payload.isRanking = payload.isRanking ? 1 : 0;
			payload.type = yield select(({ tcxx }) => tcxx.type);
			payload.id = yield select(({ tcxx }) => tcxx.id);

			var select = yield select(({ tcxx }) => tcxx.selectFoodList);

			payload.simples = select;

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

			const orderListUrl = config.foodComboDeleteUrl;
		
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

			const orderListUrl = config.foodComboByIdUrl;

			const { data } = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					if (data.code == config.MSGCODE_SUCCESS) {
						let food = data.data;

						yield put({
							type: 'updatePayload',
							payload: {
								food: food,
                                issueId:food.issueId,

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

				} else {
					message.error(data.msg);

				}
			}
		},
		*queryPrintCategory({ payload }, { select, call, put }) {

			const orderListUrl = config.printCategoryUrl;


			const { data } = yield call(httpPost, orderListUrl, payload, payload.id);
			if (data) {

				if (data.code == config.MSGCODE_SUCCESS) {

					if (data.code == config.MSGCODE_SUCCESS) {

						if (data.data) {
							yield put({
								type: 'updatePayload',
								payload: {
									printList: data.data,

								},
							});
						}

					} else {
						message.error(data.msg);
					}

					if (data.data) {
						yield put({
							type: 'updatePayload',
							payload: {

								selectFoodList: data.data.simples,
							},
						});
					}

				} else {
					message.error(data.msg);

				}
			}
		},
		// 验证套餐名称是否重复
		*checkPackageName({ payload }, { select, call, put }) {
			let way = yield select(({ tcxx }) => tcxx.way);

			let orderListUrl;
			console.log(way)
			if (way == "add") {
				orderListUrl = config.checkPackageNameUrl + `?name=${payload.value}`;
			} else {
				orderListUrl = config.checkPackageNameUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
			
			let way = yield select(({ tcxx }) => tcxx.way);

			let orderListUrl;
			if (way == "add") {
				orderListUrl = config.checkPackageCodeUrl + `?code=${payload.value}`;
			} else {
				orderListUrl = config.checkPackageCodeUrl + `?code=${payload.value}` + `&id=${payload.id}`;
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
            const {data} = yield call(httpPost, config.foodComboGetMaxCodeUrl, payload);
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