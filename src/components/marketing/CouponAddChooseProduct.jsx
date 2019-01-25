import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'dva';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';

const {MonthPicker, RangePicker} = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from '../ctgl/yybz/ReasonAddModal.less';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';

const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const CouponAddChoosePlaceProduct = (
    {yhqlb, dispatch, form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }

                   }) => {
    const ReasonAddModalProps = {

        visible: yhqlb.modaladdVisible,
        title: "选择产品",
        dispatch,
        onOk() {
            validateFields((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                dispatch({
                    type: 'yhqlb/updatePayload',
                    payload:{modaladdVisible:false,rowSelectionDataPro:yhqlb.rowSelectionDataProLs}
                });
            });

        },
        onCancel() {
            dispatch({
                type: 'yhqlb/updatePayload',
                payload:{modaladdVisible:false}
            });
        },
        yhqlb,
    };

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    var cuisineOptionHtml=[];

    if(yhqlb.regionList){
        yhqlb.regionList.map((j) => {
            cuisineOptionHtml.push ( <Checkbox key={j.id}>{j.regionName}</Checkbox>)
        })
    }
    const columnsArea = [
       {
            title: '产品',
            dataIndex: 'name',
            key: 'name',
        },
    ];
    function managerHandleRegion(record,index){
        var handlebtn=[];
        handlebtn.push(<Checkbox onChange={checkedBox(record)}>
        </Checkbox>)

        return handlebtn;
    }
    function checkedBox(e) {
       console.log(e.tableName);

    }
    const rowSelection = {

        onSelect: (record, selected, selectedRows) => {
            rowSelectionChange(selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            rowSelectionChange(selectedRows);
        },
    };

    // 选择完毕存值
    function rowSelectionChange(selectedRows){
        dispatch({type: 'yhqlb/updatePayload',payload:{rowSelectionDataProLs:selectedRows}});
    }

    return(
        <Modal  {...ReasonAddModalProps}>
            <Table 
                style={{height: "500px", overflowY: "scroll" }}  
            className={styles.table}
                   columns={columnsArea}
                   dataSource={yhqlb.foodList}
                   rowKey={record => record.id}
                   rowSelection={rowSelection}
                   pagination={false}
                   bordered/>
        </Modal>);

}
export default Form.create()(CouponAddChoosePlaceProduct);