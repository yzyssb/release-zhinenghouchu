import React, { PropTypes } from 'react';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Switch from 'antd/lib/switch';
import Tree from 'antd/lib/tree';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Form from 'antd/lib/form';
import Collapse from 'antd/lib/collapse';
import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
import styles from "./CzmxPage.less";

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;


// form表单
const Registration = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, zcglPageConfig
}) => {
  const that = this;

  //点击取消隐藏弹框
  function handleCancel() {
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { visible: false }
    });
    // 充值所有组件
    resetFields()

  }
  // 点击确认按钮
  function handleOk() {
    console.log("okkkk")

    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      // 验证通过后执行的逻辑接着执行筛选的样式
    })
  }


  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  const formItemLayoutDataPicker = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  };

  // 
  function changeDiscount(e) {
    console.log(e.target.value)

    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { userName: e.target.value }
    });
  }



  //select得到用户的选中值
  function ChangeSelect(value) {
    console.log(`selected ${value}`);
  }


  // //日期改变时
  // function onChange(dates, dateStrings) {
  //     console.log('From: ', dates[0], ', to: ', dates[1]);
  //     console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  // }

  // function callback(key) {
  //     console.log(key);
  // }


  // function submit() {
  //     console.log(123131)
  // }



  // // 是否显示折扣率
  // let zhekoulv = "jack";

  // let display = zhekoulv == "jack" ? "block" : "none"


  // 模拟tree 


  let treeData =[
        { title: 'Expand to load', key: '0', son: [{ title: 'Expand to loadzi1', key: '0' }, { title: 'Expand to loadzi2', key: '0' }, { title: 'Expand to loadzi3', key: '0' }] },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true }
    ];

  // 鼠标点击切换
  function togleShow(index) {
    treeData[index].display == "block" ? treeData[index].display = "none" : treeData[index].display = "block";
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { treeData: treeData }
    });
  }












  return (
    <Modal
      width="800px"
      visible={false}
      title="编辑折扣方式"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.modalContent} >
        <Form horizontal>
          <Form.Item
            {...formItemLayout}
            label="折扣类型"
            >
            {getFieldDecorator('type', {
              initialValue: '1',
              rules: [{
                required: true, message: '',
              }],
            })(
              <Select style={{ width: "100%" }} onChange={ChangeSelect}>
                <Option value="1" >全单折扣</Option>
                <Option value="2">方案折扣</Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="折扣名称"
            >
            {getFieldDecorator('discountName', {
              initialValue: '',
              rules: [{
                required: true, message: '请输入折扣名称',
              }],
            })(
              <Input onChange={changeDiscount} />
            )}
          </Form.Item>

          <Form.Item
            {...formItemLayout}
            label="折扣率"
            >
            {getFieldDecorator('discountRate', {
              initialValue: '',
              rules: [{
                required: true, message: '请输入折扣率',
              }],
            })(
              <Input style={{ width: "100%" }} addonAfter="%" placeholder="支持0-100的整数，输入80即为打8折" />
            )}
          </Form.Item>
          <FormItem
            {...formItemLayoutDataPicker}
            label="有效期"
          >
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked={false} />

          </FormItem>


          <Row style={{ width: "70%", lineHeight: "40px", background: "red", margin: "0 auto", textAlign: "center", height: "40px", background: "#eee", fontSize: "14px" }}>
            <Col span="10">菜品名称</Col>
            <Col span="8" offset="6">折扣比例</Col>
          </Row>

          {/* 折叠面板部分 */}
          <div className={styles.treeView}>
            {
              treeData.map(function (item, index) {
                return (
                  <div key={index}>
                    <Row key={[index]} data-index={[index]} style={{ padding: "5px 0" }} >

                      <Col span="1" onClick={() => { togleShow([index]) }}> <Icon type="caret-right" /></Col>
                      <Col span="15">{item.title}</Col>
                      <Col span="6"> <Input addonAfter="%" placeholder="支持0-100的整数，输入80即为打8折" /></Col>
                      <Col span="2" style={{ textAlign: "center", cursor: "pointer", color: "blue" }}>清空</Col>
                    </Row>

                    <div style={{ display: item.display }}>
                      {item.son && item.son.map(function (ele, key) {
                        return (
                          <Row key={[index, key]} data-index={[index, key]} style={{ padding: "5px 0" }}>
                            <Col span="14" offset="2" >{ele.title}</Col>
                            <Col span="6"> <Input addonAfter="%" placeholder="支持0-100的整数，输入80即为打8折" /></Col>
                            <Col span="2" style={{ textAlign: "center", cursor: "pointer", color: "blue" }}>清空</Col>
                          </Row>)
                      })}
                    </div>

                  </div>
                )
              })
            }

          </div>




          {/* {html} */}
        </Form>
      </div>

    </Modal>


  );

}
Registration.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

// const RegistrationForm = Form.create()(Registration);


export default Form.create()(Registration);
