/**
 *
 * @authors ${author} (${email})
 * @date    2018-04-04
 * @version $Id$
 */

import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import styles from './ZbglEditModel.less';
import PowerForm from '../../../routes/ctgl/yggl/PowerModal';

const FormItem = Form.Item;

const ZbglEditModel = ({visible, onOk, onCancel, currentItem, dispatch, form: {getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue}, zbgl,}) => {

    //console.log(yggl.commentTypes);
    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const Option = Select.Option;

    const children = [];

    zbgl.commentTypes.map((i, j) => {
        //children.push (
        //   <Option key={i.value}>{i.key}</Option>
        // )
    });


    function handleOk() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            let value = getFieldsValue();
            dispatch({
                type: 'zbgl/updatePayload',
                payload: {
                    record: value,
                }
            });
            if (value.id) {
                // edit
                dispatch({
                    type: 'zbgl/updataGroup',
                    payload: value
                });
            } else {
                // add
                dispatch({
                    type: 'zbgl/addGroup',
                    payload: {}
                });
            }
        })

    }

    function handCancel() {
        resetFields();
        dispatch({
            type: 'zbgl/updatePayload',
            payload: {
                modalVisible: false,
            }
        });

    }

    const modalOpts = {
        title: "组别管理",
        visible,
        onOk: handleOk,
        onCancel: handCancel,
        currentItem,
        okText:"确定",
        cancelText:"取消"
    };

    const PowerFormProps = {
        visible: zbgl.powerModalVisible,
        powers: zbgl.powers,
        posPowers: zbgl.posPowers,
        record: zbgl.record,
        dispatch,
        zbgl,
    };


    return (
        <Modal {...modalOpts} >


            <div className={styles.pay}>
                <Form className={styles.formwidth}>
                    <FormItem{...formItemLayout} label="折扣上限"  style={{display: "none"}}>
                        {getFieldDecorator('id', {
                            initialValue: zbgl.record.id,
                            rules: [{
                                required: false,
                                message: '',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户组名"
                        
                    >
                        {getFieldDecorator('name', {
                            initialValue: zbgl.record.groupName,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户组名'
                                }
                            ]
                        })(
                            <Input/>
                        )}

                        <Button onClick={() => {
                            dispatch({
                                type: 'zbgl/updatePayload',
                                payload: {
                                    powerModalVisible: true
                                }
                            });
                        }}>权限编辑</Button>

                    </FormItem>
                    <FormItem{...formItemLayout} label="折扣上限" >
                        {getFieldDecorator('discountLimit', {
                            initialValue: zbgl.record.discountLimit,
                            rules: [{
                                required: false,
                                message: '请输入折扣上限值',
                            }],
                        })(
                            <InputNumber max = {100}/>
                        )}
                            %
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="抹零上限"
                        
                    >
                        {getFieldDecorator('eraseLimit', {
                            initialValue: (zbgl.record.eraseLimit!=null)?zbgl.record.eraseLimit/100:0,
                            rules: [{
                                required: false,
                                message: '请输入抹零上限值',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>


                </Form>

                <PowerForm {...PowerFormProps}/>
            </div>
        </Modal>

    );
};

ZbglEditModel.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(ZbglEditModel);
