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
import styles from '../yybz/ReasonAddModal.less';
import ReasonAddModal from '../yybz/ReasonAddModal.jsx';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';

import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';

const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

const Ctaigl_add = ({
                        ctaigl, dispatch, form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }

                    }) => {

    if (ctaigl.isResetForm) {
        setTimeout(function () {
            resetFormTimeout(resetFields, dispatch)
        }, 20);
    }

    function resetFormTimeout(resetFields, dispatch) {
        if (resetFields) {
            resetFields();
        }
        if (dispatch) {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload: {isResetForm: false}
            });
        }
    }

    const ReasonAddModalProps = {

        visible: ctaigl.modaladdVisible,
        title: "新增餐台",
        okText:"确定",
        cancelText:"取消",
        dispatch,
        onOk() {
            validateFields((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                dispatch({
                    type: 'ctaigl/addTable',
                    payload: {}
                });
                dispatch({
                    type: 'ctaigl/updatePayload',
                    payload: {modaladdVisible: false}
                });
            });

        },
        onCancel() {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload: {modaladdVisible: false}
            });
        },
        ctaigl,
    };

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    function onChangeTableNum(e) {
        ctaigl.item.tableCode = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    function onChangeTableName(e) {
        ctaigl.item.tableName = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    function onChangeRegion(e) {
        console.log(e);
        ctaigl.item.regionId = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    function onChangeSeatNum(e) {
        ctaigl.item.seatNum = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    function onChangeWaiter(e) {
        ctaigl.item.waiterId = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    function onChange1(e) {
        ctaigl.item.isEatInRestaurant = e.target.checked;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload: {item: ctaigl.item}
        });
    };

    var cuisineOptionHtml = [];

    if (ctaigl.regionList) {
        ctaigl.regionList.map((j) => {
            cuisineOptionHtml.push(<Select.Option key={j.id}>{j.regionName}</Select.Option>)


        })
    }

    var waitersListHtml = [];

    if (ctaigl.waiters) {
        ctaigl.waiters.map((j) => {
            waitersListHtml.push(<Select.Option key={j.id}>{j.name}</Select.Option>)


        })
    }

    function managerRegion(e) {

        var reValue;
        if (ctaigl.regionList) {
            ctaigl.regionList.map((j) => {
                if (j.id == e.regionId) {
                    reValue = j.regionName;
                }
            })
        }
        return reValue;
    }

    return (
        <Modal  {...ReasonAddModalProps} key={ctaigl.modalKey} afterClose={() => {

             dispatch({
                type:'ctaigl/updatePayload', payload: {
                    modalKey: Date.now(),
                    
                }
            });
        }}>
           
            <div className={styles.pay}>
                <Form className={styles.formwidth}>
                    <FormItem
                        {...formItemLayout}
                        label="餐台编号"
                        
                    >
                        {getFieldDecorator('ctaino', {
                            rules: [{
                                required: true, message: '请输入餐台编号',
                            }],
                        })(
                            <InputNumber className={styles.inputnumber} min={0} max={Infinity}
                                         placeholder={'只能填数字！例如：1001，1002...'} onChange={onChangeTableNum}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="餐台名称"
                        
                        required
                    >
                        {getFieldDecorator('ctainame', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '请输入餐台名称!',
                            }],
                        })(
                            <Input placeholder={'为餐台取个好名字吧'} onChange={onChangeTableName}/>
                        )}


                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属区域"
                        
                        required
                    >
                        {getFieldDecorator('ctaiarea', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '请输入区域名称',
                            }],
                        })(
                            <Select placeholder={managerRegion} onChange={onChangeRegion}>
                                {cuisineOptionHtml}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="座位数"
                        
                        required
                    >
                        {getFieldDecorator('ctaiseat', {
                            initialValue: '',
                            rules: [{
                                required: true, message: '请输入座位数',
                            }],
                        })(
                            <InputNumber className={styles.inputnumber} min={0} max={Infinity} placeholder={'可容纳人数'}
                                         onChange={onChangeSeatNum}/>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="服务员"
                        
                    >
                        {getFieldDecorator('ctaiseat1', {})(
                            <Select onChange={onChangeWaiter}>
                                {waitersListHtml}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="是否堂食台" {...formItemLayout} >
                        {getFieldDecorator('ctaiseatBoolean', {})(
                            <Checkbox onChange={onChange1}> </Checkbox>
                        )}
                    </FormItem>

                </Form>

            </div>
        </Modal>
    );

};

export default Form.create()(Ctaigl_add);