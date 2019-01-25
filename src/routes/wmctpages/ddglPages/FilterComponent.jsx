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
import { Select, DatePicker } from 'antd';
import moment from "moment";


const RangePicker = DatePicker.RangePicker;
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
    }, dispatch, ddglConfig
  }) => {

    if (ddglConfig.isResetForm) {
      setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
    }
    function resetFormTimeout(resetFields, dispatch) {
      if (resetFields) {
        resetFields();
      }
      if (dispatch) {
        dispatch({
          type: 'ddglConfig/updatePayload',
          payload: { isResetForm: false }
        });
      }
    }



    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };


    // 点击查询把获取到的查询条件更新给filterConditions,重置请求第一页,然后调用请求接口
    function sureSubmit() {
      validateFields((errors) => {
        if (!!errors) {
          return false;
        }

        // 更新数据
        dispatch({
          type: 'ddglConfig/updatePayload',
          payload: { offset: 0, current: 1 },
        });

        // 调取tab列表数据
        dispatch({
          type: "ddglConfig/query",
          payload: {}
        })
        // 调取订单列表数据
        dispatch({
          type: "ddglConfig/getOrderList",
          payload: {}
        })

      })
    }


    // 重置条件
    function resetFilter() {
      dispatch(routerRedux.push({
        pathname: "/ddgl",
        query: {} //传入对应的平台类型
      }));
    }


    // 改变订单状态
    function changecompanyid(e) {
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.orderStatus = e;
      dispatch({
        type: 'ddglConfig/updatePayload',
        payload: { filterConditions }
      });
    }

    // 下单时间---改变日期
    function changeDate(date, dateString) {
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.startTime = dateString[0] == "" ? "" : new Date(dateString[0]).getTime();  //有效期开始时间 
      filterConditions.endTime = dateString[1] == "" ? "" : new Date(dateString[1]).getTime(); // 有效期结束时间 ,
      filterConditions.selectTime = null;
      dispatch({
        type: "ddglConfig/updatePayload",
        payload: {
          filterConditions,
          isResetForm: true
        }
      })
    }


    // 下单时间---时间戳点击确定
    function rangePickerOk(value) {
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.endTime = new Date(value[1].format("YYYY-MM-DD HH:mm:ss")).getTime();// 有效期结束时间 ,
      filterConditions.startTime = new Date(value[0].format("YYYY-MM-DD HH:mm:ss")).getTime(); //有效期开始时间 ,
      filterConditions.selectTime = null;
      dispatch({
        type: "ddglConfig/updatePayload",
        payload: {
          filterConditions,
          isResetForm: true
        }
      })

    }

    // 改变外卖平台
    function changePlatform(e) {
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.platform = e;
      dispatch({
        type: 'ddglConfig/updatePayload',
        payload: { filterConditions }
      });
    }

    // 手机号改变
    function changeSeq(e) {
      let filterConditions = ddglConfig.filterConditions;
      // 如果手机号通过验证则赋值
      let reg = /^[1-9]{1}[0-9]*$/;
      if (reg.test(e.target.value)) {
        filterConditions.daySeq = e.target.value;
      } else {
        filterConditions.daySeq = "";
      }

      
      dispatch({
        type: "ddglConfig/updatePayload",
        payload: {
          filterConditions
        }
      })
    }


    // 改变配送状态
    function changeDeliveryStatus(e) {
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.deliveryStatus = e;
      dispatch({
        type: 'ddglConfig/updatePayload',
        payload: { filterConditions }
      });
    }

    // 选择时间跨度
    function changeTimeSelect(e) {
      if (e == null) {  //null代表选中了"选择时间跨度一项"
        return;
      }

      let startTime;
      if (e == 0 || e == 1) { //今天
        startTime = new Date().setHours(0, 0, 0, 0) - (e * 24 * 60 * 60 * 1000);
      } else {
        startTime = new Date().setHours(0, 0, 0, 0) - ((e - 1) * 24 * 60 * 60 * 1000);
      }

      let endTime;
      if (e == 1) { //只有等于昨天的时候结束时间是昨天的23：59：59
        endTime = new Date().setHours(23, 59, 59, 0) - e * (1 * 24 * 60 * 60 * 1000)
      } else {
        endTime = new Date().setHours(23, 59, 59, 0);
      }
      let filterConditions = ddglConfig.filterConditions;
      filterConditions.selectTime = e;
      filterConditions.endTime = endTime;
      filterConditions.startTime = startTime;
      console.log(startTime, "==============", endTime)
      dispatch({
        type: "ddglConfig/updatePayload",
        payload: {
          filterConditions,
          isResetForm: true
        }
      })
    }



    return (
      <Form horizontal style={{ lineHeight: "20px" }}>
        <Row style={{ background: "#eee", height: "50px", marginBottom: "20px" }}>
          <FormItem >
            <Col span="2" style={{ fontWeight: "700", lineHeight: "50px", textIndent: '10px' }}>查询条件</Col>
            <Col span="2" offset="18">
              <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="default" onClick={resetFilter}>重置</Button>
            </Col>

            <Col span="2" >
              <Button style={{ float: "right", marginTop: "10px", marginRight: "10px" }} type="primary" onClick={sureSubmit}>查询</Button>
            </Col>
          </FormItem>
        </Row>

        <Row>
          <Col span={6} >
            <Form.Item
              {...formItemLayout}
              label="订单状态"
            >
              {getFieldDecorator('orderStatus', {
                initialValue: ddglConfig.filterConditions.orderStatus,
              })(
                <Select placeholder="请选择订单状态" onChange={changecompanyid}>
                  {/* <Option value={0}>全部订单状态</Option> */}
                  {ddglConfig.filterOrderStatusList.length > 0 &&
                    ddglConfig.filterOrderStatusList.map(function (item, index) {
                      return <Option key={item.value} value={item.value}>{item.label}</Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col span={9}>
            <Form.Item  {...formItemLayout} label="下单时间">
              {getFieldDecorator('dateRanger', {
                initialValue: [moment(new Date(ddglConfig.filterConditions.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(new Date(ddglConfig.filterConditions.endTime), 'YYYY-MM-DD HH:mm:ss')],
                rules: [{
                  required: true, message: '请选择下单时间！'
                }],
              })(
                <RangePicker allowClear={false} showTime onChange={changeDate} format="YYYY-MM-DD HH:mm:ss" onOk={rangePickerOk} />
              )}
            </Form.Item>
          </Col>

          <Col span={3} style={{ lineHeight: "40px" }} >
            <Select value={ddglConfig.filterConditions.selectTime} onChange={changeTimeSelect} placeholder="请选择时间跨度">
              {ddglConfig.filterSelectTimeList.length > 0 &&
                ddglConfig.filterSelectTimeList.map(function (item, index) {
                  return <Option key={item.value} value={item.value}>{item.label}</Option>
                })
              }
            </Select>
          </Col>


        </Row>

        <Row>
          <Col span={6}>
            <Form.Item
              {...formItemLayout}
              label="平台流水号"
            >
              {getFieldDecorator('daySeq', {
                initialValue: "",
                rules: [
                  { pattern: /^[1-9]{1}[0-9]*$/, message: "请输入正确的平台流水号!" }
                ],
              })(
                <Input style={{ width: "100%", height: "32px" }} onChange={changeSeq} />
              )}
            </Form.Item>
          </Col>

          <Col span={9} >
            <Form.Item
              {...formItemLayout}
              label="配送状态"
            >
              {getFieldDecorator('deliveryStatus', {
                initialValue: ddglConfig.filterConditions.deliveryStatus,
              })(
                <Select placeholder="请选择配送状态" onChange={changeDeliveryStatus}>
                  {/* <Option value={0}>全部配送状态</Option> */}
                  {ddglConfig.filterOrderDeliveryStatusList.length > 0 &&
                    ddglConfig.filterOrderDeliveryStatusList.map(function (item, index) {
                      return <Option key={item.value} value={item.value}>{item.label}</Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
          </Col>

          <Col span={9}  >
            <Form.Item
              {...formItemLayout}
              label="外卖平台"
            >
              {getFieldDecorator('platform', {
                initialValue: ddglConfig.filterConditions.platform,
              })(
                <Select placeholder="请选择外卖平台" onChange={changePlatform}>
                  <Option value={0}>全部外卖平台</Option>
                  {ddglConfig.filterOrderPlatformList.length > 0 &&
                    ddglConfig.filterOrderPlatformList.map(function (item, index) {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    })
                  }
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
