import {config, httpPost} from '../../services/HttpService';
import {postExportFile} from '../../services/CommonService';
import fetch from 'dva/fetch';
import FileSaver from 'file-saver';
import { stringify } from 'qs';
import moment from 'moment';
import message from 'antd/lib/message';
const todayStart = moment().startOf("day");
// const todayStart = moment().subtract(7, 'days');
const todayEnd = moment().endOf("day");
import common from './common.less';
import React, { PropTypes } from 'react';
import { routerRedux } from 'dva/router';
import { Popover } from 'antd';

export default {
    namespace: 'biz',
    state: {
        loading:false,
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

        // stat
        stat: {},
        list: [],
        scrollX:2350,
		
		
		
		obj1:{},
		value:[],
		autoExpand:false,

        total: 0,
        page: 1,
        size: 10,
        static_days:'0',
        avgType:'1',

        //传参下一个页面
        restaurantId:null,
        orgName:'',

        needMoneyType:0,
        receiveMoneyType:0,
        peopleType:0,
        orderType:0,


        columns:[
            {title: '餐厅名称', dataIndex: 'orgName', key: 'orgName', width: 300, className: common.left},
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
        setup({dispatch, history,biz}) {
            history.listen(location => {
                if (location.pathname === '/yyhzb') {
                    let columns=[
                        {title: '序号', dataIndex: 'key', key: 'key', width: 100, fixed:'left', className: common.right},
                        {title: '餐厅名称', dataIndex: 'orgName', key: 'orgName', width: 300, fixed:'left', className: common.left,render:(text,record,index)=>(
                            <Popover content={record.orgName}>
                                <a className={common.yzy_line1} onClick={()=>{
                                    console.log(record)
                                    let arr=[],obj={}
                                    arr.push(record.restaurantId)
                                    obj[record.restaurantId]=record.orgName
                                    dispatch({
                                        type:'updatePayload',
                                        payload:{
                                            restaurantId:record.restaurantId,
                                            orgName:record.orgName
                                        }
                                    })
                                    dispatch(routerRedux.push({
                                        pathname: '/yymxb',
                                        query: {
                                            isFromBiz:true
                                        }
                                    }));
                                }}>{record.orgName}</a>
                            </Popover>
                        )},
                        {title: '应收金额', dataIndex: 'needMoney', key: 'needMoney', width: 100, className: common.right},
                        {title: '实收金额', dataIndex: 'receiveMoney', key: 'receiveMoney', width: 100, className: common.right},
                        /*{title: (<a onClick={()=>{
                                dispatch(routerRedux.push({
                                    pathname: '/ymhzb',
                                    query: {}
                                }));
                        }}>优免金额</a>), dataIndex: 'giftMoney', key: 'giftMoney', width: 100, className: common.right},*/
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
					dispatch({
                        type: 'updatePayload',
                        payload: {
							autoExpand:false,
                            columns:columns
						},
                    });
                    dispatch({
                        type: 'userPower',
                        payload: {},
                    });
                }
            });
        }
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
                    type: 'list',
                    payload: {},
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
        * stat({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let biz = yield select(({biz}) => biz);
            payload.restaurantIds = biz.restaurantIds;
            payload.startTime = new Date(biz.startTime).getTime();
            payload.endTime = new Date(biz.endTime).getTime();
            const {data} = yield call(httpPost, config.bizStatUrl, payload);
            if (data && data.code == config.MSGCODE_SUCCESS) {
                let stat = data.data;
                let dataList = [
                    {name: "应收金额", value: stat.needMoney},
                    {name: "餐实收金额", value: stat.receiveMoney},
                    {name: "优免金额 ", value: stat.giftMoney},
                ];
                let indexList = [
                    {name: "就餐总人数", value: stat.people},
                    {name: "总单数", value: stat.order},
                    {name: "人均消费", value: stat.avgPeopleMoney},
                    {name: "单均消费", value: stat.avgOrderMoney},
                ];
                let monitorList = [
                    {name: "免单合计", value: stat.freeMoney},
                    {name: "退菜合计", value: stat.retreatFoodMoney},
                    {name: "折扣合计 ", value: stat.discountMoney},
                    {name: "赠菜合计", value: stat.giftFoodMoney},
                    {name: "反结合计", value: stat.reverseMoney},
                ];
                yield put({
                    type: 'updatePayload',
                    payload: {
                        stat: data.data,
                        dataList: dataList,
                        indexList: indexList,
                        monitorList: monitorList,
						//value1:[]
                    }
                });
            }else{
                message.error(data.msg)
            }
        },

        * list({payload}, {select, call, put}) {
            yield put({
                type: 'showLoading'
            });
            let biz = yield select(({biz}) => biz);
            let store = yield select(({store}) => store);
            payload.size = biz.size;
            payload.offset = (biz.page - 1) * biz.size;
            payload.start = (biz.page - 1) * biz.size;
            payload.restaurantIds = biz.restaurantIds;
            payload.avgType=+(biz.avgType)
            payload.resIdOrgNameMap = biz.resIdOrgNameMap;
            payload.startTime = new Date(biz.startTime).getTime();
            payload.endTime = new Date(biz.endTime).getTime();

            if(biz.needMoneyType>0) payload.needMoneyType=biz.needMoneyType
            if(biz.receiveMoneyType>0) payload.receiveMoneyType=biz.receiveMoneyType
            if(biz.peopleType>0) payload.peopleType=biz.peopleType
            if(biz.orderType>0) payload.orderType=biz.orderType

            let columns=biz.columns
            if(columns.length>20){
                columns.splice(15,columns.length-20)
            }

            const {data} = yield call(httpPost, config.bizRestaurant, payload);
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

                //let columns=biz.columns
                /*let columns=[
                    {title: '序号', dataIndex: 'key', key: 'key', width: 100, fixed:'left', className: common.right},
                    {title: '餐厅名称', dataIndex: 'orgName', key: 'orgName', width: 300, fixed:'left', className: common.left,render:(text,record,index)=>(
                            <Popover content={record.orgName}>
                                <a className={common.yzy_line1} onClick={()=>{
                                    console.log(record)
                                    let arr=[],obj={}
                                    arr.push(record.restaurantId)
                                    obj[record.restaurantId]=record.orgName
                                    dispatch({
                                        type:'updatePayload',
                                        payload:{
                                            restaurantId:record.restaurantId,
                                            orgName:record.orgName
                                        }
                                    })
                                    dispatch(routerRedux.push({
                                        pathname: '/yymxb',
                                        query: {
                                            isFromBiz:true
                                        }
                                    }));
                                }}>{record.orgName}</a>
                            </Popover>
                        )},
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
                    ];*/


                columns[0].render=(text,record,index)=>(<span>{(biz.page-1)*biz.size+(record.key+1)}</span>)
                

                let scrollX=2350
                if(arr.length>0){
                    arr.map((val,idx)=>{
                        //columns.push({title: val.ch, dataIndex: val.en, key: val.en, width: 100, className: common.right})
						columns.splice(15+idx,0,{title: val.ch, dataIndex: val.en, key: val.en, width: 100, className: common.right})
                        data.data.map((val2,idx2)=>{
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
            let biz = yield select(({biz}) => biz);
            let store = yield select(({store}) => store);
            payload.avgType=+(biz.avgType)
            payload.restaurantIds = biz.restaurantIds;
            payload.resIdOrgNameMap = biz.resIdOrgNameMap;
            payload.startTime = new Date(biz.startTime).getTime();
            payload.endTime = new Date(biz.endTime).getTime();
            
            if(biz.needMoneyType>0) payload.needMoneyType=biz.needMoneyType
            if(biz.receiveMoneyType>0) payload.receiveMoneyType=biz.receiveMoneyType
            if(biz.peopleType>0) payload.peopleType=biz.peopleType
            if(biz.orderType>0) payload.orderType=biz.orderType

            postExportFile(config.bizRestaurantExport, payload, "营业汇总表.xlsx");
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
        }
    }
}