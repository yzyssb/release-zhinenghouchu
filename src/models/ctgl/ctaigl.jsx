import { httpPost,httpPostWithId,httpPostWithIds } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from "antd/lib/message/index";



export default{
    namespace:'ctaigl',
    state:{
        offset:0,
        size:10,
        regionsize:10,
        regionoffset:0,
        restaurantId:1,
        modalVisible:false,
        modalGroupAddVisiable:false,
        modaladdVisible:false,
        modalRegionAddVisible:false,
        modalRegionEditVisible:false,
        importModalVisible:false,
        commentTypes:[],
        list:[],
        regionList:[],
        currentSteps:0,
        item:{},
        lsItem:{},
        currentEditSelectValue:"",
        lastChangeTableId:0,
        cttotal:0,
        regiontotal:0,
        regioncurrent:0,
        current:0,
        groupItem:{},
        addRegionItem:{},
        editRegionItem:{},
        waiters:[],
        tableDeleteId:"",
        regionDeleteId:"",
        isResetForm:true

    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/ctaigl') {

                    dispatch({
                        type: 'queryWaiter',
                        payload: location.query,

                    });
                    dispatch({
                        type: 'queryRegion',
                        payload: location.query,

                    });
                    dispatch({
                        type: 'query',
                        payload: location.query,

                    });

                    dispatch({
                        type: 'deskQrCode/getWXState',
                        payload: {},
                    });

                }
            });

        },
    },
    effects:{
        *queryWaiter({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const getWaitersUrl = config.getWaitersUrl;

            const { data } = yield call(httpPost,getWaitersUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            waiters: data.data
                        },
                    });
                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },
        *query({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const tableListUrl = config.tableListUrl;
            payload.offset = yield select(({ ctaigl }) => ctaigl.offset);
            payload.size = yield select(({ ctaigl }) => ctaigl.size);
            payload.name = "";

            const { data } = yield call(httpPost,tableListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){

                    yield put({
                        type: 'getSuccess',
                        payload: {
                            list: data.data,
                            cttotal: data.totalCount,
                        },
                    });
                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },
        *queryRegion({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const regionListUrl = config.regionListUrl;
            payload.offset = yield select(({ ctaigl }) => ctaigl.regionoffset);
            payload.size = yield select(({ ctaigl }) => ctaigl.regionsize);
            payload.name = "";


            const { data } = yield call(httpPost,regionListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    var total= data.data.length;
                    yield put({
                        type: 'getSuccess',
                        payload: {
                            regionList: data.data,
                            regiontotal: data.totalCount
                        },
                    });
                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },

        *updateTable({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const updateTableListUrl = config.updateTableListUrl;

            var item = yield select(({ ctaigl }) => ctaigl.item);
            console.log(item.regionId);
            payload.regionId =item.regionId;
            payload.tableCode =item.tableCode+"";
            payload.tableName = item.tableName;
            payload.seatNum = item.seatNum;
            payload.eatInRestaurant = item.isEatInRestaurant? item.isEatInRestaurant:false;
            payload.waiterId = parseInt(item.waiterId);

            const { data } = yield call(httpPostWithId,updateTableListUrl, payload,item.id);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'query',payload:{}
                    });

                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'query',payload:{payload}
                    });
                }
            }
        },
        *addTable({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const addTableUrl = config.addTableUrl;

            var item = yield select(({ ctaigl }) => ctaigl.item);
            payload.regionId =item.regionId;
            payload.tableCode =item.tableCode+"";
            payload.tableName = item.tableName;
            payload.seatNum = item.seatNum;
            payload.eatInRestaurant = item.isEatInRestaurant? item.isEatInRestaurant:false;
            payload.waiterId = parseInt(item.waiterId);


            const { data } = yield call(httpPost,addTableUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    message.success(data.msg);
                    yield put({
                        type: 'query',payload:{payload}
                    });

                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'query',payload:{payload}
                    });
                }
            }
        },
        *deleteTable({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const deleteTableUrl = config.deleteTableUrl;
            var tableDeleteId = yield select(({ ctaigl }) => ctaigl.tableDeleteId);
            const { data } = yield call(httpPostWithId,deleteTableUrl, payload,tableDeleteId);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'query',payload:{payload}
                    });
                    yield put({
                        type: 'queryRegion',
                        payload:{}
                    });

                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },
        *deleteRegion({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const deleteRegionUrl = config.deleteRegionUrl;
            var regionDeleteId = yield select(({ ctaigl }) => ctaigl.regionDeleteId);
            const { data } = yield call(httpPostWithId,deleteRegionUrl, payload,regionDeleteId);
            if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'query',payload:{payload}
                    });
                    yield put({
                        type: 'queryRegion',
                        payload:{}
                    });

                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },
        *addGroupTable({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const groupAddTableUrl = config.groupAddTableUrl;

            var item = yield select(({ ctaigl }) => ctaigl.groupItem);
            payload.startCode =item.startCode;
            payload.endCode =item.endCode;
            payload.delete4713 = item.delete4713?item.delete4713:false;
            payload.tableNamePrefix = item.tableNamePrefix;
            payload.regionId = item.regionId;
            payload.waiterId = item.waiterId;
            payload.eatInRestaurant = item.eatInRestaurant?item.eatInRestaurant:false;
            payload.seatNum = item.seatNum;


            const { data } = yield call(httpPost,groupAddTableUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    message.success(data.msg);
                    yield put({
                        type: 'query',
                        payload:{}
                    });

                }else{
                    message.warning(data.msg);
                    yield put({
                        type: 'getSuccess',payload:{payload}
                    });
                    console.log(data.msg);
                }
            }
        },
        *addRegion({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const addRegionUrl = config.addRegionUrl;

            var item = yield select(({ ctaigl }) => ctaigl.addRegionItem);
            payload.regionName = item.regionName;
            payload.seatNum = item.seatNum;
            payload.remark = item.remark;


            const { data } = yield call(httpPost,addRegionUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    message.success(data.msg);
                    yield put({
                        type: 'queryRegion',
                        payload:{}
                    });
                    yield put({
                        type: 'query',
                        payload:{}
                    });

                }else{
                    message.warning(data.msg);
                    console.log(data.msg);
                }
            }
        },
        *editRegion({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });
            const editRegionsUrl = config.editRegionsUrl;

            var item = yield select(({ ctaigl }) => ctaigl.editRegionItem);


            const { data } = yield call(httpPostWithIds,editRegionsUrl, payload,item.id,item.regionName,item.defaultSeatNum,item.remark);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'queryRegion',
                        payload:{}
                    });
                    yield put({
                        type: 'query',
                        payload:{}
                    });

                }else{
                    console.log(data.msg);
                }
            }
        },

    },
    reducers:{

        updatePayload(state,action){
            return { ...state, ...action.payload,};
        },
        getSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },
        showLoading(state) {
            return {...state, loading: true};
        },

    }
}