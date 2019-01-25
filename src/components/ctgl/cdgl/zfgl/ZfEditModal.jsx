import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './ZfAddModal.less';

const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';

const RadioGroup = Radio.Group;
const ZfEditModal = ({

                        visible,
                        onOk,
                        onCancel,
                        currentItem,
                        dispatch,
                        form: {
                            getFieldDecorator,
                            validateFields,
                            getFieldsValue,
                            resetFields,
                            setFieldsValue,
                        },
                        zfgl,
                    }) => {


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const Option = Select.Option;

    function handleOk() {

      validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            var data = {...getFieldsValue()};
            dispatch({
                type: 'zfgl/updatePayload',
                payload: {
                    foodMethodItemEdit: data,
                }
            });
            dispatch({
                type: 'zfgl/editFoodMethodUrl',
                payload: {}
            });
            dispatch({
                type: 'zfgl/updatePayload',
                payload: {
                    modalEditVisible: false
                }
            });

        })
    }

    const modalOpts = {
        title: "编辑做法",
        visible,
        onOk: handleOk,
        onCancel,
        currentItem,
        okText:"确定",
        cancelText:"取消"

    };

    function onChange(e) {
        dispatch({
            type: 'zfgl/updatePayload',
            payload: {
                currentSelectValue: e,
            }
        });
    }
    function onChange1(e) {
        dispatch({
            type: 'zfgl/updatePayload',
            payload: {
                currentSelectValue1: e,
            }
        });
    }

    return (
        <Modal {...modalOpts} key={zfgl.modalKey} afterClose={() => {
          
            dispatch({
                type: 'zfgl/updatePayload', payload: {
                    modalKey: Date.now(),
                    
                }
            });
        }}>


            <div className={styles.pay}>
                <Form horizontal className={styles.formwidth}>
                    <FormItem
                        {...formItemLayout}
                        label="做法名称 "
                        
                    >
                        {getFieldDecorator('name', {
                            initialValue: zfgl.foodMethodItemEdit.name,
                            rules: [
                                 {
                                    validator: (rule, value, callback) => {
                                        if (zfgl.id) {
                                           dispatch({
                                                type: 'zfgl/checkName',
                                                payload: {"callback": callback, "value": value,"id":zfgl.id}
                                            });
                                        } else {
                                            dispatch({
                                                type: 'zfgl/checkName',
                                                payload: { "callback": callback, "value": value }
                                            });
                                        }
                                    }
                                },
                                {required: true, message: '请输入做法名称'}
                            ]
                        })(
                            <Input disabled={zfgl.manageType == 1}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                        
                    >
                        {getFieldDecorator('state', {
                            initialValue: zfgl.foodMethodItemEdit.status,
                            rules: [{
                                required: true, message: '请输入快递单号',
                            }],
                        })(
                            <RadioGroup disabled={zfgl.manageType == 1}>
                                <Radio value={1}>启用</Radio>
                                <Radio value={2}>停用</Radio>
                             </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="默认加价方式"
                        
                    >
                        {getFieldDecorator('pricingType', {
                            initialValue: (zfgl.currentSelectValue ? zfgl.currentSelectValue + "" : "0"),
                            rules: [{
                                required: true, message: '请输入快递单号',
                            }],
                        })(
                            <Select disabled={zfgl.manageType == 1} style={{width: 120}} onChange={onChange}>
                                <Option value="0">不加价</Option>
                                <Option value="1">比例加价</Option>
                                <Option value="2">固定加价</Option>

                            </Select>
                        )}
                    </FormItem>
                    {
                        zfgl.currentSelectValue == 0 &&
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="默认加价金额/比例"
                                
                            >
                                <Input disabled={zfgl.manageType == 1} style={{width: 120}} disabled></Input>
                            </FormItem>
                        </div>

                    }
                    {
                        zfgl.currentSelectValue == 1 &&
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="默认加价比例"
                                
                            >
                                {getFieldDecorator('pricingRate', {
                                    initialValue: zfgl.foodMethodItemEdit.pricingRate,
                                    rules: [{
                                        required: true, message: '请输入快递单号',
                                    }],
                                })(
                                    <Input disabled={zfgl.manageType == 1} style={{width: 120}} addonAfter={"%"}></Input>)
                                }
                            </FormItem>
                        </div>
                    }
                    {
                        zfgl.currentSelectValue == 2 &&
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="默认加价金额"
                                
                            >
                                {getFieldDecorator('pricingMoney', {
                                    initialValue: zfgl.foodMethodItemEdit.pricingMoney/100,
                                    rules: [{
                                        required: true, message: '请输入快递单号',
                                    }],
                                })(
                                    <Input disabled={zfgl.manageType == 1} style={{width: 120}} addonAfter={"元"}></Input>)
                                }
                            </FormItem>
                        </div>
                    }

                </Form>
            </div>
        </Modal>
    );
};

ZfEditModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(ZfEditModal);
