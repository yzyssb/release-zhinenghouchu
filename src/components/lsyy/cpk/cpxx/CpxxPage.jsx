import React, {PropTypes} from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import styles from './CpxxPage.less';
import Table from 'antd/lib/table';
import {Popconfirm} from 'antd/lib';
import CpAddModal from './CpAddModal';
import CpImportModal from './CpImportModal';
import {getUserToken} from '../../../../services/CommonService';
import {config} from '../../../../services/HttpService';
import {routerRedux} from 'dva/router';

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

    function onCuisineChange(value) {


    }

    function onOperate(record) {

        dispatch({
            type: 'lscpxx/deleteFood',
            payload: {id: record.id}
        });

    }

    const edit = (record) => {

        dispatch({type: 'lscpxx/updatePayload', payload: {way:"edit",foodId:record.id}});

        dispatch({type: 'lscpxx/foodGetMaxCodeUrl', payload: {}});

        dispatch({ type: 'lscpxx/queryFoodByCategory', payload: {id: record.id,selectCategoryId:0} });

        dispatch({
            type: 'lscpxx/getFood',
            payload: {
                id: record.id,
            }
        });

        dispatch(routerRedux.push({
            pathname: "/lscpxx",
            query: {}
        }));

    };

    function deploy(record){

        dispatch({
            type: 'lscpxx/getFood',
            payload: {
                id: record.id,

            }
        });

        dispatch({ type: 'lscpxx/updatePayload', payload: {
                _selectedRowKeys:[],specList:[]}});

        dispatch(routerRedux.push({
                pathname: "/lscpxxdeploy",
                query: {}
            }));
    }

    function managerHandle(record, index) {
        let handlebtn = [];
        handlebtn.push(
            <span key={index}>
                <a onClick={() => {
                    deploy(record)
                }}>分配</a>
                 <span className="ant-divider"/>
                <a onClick={() => {
                    edit(record)
                }}>编辑</a>
                <span className="ant-divider"/>
                <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
                    <a>删除</a>
                </Popconfirm>
            </span>);

        return handlebtn;
    }

    function managerPriceHandle(record,index){
        
        let text;

        text = record.priceJson.split(',')[0]/100 + '元, ' +  record.priceJson.split(',')[1]/100 +'元, ' +  record.priceJson.split(',')[2]/100 + '元, ' +  record.priceJson.split(',')[3]/100 + '元, ' + record.priceJson.split(',')[4]/100 + '元';

        return text;

    }


     function managerVipPriceHandle(record,index){
        
        let text;

        text = record.vipPriceJson.split(',')[0]/100 + '元, ' +  record.vipPriceJson.split(',')[1]/100 +'元, ' +  record.vipPriceJson.split(',')[2]/100 + '元, ' +  record.vipPriceJson.split(',')[3]/100 + '元, ' + record.vipPriceJson.split(',')[4]/100+ '元';
        
        return text;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '中文名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '菜品编码',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '规格',
            dataIndex: 'specs',
            key: 'specs',
            render: (text, record, index) => {
                if (record.specs && record.specs.length > 0) {
                    return record.specs.join(',');
                } else {
                    return (
                        <span>
                        <a onClick={() => {
                            // addSpecs(text, record, index)
                        }}>未设置</a>
                    </span>
                    )
                }
            }
        }, {
            title: '做法',
            dataIndex: 'methods',
            key: 'methods',
            render: (text, record, index) => {
                if (record.methods && record.methods.length > 0) {
                    return record.methods.join(',');
                } else {
                    return (
                        <span>
                        <a onClick={() => {
                            // addMethods(text, record, index)
                        }}>未设置</a>
                    </span>
                    )
                }
            }
        }, {
            title: '价格',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                managerPriceHandle(record, index)
            ),
        }, {
            title: '会员价',
            dataIndex: 'vipPrice',
            key: 'vipPrice',
            render: (text, record, index) => (
                managerVipPriceHandle(record, index)
            ),
        }, {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            render: (text, record, index) => (
                managerTimeHandle(record, index)
            ),
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (text, record, index) => (
                managerHandle(record, index)
            ),
        }
    ];

    const pagination = {
        total: lscpxx.total,
        current: lscpxx.current,
        pageSize: lscpxx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    }

    function SizeChange(current, pageSize) {

      
        dispatch({type: 'lscpxx/updatePayload', payload: {size: pageSize, current: 1, offset: 0}});
        dispatch({type: 'lscpxx/query', payload: {}});


    }

    function onPageChange(pageNo) {

        var offset = pageNo * lscpxx.size - lscpxx.size;
        dispatch({type: 'lscpxx/updatePayload', payload: {offset: offset, current: pageNo}});
        dispatch({type: 'lscpxx/query', payload: {}});


    }


    function managerTimeHandle(record) {

        return timestampToTime(record.gmtCreate);

    }

    function addZero(number){
    
        return number <10 ? '0' + number : number;

    }
    function timestampToTime(timestamp) {

        var time = '';
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = addZero(date.getMonth() + 1) + '-';
        var D = addZero(date.getDate()) + ' ';
        var h = addZero(date.getHours()) + ':';
        var m = addZero(date.getMinutes()) + ':';
        var s = addZero(date.getSeconds());
        time = Y + M + D + h + m + s;
        return time;
    }

    function addReasonClick() {

        dispatch({type: 'lscpxx/updatePayload', payload: {modalVisible: true}});

    }

    function addCpdwClick() {

        lscpxx.food = {};

        lscpxx.food.id = 0;

        lscpxx.food.methods = [];

        lscpxx.food.specs = [];

        lscpxx.food.laberDetails = [];

        lscpxx.food.cookGmtCreate = 0,

        dispatch({type: 'lscpxx/updatePayload', payload: {food: lscpxx.food,specList:[{index:1,isDefault:1,boxNum:0
                    ,price1:0,vipPrice1:0
                    ,price2:0,vipPrice2:0
                    ,price3:0,vipPrice3:0
                    ,price4:0,vipPrice4:0
                    ,price5:0,vipPrice5:0}],way:"add"
                ,price1:0,vipPrice1:0
                ,price2:0,vipPrice2:0
                ,price3:0,vipPrice3:0
                ,price4:0,vipPrice4:0
                ,price5:0,vipPrice5:0,
                recommendFoods:[],
                onLabel:false,
                onMethods:false,

        }});
        dispatch({ type: 'lscpxx/queryFoodByCategory', payload: {id: 0,selectCategoryId:0} });
        dispatch({type: 'lscpxx/foodGetMaxCodeUrl', payload: {}});

        dispatch(routerRedux.push({
            pathname: "/lscpxx",
            query: {}
        }));

    }

    const CpAddModalProps = {
        visible: lscpxx.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'lscpxx/updatePayload',
                payload: {modalVisible: false}
            });
        },
        lscpxx,
        lscpfl,
        lscpdw,
        lsgggl,
        lszfgl,
        lstcxx,

    };

    const CpImportModalProps = {
        dispatch,
        lscpxx,

    };

    function onClear() {
        dispatch({type: 'lscpxx/updatePayload', payload: {keyword: ""}});
    }

    function onKeywordChange(e) {
        dispatch({type: 'lscpxx/updatePayload', payload: {keyword: e.target.value}});
    }

    const search = ((e) => {
        dispatch({type: 'lscpxx/updatePayload', payload: {offset: 0}});
        dispatch({type: 'lscpxx/query', payload: {}});

    });

    function onExport() {
        dispatch({type: 'lscpxx/export', payload: {}});

    }

    function onImport() {

        dispatch({type: 'lscpxx/updatePayload', payload: {importModalVisible: true}});
    }

    return (
        <div className={styles.search}>

            <div style={{marginLeft: 20}}><span>菜品名称</span><Input style={{marginLeft: 20, width: 220}}
                                                                  value={lscpxx.keyword} onChange={onKeywordChange} onPressEnter = {search}/>
                <Button type="primary" style={{marginLeft: 40}} onClick={search}>搜索</Button>
                <Button style={{marginLeft: 10, marginRight: 20}} onClick={onClear}>重置</Button>
            </div>


            <div style={{marginLeft: 10, marginTop: 20}}>
                <Button style={{marginLeft: 10}} onClick={addCpdwClick}>添加菜品</Button>
                <Button style={{marginLeft: 10}} onClick={onImport}>批量导入</Button>
                <Button style={{marginLeft: 10}}><a href={config.exportFoodUrl + `?token=${getUserToken()}&name=${lscpxx.keyword}`} style={{textDecoration: 'none'}}>批量导出</a></Button>
                <Popconfirm okText="确定" cancelText="取消" title="确定要批量删除吗？" onConfirm={() => {
                    dispatch({type: 'lscpxx/batchDeleteFood', payload: {ids: lscpxx._selectedRowKeys}});
                }}>
                    <Button style={{marginLeft: 10}} disabled={lscpxx._selectedRowKeys.length <= 0}>批量删除</Button>
                </Popconfirm>
            </div>
            <Table className={styles.table}
                   rowSelection={{
                       onChange: (selectedRowKeys) => {
                           dispatch({type: 'lscpxx/updatePayload', payload: {_selectedRowKeys: selectedRowKeys}});
                       }
                   }}
                   columns={columns}
                   dataSource={lscpxx.list}
                   rowKey={record => record.id}
                   pagination={pagination}
                   bordered
                   scroll={{ x: 1300 }}/>
            <CpAddModal  {...CpAddModalProps} />

            <CpImportModal  {...CpImportModalProps} />


        </div>
    );
};


CpxxPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(CpxxPage);