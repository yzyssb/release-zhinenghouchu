import {config, httpPost, httpPostWithFoodExport, httpPostWithParam, httpPostWithId} from '../../../services/HttpService';
import message from 'antd/lib/message';

//乘法精度丢失
function numMulti(num1, num2) {  
    var baseNum = 0; 
    if(!num1)  num1=0;
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
    namespace: 'lscpxx',
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
        specList:[{index:1}],
        estimateCost:0,

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

        way: "", //确认是新增还是修改
        tabkey:'1',
        lscpxxDetailVisible:false,
        recommendFoods:[],
        foodList:[],
        selectCategoryId:0,
        brandList:[],
        restaurantList:[],
        brandId:0,
        labelTag:[],
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/cpk') {

                    dispatch({
                        type: 'queryBrandList',
                        payload: location.query,
                    });

                }
            });
        },
    },

    effects: {

        * query({payload}, {select, call, put}) {

            const orderListUrl = config.hqFoodqueryUrl;
            payload.offset = yield select(({lscpxx}) => lscpxx.offset);
            payload.size = yield select(({lscpxx}) => lscpxx.size);
            payload.name = yield select(({lscpxx}) => lscpxx.keyword);
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

            const orderListUrl = config.hqFoodAddUrl;
            let food = yield select(({lscpxx}) => lscpxx.food);
            let lscpxx = yield select(({lscpxx}) => lscpxx);
            let newPrice = parseInt(lscpxx.price1*100)+','+parseInt(lscpxx.price2*100)+','+parseInt(lscpxx.price3*100)+','+parseInt(lscpxx.price4*100)+','+parseInt(lscpxx.price5*100)
            food.priceJson = newPrice;
            let newVipPrice = parseInt(lscpxx.vipPrice1*100)+','+parseInt(lscpxx.vipPrice2*100)+','+parseInt(lscpxx.vipPrice3*100)+','+parseInt(lscpxx.vipPrice4*100)+','+parseInt(lscpxx.vipPrice5*100)
            food.vipPriceJson = newVipPrice;

            food.estimateCost = yield select(({lscpxx}) => lscpxx.estimateCost*100);
            food.isRanking = food.isRanking ? 1 : 0;
            food.isRecommend = food.isRecommend ? 1 : 0;
            food.isCurrentPrice = food.isCurrentPrice ? 1 : 0;
            food.isWeigh = food.isCurrentPrice ? 1 : 0;
            food.spicyValue = food.spicyValue ? food.spicyValue:0;
            food.recommendValue = food.recommendValue ? food.recommendValue:0;

            let specList = yield select(({lscpxx}) => lscpxx.specList);
            var newSpecList = [];
            newSpecList = JSON.parse(JSON.stringify(specList))

            if (newSpecList.length >1) {

                newSpecList.map((i,j) =>{

                    i.priceJson = parseInt(numMulti(i.price1,100)) + ',' + parseInt(numMulti(i.price2,100)) + ',' + parseInt(numMulti(i.price3,100)) + ',' + parseInt(numMulti(i.price4,100)) + ',' + parseInt(numMulti(i.price5,100));
                    i.vipPriceJson = parseInt(numMulti(i.vipPrice1,100)) + ',' + parseInt(numMulti(i.vipPrice2,100)) + ',' + parseInt(numMulti(i.vipPrice3,100)) + ',' + parseInt(numMulti(i.vipPrice4,100)) + ',' + parseInt(numMulti(i.vipPrice5,100));

                    i.estimateCost = numMulti(i.estimateCost,100);

                    if (i.isDefault ==1 ){
                        food.priceJson = i.priceJson;
                        food.vipPriceJson = i.vipPriceJson;
                        food.estimateCost = i.estimateCost;
                        food.defaultBox = i.boxNum;
                    }
                })

                food.specs = newSpecList;
            }else
            {
                food.priceJson = parseInt(numMulti(newSpecList[0].price1,100)) + ',' + parseInt(numMulti(newSpecList[0].price2,100)) + ',' + parseInt(numMulti(newSpecList[0].price3,100)) + ',' + parseInt(numMulti(newSpecList[0].price4,100)) + ',' + parseInt(numMulti(newSpecList[0].price5,100));
                food.vipPriceJson = parseInt(numMulti(newSpecList[0].vipPrice1,100)) + ',' + parseInt(numMulti(newSpecList[0].vipPrice2,100)) + ',' + parseInt(numMulti(newSpecList[0].vipPrice3,100)) + ',' + parseInt(numMulti(newSpecList[0].vipPrice4,100)) + ',' + parseInt(numMulti(newSpecList[0].vipPrice5,100));
                food.estimateCost = numMulti(newSpecList[0].estimateCost,100);
                food.defaultBox = newSpecList[0].boxNum;
                food.specs = [];
            }


            let hasMethods = yield select(({lscpxx}) => lscpxx.onMethods);
            if (!hasMethods) {

                food.methods = [];
            }
            var recommendFoods = yield select(({ lscpxx }) => lscpxx.recommendFoods);

            var newRecommendFoods = [];

            newRecommendFoods = JSON.parse(JSON.stringify(recommendFoods))

            if (newRecommendFoods.length > 0 ){
                newRecommendFoods.map((i,j) =>{
                    i.originReduce = i.originReduce*100;
                    i.vipReduce = i.vipReduce*100;
                    i.maxCount = i.maxCount*100;
                })

                food.recommendFoods = newRecommendFoods;
            }else{
                food.recommendFoods = [];
            }

            let hasLabels = yield select(({lscpxx}) => lscpxx.onLabel);
            if (hasLabels) {

                food.laberDetails = yield select(({lscpxx}) => lscpxx.laberDetails);
            }

            if(food.isSay ==1 ){

                if (!food.cookImgUrl){
                    message.warning('请选择厨师长照片');
                    return;
                }

                if (!food.cookName){
                    message.warning('请填写厨师长姓名');
                    return;
                }
                if (!food.cookTitle){
                    message.warning('请填写厨师长称号');
                    return;
                }
                if (!food.cookSay){
                    message.warning('请填写厨师长说');
                    return;
                }

                if (!food.cookGmtCreate || food.cookGmtCreate ==0){
                    message.warning('请填写厨师长说创建时间');
                    return;
                }

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

            const {data} = yield call(httpPostWithParam, config.hqFoodDeleteUrl, payload, payload.id);
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
            const {data} = yield call(httpPost, config.hqFoodBatchDeleteUrl, payload);
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
            const {data} = yield call(httpPostWithParam, config.hqFoodGetUrl, payload, payload.id);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    let food = data.data;
                    food.specs = food.specs || [];
                    food.methods = food.methods || [];
                    food.laberDetails = food.laberDetails || [];

                    let newPrice = '0,0,0,0,0';
                    let newVipPrice = '0,0,0,0,0';
                    var spec =food.specs;

                    if (spec.length >0) {
                        spec.map((i,j) =>{

                            i.index = j+1;

                            i.price1 = i.priceJson.split(',')[0]/100;
                            i.price2 = i.priceJson.split(',')[1]/100;
                            i.price3 = i.priceJson.split(',')[2]/100;
                            i.price4 = i.priceJson.split(',')[3]/100;
                            i.price5 = i.priceJson.split(',')[4]/100;

                            i.vipPrice1 = i.vipPriceJson.split(',')[0]/100;
                            i.vipPrice2 = i.vipPriceJson.split(',')[1]/100;
                            i.vipPrice3 = i.vipPriceJson.split(',')[2]/100;
                            i.vipPrice4 = i.vipPriceJson.split(',')[3]/100;
                            i.vipPrice5 = i.vipPriceJson.split(',')[4]/100;

                            i.estimateCost = i.estimateCost/100;

                            if (i.isDefault == 1){

                                newPrice = i.price1 + ',' + i.price2 + ',' + i.price3 + ',' + i.price4 + ',' + i.price5;
                                newVipPrice = i.vipPrice1 + ',' + i.vipPrice2 + ',' + i.vipPrice3 + ',' + i.vipPrice4 + ',' + i.vipPrice5;

                            }

                        })
                    }else{

                        spec.push({index:1,price1:food.priceJson.split(',')[0]/100,price2:food.priceJson.split(',')[1]/100,price3:food.priceJson.split(',')[2]/100,price4:food.priceJson.split(',')[3]/100,price5:food.priceJson.split(',')[4]/100
                            ,vipPrice1:food.vipPriceJson.split(',')[0]/100,vipPrice2:food.vipPriceJson.split(',')[1]/100,vipPrice3:food.vipPriceJson.split(',')[2]/100,vipPrice4:food.vipPriceJson.split(',')[3]/100,vipPrice5:food.vipPriceJson.split(',')[4]/100
                            ,estimateCost:food.estimateCost/100,isDefault:1,boxNum:food.defaultBox,priceJson:food.priceJson,vipPriceJson:food.vipPriceJson});
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

                    if (!food.cookGmtCreate){
                        food.cookGmtCreate = 0;
                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            food: food,
                            //
                            onSpecs: food.specs.length > 0,
                            onMethods: food.methods.length > 0,
                            onLabel: food.laberDetails.length>0,
                            labelTag:newLabelTag,
                            specList:spec,

                            priceJson:newPrice,
                            vipPriceJson:newVipPrice,
                            estimateCost:food.estimateCost/100,

                            recommendFoods:recommendFoods,

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
        * export({payload}, {select, call, put}) {

            const orderListUrl = config.exportHqFoodUrl;

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
            let way = yield select(({ lscpxx }) => lscpxx.way);

            let orderListUrl;

            if (way == "add") {
                orderListUrl = config.hqFoodNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.hqFoodNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
            let way = yield select(({ lscpxx }) => lscpxx.way);

            let orderListUrl;

            if (way == "add") {
                orderListUrl = config.hqFoodCodeCheckUrl + `?code=${payload.value}`;
            }else{
                orderListUrl = config.hqFoodCodeCheckUrl + `?code=${payload.value}` +`&id=${payload.id}`;
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
            const {data} = yield call(httpPost, config.hqFoodGetMaxCodeUrl, payload);
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
                orderListUrl = config.hqFoodRecommendData + `?categoryId=${payload.selectCategoryId}` +`&id=${payload.id}` +`&name=${payload.name}`;
            }else{
                orderListUrl = config.hqFoodRecommendData + `?categoryId=${payload.selectCategoryId}` +`&id=${payload.id}`;
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
        * queryBrandList({payload}, {select, call, put}) {

            const orderListUrl = config.brandListUrl;

            let brandId = yield select(({lscpxx}) => lscpxx.brandId);

            const {data} = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    if (data.data && data.data.length>0) {

                        yield put({
                            type: 'updatePayload',
                            payload: {
                                brandList: data.data,
                            },
                        });

                        if (brandId == 0){
                            yield put({
                                type: 'updatePayload',
                                payload: {
                                    brandId:data.data[0].key,
                                },
                            });

                        }

                        yield put({
                            type: 'queryChooseBrandList',
                            payload: {},
                        });

                    }

                } else {
                    console.log(data.msg);
                }
            }
        },
        * queryChooseBrandList({payload}, {select, call, put}) {

            const orderListUrl = config.chooseBrandUrl;

            let brandId = yield select(({lscpxx}) => lscpxx.brandId);

            const {data} = yield call(httpPostWithParam, config.chooseBrandUrl, payload, brandId);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'query',
                        payload: {},
                    });

                    yield put({
                        type: 'lscpdw/query',
                        payload: {},
                    });

                    yield put({
                        type: 'lscpdw/queryAll',
                        payload: {},
                    });


                    yield put({
                        type: 'lscpfl/query',
                        payload: {},
                    });
                    yield put({
                        type: 'lscpfl/queryAll',
                        payload: {},
                    });



                    yield put({
                        type: 'lsgggl/query',
                        payload: {},
                    });
                    yield put({
                        type: 'lsgggl/queryAll',
                        payload: {},
                    });

                    yield put({
                        type: 'lstcxx/query',
                        payload: {},
                    });

                    yield put({
                        type: 'lszfgl/query',
                        payload: {},
                    });
                    yield put({
                        type: 'lszfgl/queryAll',
                        payload: {},
                    });

                    yield put({
                        type: 'lslabel/query',
                        payload: {},
                    });
                    yield put({
                        type: 'lslabel/queryAll',
                        payload: {},
                    });


                    yield put({
                        type: 'deskQrCode/getList',
                        payload: {},
                    });

                    yield put({
                        type: 'sydcppxPageConfig/getList',
                        payload: {},
                    });
					
					yield put({
						  type:'lsksqd/updatePayload',
						  payload:{
								radioValue:'1',
								radioValue1:'1',
								visible_yzy:false,
								ssList:[],//全部门店组合
								restaurantIds:[],//传递的参数：门店id数组
								ssList_0:[],//选中未传递的门店id数组
								ssList_1:[],//选中的门店组合
								ssList_2:[]
						  }
					})

                } else {
                    console.log(data.msg);
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

                        specList.map((j)=>{

                            priceCheckedMap.push({key:i.key + '-' + j.specId,value:'0,0,0'});

                        })


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

            var _selectedRowKeys = yield select(({lscpxx}) => lscpxx._selectedRowKeys);
            var priceCheckedMap = yield select(({lscpxx}) => lscpxx.priceCheckedMap);
            var foodId = yield select(({lscpxx}) => lscpxx.food.id);
            var vo = {details:[]};

            if (_selectedRowKeys.length == 0 ){

                message.warning('请选择门店')
                return;

            }

            _selectedRowKeys.map((i)=>{

                var foodSpecs = [];
                var array = [];

                priceCheckedMap.map((j)=>{


                    if (i.split('-')[0] == j.key.split('-')[0]){

                        array.push({priceIndex:j.value.split(',')[0],vipPriceIndex:j.value.split(',')[1],specId:j.key.split('-')[1]!="undefined"?j.key.split('-')[1]:""});

                    }
                })

                vo.details.push({foodSpecs:array,restaurantId:i.split('-')[0]});
                vo.foodId = foodId;

            })

            var newDetail = [];
            vo.details.map((a,b)=>{

                if (b == 0){
                    newDetail.push(a);
                } else{

                    if (a.restaurantId == vo.details[b-1].restaurantId){
                        a.foodSpecs.map((i,j)=>{
                            newDetail[newDetail.length-1].foodSpecs.push(i);
                        })
                    }else {
                        newDetail.push(a);
                    }
                }
            })

            var newVo = {details:newDetail,foodId:vo.foodId};

            const { data } = yield call(httpPost,config.hqFoodAllot2restaurantUrl, newVo);

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