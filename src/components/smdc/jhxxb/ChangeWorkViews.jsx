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
import styles from '../../../components/smdc/jhxxb/ChangeWorkViews.less';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';

const FormItem = Form.Item;

const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const ChangeWorkViews = (
    {
        changeWorkTable,
        dispatch,
        modalVisible,
        form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }
    }) => {

    const ReasonAddModalProps = {

        visible: modalVisible,
        title: "选择门店",
        dispatch,
        onOk() {

            validateFields((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                console.log(changeWorkTable.rowSelectionDataLs);
                var parmList = [];
                var parmMap = {};
                changeWorkTable.rowSelectionDataLs.forEach(function (value) {
                    parmList.push(value.id);
                    parmMap[value.id] = value.name;
                });


                dispatch({
                    type: 'changeWorkTable/updatePayload',
                    payload: {
                        restaurantIds: parmList,
                        resIdOrgNameMap:parmMap,
                        modalVisible:false
                    }
                });
            });
        },
        onCancel() {
            dispatch({
                type: 'changeWorkTable/updatePayload',
                payload:{
                    modalVisible:false
                }
            });
        },
    };

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const columnsArea = [
        {
            title: '门店',
            dataIndex: 'name',
            key: 'name',
        },
    ];
    const rowSelection = {

        onSelect: (record, selected, selectedRows) => {
            rowSelectionChange(selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            rowSelectionChange(selectedRows);
        },
    };
    function rowSelectionChange(selectedRows){
        dispatch({type: 'changeWorkTable/updatePayload',payload:{rowSelectionDataLs:selectedRows}});
    }

    return(
        <Modal  {...ReasonAddModalProps}>
            <Table className={styles.table}
                   columns={columnsArea}
                   dataSource={changeWorkTable.listValue}
                   rowKey={record => record.id}
                   rowSelection={rowSelection}
                   pagination={false}
                   bordered/>
        </Modal>);

}
export default Form.create()(ChangeWorkViews);