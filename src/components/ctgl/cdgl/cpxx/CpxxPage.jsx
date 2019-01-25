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
import  CpkAddStep1 from '../../../lsyy/cpk/cpkaddstep/CpkAddStep1';
const CpxxPage = ({
                      form: {
                          getFieldDecorator,
                          validateFields,
                          getFieldsValue,
                          resetFields,
                      },
                      dispatch, cpxx, cpfl, cpdw, zfgl, gggl,tcxx,
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
            type: 'cpxx/deleteFood',
            payload: {id: record.id}
        });

    }

    const edit = (record) => {

        dispatch({type: 'cpxx/updatePayload', payload: {way:"edit",foodId:record.id}});

        dispatch({type: 'cpxx/foodGetMaxCodeUrl', payload: {}});

        dispatch({ type: 'cpxx/queryFoodByCategory', payload: {id: record.id,selectCategoryId:0} });

        dispatch({
            type: 'cpxx/getFood',
            payload: {
                id: record.id,
            }
        });

        dispatch(routerRedux.push({
            pathname: "/cpxx",
            query: {}
        }));

    };

    function managerHandle(record, index) {
        let handlebtn = [];
        handlebtn.push(
            <span key={index}>
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

        text = record.price/100;

        return text;

    }


     function managerVipPriceHandle(record,index){
        
        let text;

        text = record.vipPrice/100;
        
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
        total: cpxx.total,
        current: cpxx.current,
        pageSize: cpxx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    }

    function SizeChange(current, pageSize) {

      
        dispatch({type: 'cpxx/updatePayload', payload: {size: pageSize, current: 1, offset: 0}});
        dispatch({type: 'cpxx/query', payload: {}});


    }

    function onPageChange(pageNo) {

        var offset = pageNo * cpxx.size - cpxx.size;
        dispatch({type: 'cpxx/updatePayload', payload: {offset: offset, current: pageNo}});
        dispatch({type: 'cpxx/query', payload: {}});


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

        dispatch({type: 'cpxx/updatePayload', payload: {modalVisible: true}});

    }

    function addCpdwClick() {

        // cpxx.food = {};
        //
        // cpxx.food.id = 0;
        //
        // cpxx.food.methods = [];
        //
        // cpxx.food.specs = [];
        //
        // dispatch({type: 'cpxx/updatePayload', payload: {food: cpxx.food,specList:[],way:"add",price:0,vipPrice:0,recommendFoods:[]}});
        // dispatch({ type: 'cpxx/queryFoodByCategory', payload: {id: 0,selectCategoryId:0} });
        // dispatch({type: 'cpxx/foodGetMaxCodeUrl', payload: {}});
        //
        // dispatch(routerRedux.push({
        //     pathname: "/cpxx",
        //     query: {}
        // }));
        dispatch({
            type: 'cpxx/queryPullFoodList',
            payload: {}
        });
        dispatch({
            type: 'cpxx/updatePayload',
            payload: {modalStep1Visiable: true,newData:[]}
        });

    }

    const CpAddModalProps = {
        visible: cpxx.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'cpxx/updatePayload',
                payload: {modalVisible: false}
            });
        },
        cpxx,
        cpfl,
        cpdw,
        gggl,
        zfgl,
        tcxx,

    };

    const CpImportModalProps = {
        dispatch,
        cpxx,

    };

    function onClear() {
        dispatch({type: 'cpxx/updatePayload', payload: {keyword: ""}});
    }

    function onKeywordChange(e) {
        dispatch({type: 'cpxx/updatePayload', payload: {keyword: e.target.value}});
    }

    const search = ((e) => {
        dispatch({type: 'cpxx/updatePayload', payload: {offset: 0}});
        dispatch({type: 'cpxx/query', payload: {}});

    });

    function onExport() {
        dispatch({type: 'cpxx/export', payload: {}});

    }

    function onImport() {

        dispatch({type: 'cpxx/updatePayload', payload: {importModalVisible: true}});
    }

    return (
        <div className={styles.search}>

            <div style={{marginLeft: 20}}><span>菜品名称</span><Input style={{marginLeft: 20, width: 220}}
                                                                  value={cpxx.keyword} onChange={onKeywordChange} onPressEnter = {search}/>
                <Button type="primary" style={{marginLeft: 40}} onClick={search}>搜索</Button>
                <Button style={{marginLeft: 10, marginRight: 20}} onClick={onClear}>重置</Button>
            </div>


            <div style={{marginLeft: 10, marginTop: 20}}>
                <Button style={{marginLeft: 10,float:'left'}} onClick={addCpdwClick}>添加菜品</Button>
                <Button style={{marginLeft: 10, float:'left',display:cpxx.manageType ==1?'none':'block' }} onClick={onImport}>批量导入</Button>
                <Button style={{marginLeft: 10,float:'left'}}><a href={config.exportFoodUrl + `?token=${getUserToken()}&name=${cpxx.keyword}`} style={{textDecoration: 'none'}}>批量导出</a></Button>
                <Popconfirm okText="确定" cancelText="取消" title="确定要批量删除吗？" onConfirm={() => {
                    dispatch({type: 'cpxx/batchDeleteFood', payload: {ids: cpxx._selectedRowKeys}});
                }}>
                    <Button style={{marginLeft: 10,float:'left'}} disabled={cpxx._selectedRowKeys.length <= 0}>批量删除</Button>
                </Popconfirm>
            </div>
            <Table className={styles.table}
                   rowSelection={{
                       onChange: (selectedRowKeys) => {
                           dispatch({type: 'cpxx/updatePayload', payload: {_selectedRowKeys: selectedRowKeys}});
                       }
                   }}
                   columns={columns}
                   dataSource={cpxx.list}
                   rowKey={record => record.id}
                   pagination={pagination}
                   bordered/>
            <CpAddModal  {...CpAddModalProps} />

            <CpImportModal  {...CpImportModalProps} />
            <CpkAddStep1 {...CpImportModalProps} />
        </div>
    );
};


CpxxPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(CpxxPage);