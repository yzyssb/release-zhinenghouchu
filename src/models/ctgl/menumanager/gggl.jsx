import {httpPost, httpPostWithParam} from '../../../services/HttpService';
import {config} from '../../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';


export default {
    namespace: 'gggl',
    state: {
        offset: 0,
        size: 10,
        restaurantId: 1,
        modalVisible: false,
        modalEditVisible:false,
        commentTypes: [],
        list: [],
        isAdd: true,
        all: [{
            "key": 13,
            "value": "spec1"
        }],
        idItem: {}
    },

    subscriptions: {
        setup({dispatch, history}) {
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

    effects: {
        * queryAll({payload}, {select, call, put}) {
            const {data} = yield call(httpPost, config.foodSpecAllUrl, payload);
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
        * query({payload}, {select, call, put}) {

            const orderListUrl = config.foodSpecQueryUrl;
            payload.offset = yield select(({gggl}) => gggl.offset);
            payload.size = yield select(({gggl}) => gggl.size);
            payload.name = yield select(({gggl}) => gggl.keyword);


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
        * querySpecAdd({payload}, {select, call, put}) {

            payload.name = yield select(({gggl}) => gggl.nameAdd);
            payload.status = yield select(({gggl}) => gggl.statusAdd);
            const orderListUrl = config.foodSpecAddUrl;

            const {data} = yield call(httpPost, orderListUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("添加成功");
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                    yield put({
                        type: 'queryAll',
                        payload: {},
                    });

                } else {
                    message.success("添加失败");
                }
            }
        },
        * querySpecEdit({payload}, {select, call, put}) {

            payload.name = yield select(({gggl}) => gggl.name);
            payload.status = yield select(({gggl}) => gggl.status);
            payload.id = yield select(({gggl}) => gggl.id);

            const orderListUrl = config.foodSpecAddUrl;

            const {data} = yield call(httpPost, orderListUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("添加成功");
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                    yield put({
                        type: 'queryAll',
                        payload: {},
                    });

                } else {
                    message.success("添加失败");
                }
            }
        },
        * deleteSpec({payload}, {select, call, put}) {

            const orderListUrl = config.foodSpecDeleteUrl;
            console.log(payload);

            const {data} = yield call(httpPostWithParam, orderListUrl, payload, payload.id);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("删除成功");
                    yield put({
                        type: 'query',
                        payload: {},
                    });
                    yield put({
                        type: 'queryAll',
                        payload: {},
                    });

                } else {
                    message.error(data.msg);

                }
            }
        },
        *checkName({payload}, {select, call, put}) {
            let isAdd = yield select(({ gggl }) => gggl.isAdd);

            let orderListUrl;

            if (isAdd) {
                orderListUrl = config.specNameCheckUrl + `?name=${payload.value}`;
            }else{
                orderListUrl = config.specNameCheckUrl + `?name=${payload.value}` +`&id=${payload.id}`;
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
    reducers: {

        updatePayload(state, action) {
            return {
                ...state, ...action.payload,
            };
        },

    }
}