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
import { Select, DatePicker, Modal, TimePicker } from 'antd';
import moment from 'moment';
import message from 'antd/lib/message';


// const dateFormat = 'YYYY-MM-DD';


const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const format = 'HH:mm';


// form表单
const LookInfoChangeTimeModal
  = ({
    form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
    }, dispatch, mdbdConfig
  }) => {

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    // modal点击取消,关闭modal,把时间重新重置到详情展示的时间
    function modalCancel(e) {

      let timeArray = [];
      if (mdbdConfig.currentStoreInfo.openTime.length > 0) {
        mdbdConfig.currentStoreInfo.openTime.map(function (item, index) {
          let obj = {};
          for (var key in item) {
            obj[key] = item[key]
          }
          timeArray.push(obj)
        })
      } else {
        timeArray.push({ startTime: "", endTime: "" })
      }


      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { LookInfoChangeTimeModalVisible: false, timeArray }
      })


    }

    // 时间控件相关操作开始========================================================================================
    // 改变开始时间
    function changeStartTime(index, time, timeString) {
      let timeArray = mdbdConfig.timeArray;
      timeArray[index].startTime = timeString;
      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { timeArray }
      })
    }

    // 改变结束时间
    function changeEndTime(index, time, timeString) {
      let timeArray = mdbdConfig.timeArray;
      timeArray[index].endTime = timeString;
      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { timeArray }
      })
    }

    // 点击添加营业时间
    function addTime() {
      let timeArray = mdbdConfig.timeArray;
      timeArray.push({ startTime: "", endTime: "" })
      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { timeArray }
      })
    }

    // 禁止选择部分小时选项
    function disabledHours(index) {
      //找到要对比的那一项时间数据,处理成[09,02],第一项是小时，第二项是分钟
      let startTimeIndexObjToArray = mdbdConfig.timeArray[index].startTime.split(":");
      let forbiddenHours = [];
      if (startTimeIndexObjToArray[0].startTime != "") {
        // 拿到开始时间的小时数
        let currentStartHour = parseInt(startTimeIndexObjToArray[0]);
        // 循环当前时间，如果小时小于当前小时则不让选择
        for (var i = 0; i < currentStartHour; i++) {
          if (i < currentStartHour) {
            forbiddenHours.push(i)
          }
        }
      }
      return forbiddenHours
    }

    // 禁止选择部分分钟选项,
    function disabledMinutes(index) {
      //找到要对比的那一项时间数据,处理成[09,02],第一项是小时，第二项是分钟
      let startTimeIndexObjToArray = mdbdConfig.timeArray[index].startTime.split(":");  //开始时间
      let endTimeIndexObjToArray = mdbdConfig.timeArray[index].endTime.split(":");  //结束时间
      let forbiddenMinutes = [];
      // 如果开始时间不等于“”才执行
      if (mdbdConfig.timeArray[index].startTime != "") {

        let currentStartHour = parseInt(startTimeIndexObjToArray[0]);  // 拿到开始时间的小时数
        let currentEndHour = parseInt(endTimeIndexObjToArray[0]);  // 拿到结束时间的小时数
        let currentStartMinutes = parseInt(startTimeIndexObjToArray[1]);  // 拿到开始时间的分钟数
        // let currentEndMinutes = parseInt(endTimeIndexObjToArray[1]);  // 拿到结束时间的分钟数
        // 如果结束时间小时数==开始时间小时数才需要禁止部分分钟选项
        if (currentEndHour == currentStartHour) {
          // 循环当前时间，如果小时小于当前小时则不让选择
          for (var i = 0; i <= currentStartMinutes; i++) {
            if (i <= currentStartMinutes) {
              forbiddenMinutes.push(i)
            }
          }
        }
      }
      return forbiddenMinutes
    }

    // 删除对应的timePicker
    function delTimePicker(index) {
      let timeArray = mdbdConfig.timeArray;
      if (timeArray.length == 1) {
        message.error("至少保留一组营业时间！");
        return
      }
      // start:开始位置  deleteCount:删除的个数,原数组会发生改变
      timeArray.splice(index, 1);
      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { timeArray }
      })

    }
    // 时间控件相关操作结束============================================================================================


    // 点击确认
    function sureSubmit() {
      validateFields((errors) => {
        if (!!errors) {
          return false;
        }
        // 验证营业时间是否都填写了
        let timeArray = mdbdConfig.timeArray;
        for (var i = 0; i < timeArray.length; i++) {
          for (var key in timeArray[i]) {
            if (timeArray[i][key] == "") {
              message.error("请将营业时间填写完整！");
              return
            }
          }
        }

        // 调用保存接口
        dispatch({
          type: 'mdbdConfig/changeStoreTime',
          payload: { platformType: mdbdConfig.currentPlatformType, sellTimes: timeArray },
        });
      })
    }


    return (
      <Modal
        title="升级信息"
        visible={mdbdConfig.LookInfoChangeTimeModalVisible}
        onCancel={modalCancel}
        destroyOnClose={true} // 关闭时销毁 Modal 里的子元素,重置modal
        footer={null}  //禁用modal自己底部的按钮
      >

        {/* horizontal */}
        <Form style={{ lineHeight: "20px", height: "350px", overflowY: "scroll" }}>

          <Form.Item
            {...formItemLayout}
            label="修改营业时间"
          >
            {getFieldDecorator('storeName', {
              initialValue: mdbdConfig.currentStoreInfo.name,
              rules: [
                { required: true, message: '请选择门店名称' }
              ],
            })(
              <Input disabled={true} style={{ width: "100%" }} />
            )}
          </Form.Item>

          {mdbdConfig.timeArray.length > 0 &&
            <div>
              {mdbdConfig.timeArray.map(function (item, index) {
                return <Row key={index} style={{ padding: "10px 0" }}>
                  <Col span="6" style={{ textAlign: "right", lineHeight: "32px" }}>营业时间{index + 1}：</Col>
                  <Col span="7">
                    <TimePicker onChange={(time, timeString) => { changeStartTime(index, time, timeString) }}
                      value={item.startTime == "" ? null : moment(item.startTime, 'HH:mm')} format='HH:mm' />
                  </Col>
                  <Col style={{ textAlign: "center" }} span="1">~</Col>
                  <Col span="7">
                    <TimePicker
                      disabled={mdbdConfig.timeArray[index].startTime == "" ? true : false}  //必须选完第一个timePicker第二个才能选
                      disabledHours={() => disabledHours(index)}  //禁止选择部分小时选项
                      disabledMinutes={() => disabledMinutes(index)}  //禁止选择部分分钟选项
                      onChange={(time, timeString) => { changeEndTime(index, time, timeString) }}
                      value={item.endTime == "" ? null : moment(item.endTime, 'HH:mm')} format='HH:mm' />
                  </Col>
                  <Col><a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => { delTimePicker(index) }}>删除</a></Col>
                </Row>
              })
              }
            </div>
          }

          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <a href="javascript:;" style={{ textDecoration: "none" }} onClick={addTime}>+添加营业时间</a>
          </div>
        </Form>
        <div style={{ textAlign: "center" }}>
          <Button style={{ margin: "0 10px" }} type="primary" onClick={sureSubmit}>确认升级</Button>
          <Button style={{ margin: "0 10px" }} type="default" onClick={modalCancel}>取消</Button>
        </div>
      </Modal>

    );

  }

LookInfoChangeTimeModal
  .propTypes = {
    form: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    field: PropTypes.string,
    keyword: PropTypes.string,
  };


export default Form.create()(LookInfoChangeTimeModal
);
