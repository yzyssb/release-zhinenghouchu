/**
 *
 * @authors ${author} (${email})
 * @date    2018-04-04
 * @version $Id$
 */

import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input'  ;
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';

import DatePicker from 'antd/lib/date-picker';
import styles from './YgglEditModel.less';
import UpLoadImage from '../../../components/base/common/UpLoadPicture';
import moment from 'moment';

const RadioGroup = Radio.Group;

const FormItem = Form.Item;

const YgglEditModel = ({visible, onOk, onCancel, currentItem, dispatch, form: {getFieldDecorator, validateFields, getFieldsValue, resetFields, setFieldsValue,}, yggl,}) => {

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const {record} = yggl;
    const Option = Select.Option;

    if (yggl.isResetForm) {
        setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
    }
    function resetFormTimeout(resetFields, dispatch) {
        if (resetFields) {
            resetFields();
        }
        if (dispatch) {
            dispatch({
                type: 'yggl/updatePayload',
                payload: { isResetForm: false }
            });
        }
    }

    function handleOk() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            let value = getFieldsValue();
            value.gmtEnter = value.gmtEnter && value.gmtEnter.toDate().getTime();
            value.gmtLeave = value.gmtLeave && value.gmtLeave.toDate().getTime();
            value.sex = value.sex ? 1 : 0;
            console.log(record.headImg)

            value.headImg=record.headImg
            if (!value.id) {
                value.headImg=record.headImg
                dispatch({
                    type: 'yggl/addWatiers',
                    payload: value
                });
            } else {
                // update
                dispatch({
                    type: 'yggl/updateWatiers',
                    payload: value
                });
            }
            dispatch({
                type: 'yggl/updatePayload',
                payload: {
                    modalVisible: false,
                }
            });
        });
    }

    function handCancel() {
        dispatch({
            type: 'yggl/updatePayload',
            payload: {
                modalVisible: false,
            }
        });
    }

    function normFile(e) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    function handleSelectChange(e) {
        console.log(e)
    }

    const onImgChange = (e) => {
        if (e.previewImage && e.previewImage.length > 0 && e.previewImage[0].response && e.previewImage[0].response.data) {
            let a=getFieldsValue()
            a.headImg= e.previewImage[0].response.data
            dispatch({
                type: 'yggl/updatePayload',
                payload: {record: a},
            });
        }
    };

    function onImgRemove(e) {
        record.headImg = '';
        dispatch({
            type: 'yggl/updatePayload',
            payload: { record: record, }
        });
    };

    const UpLoadImageGen = () =>
    <UpLoadImage defaultUrl={record.headImg} maxCount={1} onChange={(e) => { onImgChange(e) }} info={"添加图片"} onRemove={(e) => { onImgRemove(e) }}> </UpLoadImage>

    return (
        <Modal title='员工管理' visible={visible} onCancel={handCancel} width='1000px' afterClose={() => {
            resetFields()
        }}
               footer={[
                   <Button key="back" onClick={handCancel}>取消</Button>,
                   <Button key="submit" type="primary" onClick={handleOk}>确认</Button>
               ]}
        >
            <div className={styles.pay}>
                <Form className={styles.formwidth}>
                    <Form.Item label="id" {...formItemLayout} style={{display: "none"}}>
                        {
                            getFieldDecorator('id', {
                                initialValue: record.id
                            })(
                                <Input/>
                            )
                        }
                    </Form.Item>
                    <FormItem{...formItemLayout} label="员工姓名" >
                        {getFieldDecorator('waiterRealName', {
                            initialValue: record.waiterRealName,
                            rules: [
                                {
                                    required: true,
                                    message: '填写员工真实姓名'
                                }
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户名"
                        
                        extra='用于登录平台'
                    >
                        {getFieldDecorator('waiterUserName', {
                            initialValue: record.waiterUserName,
                            rules: [{
                                required: true,
                                message: '请输入用户名',

                            }],
                        })(
                            <Input/>
                        )}

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="登录密码"
                        
                        extra='（若不需修改,默认密码123456）'
                    >
                        {getFieldDecorator('password', {
                            initialValue: record.password,
                            rules: [{
                                required: false,
                                message: '请输入快递单号',
                            }],
                        })(
                            <Input type='password'/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="性别"
                        >
                        {getFieldDecorator('sex', {
                            initialValue: record.sex,
                            rules: [{
                                required: true,
                                message: '请选择性别',
                            }],
                        })(
                            <RadioGroup>
                                <Radio value={true}>男</Radio>
                                <Radio value={false}>女</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="职级"
                        
                    >
                        {getFieldDecorator('groupId', {
                            initialValue: record.groupId,
                            rules: [{
                                required: true,
                                message: '请选择'
                            }],
                        })(
                            <Select placeholder="" onChange={handleSelectChange}>
                                {yggl.groupList.map(item => <Option key={item.code}
                                                                    value={item.code}>{item.name}</Option>)}
                            </Select>
                        )}

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="身份证号"
                        
                    >
                        {getFieldDecorator('idCardNo', {
                            initialValue: record.idCardNo,
                            rules: [{
                                required: false,
                                message: '请输入身份证号',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="手机号"
                        
                    >
                        {getFieldDecorator('phone', {
                            initialValue: record.phone,
                            rules: [{
                                required: true,
                                message: '请输入手机号',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="上传图片"
                        
                    >

                        <div className="dropbox">
                            {/*{getFieldDecorator('headImg', {

                                valuePropName: 'fileList',
                                getValueFromEvent: normFile,
                                initialValue: record.headImg,
                            })(
                                <UpLoadImage defaultUrl={record.headImg} onChange={(e) => {
                                    onImgChange(e)
                                }} onRemove={(e) => { onImgRemove(e) }} maxCount={1} info={"添加图片"}/>
                            )}*/}
                            <UpLoadImageGen/>
                        </div>
                    </FormItem>

                    <FormItem {...formItemLayout}  >
                        更多设置

                    </FormItem>
                    <div>

                    </div>

                    <FormItem
                        {...formItemLayout}
                        label="入职时间"
                        
                    >
                        {getFieldDecorator('gmtEnter', {
                            initialValue: record.gmtEnter && moment(record.gmtEnter),
                            //rules: [{
                            //    type: 'object',
                            //    required: false,
                            //    message: '请选择时间'
                            //}],
                        })(
                            <DatePicker format={'YYYY-MM-DD'}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="离职时间"
                        
                    >
                        {getFieldDecorator('gmtLeave', {
                            initialValue: record.gmtLeave && moment(record.gmtLeave),
                            //rules: [{
                            //    type: 'object',
                            //    required: false,
                            //    message: '请选择时间'
                            //}],
                        })(
                            <DatePicker format={'YYYY-MM-DD'}/>
                        )}
                    </FormItem>

                    {/*<FormItem
                        {...formItemLayout}
                        label="居住地"
                        
                    >
                        {getFieldDecorator('address', {
                            initialValue: record.address,
                            rules: [{
                                required: false,
                                message: '请输入快递单号',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        
                    >
                        {getFieldDecorator('remark', {
                            initialValue: record.remark,
                            rules: [{
                                required: false,
                                message: '请输入快递单号',
                            }],
                        })(
                            <Input type='textarea'/>
                        )}
                    </FormItem>*/}


                </Form>

            </div>
        </Modal>
    );
};

YgglEditModel.propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(YgglEditModel);
