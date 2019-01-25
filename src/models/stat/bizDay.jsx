import {config, httpPost} from '../../services/HttpService';
import {postExportFile} from '../../services/CommonService';
import moment from 'moment';
import message from 'antd/lib/message';
const todayStart = moment().startOf("day");
// const todayStart = moment().subtract(7, 'days');
const todayEnd = moment().endOf("day");
import common from './common.less';
import React, { PropTypes } from 'react';

export default {
    namespace: 'bizDay',
    state: {
        restaurantIds: null,
        restaurantList:[],
		resIdOrgNameMap:{},
        // obj
        startTime: todayStart,
        endTime: todayEnd,

        // 营业数据
        dataList: [],
        // 经营指标
        indexList: [],
        // 营业监控
        monitorList: [],
        scrollX:2250,
		
		obj1:{},
		value:[],
		autoExpand:false,

        // stat
        stat: {},
        list: [],
        total: 0,
        page: 1,
        size: 10,
        static_days:'0',
        avgType:'1',

        isFromBiz:false,
        columns:[
            {title: '序号', dataIndex: 'key', key: 'key', width: 100, fixed:'left', className: common.right},
            {title: '日期', dataIndex: 'day', key: 'day', width: 100, className: common.left,fixed:'left'},
            {title: '星期', dataIndex: 'week', key: 'week', width: 100, className: common.left,fixed:'left'},
            {title: '应收金额', dataIndex: 'needMoney', key: 'needMoney', width: 100, className: common.right},
            {title: '实收金额', dataIndex: 'receiveMoney', key: 'receiveMoney', width: 100, className: common.right},
            {title: '优免金额', dataIndex: 'giftMoney', key: 'giftMoney', width: 100, className: common.right},
            {title: '就餐总人数', dataIndex: 'people', key: 'people', width: 120, className: common.right},
            {title: '总单数', dataIndex: 'order', key: 'order', width: 100, className: common.right},
            {title: '人均消费', dataIndex: 'avgPeopleMoney', key: 'avgPeopleMoney', width: 100, className: common.right},
            {title: '单均消费', dataIndex: 'avgOrderMoney', key: 'avgOrderMoney', width: 100, className: common.right},

            {title: '现金', dataIndex: 'cash', key: 'cash', width: 100, className: common.right},
            {title: '微信', dataIndex: 'weixin', key: 'weixin', width: 100, className: common.right},
            {title: '支付宝', dataIndex: 'aliPay', key: 'aliPay', width: 100, className: common.right},
            {title: '积分支付', dataIndex: 'points', key: 'points', width: 100, className: common.right},
            {title: '储值本金支付', dataIndex: 'vipMain', key: 'vipMain', width: 130, className: common.right},
            {title: '储值赠送支付', dataIndex: 'vipGift', key: 'vipGift', width: 130, className: common.right},
            
            {title: '优惠券抵扣', dataIndex: 'coupon', key: 'coupon', width: 130, className: common.right},
            {title: '红包支付', dataIndex: 'redPacket', key: 'redPacket', width: 100, className: common.right},
            {title: '手动抹零', dataIndex: 'wipeMT', key: 'wipeMT', width: 100, className: common.right},
            {title: '消费返积分', dataIndex: 'backPoints', key: 'backPoints', width: 120, className: common.right},
            {title: '评论返红包', dataIndex: 'backRedPaceket', key: 'backRedPaceket', width: 120, className: common.right},
        ]
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/yymxb') {
                    dispatch({
                        type: 'updatePayload',
                        payload: {
                            autoExpand:false,
                            isFromBiz:false,
                            static_days:'0',
                            avgType:'1',
                            isFromBiz:location.query.isFromBiz=='true'
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
                    let biz = yield select(({biz}) => biz);
                    let bizDay = yield select(({bizDay}) => bizDay);
                    console.log(bizDay.isFromBiz)
                    if(bizDay.isFromBiz){
                        let arr2=[],obj2={},value2=[]
                        arr2.push(biz.restaurantId)
                        obj2[biz.restaurantId]=biz.orgName
                        value2.push(biz.restaurantId+'-'+biz.orgName)
                        yield put({
                            type: 'updatePayload',
                            payload: {
                                avgType:String(biz.avgType),
                                static_days:biz.static_days,
                                restaurantIds: arr2,
                                resIdOrgNameMap:obj2,
                                startTime:biz.startTime,
                                endTime:biz.endTime,
                                value:value2,
                                obj1:obj1,
                            }
                        });
                        yield put({
                            type: 'list',
                            payload: {},
                        });
                    }else{
    					yield put({
    						type:'updatePayload',
    						payload:{
    							obj1:obj1,
    							resIdOrgNameMap:obj2,
    							restaurantIds:arr,
    							value:value
    						}
    					})
                        yield put({
                            type: 'list',
                            payload: {},
                        });
                    }
				}
				
				
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
            let bizDay = yield select(({bizDay}) => bizDay);
            let store = yield select(({store}) => store);
            let biz = yield select(({biz}) => biz);
            payload.size = bizDay.size;
            payload.offset = (bizDay.page - 1) * bizDay.size;
            payload.start = (bizDay.page - 1) * bizDay.size;
            payload.avgType=+(bizDay.avgType)
            payload.restaurantIds = bizDay.restaurantIds;
            payload.resIdOrgNameMap = bizDay.resIdOrgNameMap;
            payload.startTime = new Date(bizDay.startTime).getTime();
            payload.endTime = new Date(bizDay.endTime).getTime();

            

            console.log(payload)

            const {data} = yield call(httpPost, config.bizDay, payload);

            if (data && data.code == config.MSGCODE_SUCCESS) {

                let arr=[]
                if(data.data&&data.data.length>0){
                    data.data.map((val1,idx1)=>{
                        val1.key=+idx1
                        if(val1.thirdPays&&val1.thirdPays.length>0){
                            val1.thirdPays.map((val2,idx2)=>{
                                if(arr.length==0){
                                    arr.push({
                                        en:'key_'+arr.length,
                                        ch:val2.payName
                                    })
                                }else{
                                    let a=false
                                    arr.map((val3,idx3)=>{
                                        if(val3.ch==val2.payName){
                                            a=true
                                        }
                                    })
                                    if(!a){
                                        arr.push({
                                            en:'key_'+arr.length,
                                            ch:val2.payName
                                        })
                                    }
                                }
                            })
                        }
                    })
                }

                let columns=[
                    {title: '序号', dataIndex: 'key', key: 'key', width: 100, fixed:'left', className: common.right,render:(text,record,index)=>(<span>{(bizDay.page-1)*bizDay.size+(record.key+1)}</span>)},
                    {title: '日期', dataIndex: 'day', key: 'day', width: 100, className: common.left,fixed:'left'},
                    {title: '星期', dataIndex: 'week', key: 'week', width: 100, className: common.left,fixed:'left'},
                    {title: '应收金额', dataIndex: 'needMoney', key: 'needMoney', width: 100, className: common.right},
                    {title: '实收金额', dataIndex: 'receiveMoney', key: 'receiveMoney', width: 100, className: common.right},
                    {title: '优免金额', dataIndex: 'giftMoney', key: 'giftMoney', width: 100, className: common.right},
                    {title: '就餐总人数', dataIndex: 'people', key: 'people', width: 120, className: common.right},
                    {title: '总单数', dataIndex: 'order', key: 'order', width: 100, className: common.right},
                    {title: '人均消费', dataIndex: 'avgPeopleMoney', key: 'avgPeopleMoney', width: 100, className: common.right},
                    {title: '单均消费', dataIndex: 'avgOrderMoney', key: 'avgOrderMoney', width: 100, className: common.right},

                    {title: '现金', dataIndex: 'cash', key: 'cash', width: 100, className: common.right},
                    {title: '微信', dataIndex: 'weixin', key: 'weixin', width: 100, className: common.right},
                    {title: '支付宝', dataIndex: 'aliPay', key: 'aliPay', width: 100, className: common.right},
                    {title: '积分支付', dataIndex: 'points', key: 'points', width: 100, className: common.right},
                    {title: '储值本金支付', dataIndex: 'vipMain', key: 'vipMain', width: 130, className: common.right},
                    {title: '储值赠送支付', dataIndex: 'vipGift', key: 'vipGift', width: 130, className: common.right},
                    
                    {title: '优惠券抵扣', dataIndex: 'coupon', key: 'coupon', width: 130, className: common.right},
                    {title: '红包支付', dataIndex: 'redPacket', key: 'redPacket', width: 100, className: common.right},
                    {title: '手动抹零', dataIndex: 'wipeMT', key: 'wipeMT', width: 100, className: common.right},
                    {title: '消费返积分', dataIndex: 'backPoints', key: 'backPoints', width: 120, className: common.right},
                    {title: '评论返红包', dataIndex: 'backRedPaceket', key: 'backRedPaceket', width: 120, className: common.right},
                ]

                let scrollX=2250
                if(arr.length>0){
                    arr.map((val,idx)=>{
                        //columns.push({title: val.ch, dataIndex: val.en, key: val.en, width: 100, className: common.right})
						columns.splice(16+idx,0,{title: val.ch, dataIndex: val.en, key: val.en, width: 100, className: common.right})
                        data.data.map((val2,idx2)=>{
                            val2.key=+idx2
                            let b='0.00'
                            val2.thirdPays.map((val3,idx3)=>{
                                if(val.ch==val3.payName){
                                    b=val3.money
                                } 
                            })
                            val2[val.en]=b
                        })
                    })
                    scrollX+=100*arr.length
                }

                yield put({
                    type: 'updatePayload',
                    payload: {
                        columns:columns,
                        list: data.data,
                        total:data.totalCount,
                        scrollX:scrollX
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
            let bizDay = yield select(({bizDay}) => bizDay);
            let store = yield select(({store}) => store);
            payload.restaurantIds = bizDay.restaurantIds;
            payload.avgType=+(bizDay.avgType)
            payload.resIdOrgNameMap = bizDay.resIdOrgNameMap;
            payload.startTime = new Date(bizDay.startTime).getTime();
            payload.endTime = new Date(bizDay.endTime).getTime();
            postExportFile(config.bizDayExport, payload, "营业明细表.xlsx");
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