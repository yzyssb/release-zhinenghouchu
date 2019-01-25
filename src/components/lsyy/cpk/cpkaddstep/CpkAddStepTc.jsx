import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Steps from 'antd/lib/steps';
import Table from 'antd/lib/table';
const Step = Steps.Step;
import Radio from 'antd/lib/radio';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
const RadioGroup = Radio.Group;
import {TreeTransfer, getAllTreeData} from '../../../../components/treetransfer';

const CpkAddStepTc = ({
                         dispatch,
                         tcxx,

                     }) => {

    function handleOk() {
        var selectkey = localStorage.selectedRightKeys;
        var sendNextData = [];
        var lsBean = {};
        lsBean.name = "全选";
        lsBean.onlyKey = "-1-1-1-1-";
        sendNextData.push(lsBean);
        var pullToRestaurant = [];
        tcxx.nextData.map(function (item) {
            selectkey.split(",").map(function (key) {
                if(key === item.key)
                {
                    sendNextData.push(item);
                }
            });
        });
        for(var i = 0 ; i < sendNextData.length ; i ++)
        {
            var item = sendNextData[i];
            var goEnd = false;
            pullToRestaurant.map(function (pullToRestaurantItem) {
                if(item.id == pullToRestaurantItem.foodId)
                {
                    var foodSpecsItem = {};
                    foodSpecsItem.priceIndex = 0;
                    foodSpecsItem.vipPriceIndex = 0;
                    foodSpecsItem.specId = item.specId;
                    pullToRestaurantItem.foodSpecs.push(foodSpecsItem);
                    goEnd = true;
                    return;
                }
            });
            if(goEnd)
            {
                continue
            }
            var pullItem ={};
            pullItem.foodId = item.id;
            var foodSpecs = [];
            var foodSpecsItem = {};
            foodSpecsItem.priceIndex = 0;
            foodSpecsItem.vipPriceIndex = 0;
            foodSpecsItem.specId = item.specId;
            foodSpecs.push(foodSpecsItem)
            pullItem.foodSpecs = foodSpecs;
            pullToRestaurant.push(pullItem)
        }
        dispatch({type: 'tcxx/updatePayload', payload: {currentSteps: 1,sendNextData:sendNextData,pullAfter:pullToRestaurant}});
    }

    function cancel() {
        localStorage.setItem("selectedRightKeys","");
        dispatch({type: 'tcxx/updatePayload', payload: {modalStepTcVisiable: false,currentSteps:0,rightTree:[],sendNextData:[],pullToRestaurant:[]}});
    }


    const modalOpts = {
        title: "选择总部菜品（直营店铺只可以选择总部允许售卖的菜品，且不可以修改）",
        visible: tcxx.modalStepTcVisiable,
        // onOk: handleOk,
        onCancel: cancel,
        width: 600,
        // closable:false,
        maskClosable:false,
        footer:null,
        // okText: "下一步",
        // cancelText: "取消"
    };
    const modalOpts1 = {
        title: "选择总部菜品（直营店铺只可以选择总部允许售卖的菜品，且不可以修改）",
        visible: tcxx.modalStepTcVisiable,
        // onOk: pullToRes,
        width: 1400,
        // closable:false,
        footer:null,
        maskClosable:false,
        onCancel: cancel,
        // okText: "保存",
        // cancelText: "上一步"
    };

    function lastStep() {
        // localStorage.setItem("selectedRightKeys","");
        // dispatch({type: 'tcxx/updatePayload', payload: {rightTree:[],currentSteps: 0,sendNextData:[],pullToRestaurant:[]}});
        // dispatch({
        //     type: 'tcxx/queryPullFoodList',
        //     payload: {}
        // });
        dispatch({type: 'tcxx/updatePayload', payload: {currentSteps: 0}})
    }

    const rightTree = [];


    function getRadioValue(record,str) {
        var pullToRestaurantNew = tcxx.pullAfter;
        for (var i = 0; i < pullToRestaurantNew.length; i++) {
            if (record.id == pullToRestaurantNew[i].foodId ) {
                if(record.specId)
                {
                    for (var j = 0; j < pullToRestaurantNew[i].foodSpecs.length; j++) {
                        if (pullToRestaurantNew[i].foodSpecs[j].specId == record.specId) {
                            return eval('pullToRestaurantNew[i].foodSpecs[j].'+str);
                        }
                    }
                }
                return eval('pullToRestaurantNew[i].foodSpecs[0].'+str);
            }

        }
    }

    function radioChange2(e,record) {
        var pullToRestaurantNew = tcxx.pullAfter;
        for (var i = 0; i < pullToRestaurantNew.length; i++) {
            if (record.id == pullToRestaurantNew[i].foodId) {
                if (record.specId) {
                    for (var j = 0; j < pullToRestaurantNew[i].foodSpecs.length; j++) {
                        if (pullToRestaurantNew[i].foodSpecs[j].specId == record.specId) {
                            pullToRestaurantNew[i].foodSpecs[j].vipPriceIndex = e.target.value;
                            dispatch({type: 'tcxx/updatePayload', payload: {pullAfter: pullToRestaurantNew}});
                            return;
                        }
                    }
                }
                pullToRestaurantNew[i].foodSpecs[0].vipPriceIndex = e.target.value;
                dispatch({type: 'tcxx/updatePayload', payload: {pullAfter: pullToRestaurantNew}});
                return;
            }
        }
    }

    function radioChange(e,record) {
        var pullToRestaurantNew = tcxx.pullAfter;
        for (var i = 0; i < pullToRestaurantNew.length; i++) {
            if (record.id == pullToRestaurantNew[i].foodId ) {
                if(record.specId)
                {
                    for (var j = 0; j < pullToRestaurantNew[i].foodSpecs.length; j++) {
                        if (pullToRestaurantNew[i].foodSpecs[j].specId == record.specId) {
                            pullToRestaurantNew[i].foodSpecs[j].priceIndex = e.target.value;
                            dispatch({type: 'tcxx/updatePayload', payload: {pullAfter:pullToRestaurantNew}});
                            radioChange2(e,record);
                            radioChange3(e,record);
                            return;
                        }
                    }
                }
                pullToRestaurantNew[i].foodSpecs[0].priceIndex = e.target.value;
                dispatch({type: 'tcxx/updatePayload', payload: {pullAfter:pullToRestaurantNew}});
                radioChange2(e,record);
                radioChange3(e,record);
                return;
            }
        }
    }

    function radioAllChange(e,str) {
        var pullToRestaurantNew = tcxx.pullAfter;
        for (var i = 0; i < pullToRestaurantNew.length; i++) {
            for (var j = 0; j < pullToRestaurantNew[i].foodSpecs.length; j++) {

                eval('pullToRestaurantNew[i].foodSpecs[j].'+str+' = e.target.value')
            }
        }
        dispatch({type: 'tcxx/updatePayload', payload: {pullAfter:pullToRestaurantNew}});
    }
    function pullToRes() {
        if(tcxx.pullAfter.length == 1)
        {
            message.warning("请选择菜品");
            return;
        }
        var ls = tcxx.pullAfter;
        ls.splice(0,1)
        dispatch({type: 'tcxx/updatePayload', payload: {pullAfter:ls}});
        dispatch({
            type: 'tcxx/pullToRestaurant',
            payload: {}
        });

    }
    const columns = [
        {
            title: '菜品名称',
            dataIndex: 'name',
            key: 'name',

        },
        {
            title: '规格名称',
            dataIndex: 'specName',
            key: 'specName',

        },
        {
            title: '原价格1--原价格2--原价格3--原价格4--原价格5',
            dataIndex: 'priceJson',
            key: 'priceJson',
            render(text, record,index) {
                if(index==0)
                {
                    return <RadioGroup onChange={e=>radioAllChange(e,"priceIndex")}>

                        <Radio style={{width:53}} key="a" value={0}></Radio>
                        <Radio style={{width:53}} key="b" value={1}></Radio>
                        <Radio style={{width:53}} key="c" value={2}></Radio>
                        <Radio style={{width:53}} key="d" value={3}></Radio>
                        <Radio style={{width:53}} key="e" value={4}></Radio>
                    </RadioGroup>
                }
                return <RadioGroup value={getRadioValue(record,"priceIndex")} onChange={e=>radioChange(e,record)}>

                    <Radio style={{width:53}} key="a" value={0}>{record.priceJson.split(",")[0]/100}</Radio>
                    <Radio style={{width:53}} key="b" value={1}>{record.priceJson.split(",")[1]/100}</Radio>
                    <Radio style={{width:53}} key="c" value={2}>{record.priceJson.split(",")[2]/100}</Radio>
                    <Radio style={{width:53}} key="d" value={3}>{record.priceJson.split(",")[3]/100}</Radio>
                    <Radio style={{width:53}} key="e" value={4}>{record.priceJson.split(",")[4]/100}</Radio>
                </RadioGroup>

            }

        },
        {
            title: '会员价1--会员价2--会员价3--会员价4--会员价5',
            dataIndex: 'vipPriceJson',
            key: 'vipPriceJson',
            render(text, record,index) {
                if(index==0)
                {
                    return <RadioGroup  onChange={e=>radioAllChange(e,"vipPriceIndex")}>

                        <Radio style={{width:53}} key="a" value={0}></Radio>
                        <Radio style={{width:53}} key="b" value={1}></Radio>
                        <Radio style={{width:53}} key="c" value={2}></Radio>
                        <Radio style={{width:53}} key="d" value={3}></Radio>
                        <Radio style={{width:53}} key="e" value={4}></Radio>
                    </RadioGroup>
                }
                return <RadioGroup value={getRadioValue(record,"vipPriceIndex")} onChange={e=>radioChange2(e,record)}>

                    <Radio style={{width:53}} key="a1" value={0}>{record.vipPriceJson.split(",")[0]/100}</Radio>
                    <Radio style={{width:53}} key="b1" value={1}>{record.vipPriceJson.split(",")[1]/100}</Radio>
                    <Radio style={{width:53}} key="c1" value={2}>{record.vipPriceJson.split(",")[2]/100}</Radio>
                    <Radio style={{width:53}} key="d1" value={3}>{record.vipPriceJson.split(",")[3]/100}</Radio>
                    <Radio style={{width:53}} key="e1" value={4}>{record.vipPriceJson.split(",")[4]/100}</Radio>
                </RadioGroup>

            }
        },

    ];

    return (
        <Modal {...tcxx.currentSteps == 0 ? modalOpts : modalOpts1} >
            <Steps current={tcxx.currentSteps}>
                <Step title="选择菜品" description=""/>
                <Step title="选择价格" description=""/>
            </Steps>
            {<div style={{display:tcxx.currentSteps == 0 ? 'block' : 'none',marginTop: 30}}>
                <TreeTransfer
                    placeholder={'查找需要选择的菜品'}
                    showSearch={true}
                    treeWidth={250}
                    treeHeight={400}
                    getAllTreeData={getAllTreeData} leftTreeData={tcxx.newData} rightTreeData={rightTree}
                    leftTitle={'分类 名称'}
                    rightTitle={'分类 名称'}/>
                <Button style={{marginTop:50,marginLeft:'70%'}} onClick={cancel}>取消</Button>
                <Button style={{marginLeft:10}}type="primary"  onClick={handleOk}>下一步</Button>
            </div>
            }
            {tcxx.currentSteps == 1 && <div style={{marginTop: 30}}>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={tcxx.sendNextData}
                    rowKey={record => record.onlyKey}
                    bordered />
                <Button style={{marginTop:50,marginLeft:'85%'}}  onClick={lastStep}>上一步</Button>
                <Button style={{marginLeft:10}} onClick={pullToRes} type="primary" >保存</Button>
            </div>
            }
        </Modal>
    );
};


export default Form.create()(CpkAddStepTc);
