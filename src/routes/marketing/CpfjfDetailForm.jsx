import React, { PropTypes } from 'react';
import Header from '../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import TimePicker from 'antd/lib/time-picker';
const { TextArea } = Input;

// import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
// import moment from 'moment';


const RadioGroup = Radio.Group;
const FormItem = Form.Item;

import Checkbox from 'antd/lib/checkbox';
// import { RangePicker } from 'antd/lib/date-picker';
const CheckboxGroup = Checkbox.Group;

import DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
import Modal from 'antd/lib/modal';


// form表单
const CpfjfEditDetail = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, cpfjfDetailConfig
}) => {

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };

  // 选星期几时的选项
  const options = [
    { label: '星期日', value: '1' },
    { label: '星期一', value: '2' },
    { label: '星期二', value: '3' },
    { label: '星期三', value: '4' },
    { label: '星期四', value: '5' },
    { label: '星期五', value: '6' },
    { label: '星期六', value: '7' },

  ];

  // 改变时间类型清空所有的时间数据
  function changeTimeType(e) {
    dispatch({
      type: 'cpfjfDetailConfig/updatePayload',
      payload: {
        timeRadio: e.target.value,
        activity_starttime: "",
        activity_endtime: "",
        in_day: "",  //清空日子
        in_week: []  //清空周
      }
    });
  }

  // 判断初始时间怎么显示,当时间值存在和不存在的时候分别怎么显示
  let rangPickerinitialValue;
  if (cpfjfDetailConfig.activity_starttime == "" && cpfjfDetailConfig.activity_endtime == "") {
    rangPickerinitialValue = ""
  } else {
    rangPickerinitialValue = [moment(cpfjfDetailConfig.activity_starttime, 'YYYY-MM-DD HH:mm:ss'), moment(cpfjfDetailConfig.activity_endtime, 'YYYY-MM-DD HH:mm:ss')];
  }

  // 修改时间
  function onSearchDateChange(dates) {

    dispatch({
      type: 'cpfjfDetailConfig/updatePayload',
      payload: {
        activity_starttime: dates[0].format('YYYY-MM-DD HH:mm:ss'), //2018-05-24 00:00:04格式的
        activity_endtime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      }
    });


  };

  // 会员切换是否参与活动
  function changeMemberTakeIn(e) {
    dispatch({
      type: 'cpfjfDetailConfig/updatePayload',
      payload: {
        memberTakeIn: e.target.value
      }
    });

  }


  // 非会员切换是否参与活动
  function changeDismemberTakeIn(e) {
    dispatch({
      type: 'cpfjfDetailConfig/updatePayload',
      payload: {
        dismemberTakeIn: e.target.value
      }
    });
  }

  // storeModal开始==============================================================================================================================
  const storeColumns = [
    {
      title: '序号',
      dataIndex: 'tableName',
      key: 'tableName',
      render: function (text, record, index) {
        return index + 1
      }
    }, {
      title: '店名',
      dataIndex: 'name',
      key: 'name',
    }
  ];

  // 展示门店列表modal
  function showStoreListModal() {
    console.log("展示store")
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        storeModalVisible: true
      }
    })
  }

  // 门店modal点击ok,把临时选中的项给sureStoreSelectedRowKeys,并且关闭modal
  function storeHandleOk(data) {
    let storeids = "";
    // 循环所有的storeList和选中的id,如果相等就存储起来名字并展示在页面上
    if (cpfjfDetailConfig.storeList.length > 0 && cpfjfDetailConfig.storeSelectedRowKeys.length > 0) {
      cpfjfDetailConfig.storeList.map(function (item, index) {
        for (var i = 0; i < cpfjfDetailConfig.storeSelectedRowKeys.length; i++) {
          if (item.id == cpfjfDetailConfig.storeSelectedRowKeys[i]) {
            storeids += item.name + ","
          }
        }
      })
    } else {
      storeids = ""
    }
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        storeModalVisible: false,
        storeInitSelectedRowKeys: cpfjfDetailConfig.storeSelectedRowKeys,
        storeids: storeids,
        // isResetForm:false
      }
    })

    // 重置门店input
    resetFields("storeids")
  }


  // 门店modal点击cancle取消,需要把storeInitSelectedRowKeys回到storeInitSelectedRowKeys的状态
  function storeHandleCancel() {
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        storeModalVisible: false,
        storeSelectedRowKeys: cpfjfDetailConfig.storeInitSelectedRowKeys  //点击取消让选中的值回到初始的状态点击取消清空选中的
      }
    })
  }

  // 初始化和改变选项
  const storeRowSelection = {
    selectedRowKeys: cpfjfDetailConfig.storeSelectedRowKeys,  //指定选中项的项,这个对应的不是数组的index,而是数据的id
    // 改变时把选中的值赋给
    onChange: function (selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys)   //选中的key
      // console.log(selectedRows)  //选中的数据是哪一条
      dispatch({
        type: "cpfjfDetailConfig/updatePayload",
        payload: { storeSelectedRowKeys: selectedRowKeys }
      });
    },
    hideDefaultSelections: true, //去掉『全选』『反选』两个默认选项
  }


  // 产品列表modal开始==========================================================================================================================
  const goodColumns = [
    {
      title: '序号',
      dataIndex: 'tableName',
      key: 'tableName',

      render: function (text, record, index) {
        return index + 1
      }
    }, {
      title: '产品',
      dataIndex: 'name',
      key: 'name',

    }
  ];

  // 展示食品列表modal
  function showGoodListModal() {
    console.log("展示good")
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        goodModalVisible: true
      }
    })
  }

  // 门店modal点击ok,把临时选中的项给suregoodSelectedRowKeys,并且关闭modal
  function goodHandleOk(data) {
    let goodids = "";
    // 循环所有的goodList和选中的id,如果相等就存储起来名字并展示在页面上
    if (cpfjfDetailConfig.goodList.length > 0 && cpfjfDetailConfig.goodSelectedRowKeys.length > 0) {
      cpfjfDetailConfig.goodList.map(function (item, index) {
        for (var i = 0; i < cpfjfDetailConfig.goodSelectedRowKeys.length; i++) {
          if (item.id == cpfjfDetailConfig.goodSelectedRowKeys[i]) {
            goodids += item.name + ","
          }
        }
      })
    } else {
      goodids = ""
    }
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        goodModalVisible: false,
        goodInitSelectedRowKeys: cpfjfDetailConfig.goodSelectedRowKeys,
        goodids: goodids,
        // isResetForm: true
      }
    })

    // 重置产品input
    resetFields("goodids")
  }


  // 门店modal点击cancle取消,需要把goodInitSelectedRowKeys回到goodInitSelectedRowKeys的状态
  function goodHandleCancel() {
    dispatch({
      type: "cpfjfDetailConfig/updatePayload",
      payload: {
        goodModalVisible: false,
        goodSelectedRowKeys: cpfjfDetailConfig.goodInitSelectedRowKeys  //点击取消让选中的值回到初始的状态点击取消清空选中的
      }
    })
  }

  // 初始化和改变选项
  const goodRowSelection = {
    selectedRowKeys: cpfjfDetailConfig.goodSelectedRowKeys,  //指定选中项的项,这个对应的不是数组的index,而是数据的id
    // 改变时把选中的值赋给
    onChange: function (selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys)   //选中的key
      // console.log(selectedRows)  //选中的数据是哪一条
      dispatch({
        type: "cpfjfDetailConfig/updatePayload",
        payload: { goodSelectedRowKeys: selectedRowKeys }
      });
    },
    hideDefaultSelections: true, //去掉『全选』『反选』两个默认选项
  }




  // 点击提交表单
  function sureSubmit() {
    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      // 验证通过后执行的逻辑接着执行筛选的样式
      console.log("执行自己的逻辑")
      console.log(getFieldsValue())

      // 更新数据
      dispatch({
        type: "cpfjfDetailConfig/updatePayload",
        payload: { getFieldsValue: getFieldsValue() }
      })

      // 调用保存接口
      dispatch({
        type: "cpfjfDetailConfig/saveEdit",
        payload: {}
      })

    })
  }


  // 点击取消回到列表页
  function quxiao() {
    // 跳转页面到列表页
    dispatch(routerRedux.push({
      pathname: '/cpfjf',
      query: {},
    }));
  }


  return (

    <div>

      <div style={{ textAlign: 'left', marginBottom: "20px", background: "#f8f8f8", lineHeight: "40px", marginTop: "20px", fontWeight: 700, textIndent: "10px" }}>积分基本详情</div>


      <Form style={{ textAlign: "center" }}>
        <FormItem {...formItemLayout}
          label="活动名称"
        >
          {getFieldDecorator('activity_name', {
            initialValue: cpfjfDetailConfig.currentDataDetail.activityName,
            rules: [{
              required: true, message: '请输入活动名称',
            },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
          })(
            <Input disabled={true} />
          )}
        </FormItem>


        <Row style={{ marginBottom: "10px" }}>
          <Col span="8" style={{ textAlign: "right" }}> 选择时间类型： </Col>
          <Col span="8" >
            <RadioGroup style={{ width: "100%", textAlign: "left" }} value={cpfjfDetailConfig.timeRadio} onChange={changeTimeType} disabled={true}>
              <Radio style={{ width: "30%" }} value={1}>固定日期</Radio>
              <Radio style={{ width: "30%" }} value={2}>固定星期几</Radio>
              <Radio style={{ width: "30%" }} value={3}>时间段临时活动</Radio>
            </RadioGroup>
          </Col>
        </Row>

        {/* 根据上面radio的结果动态显示formItem */}

        {cpfjfDetailConfig.timeRadio == 1 &&
          <Form.Item
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('in_day', {
              initialValue: cpfjfDetailConfig.in_day,
              rules: [{
                required: true, message: '请设置固定日期',
              }, { pattern: /^([1-9]|[1-2][0-9]|3[0-1])$/, message: "请输入1-31之间的任意整数！" }],
            })(
              <Input disabled={true} placeholder="请输入1-31之间的任意整数" />
            )}
          </Form.Item>
        }

        {cpfjfDetailConfig.timeRadio == 2 &&
          // <div>
            <Form.Item
              {...formItemLayout}
              label=" "
            >
              {getFieldDecorator('in_week', {
                initialValue: cpfjfDetailConfig.in_week,
                rules: [{
                  required: true, message: '请选择固定星期几',
                }],
              })(
                <CheckboxGroup disabled={true} style={{ textAlign: "left" }} options={options} />
              )}
            </Form.Item>
          //   {/* 新增时间功能 */}
          //   <Row>
          //     <Col span="8" style={{ textAlign: "right", paddingRight: "10px", lineHeight: "32px" }}>
          //       <span style={{ color: "red" }}>*</span> 营业时间 :
          //     </Col>
          //     <Col span="3">
          //       <FormItem
          //         label=""
          //         style={{ textAlign: 'left' }}
          //       >
          //         {getFieldDecorator('startTime', {
          //         initialValue: moment('00:00:00', 'HH:mm'),
          //           rules: [{ required: true, message: '请选择开始营业时间!' }]
          //         })(
          //           <TimePicker format="HH:mm" style={{ width: "100%" }} />
          //         )}
          //       </FormItem>
          //     </Col>
          //     <Col span="1" style={{ lineHeight: "32px" }}>至</Col>
          //     <Col span="3">
          //       <FormItem
          //         label=""
          //         style={{ textAlign: 'left' }}
          //       >
          //         {getFieldDecorator('endTime', {
          //         initialValue: moment('00:00:00', 'HH:mm'),
          //           rules: [{ required: true, message: '请选择结束营业时间!' }]
          //         })(
          //           <TimePicker format="HH:mm" style={{ width: "100%" }} />
          //         )}
          //       </FormItem>
          //     </Col>
          //   </Row>
          //   {/*新增时间功能结束*/}
          // </div>
        }


        {cpfjfDetailConfig.timeRadio == 3 &&

          <FormItem
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('range-time-picker',
              {
                initialValue: rangPickerinitialValue,
                rules: [{ type: 'array', required: true, message: '请选择时间范围!' }]
              }
            )(
              <RangePicker disabled={true} allowClear={false} showTime format="YYYY-MM-DD HH:mm:ss" onOk={onSearchDateChange} />
            )}
          </FormItem>
        }

        {/* ----------------------------------------------------------------------------------------------------- */}

        <FormItem {...formItemLayout}
          label="适用门店"
          style={{ textAlign: 'left' }}
        >
          {/* <Button type="primary" onClick={showStoreListModal}>选择合适的门店</Button> */}
          {getFieldDecorator('storeids', {
            initialValue: cpfjfDetailConfig.storeids,
            rules: [{ required: true, message: '请选择适用门店!' }]

          })(
            <TextArea style={{ resize: "none", lineHeight: "26px", background: "#fff" }} placeholder="请选择适用门店!" autosize={{ minRows: 1 }} disabled={true} />
          )}
        </FormItem>
        <FormItem {...formItemLayout}
          label="适用产品"
          style={{ textAlign: 'left' }}
        >
          {/* <Button style={{ textAlign: 'left' }} type="primary" onClick={showGoodListModal}>选择合适的产品</Button> */}
          {getFieldDecorator('goodids', {
            initialValue: cpfjfDetailConfig.goodids,
            rules: [{ required: true, message: '请选择适用产品!' }]
          })(
            // <textarea style={{ width: "100%", minHeight: "32px" }} disabled={true} />
            <TextArea style={{ resize: "none", lineHeight: "26px", background: "#fff" }} placeholder="请选择适用产品!" autosize={{ minRows: 1 }} disabled={true} />

          )}


        </FormItem>
        <div style={{ textAlign: 'left', marginBottom: "20px", background: "#f8f8f8", lineHeight: "40px", fontWeight: 700, textIndent: "10px" }}>会员权益详情</div>

        <FormItem {...formItemLayout}
          label="参与活动"
          style={{ textAlign: "left" }}
        >
          {getFieldDecorator('member_take_in', {
            initialValue: cpfjfDetailConfig.currentDataDetail.memberTakeIn,
            rules: [{
              required: true, message: '请选择是否参与活动',
            }],
          })(
            <RadioGroup style={{ marginLeft: 20 }} onChange={changeMemberTakeIn} disabled={true}>
              <Radio key="a" value={1}>参与活动</Radio>
              <Radio key="b" value={2}>不参与</Radio>
            </RadioGroup>
          )}
        </FormItem>

        {/*会员参与活动时才展示input*/}
        {cpfjfDetailConfig.memberTakeIn == 1 &&
          <FormItem {...formItemLayout}
            label="积分返还比例"
            style={{ textAlign: "left" }}
          >
            {getFieldDecorator('mem_count', {
              initialValue: cpfjfDetailConfig.currentDataDetail.memCount,
              rules: [{
                required: true, message: '请输入积分返还比例',
              }, { pattern: /^([1-9]\d?|100)$/, message: "请输入1-100的整数！" }],
            })(
              <Input addonAfter="%" disabled={true} />
            )}
          </FormItem>
        }



        {/* <div style={{ textAlign: 'left' }}>非会员权益设置</div> */}
        <div style={{ textAlign: 'left', marginBottom: "20px", background: "#f8f8f8", lineHeight: "40px", fontWeight: 700, textIndent: "10px" }}>非会员权益详情</div>

        <FormItem {...formItemLayout}
          label="参与活动"
          style={{ textAlign: "left" }}
        >
          {getFieldDecorator('dismember_take_in', {
            initialValue: cpfjfDetailConfig.currentDataDetail.dismemberTakeIn,
            rules: [{
              required: true, message: '请选择是否参与活动',
            }],
          })(
            <RadioGroup style={{ marginLeft: 20 }} onChange={changeDismemberTakeIn} disabled={true}>
              <Radio key="a" value={1}>参与活动</Radio>
              <Radio key="b" value={2}>不参与</Radio>
            </RadioGroup>
          )}
        </FormItem>



        {/*会员参与活动时才展示input*/}
        {cpfjfDetailConfig.dismemberTakeIn == 1 &&
          <FormItem {...formItemLayout}
            label="积分返还比例"
            style={{ textAlign: "left" }}
          >
            {getFieldDecorator('dis_count', {
              initialValue: cpfjfDetailConfig.currentDataDetail.disCount,
              rules: [{
                required: true, message: '请输入积分返还比例',
              }, { pattern: /^([1-9]\d?|100)$/, message: "请输入1-100的整数！" }],
            })(
              <Input addonAfter="%" disabled={true} />
            )}
          </FormItem>
        }

        <hr style={{ background: "red", marginTop: "50px", marginBottom: "20px" }} />
        <FormItem style={{ textAlign: 'center' }}>
          {/* <Button style={{ margin: "0 20px" }} type="primary" onClick={sureSubmit}>保存</Button> */}
          <Button style={{ margin: "0 20px" }} type="default" onClick={quxiao}>返回</Button>
        </FormItem>
      </Form >


      {/*门店modal*/}
      <Modal
        title="选择门店"
        visible={cpfjfDetailConfig.storeModalVisible}
        onOk={storeHandleOk}
        onCancel={storeHandleCancel}
      >
        <Table scroll={{ x: "100%", y: 380 }} rowKey={record => record.id} rowSelection={storeRowSelection} columns={storeColumns} dataSource={cpfjfDetailConfig.storeList} pagination={false} />
      </Modal>


      {/*产品modal*/}
      <Modal
        title="选择产品"
        visible={cpfjfDetailConfig.goodModalVisible}
        onOk={goodHandleOk}
        onCancel={goodHandleCancel}
      >
        <Table scroll={{ x: "100%", y: 380 }} rowKey={record => record.id} rowSelection={goodRowSelection} columns={goodColumns} dataSource={cpfjfDetailConfig.goodList} pagination={false} />
      </Modal>

    </div>







  )

}


CpfjfEditDetail.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};


const CpfjfEditDetails = Form.create()(CpfjfEditDetail);


// =============================================表单到此结束===========================================================================


// 上面只是表单，把表单放到下面的页面中
function CpfjfEdit({ menu, dispatch, cpfjfDetailConfig }) {

  const HeaderProps = {
    menu,
    dispatch,
  };





  return (
    <Header {...HeaderProps}>
      <CpfjfEditDetails dispatch={dispatch} cpfjfDetailConfig={cpfjfDetailConfig} />
    </Header>
  );
}

CpfjfEdit.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, cpfjfDetailConfig }) {
  return { menu, cpfjfDetailConfig };
}

export default connect(mapStateToProps)(CpfjfEdit);

