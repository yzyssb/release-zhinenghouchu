import {config, httpPost} from '../../services/HttpService';
import moment from 'moment';
import {postExportFile} from "../../services/CommonService";
import message from 'antd/lib/message';
const todayStart = moment().startOf("day");
// const todayStart = moment().subtract(7, 'days');
const todayEnd = moment().endOf("day");

export default {
    namespace: 'bill',
    state: {
        restaurantIds: null,
        restaurantList:[],
        // obj
        startTime: todayStart,
        endTime: todayEnd,

        sourceType: "",
        modalVisible: false,
        // table record
        record: {},
        // bill detail info
        info: {},
        // 菜品合计
        foodSumPrice: 0,
        // stat
        stat: {},
        list: [
            // {
            //     id: 1,
            //     name: 123,
            //     contactName: 4556,
            // }
        ],
        total: 0,
        page: 1,
        size: 10,
		
		obj1:{},
		value:[],
		autoExpand:false,

        static_days:'0',

        //新增字段
        orderNo:'',
        phone:'',
        regionName:'',
        tableName:'',
        eatType:-1,
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/zdmxb') {
					dispatch({
                        type: 'updatePayload',
                        payload: {
							autoExpand:false,
						},
                    });
                    dispatch({
                        type: 'userPower',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {
		* userPower({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const {data} = yield call(httpPost, config.userPower, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                let arr=[],obj2={},value=[]
				function extend(target, source) {
				  for (var key in source) {
					if (Object.prototype.toString.call(source[key]) === '[object Object]') {
					  target[key] = {}
					  extend(target[key], source[key])
					} else if (Object.prototype.toString.call(source[key]) === '[object Array]') {
					  target[key] = []
					  extend(target[key], source[key])
					} else {
					  if (key == "nodeName") {
						target["title"] = source[key];
					  }else{
						target[key] = source[key]
					  }
					  target["key"] = source["id"] + "-" + source["nodeName"]
					  target["value"] = source["id"] + "-" + source["nodeName"]
					  if(Object.keys(source).indexOf('children')==-1&&arr.indexOf(source["id"])==-1){
						  arr.push(source["id"])
						  value.push(source["id"] + "-" + source["nodeName"])
						  obj2[source["id"]]=source["nodeName"]
					  }
					}
				  }
				}
				
				let obj1={}
				if(Object.keys(data.data).length>0){
					extend(obj1,data.data)
					yield put({
						type:'updatePayload',
						payload:{
							obj1:obj1,
							resIdOrgNameMap:obj2,
							restaurantIds:arr,
							value:value
						}
					})
				}
				yield put({
                    type: 'stat',
                    payload: {},
                });
				yield put({
                    type: 'list',
                    payload: {},
                });
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)

            }
        },
        * stat({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let bill = yield select(({bill}) => bill);
            payload.restaurantIds = bill.restaurantIds;
            payload.startTime = new Date(bill.startTime).getTime();
            payload.endTime = new Date(bill.endTime).getTime();
            if (bill.sourceType) {
                payload.sourceType = bill.sourceType;
            }

            if(bill.orderNo.length>0) payload.orderNo=bill.orderNo
            if(bill.phone.length>0) payload.phone=bill.phone
            if(bill.regionName.length>0) payload.regionName=bill.regionName
            if(bill.tableName.length>0) payload.tableName=bill.tableName
            if(bill.eatType!=-1) payload.eatType=+bill.eatType

            const {data} = yield call(httpPost, config.billStatUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                yield put({
                    type: 'updatePayload',
                    payload: {
                        stat: data.data,
						value1:[]
                    }
                });
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)
            }
        },
        * list({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let bill = yield select(({bill}) => bill);
            let store = yield select(({store}) => store);
            payload.size = bill.size;
            payload.offset = (bill.page - 1) * bill.size;
            payload.restaurantIds = bill.restaurantIds;
            payload.resIdOrgNameMap = bill.resIdOrgNameMap;
            payload.startTime = new Date(bill.startTime).getTime();
            payload.endTime = new Date(bill.endTime).getTime();
            if (bill.sourceType) {
                payload.sourceType = bill.sourceType;
            }

            if(bill.orderNo.length>0) payload.orderNo=bill.orderNo
            if(bill.phone.length>0) payload.phone=bill.phone
            if(bill.regionName.length>0) payload.regionName=bill.regionName
            if(bill.tableName.length>0) payload.tableName=bill.tableName
            if(bill.eatType!=-1) payload.eatType=+bill.eatType

            const {data} = yield call(httpPost, config.billListUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                if(data.data&&data.data.length>0){
                    data.data.map((v,i)=>{
                        v.key=+i
                    })
                }
                yield put({
                    type: 'updatePayload',
                    payload: {
                        list: data.data,
                        total:data.totalCount,
                    }
                });
                yield put({
                    type: 'hideLoading'
                });
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)
            }
        },

        * info({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            const {data} = yield call(httpPost, config.billInfoUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                let foodSumPrice = 0;
                let info = data.data;
                if(info.foodInfos){
                    info.foodInfos.map((item,index) => {
                        item.key=+index
                        foodSumPrice += item.totalPrice*100;
                    });
                }
                yield put({
                    type: 'updatePayload',
                    payload: {
                        info: info,
                        foodSumPrice: foodSumPrice,
                    }
                });
                yield put({
                    type: 'hideLoading'
                });
            }else{
                yield put({
                    type: 'hideLoading'
                });
                message.error(data.msg)
            }
        },

        * _export({payload}, {select, call, put}) {
            let bill = yield select(({bill}) => bill);
            let store = yield select(({store}) => store);
            payload.restaurantIds = bill.restaurantIds;
            payload.resIdOrgNameMap = bill.resIdOrgNameMap;
            payload.startTime = new Date(bill.startTime).getTime();
            payload.endTime = new Date(bill.endTime).getTime();
            if (bill.sourceType) {
                payload.sourceType = bill.sourceType;
            }

            if(bill.orderNo.length>0) payload.orderNo=bill.orderNo
            if(bill.phone.length>0) payload.phone=bill.phone
            if(bill.regionName.length>0) payload.regionName=bill.regionName
            if(bill.tableName.length>0) payload.tableName=bill.tableName
            if(bill.eatType!=-1) payload.eatType=+bill.eatType

            postExportFile(config.billStatExportUrl, payload, "账单明细表.xlsx");
        },
    },
    reducers: {
        updatePayload(state, action) {
            return {
                ...state, ...action.payload,
            };
        },
        /*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
        },
    }
}