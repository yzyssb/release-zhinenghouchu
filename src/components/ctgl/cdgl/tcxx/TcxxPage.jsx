import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './TcxxPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import TcAddModal from './TcAddModal';
import Popconfirm from 'antd/lib/popconfirm';
import {routerRedux} from "dva/router";
import  CpkAddStepTc from '../../../lsyy/cpk/cpkaddstep/CpkAddStepTc';
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 12,
    },
};

const TcxxPage = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    },
    dispatch, tcxx, cpxx, cpfl,
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

        var data = { ...getFieldsValue() };

        dispatch({ type: 'tcxx/query', payload: { name: data.keyword } });

    }

    function onCuisineChange(value) {


    }

    function onOperate(record) {

        dispatch({
            type: 'tcxx/deleteFoodCombo',
            payload: { id: record.id }
        });

    }

    function goeditgoods(record) {
        // 每次点击编辑都重置验证名称和编码
        dispatch({
            type: 'tcxx/updatePayload', payload: {
                checkName: 0,
                checkCode: 0,
                way: "edit",
                recordId: record.id
            }
        })
        console.log("编辑了11")
        
        dispatch({ type: 'tcxx/updatePayload', payload: {isAdd: false, id: record.id } });

        dispatch({type: 'tcxx/foodComboGetMaxCodeUrl', payload: {}});

        dispatch({ type: 'tcxx/queryFoodComboById', payload: { id: record.id } });

        tcxx.food.id = record.id;
        dispatch({ type: 'tcxx/updatePayload', payload: { food: tcxx.food } });

        dispatch({ type: 'tcxx/queryFoodByCategory', payload: { id: 0 } });

        dispatch(routerRedux.push({
            pathname: "/tcxx",
            query: {}
        }));

    }

    function managerHandle(record, index) {

        var handlebtn = [];

        handlebtn.push(<span key={index} ><a onClick={() => { goeditgoods(record) }}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
                <a>删除</a>
            </Popconfirm>
        </span>)

        return handlebtn;
    }
    function managerTimeHandle(record) {

        return timestampToTime(record.gmtCreate);

    }

    function managerTypeHandle(record) {
        var text;
        if (record.type == 1) {
            text = '简易套餐';
        }
        return text;
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

    function managerPriceHandle(record, index) {

        let text;

        text = record.price / 100;

        return text;

    }


    function managerVipPriceHandle(record, index) {

        let text;

        text = record.vipPrice / 100;

        return text;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '套餐名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '快捷码',
            dataIndex: 'quickCode',
            key: 'quickCode',
        }, {
            title: '套餐类型',
            dataIndex: 'type',
            key: 'type',
            render: (text, record, index) => (
                managerTypeHandle(record, index)
            ),
        }, {
            title: '套餐价/套餐优惠价',
            dataIndex: 'price',
            key: 'price',
            render: (text, record, index) => (
                managerPriceHandle(record, index)
            ),
        }, {
            title: '会员价/会员优惠价',
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
        total: tcxx.total,
        current: tcxx.current,
        pageSize: tcxx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize) {


        dispatch({ type: 'tcxx/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
        dispatch({ type: 'tcxx/query', payload: {} });


    }

    function onPageChange(pageNo) {

        var offset = pageNo * tcxx.size - tcxx.size;
        dispatch({ type: 'tcxx/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'tcxx/query', payload: {} });


    }


    function addTcxxClick() {

        // // 每次点击新增都重置验证名称和编码
        // dispatch({
        //     type: 'tcxx/updatePayload', payload: {
        //         checkName: 0,
        //         checkCode: 0,
        //         way: "add",
        //         recordId: ""
        //     }
        // })
        // console.log("新增了！！！")
        //
        // dispatch({ type: 'tcxx/updatePayload', payload: {food: {}, selectFoodList: [], singleFoodCombo: {}, id: 0 } });
        // dispatch({type: 'tcxx/foodComboGetMaxCodeUrl', payload: {}});
        // dispatch({ type: 'tcxx/queryFoodByCategory', payload: { id: 0 } });
        //
        // dispatch(routerRedux.push({
        //     pathname: "/tcxx",
        //     query: {}
        // }));
        dispatch({
            type: 'tcxx/queryPullFoodList',
            payload: {}
        });
        dispatch({
            type: 'tcxx/updatePayload',
            payload: {modalStepTcVisiable: true,newData:[]}
        });


    }
    const CpImportModalProps = {
        dispatch,
        tcxx,

    };
    const TcAddModalProps = {
        visible: tcxx.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'tcxx/updatePayload',
                payload: { modalVisible: false }
            });


            dispatch({ type: 'tcxx/updatePayload', payload: { currentSteps: 0 } });
        },


        tcxx, cpxx, cpfl,
    };

    function onClear() {
        dispatch({ type: 'tcxx/updatePayload', payload: { keyword: "" } });
    }

    function onKeywordChange(e) {
        dispatch({ type: 'tcxx/updatePayload', payload: { keyword: e.target.value } });
    }


    function onSearch() {

        dispatch({ type: 'tcxx/query', payload: { name: tcxx.keyword } });
    }

    return (
        <div className={styles.search}>

            <div style={{ marginLeft: 20 }} > <span>套餐名称</span>

                <Input style={{ marginLeft: 20, width: 220 }} onChange={onKeywordChange} value={tcxx.keyword} onPressEnter = {onSearch}/>

                <Button type="primary" style={{ marginLeft: 40 }} onClick={onSearch}>搜索</Button>
                <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={onClear}>重置</Button>
            </div>



            <Button style={{ marginLeft: 10, marginTop: 20 }} onClick={addTcxxClick}>新增套餐信息</Button>

            <Table className={styles.table}
                columns={columns}
                dataSource={tcxx.list}
                rowKey={record => record.id}
                pagination={pagination}
                bordered />

            <TcAddModal  {...TcAddModalProps} />
            <CpkAddStepTc {...CpImportModalProps}/>
        </div>
    );
};


TcxxPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(TcxxPage);