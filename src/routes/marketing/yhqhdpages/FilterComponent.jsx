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
import Select from 'antd/lib/select';
const Option = Select.Option;


const RadioGroup = Radio.Group;
const FormItem = Form.Item;


// form表单
const FilterComponent
    = ({
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
        }, dispatch, yhqhdConfig
    }) => {



        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };



        // 优惠券名称改变
        function changeName(e) {
            let filterConditions = yhqhdConfig.filterConditions;
            // 如果通过验证则赋值
            let reg = /^[^ ]+$/;
            if (reg.test(e.target.value)) {
                filterConditions.name = e.target.value;
            } else {
                filterConditions.name = "";
            }
            dispatch({
                type: "yhqhdConfig/updatePayload",
                payload: {
                    filterConditions
                }
            })
        }




        // 优惠券类型改变
        function changeCouponType(e) {
            let filterConditions = yhqhdConfig.filterConditions;
            filterConditions.couponType = e;
            dispatch({
                type: "yhqhdConfig/updatePayload",
                payload: {
                    filterConditions
                }
            })
        }


        // 状态改变
        function changeStatus(e) {
            console.log(e)
            let filterConditions = yhqhdConfig.filterConditions;
            filterConditions.status = e;
            dispatch({
                type: "yhqhdConfig/updatePayload",
                payload: {
                    filterConditions
                }
            })
        }
        // 点击查询把获取到的查询条件更新给filterConditions,重置请求第一页,然后调用请求接口
        function sureSubmit() {
            validateFields((errors) => {
                if (!!errors) {
                    return false;
                }
                // 更新数据
                dispatch({
                    type: 'yhqhdConfig/updatePayload',
                    payload: { offset: 0, filterConditions: getFieldsValue() },
                });
                // 调用请求列表接口
                dispatch({
                    type: 'yhqhdConfig/query',
                    payload: {},
                });
            })
        }

        // 重置过滤条件
        function initFilter() {
            // 重置表单数据 把重置后的数据更新
            resetFields();
            //重置条件更新数据
            dispatch({
                type: 'yhqhdConfig/updatePayload',
                payload: { filterConditions: getFieldsValue() },
            });

            // 请求列表数据
            dispatch({
                type: 'yhqhdConfig/query',
                payload: {},
            });

        }

        return (

            <Form style={{ lineHeight: "20px" }}>
                <Row style={{ background: "#eee", height: "50px", marginBottom: "20px" }}>
                    <FormItem >
                        <Col span="5" style={{ fontWeight: "700", lineHeight: "50px", textIndent: '10px' }}>查询条件</Col>
                        <Col span="2" offset="15" >
                            <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="primary" htmlType="submit" onClick={sureSubmit}>查询</Button>
                        </Col>
                        <Col span="2" >
                            <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="default" htmlType="submit" onClick={initFilter}>重置条件</Button>
                        </Col>
                    </FormItem>
                </Row>
                <Row>

                    <Col span={6}>
                        <Form.Item
                            {...formItemLayout}
                            label="优惠券名称"
                        >
                            {getFieldDecorator('name', {
                                initialValue: "",
                                rules: [
                                    { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
                            })(
                                <Input style={{ width: "100%", height: "32px" }} onChange={changeName} />
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            {...formItemLayout}
                            label="优惠券类型"
                        >
                            {getFieldDecorator('couponType', {
                                initialValue: "",
                            })(
                                <Select placeholder="请选择优惠券类型" onChange={changeCouponType}>
                                    <Option value="">全部类型</Option>
                                    <Option value={1}>代金券</Option>
                                    <Option value={2}>菜品</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col span={6}>
                        <Form.Item
                            {...formItemLayout}
                            label="状态"
                        >
                            {getFieldDecorator('status', {
                                initialValue: "",
                            })(
                                <Select placeholder="请选择状态" onChange={changeStatus}>
                                    <Option value="">全部状态</Option>
                                    <Option value={1}>启用</Option>
                                    <Option value={2}>终止</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                </Row>


            </Form>);

    }

FilterComponent
    .propTypes = {
        form: PropTypes.object.isRequired,
        onSearch: PropTypes.func,
        onAdd: PropTypes.func,
        field: PropTypes.string,
        keyword: PropTypes.string,
    };


export default Form.create()(FilterComponent
);
