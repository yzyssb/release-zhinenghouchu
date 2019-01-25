import {config, httpPost, httpPostWithFoodExport, httpPostWithParam, httpPostWithId} from '../../../services/HttpService';
import message from 'antd/lib/message';


export default {
    namespace: 'cpxx',
    state: {
        offset: 0,
        size: 10,
        restaurantId: 1,
        modalVisible: false,
        commentTypes: [],
        list: [],
        modalKey: 0,
        currentSteps: 0,
        food: {
            specs: [],
            methods: [],
            spicyValue:0,
            recommendValue:0,
            isRecommend:0,
        },
        // 多规格
        onSpecs: false,
        // 多做法
        onMethods: false,
        keyword: '',
        categoryId: 0,
        importModalVisible: false,
        _selectedRowKeys: [],
        specList:[],
        price:0,
        vipPrice:0,
        estimateCost:0,
        way: "", //确认是新增还是修改
        tabkey:'1',
        cpxxDetailVisible:false,
        recommendFoods:[],
        foodList:[],
        selectCategoryId:0,
        issueId:0,
        modalStep1Visiable:false,

        /*连锁菜品弹框 start*/
        // companyId:myApp._store.getState().account.companyId,
        // restaurantId:myApp._store.getState().account.restaurantId,
        // brandId:myApp._store.getState().account.brandId,
        pullFoodList:[],
        pullToRestaurant:[],
        rightTree:[],
        /*连锁菜品弹框   end*/
        labelTag:[],
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/cdgl') {
                    dispatch({
                        type: 'query',
                        payload: location.query,
                    });

                }
            });
        },
    },

    effects: {
        * queryPullFoodList({payload}, {select, call, put}) {
            const pullFoodListUrl = config.pullFoodList;
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
                            var end = [];
                            itemChild.recommendFoods && itemChild.recommendFoods.map(function (s) {
                                end.push(s.recommendFoodName);
                            })
                            itemChild.title = itemChild.recommendFoods?itemChild.name+"(推:"+end+")":itemChild.name;
                            itemChild.parentKey = item.categoryId+"S";
                            newData.push(itemChild);
                            itemChild.foodSpecs.map(function (specs) {
                                var itemChildChild={};
                                itemChildChild.priceJson = specs.priceJson;
                                itemChildChild.key = itemChild.id+"";
                                itemChildChild.parentKey = item.categoryId+"";
                                itemChildChild.specId = specs.specId;
                                itemChildChild.specName = specs.specName;
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

            var pullToRestaurant = config.pullToRestaurant;

            var postBody =  yield select(({cpxx}) => cpxx.pullAfter);

            payload.pullFoods = postBody;
            const {data} = yield call(httpPost, pullToRestaurant, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    console.log(data.msg);
                    message.success(data.msg)
                    localStorage.setItem("selectedRightKeys","");
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            modalStep1Visiable: false,currentSteps:0,rightTree:[],sendNextData:{},pullToRestaurant:[]
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
        * query({payload}, {select, call, put}) {

            const orderListUrl = config.foodqueryUrl;
            payload.offset = yield select(({cpxx}) => cpxx.offset);
            payload.size = yield select(({cpxx}) => cpxx.size);
            payload.name = yield select(({cpxx}) => cpxx.keyword);
            const {data} = yield call(httpPost, orderListUrl, payload);
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
        * queryFoodAdd({payload}, {select, call, put}) {

            const orderListUrl = config.foodAddUrl;
            let food = yield select(({cpxx}) => cpxx.food);

            food.price = yield select(({cpxx}) => cpxx.price*100);
            food.vipPrice = yield select(({cpxx}) => cpxx.vipPrice*100);
            food.estimateCost = yield select(({cpxx}) => cpxx.estimateCost*100);
            food.defaultBox = yield select(({cpxx}) => cpxx.defaultBox);
            food.isRanking = food.isRanking ? 1 : 0;
            food.isRecommend = food.isRecommend ? 1 : 0;
            food.isCurrentPrice = food.isCurrentPrice ? 1 : 0;
            food.isWeigh = food.isCurrentPrice ? 1 : 0;
            food.spicyValue = food.spicyValue ? food.spicyValue:0;
            food.recommendValue = food.recommendValue ? food.recommendValue:0;

            let specList = yield select(({cpxx}) => cpxx.specList);
            var newSpecList = [];
            newSpecList = JSON.parse(JSON.stringify(specList))

            if (newSpecList.length >1) {

                newSpecList.map((i,j) =>{

                    i.price = i.price*100;
                    i.vipPrice = i.vipPrice*100;
                    i.estimateCost = i.estimateCost*100;

                    if (i.isDefault ==1 ){
                        food.price = i.price;
                        food.vipPrice = i.vipPrice;
                        food.estimateCost = i.estimateCost;
                        food.defaultBox = i.boxNum;
                    }
                })

                food.specs = newSpecList;
            }else
            {
                food.price = newSpecList[0].price*100;
                food.vipPrice = newSpecList[0].vipPrice*100;
                food.estimateCost = newSpecList[0].estimateCost*100;
                food.defaultBox = newSpecList[0].boxNum;
                food.specs = [];
            }

            let hasMethods = yield select(({cpxx}) => cpxx.onMethods);
            if (!hasMethods) {

                food.methods = [];
            }
            var recommendFoods = yield select(({ cpxx }) => cpxx.recommendFoods);

            var newRecommendFoods = [];

            newRecommendFoods = JSON.parse(JSON.stringify(recommendFoods))

            if (newRecommendFoods.length > 0 ){
                newRecommendFoods.map((i,j) =>{
                    i.originPrice = i.originPrice*100;
                    i.originReduce = i.originReduce*100;
                    i.vipPrice = i.vipPrice*100;
                    i.vipReduce = i.vipReduce*100;
                    i.specName = i.specName;
                    i.specId = i.specId;
                    i.maxCount = i.maxCount*100;
                })

                food.recommendFoods = newRecommendFoods;
            }else{
                food.recommendFoods = [];
            }




            const {data} = yield call(httpPost, orderListUrl, food);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success(data.msg);
                    window.history.back();
                } else {
                    message.warning(data.msg);
                }
            }
        },
        * deleteFood({payload}, {select, call, put}) {
            const {data} = yield call(httpPostWithParam, config.foodDeleteUrl, payload, payload.id);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("删除成功");
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        * batchDeleteFood({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.foodBatchDeleteUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("删除成功");
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        * getFood({payload}, {select, call, put}) {
            const {data} = yield call(httpPostWithParam, config.foodGetUrl, payload, payload.id);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let food = data.data;
                    food.specs = food.specs || [];
                    food.methods = food.methods || [];
                    food.laberDetails = food.laberDetails || [];

                    var spec =food.specs;

                    if (spec.length >0) {
                        spec.map((i,j) =>{

                            i.index = j+1;
                            i.price = i.price/100;
                            i.vipPrice = i.vipPrice/100;
                            i.estimateCost = i.estimateCost/100;
                        })
                    }else{
                        spec.push({index:1,price:food.price/100,
                            vipPrice:food.vipPrice/100,
                            estimateCost:food.estimateCost/100,
                            isDefault:1,boxNum:food.defaultBox});
                    }

                    var recommendFoods =food.recommendFoods;

                    if (recommendFoods.length >0) {
                        recommendFoods.map((i,j) =>{

                            i.index= i.recommendFoodId + '_' + i.specId;
                            i.recommendFoodName = i.recommendFoodName;
                            i.recommendFoodId = i.recommendFoodId;
                            i.originPrice = i.originPrice/100;
                            i.originReduce = i.originReduce/100;
                            i.vipPrice = i.vipPrice/100;
                            i.vipReduce = i.vipReduce/100;
                            i.specName = i.specName;
                            i.specId = i.specId;
                            i.maxCount = i.maxCount/100;
                        })
                    }

                    let newLabelTag = [];
                    if (food.laberDetails.length >0){

                        food.laberDetails.map((j)=>{

                            newLabelTag.push(j.name);
                        })

                    }


                    yield put({
                        type: 'updatePayload',
                        payload: {
                            food: food,
                            //
                            onSpecs: food.specs.length > 0,
                            onMethods: food.methods.length > 0,
                            specList:spec,
                            labelTag:newLabelTag,
                            price:food.price/100,
                            vipPrice:food.vipPrice/100,
                            estimateCost:food.estimateCost/100,
                            recommendFoods:recommendFoods,
                            issueId:food.issueId,

                        },
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },
        * export({payload}, {select, call, put}) {

            const orderListUrl = config.exportFoodUrl;
            console.log(payload);

            const {data} = yield call(httpPostWithFoodExport, orderListUrl, payload, 0, 0);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success(删除成功);
                    yield put({
                        type: 'query',
                        payload: {},
                    });

                } else {
                    message.error(data.msg);

                }
            }
        },

        //
        * checkName({payload}, {select, call, put}) {
            let way = yield select(({ cpxx }) => cpxx.way);

            let orderListUrl;

            if (way == "add") {
                orderListUrl = config.foodNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.foodNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
        * checkQuickCode({payload}, {select, call, put}) {
            let way = yield select(({ cpxx }) => cpxx.way);

            let orderListUrl;

            if (way == "add") {
                orderListUrl = config.foodCodeCheckUrl + `?code=${payload.value}`;
            }else{
                orderListUrl = config.foodCodeCheckUrl + `?code=${payload.value}` +`&id=${payload.id}`;
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
        *foodGetMaxCodeUrl({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.foodGetMaxCodeUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if(data.data) {
                       yield put({
                        type: 'updatePayload',
                        payload: {foodMaxCode:data.data},
                    });
                    }
                } else {
                    message.error(data.msg);
                }
            }
        },
        *queryFoodByCategory({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            let orderListUrl = '';
            if (payload.name) {
                orderListUrl = config.foodRecommendData + `?categoryId=${payload.selectCategoryId}` +`&id=${payload.id}` +`&name=${payload.name}`;
            }else{
                orderListUrl = config.foodRecommendData + `?categoryId=${payload.selectCategoryId}` +`&id=${payload.id}`;
            }

            const { data } = yield call(httpPost, orderListUrl, payload, payload.id);
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
    },
    reducers: {
        addSpec(state, action) {
            state.food.specs = [...state.food.specs, action.payload.spec];
            return {...state};
        },
        updateFood(state, action) {
            action.payload.food = {...state.food, ...action.payload.food};
            return {...state, ...action.payload,};
        },
        updatePayload(state, action) {
            return {...state, ...action.payload,};
        },
        nextStep(state, action) {
            action.payload.currentSteps = state.currentSteps + 1;
            return {...state, ...action.payload,};
        },
        prevStep(state, action) {
            action.payload.currentSteps = state.currentSteps - 1;
            return {...state, ...action.payload,};
        },

    }
}