import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import Tabs from "antd/lib/tabs/index";
import Radio from 'antd/lib/radio';
import Checkbox from 'antd/lib/checkbox';
import DatePicker from 'antd/lib/date-picker';
import styles from './JfgzAddModal.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import message from "antd/lib/message/index";

const hydj = ({
                  hydjAdd,
                  hydjVisible,
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
                  jfgz,
              }) => {


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const formItemLayout2 = {
        labelCol: {
            span: 7,
        },
        wrapperCol: {
            span: 6,
        },
    };
    const {levelInfo, baseInfo} = jfgz;
    const Option = Select.Option;



    function handleOk() {
        validateFields((errors) => {
            if (!!errors) {
                return false;
            }
            let value = getFieldsValue();
            console.log(value)
            if(value.level_pay<0){
                message.error('支付金额不能为负数');
                return;
            }
            if(value.limit_pay<0){
                message.error('每天刷卡限制不能为负数');
                return;
            }
            if(value.level_num<0){
                message.error('限制会员数量不能为负数');
                return;
            }
            jfgz.levelInfo = {
                level_name: value.level_name,
                level_pay: value.level_pay,
            },
                jfgz.baseInfo = {
                    valid_day: value.valid_day,
                    limit_pay: value.limit_pay,
                    level_num: value.level_num,
                    is_ck: value.is_ck,
                }
                if(hydjAdd){
                    dispatch({
                        type: 'jfgz/addVipLevel',
                        payload: {
                            levelInfo: jfgz.levelInfo, baseInfo: jfgz.baseInfo
                        }
                    });
                }else{
                    dispatch({
                        type: 'jfgz/modifyVipLevel',
                        payload: {
                            levelId:jfgz.levelId,levelInfo: jfgz.levelInfo, baseInfo: jfgz.baseInfo
                        }
                    });
                }

            dispatch({
                type: 'jfgz/updatePayload',
                payload: {
                    hydjVisible: false,
                }
            });

        });

    }

    function handCancel() {
        jfgz.levelInfo = {
            level_name: '',
            level_pay: '',
        },
            jfgz.baseInfo = {
                valid_day: '',
                limit_pay: '',
                level_num: '',
                is_ck: '',
            }
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {
                hydjVisible: false,levelInfo: jfgz.levelInfo, baseInfo: jfgz.baseInfo
            }
        });
    }

    const modalOpts = {
        title: "会员等级",
        visible: hydjVisible,
        onOk: handleOk,
        onCancel,
        currentItem,

    };


    const formItemLayoutDataPicker = {
        labelCol: {span: 1},
        wrapperCol: {span: 22},
    };

    function radioChangeFun(e) {
        baseInfo.valid_day = e.target.value
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {baseInfo: baseInfo}

        });
    }

    return (
        <Modal {...modalOpts}visible={hydjVisible}  onCancel={handCancel} afterClose={() => {
            resetFields()
        }}
               footer={[
                   <Button key="back" onClick={handCancel}>取消</Button>,
                   <Button key="submit" type="primary" onClick={handleOk}>确认</Button>
               ]}>
            <div>
                <Form horizontal>
                    <FormItem{...formItemLayout} label="会员等级名称" >
                        {getFieldDecorator('level_name', {
                            initialValue: levelInfo.level_name,
                            rules: [
                                {
                                    required: true,
                                    message: '请填写会员等级名称'
                                }
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout2} label="获取条件(支付金额)" >
                        {getFieldDecorator('level_pay', {
                            initialValue: levelInfo.level_pay,
                            rules: [
                                {
                                    pattern: /^\d+(\.?\d+)?$/,
                                    required: true,
                                    message: '请填写正确的支付金额'
                                }
                            ]
                        })(
                            <Input type='number'/>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="每天刷卡限制" >
                        {getFieldDecorator('limit_pay', {
                            initialValue: baseInfo.limit_pay,
                            rules: [
                                {
                                    pattern: /^([1-9]\d*|[0])$/,
                                    required: true,
                                    message: '请输入正确的限制次数'
                                }
                            ]
                        })(
                            <Input type='number'/>
                        )}【0不限制次数】
                    </FormItem>
                    <FormItem{...formItemLayout} label="会员有效期" >
                        <RadioGroup onChange={radioChangeFun} defaultValue={baseInfo.valid_day==0?0:1}>
                            <Radio value={0}>永久</Radio>
                            <Radio value={1}>自定义</Radio>
                        </RadioGroup>
                    </FormItem>
                    {baseInfo.valid_day != 0&&(
                        <FormItem
                            {...formItemLayout} >
                            {getFieldDecorator('valid_day', {
                                initialValue: baseInfo.valid_day,
                                rules: [
                                    {
                                        pattern: /^([1-9]\d*|[0])$/,
                                        required: true,
                                        message: '请输入正确的会员有效期'
                                    }
                                ]
                            })(
                                <Input type='number'/>
                            )}

                        </FormItem>
                    )}


                    <FormItem{...formItemLayout} label="是否是会员" >
                        {getFieldDecorator('is_ck', {
                            initialValue: baseInfo.is_ck,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择是否是会员'

                                }
                            ]
                        })(
                            <RadioGroup defaultValue={baseInfo.is_ck}>
                                <Radio value="1">是</Radio>
                                <Radio value="0">否</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="限制会员数量" >
                        {getFieldDecorator('level_num', {
                            initialValue: baseInfo.level_num,
                            rules: [
                                {
                                    pattern: /^([1-9]\d*|[0])$/,
                                    required: true,
                                    message: '请输入正确的限制会员数量'
                                }
                            ]
                        })(
                            <Input type='number'/>
                        )}【0代表不限制】
                    </FormItem>
                    <FormItem
                    >
                    {/*<Button type="primary" className={styles.textMarin} onClick={add}>搜索</Button>*/}
                    {/*<Button type="primary" className={styles.textMarin} onClick={add}>导出</Button>*/}
                    </FormItem>
                </Form>
            </div>


        </Modal>
    )
        ;
};

hydj.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(hydj);
