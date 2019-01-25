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
    dispatch, lstcxx, lscpxx, lscpfl,
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

        dispatch({ type: 'lstcxx/query', payload: { name: data.keyword } });

    }

    function onCuisineChange(value) {


    }

    function onOperate(record) {

        dispatch({
            type: 'lstcxx/deleteFoodCombo',
            payload: { id: record.id }
        });

    }

    function goeditgoods(record) {
        // 每次点击编辑都重置验证名称和编码
        dispatch({
            type: 'lstcxx/updatePayload', payload: {
                checkName: 0,
                checkCode: 0,
                way: "edit",
                recordId: record.id
            }
        })
        console.log("编辑了11")
        
        dispatch({ type: 'lstcxx/updatePayload', payload: {isAdd: false, id: record.id } });

        dispatch({type: 'lstcxx/foodComboGetMaxCodeUrl', payload: {}});

        dispatch({ type: 'lstcxx/queryFoodComboById', payload: { id: record.id } });

        lstcxx.food.id = record.id;
        dispatch({ type: 'lstcxx/updatePayload', payload: { food: lstcxx.food } });

        dispatch({ type: 'lstcxx/queryFoodByCategory', payload: { id: 0 } });

        dispatch(routerRedux.push({
            pathname: "/lstcxx",
            query: {}
        }));

    }

    function deploy(record){

        dispatch({ type: 'lstcxx/queryFoodComboById', payload: { id: record.id } });

        dispatch(routerRedux.push({
            pathname: "/lstcxxdeploy",
            query: {}
        }));
    }

    function managerHandle(record, index) {

        var handlebtn = [];

        handlebtn.push(
            <span key={index} >
                 <a onClick={() => {
                     deploy(record)
                 }}>分配</a>
                 <span className="ant-divider"/>
                <a onClick={() => { goeditgoods(record) }}>编辑</a>
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

        text = record.priceJson.split(',')[0]/100 + '元 ' +  record.priceJson.split(',')[1]/100 +'元 ' +  record.priceJson.split(',')[2]/100 + '元 ' +  record.priceJson.split(',')[3]/100 + '元 ' + record.priceJson.split(',')[4]/100 +'元';

        return text;

    }


    function managerVipPriceHandle(record, index) {

        let text;

        text = record.vipPriceJson.split(',')[0]/100 + '元 ' +  record.vipPriceJson.split(',')[1]/100 +'元 ' +  record.vipPriceJson.split(',')[2]/100 + '元 ' +  record.vipPriceJson.split(',')[3]/100 + '元 ' + record.vipPriceJson.split(',')[4]/100 + '元';

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
        total: lstcxx.total,
        current: lstcxx.current,
        pageSize: lstcxx.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger: true,
        onShowSizeChange: SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize) {


        dispatch({ type: 'lstcxx/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
        dispatch({ type: 'lstcxx/query', payload: {} });


    }

    function onPageChange(pageNo) {

        var offset = pageNo * lstcxx.size - lstcxx.size;
        dispatch({ type: 'lstcxx/updatePayload', payload: { offset: offset, current: pageNo } });
        dispatch({ type: 'lstcxx/query', payload: {} });


    }


    function addTcxxClick() {

        // 每次点击新增都重置验证名称和编码
        dispatch({
            type: 'lstcxx/updatePayload', payload: {
                checkName: 0,
                checkCode: 0,
                way: "add",
                recordId: ""
            }
        })
        console.log("新增了！！！")
        
        dispatch({ type: 'lstcxx/updatePayload', payload: {food: {cookGmtCreate:0}, selectFoodList: [], singleFoodCombo: {}, id: 0
                ,price1:0,vipPrice1:0
                ,price2:0,vipPrice2:0
                ,price3:0,vipPrice3:0
                ,price4:0,vipPrice4:0
                ,price5:0,vipPrice5:0
                ,estimateCost:0,
            }});
        dispatch({type: 'lstcxx/foodComboGetMaxCodeUrl', payload: {}});
        dispatch({ type: 'lstcxx/queryFoodByCategory', payload: { id: 0 } });

        dispatch(routerRedux.push({
            pathname: "/lstcxx",
            query: {}
        }));

    }
    const TcAddModalProps = {
        visible: lstcxx.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'lstcxx/updatePayload',
                payload: { modalVisible: false }
            });


            dispatch({ type: 'lstcxx/updatePayload', payload: { currentSteps: 0 } });
        },


        lstcxx, lscpxx, lscpfl,
    };

    function onClear() {
        dispatch({ type: 'lstcxx/updatePayload', payload: { keyword: "" } });
    }

    function onKeywordChange(e) {
        dispatch({ type: 'lstcxx/updatePayload', payload: { keyword: e.target.value } });
    }


    function onSearch() {

        dispatch({ type: 'lstcxx/query', payload: { name: lstcxx.keyword } });
    }

    return (
        <div className={styles.search}>

            <div style={{ marginLeft: 20 }} > <span>套餐名称</span>

                <Input style={{ marginLeft: 20, width: 220 }} onChange={onKeywordChange} value={lstcxx.keyword} onPressEnter = {onSearch}/>

                <Button type="primary" style={{ marginLeft: 40 }} onClick={onSearch}>搜索</Button>
                <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={onClear}>重置</Button>
            </div>



            <Button style={{ marginLeft: 10, marginTop: 20 }} onClick={addTcxxClick}>新增套餐信息</Button>

            <Table className={styles.table}
                columns={columns}
                dataSource={lstcxx.list}
                rowKey={record => record.id}
                pagination={pagination}
                bordered
                scroll={{ x: 1300 }}/>

            <TcAddModal  {...TcAddModalProps} />
        </div>
    );
};


TcxxPage.propTypes = {
    visible: PropTypes.any,
    form: PropTypes.object,
    item: PropTypes.object,
};

export default Form.create()(TcxxPage);