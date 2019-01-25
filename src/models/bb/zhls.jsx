import { httpPost } from '../../services/HttpService';
import { config } from '../../services/HttpService';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import moment from 'moment';
import { postVipExportFile } from "../../services/CommonService";

export default {
    namespace: 'zhls',
    state: {
        start:0,
        total:0,
        size:10,
        current:1,
        loading:false,

        activeKey:1,
        endOpen: false,
        list:[],

        businessOrderId:'',
        incomExpen:['1','2'],
        tradeMode:['1','2','3','4','5','6'],
        restaurantId:0,

        startTime: moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
        endTime: moment().subtract(1, "days").format("YYYY-MM-DD 23:59:59"),

        extraData:{},

        timeParse: function (t) {
            t = new Date(String(t))
            let year = t.getFullYear(),
                month = t.getMonth() + 1,
                day = t.getDate()
            return year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day)
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/zhls') {
                    var start=new Date(location.query.date+' 00:00:00'),
                        end=new Date(location.query.date+' 23:59:59')
                    dispatch({
                        type:'updatePayload',
                        payload:{
                            activeKey:location.query.activeKey,
                            restaurantId:location.query.restaurantId,
                            startTime:moment(start),
                            endTime:moment(end),
                            name:location.query.name
                        }
                    })
                    dispatch({
                        type:'fundBillDetail',
                        payload:{}
                    })
                }
            })  
        },
    },

    effects: {
        * fundBillDetail({ payload }, { select, call, put }) {
            yield put({ type: 'showLoading' });

            const zhls = yield select(({ zhls }) => zhls)
            payload.startTime = new Date(zhls.startTime).getTime()
            payload.endTime = new Date(zhls.endTime).getTime()
            payload.offset=zhls.start
            payload.size=zhls.size
            payload.accountType=4
            payload.businessOrderId=zhls.businessOrderId
            payload.restaurantId=+zhls.restaurantId
            if(zhls.incomExpen.length==0){
                message.error('记账类型是必选项！')
                yield put({ type: 'hideLoading' });
                return
            }
            payload.incomExpen=(zhls.incomExpen.length==2||zhls.incomExpen.length==0)?0:+zhls.incomExpen[0]
            if(zhls.tradeMode.length==0){
                message.error('业务类型是必选项！')
                yield put({ type: 'hideLoading' });
                return
            }
            payload.tradeMode=zhls.tradeMode.join(',')

            const { data } = yield call(httpPost, config.fundBillDetail, payload);
            if (data) {
                yield put({ type: 'hideLoading' });
                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data&&data.data[0] && data.data[0].fundBillDetailList && data.data[0].fundBillDetailList.length > 0) {
                        data.data[0].fundBillDetailList.map((v, i) => {
                            v.key = +i + 1
                        })
                    }
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            extraData:data.data[0],
                            list: data.data[0].fundBillDetailList,
                            total:data.totalCount
                        }
                    })

                } else {
                    message.error(data ? data.msg : '接口报错');
                }
            } else {
                yield put({ type: 'hideLoading' });
            }
        },
        * _export({ payload }, { select, call, put }) {

			const zhls = yield select(({ zhls }) => zhls)
            payload.startTime = new Date(zhls.startTime).getTime()
            payload.endTime = new Date(zhls.endTime).getTime()
            payload.accountType=4
            payload.businessOrderId=zhls.businessOrderId
            payload.restaurantId=+zhls.restaurantId
            if(zhls.incomExpen.length==0){
                message.error('记账类型是必选项！')
                yield put({ type: 'hideLoading' });
                return
            }
            payload.incomExpen=(zhls.incomExpen.length==2||zhls.incomExpen.length==0)?0:+zhls.incomExpen[0]
            if(zhls.tradeMode.length==0){
                message.error('业务类型是必选项！')
                yield put({ type: 'hideLoading' });
                return
            }
            payload.tradeMode=zhls.tradeMode.join(',')

            var excelTime=moment(new Date(zhls.startTime).getTime()).format('MMDD')+'-'+moment(new Date(zhls.endTime).getTime()).format('MMDD')
			postVipExportFile(config.fundBillExport, payload, zhls.name+'-'+'账户流水表('+excelTime+").xlsx");
		},
    },

    reducers: {
        updatePayload(state, action) {
            return { ...state, ...action.payload, };
        },
        /*显示加载提示*/
        showLoading(state) {
            return { ...state, loading: true };
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return { ...state, loading: false };
        },
    }
}