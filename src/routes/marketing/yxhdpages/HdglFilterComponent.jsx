import React, { PropTypes } from 'react';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Select from 'antd/lib/select';
const Option = Select.Option;
 

// form表单
const HdglFilterComponent= ({
        form: {
            getFieldDecorator,
            validateFields,
            getFieldsValue,
            resetFields,
        }, dispatch, hdglConfig 
    }) => { 

        const formItemLayout = {
            labelCol: { span: 10 },   
            wrapperCol: { span: 14 },  
        };

  
 
        // 活动名称改变 
        function changeCouponName(e) {
            let filterConditions = hdglConfig.filterConditions;
            // 如果通过验证则赋值
            let reg = /^[^ ]+$/;
            if (reg.test(e.target.value)) {
                filterConditions.couponName = e.target.value;
            } else {
                filterConditions.couponName = "";
            }
            dispatch({
                type: "hdglConfig/updatePayload",
                payload: {
                    filterConditions
                }
            })
        }


        // 状态改变
        function changeState(e) {
            console.log(e)
            let filterConditions = hdglConfig.filterConditions;
            filterConditions.state = e;
            dispatch({
                type: "hdglConfig/updatePayload",
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
                    type: 'hdglConfig/updatePayload',
                    payload: { offset: 0, filterConditions: getFieldsValue() },
                });
                // 调用请求列表接口
                dispatch({
                    type: 'hdglConfig/query',
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
                type: 'hdglConfig/updatePayload',
                payload: { filterConditions: getFieldsValue()},
            });

            // 请求列表数据
            dispatch({
                type: 'hdglConfig/query',
                payload: {},
            });

        }

        return (
            <div>
                <Row style={{ background: "#eee", height: "50px", marginBottom: "20px" }}>
                        <Col span="5" style={{ fontWeight: "700", lineHeight: "50px", textIndent: '10px' }}>查询条件</Col>
                        <Col span="2" offset="15" >
                            <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="primary" htmlType="submit" onClick={sureSubmit}>查询</Button>
                        </Col>
                        <Col span="2" >
                            <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="default" htmlType="submit" onClick={initFilter}>重置条件</Button>
                        </Col>
                </Row>
                <Form layout="inline" style={{ lineHeight: "20px" }}>

                            <Form.Item
                                {...formItemLayout}
                                label="活动名称"
                            >
                                {getFieldDecorator('couponName', {
                                    initialValue: "",
                                    rules: [
                                        { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
                                })(
                                    <Input style={{ width: "100%", height: "32px" }} onChange={changeCouponName} />
                                )}
                            </Form.Item>



                            <Form.Item
                                {...formItemLayout}
                                label="状态"
                            >
                                {getFieldDecorator('state', {
                                    initialValue: "",
                                })(
                                    <Select placeholder="请选择状态" onChange={changeState} style={{ width: "200px", height: "32px" }}>
                                        <Option value="">全部状态</Option>
                                        <Option value={1}>启用</Option>
                                        <Option value={2}>终止</Option>
                                    </Select>
                                )}
                            </Form.Item>
                       


                </Form>
            </div>

           );

    }

HdglFilterComponent.propTypes = {
        form: PropTypes.object.isRequired,
        onSearch: PropTypes.func,
        onAdd: PropTypes.func,
        field: PropTypes.string,
        keyword: PropTypes.string,
    };


export default Form.create()(HdglFilterComponent);
