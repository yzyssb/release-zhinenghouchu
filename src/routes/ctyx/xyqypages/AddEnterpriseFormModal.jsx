import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { Select, DatePicker, Modal } from 'antd';
import moment from "moment";


const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


const RadioGroup = Radio.Group;
const FormItem = Form.Item;


// form表单
const AddEnterpriseFormModal
    = ({
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
        }, dispatch, xyqyConfig
    }) => {

        // if (xyqyConfig.isResetForm) {
        //     setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
        // }
        // function resetFormTimeout(resetFields, dispatch) {
        //     if (resetFields) {
        //         resetFields();
        //     }
        //     if (dispatch) {
        //         dispatch({
        //             type: 'xyqyConfig/updatePayload',
        //             payload: { isResetForm: false }
        //         });
        //     }
        // }


        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };


        // 点击查询把获取到的查询条件更新给filterConditions,重置请求第一页,然后调用请求接口
        // function sureSubmit() {
        //     validateFields((errors) => {
        //         if (!!errors) {
        //             return false;
        //         }

        //         dispatch({
        //             type: "xyqyConfig/saveEnterprise",
        //             payload: getFieldsValue()
        //         })
        //     })
        // }

        // 每次关闭modal时清空当前存储的数据
        function handleCancel() {
            dispatch({
                type: "xyqyConfig/updatePayload",
                payload: {
                    enterpriseVisible: false, currentEnterPrise: {}, way: ""
                }
            })
        }


        return (

            <Modal
                title="添加企业"
                visible={xyqyConfig.enterpriseVisible}
                // footer={null}
                onCancel={handleCancel}
                // onOk={sureSubmit}
                // width={1200}
                footer={null}
                destroyOnClose={true}
            >

                <Form style={{ lineHeight: "20px" }}>

                    <div
                        style={{ borderBottom: "2px solid #0F8FEA", marginBottom: "25px", color: "#0F8FEA", lineHeight: "30px" }}>
                        基本信息
                </div>
                    <Form.Item {...formItemLayout} label="企业简称" extra="建议填写企业简称">
                        {getFieldDecorator('companyName', {
                            initialValue: xyqyConfig.currentEnterPrise.companyName ? xyqyConfig.currentEnterPrise.companyName : "",
                            rules: [{
                                required: true, message: '请输入企业简称!',
                            },
                            { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                            ],
                        })(
                            <Input maxLength={15} style={{ height: "32px", width: "100%" }} disabled={true}/>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="联系人">
                        {getFieldDecorator('linkman', {
                            initialValue: xyqyConfig.currentEnterPrise.linkman ? xyqyConfig.currentEnterPrise.linkman : "",
                            rules: [
                                // { required: true, message: '请输入联系人!' },
                                { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                            ],
                        })(
                            <Input maxLength={15} style={{ height: "32px", width: "100%" }} disabled={true}/>
                        )}
                    </Form.Item>

                    <Form.Item {...formItemLayout} label="电话">
                        {getFieldDecorator('phone', {
                            initialValue: xyqyConfig.currentEnterPrise.phone ? xyqyConfig.currentEnterPrise.phone : "",
                            rules: [
                                // { required: true, message: '请输入电话!' },
                                { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                                // { pattern: /^[1][1-9][0-9]{9}$/, message: "请输入有效手机号码!" }
                                { pattern: /^[1][1-9][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/, message: "请输入有效号码!" }
                            ],
                        })(
                            <Input style={{ height: "32px", width: "100%" }} disabled={true}/>
                        )}
                    </Form.Item>

                    <div
                        style={{ borderBottom: "2px solid #0F8FEA", marginBottom: "25px", color: "#0F8FEA", lineHeight: "30px" }}>
                        设置折扣
                    <span style={{ color: "#999" }}>(在原价基础上进行折扣)</span>
                    </div>


                    <Form.Item {...formItemLayout} label="堂食折扣">
                        {getFieldDecorator('inDiscount', {
                            initialValue: xyqyConfig.way == "add" ? 100 : (xyqyConfig.currentEnterPrise.inDiscount ? xyqyConfig.currentEnterPrise.inDiscount : ""),
                            rules: [{
                                required: true, message: '请输入堂食折扣!',
                            },
                            { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                            { pattern: /^([1-9]\d{0,1}?|100)$/, message: "请输入正确的折扣比例！" }
                            ],
                        })(
                            <Input style={{ height: "32px", width: "100%" }} addonAfter="%" disabled={true}/>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="打包外带折扣">
                        {getFieldDecorator('outDiscount', {
                            initialValue: xyqyConfig.way == "add" ? 100 : (xyqyConfig.currentEnterPrise.outDiscount ? xyqyConfig.currentEnterPrise.outDiscount : ""),
                            rules: [{
                                required: true, message: '请输入打包外带折扣!',
                            },
                            { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                            { pattern: /^([1-9]\d{0,1}?|100)$/, message: "请输入正确的折扣比例！" }
                            ],
                        })(
                            <Input style={{ height: "32px", width: "100%" }} addonAfter="%" disabled={true}/>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="自营外卖折扣">
                        {getFieldDecorator('takeoutDiscount', {
                            initialValue: xyqyConfig.way == "add" ? 100 : (xyqyConfig.currentEnterPrise.takeoutDiscount ? xyqyConfig.currentEnterPrise.takeoutDiscount : ""),
                            rules: [{
                                required: true, message: '请输入自营外卖折扣!',
                            },
                            { pattern: /^[^ ]+$/, message: "请勿输入空格！" },
                            { pattern: /^([1-9]\d{0,1}?|100)$/, message: "请输入正确的折扣比例！" }
                            ],
                        })(
                            <Input style={{ height: "32px", width: "100%" }} addonAfter="%" disabled={true} />
                        )}
                    </Form.Item>

                </Form>
            </Modal>

        );

    }

AddEnterpriseFormModal
    .propTypes = {
        form: PropTypes.object.isRequired,
        onSearch: PropTypes.func,
        onAdd: PropTypes.func,
        field: PropTypes.string,
        keyword: PropTypes.string,
    };


export default Form.create()(AddEnterpriseFormModal
);
