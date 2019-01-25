import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import styles from './TcxxPage.less';
import Table from 'antd/lib/table';
import {Popconfirm} from 'antd/lib';

import {getUserToken} from '../../../../services/CommonService';
import {config} from '../../../../services/HttpService';
import {routerRedux} from 'dva/router';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;

const CpxxPage = ({
                      form: {
                          getFieldDecorator,
                          validateFields,
                          getFieldsValue,
                          resetFields,
                      },
                      dispatch, lscpxx, lscpfl, lscpdw, lszfgl, lsgggl,lstcxx,
                      pageNo,
                      total,
                      current,
                      dataSource,

                  }) => {


    var list = [ {foodId:lscpxx.food.id,
        foodName:'全选',
        id:-1,
        rowSpan:1,}];
    lstcxx.restaurantList.length >0 && lstcxx.restaurantList.map((i)=>{

            list.push({foodId:lstcxx.food.id,
                foodName:lstcxx.food.name,
                id:i.key,
                name:i.value,
                priceJson: lstcxx.food.priceJson,
                vipPriceJson: lstcxx.food.vipPriceJson,
                })

    })

    function handleSubmit(e) {
        if (e) {
            e.preventDefault();
        }

        validateFields((errors) => {
            if (!!errors) {
                return;
            }
        });

        var data = {...getFieldsValue()};

        //dispatch({type: 'orderlist/recoverOrderTime',payload:{}});

    }

    function radioChange(e,record) {

        if (e.target.checked){

            var newPriceCheckedMap = lstcxx.priceCheckedMap;
            newPriceCheckedMap.map((i,j)=>{

                if (record.id == i.key){
                    i.value =  e.target.value  + ',' + e.target.value + ',' + e.target.value;
                }
            })
            dispatch({ type: 'lscpxx/updatePayload', payload: {
                    priceCheckedMap:newPriceCheckedMap,}});
        }

    }

    function radioVipChange(e,record) {

        if (e.target.checked){

            var newPriceCheckedMap = lstcxx.priceCheckedMap;
            newPriceCheckedMap.map((i,j)=>{

                if (record.id == i.key){
                    i.value =  i.value.split(',')[0]  + ',' + e.target.value + ',' + i.value.split(',')[2];
                }
            })
            dispatch({ type: 'lstcxx/updatePayload', payload: {
                    priceCheckedMap:newPriceCheckedMap,}});
        }
    }

    function setDefaultValue(record) {
        var e ={target:{value:0}};
        radioChange(e,record)
        return 0;
    }
    function setDefaultValueVip(record) {
        var e ={target:{value:0}};
        radioVipChange(e,record)
        return 0;
    }

    function getDefaultValue(record) {

        var priceIndex;

        lstcxx.priceCheckedMap.map((i)=>{

            if (i.key == record.id){

                priceIndex = i.value.split(',')[0]
            }
        })

        return Number(priceIndex);
    }

    function getDefaultValueVip(record) {

        var priceIndex;

        lstcxx.priceCheckedMap.map((i)=>{

            if (i.key == record.id){

                priceIndex = i.value.split(',')[1]
            }
        })

        return Number(priceIndex);
    }
    function getDefaultValueStff(record) {

        var priceIndex;

        lstcxx.priceCheckedMap.map((i)=>{

            if (i.key == record.id){

                priceIndex = i.value.split(',')[2]
            }
        })

        return Number(priceIndex);
    }

    const columns = [
        {
            title: '门店名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '菜品名称',
            dataIndex: 'foodName',
            key: 'foodName',
        },
        {
            title: '原价格1--原价格2--原价格3--原价格4--原价格5',
            dataIndex: 'priceJson',
            key: 'priceJson',
            render(text, record, index) {

                if (index == 0){
                    return <RadioGroup onChange={(e)=>{

                        let newPriceCheckedMap = lstcxx.priceCheckedMap;

                        newPriceCheckedMap.map((i)=>{

                            i.value=e.target.value + ',' + i.value.split(',')[1] + ',' +i.value.split(',')[2];
                        })

                        dispatch({ type: 'lstcxx/updatePayload', payload: {
                                priceCheckedMap:newPriceCheckedMap}});



                    }}>

                        <Radio style={{width:53}} key="a" value={0}></Radio>
                        <Radio style={{width:53}} key="b" value={1}></Radio>
                        <Radio style={{width:53}} key="c" value={2}></Radio>
                        <Radio style={{width:53}} key="d" value={3}></Radio>
                        <Radio style={{width:53}} key="e" value={4}></Radio>
                    </RadioGroup>

                }

                return <RadioGroup defaultValue={setDefaultValue(record)} onChange={e=>radioChange(e,record)} value = {getDefaultValue(record)}>

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
            render(text, record, index) {

                if (index == 0){

                    return <RadioGroup onChange={(e)=>{

                        let newPriceCheckedMap = lstcxx.priceCheckedMap;

                        newPriceCheckedMap.map((i)=>{

                            i.value=i.value.split(',')[0] + ',' + e.target.value + ',' +i.value.split(',')[2];
                        })

                        dispatch({ type: 'lstcxx/updatePayload', payload: {
                                priceCheckedMap:newPriceCheckedMap}});

                    }}>

                        <Radio style={{width:53}} key="a1" value={0}></Radio>
                        <Radio style={{width:53}} key="b2" value={1}></Radio>
                        <Radio style={{width:53}} key="c3" value={2}></Radio>
                        <Radio style={{width:53}} key="d4" value={3}></Radio>
                        <Radio style={{width:53}} key="e5" value={4}></Radio>
                    </RadioGroup>
                }

                return <RadioGroup defaultValue={setDefaultValueVip(record)} onChange={e=>radioVipChange(e,record)} value = {getDefaultValueVip(record)}>

                    <Radio style={{width:53}} key="a1" value={0}>{record.vipPriceJson.split(",")[0]/100}</Radio>
                    <Radio style={{width:53}} key="b1" value={1}>{record.vipPriceJson.split(",")[1]/100}</Radio>
                    <Radio style={{width:53}} key="c1" value={2}>{record.vipPriceJson.split(",")[2]/100}</Radio>
                    <Radio style={{width:53}} key="d1" value={3}>{record.vipPriceJson.split(",")[3]/100}</Radio>
                    <Radio style={{width:53}} key="e1" value={4}>{record.vipPriceJson.split(",")[4]/100}</Radio>
                </RadioGroup>

            }
        }
    ];


    return (
        <div className={styles.search}>

            <div style={{marginLeft: 20}}><span>分配到门店</span>
            </div>

            <Table className={styles.table}
                   rowSelection={{
                       onChange: (selectedRowKeys) => {
                           dispatch({type: 'lstcxx/updatePayload', payload: {_selectedRowKeys: selectedRowKeys}});
                       }
                   }}
                   columns={columns}
                   dataSource={list}
                   rowKey={record => record.id}
                   bordered
                   pagination = {false}
                   />

            <div style={{marginLeft: '80%',marginTop:20}}>
                <Button style={{marginTop:20}} onClick = {()=>{window.history.back()}}>取消</Button>
                <Button style = {{marginLeft: '10%',marginTop:20}} type = 'primary' onClick ={() => {

                    dispatch({type: 'lstcxx/queryAllot2restaurant', payload: {}})}

                }>保存</Button>
            </div>

        </div>
    );
};


CpxxPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(CpxxPage);