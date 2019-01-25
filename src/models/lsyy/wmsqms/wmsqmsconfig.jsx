import { httpPost } from '../../../services/HttpService';
import { config } from '../../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import { getRestaurantId, getCompanyId, getWxToken, getWxState } from '../../../services/CommonService';



export default {
    namespace: 'wmsqmsConfig',
    state: {

        checked: true, // 0是手动授权，1是线上授权
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/wmsqms') {
                    // 查询当前状态
                    dispatch({
                        type: 'getChecked',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {

        //查询当前美团外卖授权模式状态
        *getChecked({ payload }, { select, call, put }) {
            const orderListUrl = config.getBdStateUrl;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            checked: data.data == 0 ? true : false

                        }
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

        //查询当前外卖授权模式状态
        *changeChecked({ payload }, { select, call, put }) {
            const orderListUrl = config.updateBdStateUrl + payload.state;
            const { data } = yield call(httpPost, orderListUrl, payload);
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success("修改成功！");

                    // 更新状态                    
                    yield put({
                        type: 'getChecked',
                        payload: {}
                    });
                } else {
                    message.error(data.msg);
                }
            }
        },

    },
    reducers: {
        updatePayload(state, action) {
            return { ...state, ...action.payload, };
        },

    }
}