import React, {PropTypes} from 'react';
import Header from '../../../components/Header';
import {connect} from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import {routerRedux} from 'dva/router';
import Spin from 'antd/lib/spin';
import Form from 'antd/lib/form';

const FormItem = Form.Item;

import styles from '../tcmxb/TcmxbPage.less';

import moment from 'moment';
import DatePicker from 'antd/lib/date-picker';

const RangePicker = DatePicker.RangePicker;

import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Select from 'antd/lib/select';
import Tabs from 'antd/lib/tabs';
import {config} from "../../../services/HttpService";
import {getUserToken} from "../../../services/CommonService";

const Option = Select.Option;
const TabPane = Tabs.TabPane;

import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import common from '../common.less';
import Breadcrumb from 'antd/lib/breadcrumb';
import Tree from 'antd/lib/tree';
import TreeSelect from 'antd/lib/tree-select';
const TreeNode = Tree.TreeNode;
import message from 'antd/lib/message';

function CpxsbPage({menu, dispatch, cpxsb}) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formItemLayout1 = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const pagination = {
        current:cpxsb.current,
        pageSize: cpxsb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'cpxsb/updatePayload',payload:{size:pageSize,current:1,}});
    }

    function onPageChange(pageNo){
        dispatch({type: 'cpxsb/updatePayload',payload:{current:pageNo}});
    }

    const pagination1 = {
        current:cpxsb.current1,
        pageSize: cpxsb.size1,
        onChange: (pageNo) => {
            onPageChange1(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange1,
    };

    function SizeChange1(current, pageSize){
        dispatch({type: 'cpxsb/updatePayload',payload:{size1:pageSize,current1:1,}});
    }

    function onPageChange1(pageNo){
        dispatch({type: 'cpxsb/updatePayload',payload:{current1:pageNo}});
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            className:common.right,
            width:60,
            fixed:cpxsb.foodList.length==0?false:'left',
            render:(text,record,index)=>{
                return cpxsb.size*(cpxsb.current-1)+index+1
            }
        },
        {
            title: '菜品名称',
            dataIndex: 'foodName',
            key: 'foodName',
            width:230,
            fixed:cpxsb.foodList.length==0?false:'left',
            className:common.left,
            sorter:(a,b)=>a.foodName.localeCompare(b.foodName,'zh')
        },
        {
            title:'规格',
            dataIndex:'specName',
            key:'specName',
            width:60,
            className:common.left,
        },
        {
            title: '单位',
            dataIndex: 'unitName',
            key: 'unitName',
            width:60,
            className:common.left,
        },
        {
            title: '菜品分类',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width:300,
            className:common.left,
        },
        {
            title: '菜品单价',
            dataIndex: 'singlePrice',
            key: 'singlePrice',
            width:100,
            className:common.right,
        },
        {
            title: '会员价',
            dataIndex: 'vipPrice',
            key: 'vipPrice',
            width:100,
            className:common.right,
        },
        {
            title: '实售单价',
            dataIndex: 'realPrice',
            key: 'realPrice',
            width:100,
            className:common.right,
        },
        {
            title: '售卖数量',
            dataIndex: 'num',
            key: 'num',
            width:100,
            className:common.right,
            sorter:(a,b)=>a.num-b.num
        },
        {
            title: '单品成本',
            dataIndex: 'amtCost',
            key: 'amtCost',
            width:100,
            className:common.right,
        },
        {
            title: '菜品应收',
            dataIndex: 'amtNeed',
            key: 'amtNeed',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.amtNeed-b.amtNeed
        },
        {
            title: '菜品实收',
            dataIndex: 'amtRecv',
            key: 'amtRecv',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.amtRecv-b.amtRecv
        },
        {
            title: '实收日均',
            dataIndex: 'avgAmtDay',
            key: 'avgAmtDay',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.avgAmtDay-b.avgAmtDay
        },
        {
            title: '售卖量占比',
            dataIndex: 'numProportion',
            key: 'numProportion',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.numProportion.split('%')[0]-b.numProportion.split('%')[0]

        },
        {
            title: '实收额占比',
            dataIndex: 'realProportion',
            key: 'realProportion',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.realProportion.split('%')[0]-b.realProportion.split('%')[0]
        },
        {
            title: '日均销量',
            dataIndex: 'avgNumDay',
            key: 'avgNumDay',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.avgNumDay-b.avgNumDay
        },
        {
            title: '日均销量占比',
            dataIndex: 'avgNumDayProportion',
            key: 'avgNumDayProportion',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.avgNumDayProportion.split('%')[0]-b.avgNumDayProportion.split('%')[0]
        },
        {
            title: '标准毛利率',
            dataIndex: 'standardRate',
            key: 'standardRate',
            width:100,
            className:common.right,
        },
        {
            title: '实际毛利率',
            dataIndex: 'realRate',
            key: 'realRate',
            width:130,
            className:common.right,
            sorter:(a,b)=>a.realRate.split('%')[0]-b.realRate.split('%')[0]
        },
    ]

    const columns1 = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: 100,
            fixed:cpxsb.combosellList.length==0?false:'left',
            className:common.right,
        },
        {
            title: '菜品名称',
            dataIndex: 'foodName',
            key: 'foodName',
            width: 300,
            fixed:cpxsb.combosellList.length==0?false:'left',
            className:common.left,
            sorter:(a,b)=>a.foodName.localeCompare(b.foodName,'zh')
        },
        {
            title: '套餐价',
            dataIndex: 'comboPrice',
            key: 'comboPrice',
            width: 100,
            className:common.right,
        },
        {
            title: '菜品单价',
            dataIndex: 'singlePirce',
            key: 'singlePirce',
            width: 100,
            className:common.right,
        },
        {
            title: '会员价',
            dataIndex: 'vipPrice',
            key: 'vipPrice',
            width: 100,
            className:common.right,
        },
        {
            title: '售卖数量',
            dataIndex: 'num',
            key: 'num',
            width: 130,
            className:common.right,
            sorter:(a,b)=>a.num-b.num
        },
        {
            title: '菜品应收',
            dataIndex: 'needMoney',
            key: 'needMoney',
            width: 130,
            className:common.right,
            sorter:(a,b)=>a.needMoney-b.needMoney
        },
        {
            title: '菜品实收',
            dataIndex: 'realMoney',
            key: 'realMoney',
            width: 130,
            className:common.right,
            sorter:(a,b)=>a.realMoney-b.realMoney
        },
        {
            title: '实收日均',
            dataIndex: 'avgAmtDay',
            key: 'avgAmtDay',
            width: 130,
            className:common.right,
            sorter:(a,b)=>a.avgAmtDay-b.avgAmtDay
        },
        {
            title: '售卖量占比',
            dataIndex: 'numProportion',
            key: 'numProportion',
            width: 150,
            className:common.right,
            sorter:(a,b)=>a.numProportion.split('%')[0]-b.numProportion.split('%')[0]
        },
        {
            title: '实收额占比',
            dataIndex: 'realProportion',
            key: 'realProportion',
            width: 150,
            className:common.right,
            sorter:(a,b)=>a.realProportion.split('%')[0]-b.realProportion.split('%')[0]
        },
        {
            title: '日均销量',
            dataIndex: 'avgNumDay',
            key: 'avgNumDay',
            width: 130,
            className:common.right,
            sorter:(a,b)=>a.avgNumDay-b.avgNumDay
        },
        {
            title: '日均销量占比',
            dataIndex: 'avgNumDayProportion',
            key: 'avgNumDayProportion',
            width: 150,
            className:common.right,
            sorter:(a,b)=>a.avgNumDayProportion.split('%')[0]-b.avgNumDayProportion.split('%')[0]
        }
    ]

    const columns2 = [
        {
            title: '门店名称',
            dataIndex: 'orgName',
            key: 'orgName',
            width: 100,
            className:common.left,
        },
        {
            title: '菜品名称',
            dataIndex: 'foodName',
            key: 'foodName',
            width: 100,
            className:common.left,
        },
        {
            title: '菜品分类',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 100,
            className:common.left,
        },
        {
            title: '菜品原价',
            dataIndex: 'originalPrice ',
            key: 'originalPrice ',
            width: 100,
            className:common.right,
        },
        {
            title: '套餐价',
            dataIndex: 'comboPrice',
            key: 'comboPrice',
            width: 100,
            className:common.right,
        },
        {
            title: '售卖数量',
            dataIndex: 'num1',
            key: 'num1',
            width: 100,
            className:common.right,
        },
        {
            title: '菜品数量明细',
            dataIndex: 'num',
            key: 'num',
            width: 100,
            className:common.right,
        },
        {
            title: '菜品应收合计',
            dataIndex: 'needMoney',
            key: 'needMoney',
            width: 100,
            className:common.right,
        },


    ]
    function selectChange(key) {
        var postMap={};
        var choosedIndex=[]

        // map.
        if(key.length>0)
        {
            if (cpxsb.storeList.shopList) {
                cpxsb.storeList.shopList.map((j) => {
                    key.map(function(selectId){
                        if(j.id == selectId)
                        {
                            postMap[j.id]=j.name;
                            choosedIndex.push(String(j.id))
                        }
                    })
                })
            }
        }
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {postChoosedIndex: choosedIndex}
        })
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {choosedIndex: choosedIndex,postMap:postMap}
        })
    }
    function selectChange1(key) {
        var postMap={};
        var choosedIndex1=[]

        // map.
        if(key.length>0)
        {
            if (cpxsb.storeList.shopList) {
                cpxsb.storeList.shopList.map((j) => {
                    key.map(function(selectId){
                        if(j.id == selectId)
                        {
                            postMap[j.id]=j.name;
                            choosedIndex1.push(String(j.id))
                        }
                    })
                })
            }
        }
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {postChoosedIndex1: choosedIndex1}
        })
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {choosedIndex1: choosedIndex1,postMap1:postMap}
        })
    }

    var cuisineOptionHtml = [];

    if (cpxsb.storeList.shopList) {
        cpxsb.storeList.shopList.map((j) => {
            cuisineOptionHtml.push(<Select.Option key={j.id}>{j.name}</Select.Option>)
        })
    }

    function onSearch() {
        dispatch({
            type: 'cpxsb/getData',
            payload: {}
        })
        /*dispatch({
            type: 'cpxsb/getFoodStat',
            payload: {}
        })*/
    }
    function onSearch1() {
        dispatch({
            type: 'cpxsb/getCData',
            payload: {}
        })
        /*dispatch({
            type: 'cpxsb/getCombosellStat',
            payload: {}
        })*/
    }

    function onReset() {
        var startTime = new Date(new Date().toLocaleDateString() + ' 00:00:00').getTime(),
            endTime = new Date(startTime + 24 * 3600 * 1000).getTime()
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {startTime: startTime, endTime: endTime, choosedIndex: -1}
        })
        dispatch({
            type: 'cpxsb/getData',
            payload: {}
        })
    }


    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    function range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    function disabledRangeTime(_, type) {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 60).splice(4, 20),
                disabledMinutes: () => range(30, 60),
                disabledSeconds: () => [55, 56],
            };
        }
        return {
            disabledHours: () => range(0, 60).splice(20, 4),
            disabledMinutes: () => range(0, 31),
            disabledSeconds: () => [55, 56],
        };
    }

    const onSearchDateChange = (dates, dateStrings) => {
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {
                startTime: dates[0],
                endTime: dates[1],
                postStartTime: new Date(dates[0].format('YYYY-MM-DD 00:00:00')).valueOf(),
                postEndTime: new Date(dates[1].format('YYYY-MM-DD 23:59:59')).valueOf(),
                static_days:'0'
            }
        });
    };
    const onSearchDateChange1 = (dates, dateStrings) => {
        dispatch({
            type: 'cpxsb/updatePayload',
            payload: {
                startTime1: dates[0],
                endTime1: dates[1],
                postStartTime1: new Date(dates[0].format('YYYY-MM-DD 00:00:00')).valueOf(),
                postEndTime1: new Date(dates[1].format('YYYY-MM-DD 23:59:59')).valueOf(),
                static_days:'0'
            }
        });
    };

    function callback(key) {
        console.log(key);
        if(key==1){
            /*dispatch({
                type:'cpxsb/getFoodStat',
                payload:{}
            })*/
            dispatch({
                type:'cpxsb/getData',
                payload:{}
            })
        }else if(key==2){
            /*dispatch({
                type:'cpxsb/getCombosellStat',
                payload:{}
            })*/
            dispatch({
                type:'cpxsb/getCData',
                payload:{}
            })
        }
    }
    function loadFoodOut() {
        document.getElementById("formFoodsellOrderExport").submit();
    }
    function loadOut() {
        document.getElementById("formOrderExport").submit();
    }

    const expandedRowRenderFile = (record) => {
        console.log(record)
        return (
            <Table
                columns={columns2}
                dataSource={record.comboSimpleDTOs}
                pagination={false}
                rowKey={record.id}
                showHeader={false}
                indentSize={5}
            />
        );

    };

    function chooseDuration(t){
        var startTime,endTime=moment().endOf('day')
        if(t==0){
            startTime=moment().startOf("month")
            endTime=moment().endOf('day')
        }else if(t==1){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==2){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==7){
            startTime=moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                startTime:new Date(startTime).getTime(),
                endTime:new Date(endTime).getTime(),
                postStartTime:new Date(startTime).getTime(),
                postEndTime:new Date(endTime).getTime(),
                static_days:t
            }
        })
    }

    function chooseDuration1(t){
        var startTime,endTime=moment().endOf('day')
        if(t==0){
            startTime=moment().startOf("month")
            endTime=moment().endOf('day')
        }else if(t==1){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59')
        }else if(t==2){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(t==7){
            startTime=moment().subtract(6, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==15){
            startTime=moment().subtract(14, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(t==30){
            startTime=moment().subtract(29, 'days').format('YYYY-MM-DD 00:00:00')
        }
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                startTime1:new Date(startTime).getTime(),
                endTime1:new Date(endTime).getTime(),
                postStartTime1:new Date(startTime).getTime(),
                postEndTime1:new Date(endTime).getTime(),
                static_days1:t
            }
        })
    }

    function typeChange(e){
        console.log(e)
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                queryType:e
            }
        })
    }

    function back(){
        window.history.go(-1)
    }

    function treeChange(value){
        
        let lastValue=cpxsb.value,extraValue=[]
        if(value.length>=lastValue.length){
            let exist=false
            if(value.length>0){
                value.map((v,i)=>{
                    exist=false
                    if(lastValue.length>0){
                        lastValue.map((vv,ii)=>{
                            if(v==vv){
                                console.log(1)
                                exist=true
                            }
                        })
                    }
                    console.log(exist)
                    if(!exist){
                        extraValue.push(v)
                    }
                })
            }
        }

        let valueParent=[],extraParent=[]
        if(value.length>=2&&extraValue.length>0){
            value.map((v,i)=>{
                cpxsb.obj1.map((vv,ii)=>{
                    if(vv.children&&vv.children.length>0){
                        vv.children.map((vvv,iii)=>{
                            if(v.split('-')[0]==vvv.id&&valueParent.indexOf(vv.id)==-1){
                                valueParent.push(vv.id)
                            }
                        })
                    }
                })
            })
            extraValue.map((v,i)=>{
                cpxsb.obj1.map((vv,ii)=>{
                    if(vv.children&&vv.children.length>0){
                        vv.children.map((vvv,iii)=>{
                            if(v.split('-')[0]==vvv.id&&extraParent.indexOf(vv.id)==-1){
                                extraParent.push(vv.id)
                            }
                        })
                    }
                })
            })

            let a=0
            if(valueParent.length==1){
                extraParent.map((v,i)=>{
                    valueParent.map((vv,ii)=>{
                        if(v==vv){
                            a++
                        }
                    })
                })
            }else{
                value=extraValue
            }
            if(a!=extraParent.length){
                value=extraValue
            }
        }
        let brandId=null,specials=[]
        if(value.length>0){
            cpxsb.obj1.map((vv,ii)=>{
                if(vv.children&&vv.children.length>0){
                    vv.children.map((vvv,iii)=>{
                        if(vv.id=='-0'){
                            value.map((h)=>{
                                if(vvv.id==h.split('-')[0]&&specials.indexOf(vvv.id)==-1){
                                    specials.push(vvv.id)
                                }
                            })
                        }else{
                            if(vvv.id==value[0].split('-')[0]){
                                brandId=vvv.brandId
                            }
                        }
                    })
                }
            })
        }

        let arr=[],obj={}
        if(value.length>0){
            value.map((v,i)=>{
                let id=v.split('-')[0],name=v.split('-')[1]
                arr.push(id)
                obj[String(id)]=name
            })
        }
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                value:value,
                restaurantIds:arr,
                resIdOrgNameMap:obj,
                categoryName_val:'全部',
                foodNames_val:[],
                categoryName:'全部',
                foodNames:[]
            }
        })

        if(brandId&&specials.length==0){
            dispatch({
                type:'cpxsb/comboList',
                payload:{
                    brandId:brandId
                }
            })
            dispatch({
                type:'cpxsb/categorySelectDataByBrandId',
                payload:{
                    brandId:brandId
                }
            })
            dispatch({
                type:'cpxsb/foodList',
                payload:{
                    selectBrandId:brandId
                }
            })
        }else if(!brandId&&specials.length>0){
            dispatch({
                type:'cpxsb/comboList1',
                payload:{
                    restaurantIds:specials
                }
            })
            dispatch({
                type:'cpxsb/categorySelectDataByRes',
                payload:{
                    restaurantIds:specials
                }
            })
            dispatch({
                type:'cpxsb/foodList1',
                payload:{
                    restaurantIds:specials
                }
            })
        }else{
            dispatch({
                type:'cpxsb/updatePayload',
                payload:{
                    cateList:[],
                    comboList:[],
                    cpflList:[],
                }
            })
        }
    }

	
	function treeExpand(value){
		dispatch({
			type:'cpxsb/updatePayload',
			payload:{
				value1:value
			}
		})
	}

	
	const tProps = {
      //treeData:[cpxsb.obj1],
      treeData:cpxsb.obj1,
      value: cpxsb.value,
      onChange: treeChange,
      treeCheckable: true,
      searchPlaceholder: '请选择门店',
      style: {
        width: 'auto',
        minWidth:334,
        marginTop:20
      },
	  maxTagCount:1,
	  dropdownStyle:{
		maxHeight:300,
		overflowY:'scroll'
	  }
    };

    //菜品修改
    function cateChange(e){
        let cateList=cpxsb.cateList,arr=[],foodType=cpxsb.foodType
        if(e.length>0){
            e.map((v)=>{
                arr.push(foodType==1?cateList[v.split('-yzy')[1]].spellName:cateList[v.split('-yzy')[1]])
            })
        }
        console.log(arr)
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                foodNames:arr,
                foodNames_val:e
            }
        })
    }

    //套餐修改
    function comboChange(e){
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                comboNames:e
            }
        }) 
    }

    function focus(){
        if(cpxsb.cateList.length==0&&cpxsb.value.length==0){
            message.error('请先选择门店')
        }
    }
    function focus1(){
        if(cpxsb.comboList.length==0&&cpxsb.value.length==0){
            message.error('请先选择门店')
        }
    }

    function categoryNameChange(e){
        var cpflType=cpxsb.cpflType,cpflList=cpxsb.cpflList,categoryName=''
        if(e!='全部'){
            categoryName=cpflType==1?cpflList[e].value:cpflList[e]
        }
        console.log(categoryName)
        dispatch({
            type:'cpxsb/updatePayload',
            payload:{
                categoryName:categoryName,
                categoryName_val:e
            }
        })
    }

    return (
        <Header {...HeaderProps}>
            <div style={{background:'#eee',padding:'10px 20px'}}>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>菜品销量</Breadcrumb.Item>
                    <Breadcrumb.Item>菜品销售表</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Spin spinning={cpxsb.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
            <div>
                <Tabs onChange={callback}>
                    <TabPane tab="堂食单品销售报表" key="1">
                        <div className={common.yzy_search_1}>
                            <div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>选择时间：</span>
                                    <RangePicker
                                      showTime
                                      format="YYYY-MM-DD HH:mm:ss"
                                      value={[moment(cpxsb.startTime), moment(cpxsb.endTime)]}
                                      allowClear={false}
                                      onChange={onSearchDateChange}
                                      className={common.yzy_datePicker}
                                    />
                                    <Select value={String(cpxsb.static_days)}  className={common.periods_1} onChange={chooseDuration}>
                                        <Select.Option key="0">请选择时间跨度</Select.Option>
                                        <Select.Option key="1">昨天</Select.Option>
                                        <Select.Option key="2">今天</Select.Option>
                                        <Select.Option key="7">近7天</Select.Option>
                                        <Select.Option key="15">近15天</Select.Option>
                                        <Select.Option key="30">近30天</Select.Option>
                                    </Select>
                                </div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>选择门店：</span>
                                    <TreeSelect {...tProps} />
                                </div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>菜品分类：</span>
                                    <Select className={common.yzy_margin} value={cpxsb.categoryName_val} style={{minWidth:300}} onChange={categoryNameChange}>
                                        <Select.Option key="全部">请选择菜品分类</Select.Option>
                                        {cpxsb.cpflList.length>0&&(cpxsb.cpflType==1?cpxsb.cpflList.map((v,i)=>(
                                            <Select.Option key={i}>{v.value}</Select.Option>
                                        )):cpxsb.cpflList.map((v,i)=>(
                                            <Select.Option key={i}>{v}</Select.Option>
                                        )))}
                                    </Select>
                                </div> 
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>菜品类型：</span>
                                    <Select className={common.yzy_margin} onChange={typeChange} value={String(cpxsb.queryType)}>
                                        <Select.Option value="1">单品+套餐明细</Select.Option>
                                        <Select.Option value="2">单品+套餐主项</Select.Option>
                                    </Select>
                                </div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>菜品：</span>
                                    <Select placeholder="请选择菜品" mode="multiple" value={cpxsb.foodNames_val} style={{minWidth:300}} maxTagCount={1} onChange={cateChange} onFocus={focus}>
                                        {/* {cpxsb.cateList.length>0&&(cpxsb.foodType==1?cpxsb.cateList.map((v,i)=>(
                                            <Option key={i}>{v.spellName&&v.spellName.length>0&&v.spellName.indexOf('()')>-1?v.spellName.split('()')[0]:v.spellName}</Option>
                                        )):cpxsb.cateList.map((v,i)=>(
                                            <Option key={i}>{v.length>0&&v.indexOf('()')>-1?v.split('()')[0]:v}</Option>
                                        )))} */}
                                        {cpxsb.cateList.length>0&&(cpxsb.foodType==1?cpxsb.cateList.map((v,i)=>(
                                            <Option key={v.spellName&&v.spellName.length>0&&v.spellName.indexOf('()')>-1?(v.spellName.split('()')[0]+'-yzy'+i):(v.spellName+'-yzy'+i)}>{v.spellName&&v.spellName.length>0&&v.spellName.indexOf('()')>-1?v.spellName.split('()')[0]:v.spellName}</Option>
                                        )):cpxsb.cateList.map((v,i)=>(
                                            <Option key={v.length>0&&v.indexOf('()')>-1?(v.split('()')[0]+'-yzy'+i):(v+'-yzy'+i)}>{v.length>0&&v.indexOf('()')>-1?v.split('()')[0]:v}</Option>
                                        )))}
                                    </Select>
                                </div>
                                                             
                                <div className={common.searchBlock}>
                                    <Button size="default" type="primary" className={common.btn_1} onClick={onSearch}>搜索</Button>
                                    <Button size="default" className={common.btn_2} onClick={loadFoodOut}>导出</Button>
                                </div>
                            </div>
                        </div>

                        {cpxsb.foodList.length==0?
                            <Table
                                className={common.yzy}
                                bordered
                                columns={columns}
                                dataSource={cpxsb.foodList}
                                pagination={pagination}
                                size="small"
                            />
                        :
                            <Table
                                className={common.yzy}
                                bordered
                                columns={columns}
                                dataSource={cpxsb.foodList}
                                pagination={pagination}
                                scroll={{x:2350,y:400}}
                                size="small"
                            />
                        }
                        
                    </TabPane>
                    <TabPane tab="堂食套餐销售报表" key="2">
                        <div className={common.yzy_search_1}>
                            <div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>选择时间：</span>
                                    <RangePicker
                                      showTime
                                      format="YYYY-MM-DD HH:mm:ss"
                                      value={[moment(cpxsb.startTime1), moment(cpxsb.endTime1)]}
                                      allowClear={false}
                                      onChange={onSearchDateChange1}
                                      className={common.yzy_datePicker}
                                    />
                                    <Select value={String(cpxsb.static_days1)}  className={common.periods_1} onChange={chooseDuration1}>
                                        <Select.Option key="0">请选择时间跨度</Select.Option>
                                        <Select.Option key="1">昨天</Select.Option>
                                        <Select.Option key="2">今天</Select.Option>
                                        <Select.Option key="7">近7天</Select.Option>
                                        <Select.Option key="15">近15天</Select.Option>
                                        <Select.Option key="30">近30天</Select.Option>
                                    </Select>
                                </div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>选择门店：</span>
                                    <TreeSelect {...tProps} />
                                </div>
                                <div className={common.searchBlock}>
                                    <span className={common.yzy_txt}>套餐：</span>
                                    <Select placeholder="请选择套餐" mode="multiple" style={{minWidth:200}} maxTagCount={1} onChange={comboChange} onFocus={focus1}>
                                        {cpxsb.comboList&&cpxsb.comboList.length>0&&cpxsb.comboList.map((v,i)=>(
                                            <Option key={v}>{v}</Option>
                                        ))}
                                    </Select>
                                </div>
                                
                                <div className={common.searchBlock}>
                                    <Button type="primary" className={common.btn_1} onClick={onSearch1}>搜索</Button>
                                    <Button className={common.btn_2} onClick={loadOut}>导出</Button>
                                </div>
                            </div>
                        </div>
                        
                        {/*<div className={styles.box}>
                            <div className={styles.left}>
                                <span className={styles.txt}>数量</span>
                                <span className={styles.num}>{cpxsb.combosellStat.num}</span>
                            </div>
                            <div className={styles.right}>
                                <span className={styles.txt}>实收金额</span>
                                <span className={styles.num}>{cpxsb.combosellStat.realMoney}</span>
                            </div>
                        </div>*/}


                        {cpxsb.combosellList.length==0?
                            <Table
                                className={common.yzy}
                                columns={columns1}
                                dataSource={cpxsb.combosellList}
                                pagination={pagination1}
                                bordered
                                size="small"
                            />
                        :
                            <Table
                                className={common.yzy}
                                columns={columns1}
                                dataSource={cpxsb.combosellList}
                                pagination={pagination1}
                                bordered
                                scroll={{x:1800,y:400}}
                                size="small"
                            />
                        }
                        
                        {/*<Table
                            expandedRowRender={expandedRowRenderFile}
                            columns={columns1}
                            rowKey={record => record.id}
                            dataSource={cpxsb.combosellList}
                            className="table"
                            pagination={pagination1}
                        />
                        <Table columns={columnsasd}*/}
                               {/*expandedRowRender={record => <p>{record.description}</p>}*/}
                               {/*dataSource={data}*/}
                               {/*className="table"*/}
                        {/*/>*/}
                    </TabPane>
                </Tabs>
            </div>


            <form action={cpxsb.linkOrigin+'report-api/report/export/foodsell'} method="post"  id='formFoodsellOrderExport'>

                <input type="hidden" name="restaurantIds" value = {JSON.stringify(cpxsb.restaurantIds)} id='pay_way'/>
                <input type="hidden" name="startTime" value = {cpxsb.postStartTime}/>
                <input type="hidden" name="endTime" value = {cpxsb.postEndTime}/>              
                <input type="hidden" name="queryType" value = {cpxsb.queryType}/>              
                <input type="hidden" name="foodNames" value = {JSON.stringify(cpxsb.foodNames)}/>
                <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(cpxsb.resIdOrgNameMap)}/>
                {cpxsb.categoryName!='全部'&&<input type="hidden" name="categoryName" value = {cpxsb.categoryName}/>}

            </form>

            <form action={cpxsb.linkOrigin+'report-api/report/export/combosell'} method="post"  id='formOrderExport'>

                <input type="hidden" name="restaurantIds" value = {JSON.stringify(cpxsb.restaurantIds)}  id='pay_way_1'/>
                <input type="hidden" name="startTime" value = {cpxsb.postStartTime1}/>
                <input type="hidden" name="endTime" value = {cpxsb.postEndTime1}/>
                <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(cpxsb.resIdOrgNameMap)}/>
                <input type="hidden" name="foodNames" value = {JSON.stringify(cpxsb.comboNames)}/>
                <input type="hidden" name="resIdOrgNameMap" value = {JSON.stringify(cpxsb.resIdOrgNameMap)}/>

            </form>
        </Header>
    );

}

CpxsbPage.propTypes = {
    menu: PropTypes.object,
};

function mapStateToProps({menu, cpxsb}) {
    return {menu, cpxsb};
}

export default connect(mapStateToProps)(CpxsbPage);

