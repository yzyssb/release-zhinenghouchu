import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
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
import styles from "./ZcglPage.less";

const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const dateFormat = 'YYYY/MM/DD h:mm:ss a';


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


  // 每次重载页面时检测zcglPageConfig.isResetForm的值，如果为真就重置数据，一定要加延时
  if (zcglPageConfig.isResetForm) {
    setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
  }
  function resetFormTimeout(resetFields, dispatch) {
    if (resetFields) {
      resetFields();
    }
    if (dispatch) {
      dispatch({
        type: 'zcglPageConfig/updatePayload',
        payload: { isResetForm: false }
      });
    }
  }

  //点击取消隐藏弹框
  function handleCancel() {
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { visible: false }
    });
    // 充值所有组件
    resetFields()
  }


  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const formItemLayoutDataPicker = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  // 设置起始时间如果是新增则不展示默认时间，是修改则展示获取的时间
  let startTime;
  let endTime;
  let rangPickerinitialValue;

  if (zcglPageConfig.actionData.gmtStart == "" && zcglPageConfig.actionData.gmtFinish == "") {
    rangPickerinitialValue = ""
  } else {
    startTime = zcglPageConfig.formatDateTime(zcglPageConfig.actionData.gmtStart);
    endTime = zcglPageConfig.formatDateTime(zcglPageConfig.actionData.gmtFinish);
    rangPickerinitialValue = [moment(startTime, dateFormat), moment(endTime, dateFormat)];
  }

  const rangeConfig = {
    // initialValue:[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)],
    initialValue: rangPickerinitialValue,
    rules: [{ type: 'array', required: true, message: '请选择时间范围!' }],
  };

  // select改变折扣方案
  function changeSelect(value) {
    var actionData = zcglPageConfig.actionData;
    actionData.type = value;
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { actionData }
    });
  }

  // 改变折扣名称
  function changeDiscountName(e) {
    var actionData = zcglPageConfig.actionData;
    actionData.name = e.target.value;
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { actionData}
    });
  }

  // 输入折扣率
  function changeRate(e) {
    var actionData = zcglPageConfig.actionData;
    // 去掉空格
    actionData.wholeRate = e.target.value;
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { actionData }
    });
  }

  // 选择完日期并点击了确定,得到两个时间,转为时间戳
  function sureChangeTime(times) {
    // console.log(times)
    var gmtStart = moment(times[0]).format();
    gmtStart = new Date(gmtStart).getTime();
    var gmtFinish = moment(times[1]).format();
    gmtFinish = new Date(gmtFinish).getTime();

    var actionData = zcglPageConfig.actionData;
    actionData.gmtStart = gmtStart;
    actionData.gmtFinish = gmtFinish;
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { actionData }
    });
  }

  // 状态的停用和启用
  function changeStatus(result) {
    var actionData = zcglPageConfig.actionData;
    //状态：1启用，2停用
    actionData.status = result ? "1" : "2";
    dispatch({
      type: 'zcglPageConfig/updatePayload',
      payload: { actionData }
    });

  }

  let discountDetails = zcglPageConfig.discountDetails;

  // 点击菜类请求菜品key是菜类的key,index是第几项数据
  // togleShow(item.isCombo, indexFather)
  function togleShow(isCombo, indexFather) {
    // 如果子项有数据就展开
    if (discountDetails[indexFather].foods) {
      // console.log(123456)

      discountDetails[indexFather].display = !discountDetails[indexFather].display

      dispatch({
        type: 'zcglPageConfig/updatePayload',
        payload: { discountDetails }
      });

    }


  }

  // 改变折扣比例折叠表父级input，indexFather是每个大类在数组中的位置
  // changeFatherInput(indexFather, e)
  function changeFatherInput(fatherkey, e) {
    let discountDetails = zcglPageConfig.discountDetails;
    discountDetails.map(function (item, index) {
      if (index == fatherkey) {
        item.discountRate = e.target.value;
        if (item.foods && item.foods != null && item.foods.length > 0) {
          item.foods.map(function (ele, i) {
            ele.discountRate = e.target.value;
          })
        }
        dispatch({
          type: 'zcglPageConfig/updatePayload',
          payload: { discountDetails }
        });

      }
    })
  }


  // 改变折扣比例折叠子级
  /**
   * @param {*} fatherKey 父级自己的key
   * @param {*} sonkey 子集自己的key
   * @param {*} e 
   */

  //   changeSonInput(indexFather, indexSon, e) 
  function changeSonInput(fatherKey, indexSon, e) {
    let discountDetails = zcglPageConfig.discountDetails;
    // 每次一有输入先清除父级的discountRate 
    discountDetails.map(function (item, index) {
      if (index == fatherKey) {
        item.discountRate = "";
        item.foods.map(function (ele, i) {
          if (i == indexSon) {
            ele.discountRate = e.target.value;
          }
        });
        // 再次循环子项，如果所有的值都一样就给父级赋值
        let rel = item.foods.every(function (el) {
          return el.discountRate == e.target.value;
        });

        if (rel) {
          item.discountRate = e.target.value;
        }

        dispatch({
          type: 'zcglPageConfig/updatePayload',
          payload: { discountDetails }
        });
      }
    })
  }


  // 折扣名字失去焦点的时候触发验证折扣请求
  function checkNameQuery() {
    dispatch({
      type: 'zcglPageConfig/checkName',
      payload: {}
    });
  }



  // 点击确认按钮
  function handleOk() {
    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      if (zcglPageConfig.checkName != 0) {
        message.error('折扣名称已存在！');
        return
      }

      // 如果是新增全单折扣
      if (zcglPageConfig.actionData.type == 1) {
        addAll();// 调用全单折扣
      }
      if (zcglPageConfig.actionData.type == 2) {
        // 方案折扣的时候要验证所有输入的input值是否符合要求
        let reg = /^(0|[1-9]\d?|100)$/;
        let discountDetails = zcglPageConfig.discountDetails;
        let flag = true;
        discountDetails.map(function (ele1, index1) {
          // 验证父级
          if (ele1.discountRate != null && ele1.discountRate != "") {
            if (!reg.test(ele1.discountRate)) {
              //  验证失败
              // console.log("验证失败")
              flag = false;
            }
          }
          // 验证子集
          if (ele1.foods && ele1.foods != null && ele1.foods != "" && ele1.foods.length > 0) {
            ele1.foods.map(function (ele2, index2) {
              if (ele2.discountRate != null && ele2.discountRate != "") {
                if (!reg.test(ele2.discountRate)) {
                  //  验证失败
                  // console.log("验证失败")
                  flag = false;
                }
              }
            })
          }
        })
        if (!flag) {
          console.log("验证失败")
          message.error('折扣比例输入有误！');
          return false
        }

        addplan();// 调用方案折扣
      }
    })

    // 清空数据

  }

  // 全单折扣
  function addAll() {
    let payload = {
      saveDetails: [],
      id: zcglPageConfig.actionData.id, //id为空表示新增，不为空表示修改
      gmtFinish: zcglPageConfig.actionData.gmtFinish,  //结束时间
      gmtStart: zcglPageConfig.actionData.gmtStart,  //开始时间
      name: zcglPageConfig.actionData.name, //方案名称
      status: zcglPageConfig.actionData.status, //状态：1启用，2停 ,
      type: 1, //折扣类型：1全单折2方案折,默认全单折扣
      wholeRate: zcglPageConfig.actionData.wholeRate //全单折折扣0-100
    }

    // 执行请求添加接口
    dispatch({
      type: 'zcglPageConfig/addDiscount',
      payload: payload
    });
  }

  // 方案折扣
  function addplan() {
    let payload = {
      saveDetails: [], //保存明细
      id: zcglPageConfig.actionData.id, //id为空表示新增，不为空表示修改
      gmtFinish: zcglPageConfig.actionData.gmtFinish,  //结束时间
      gmtStart: zcglPageConfig.actionData.gmtStart,  //开始时间
      name: zcglPageConfig.actionData.name, //方案名称
      status: zcglPageConfig.actionData.status, //状态：1启用，2停 ,
      type: 2, //折扣类型：1全单折2方案折,默认全单折扣
      wholeRate: "" //全单折折扣0-100
    }

    // 循环得到discountDetails数据
    let discountDetails = zcglPageConfig.discountDetails;

    // discountDetails大于0才需要执行循环
    if (discountDetails.length > 0) {
      discountDetails.map(function (item, index) {
        // 处理非套餐时
        if (item.isCombo != 1) {
          // 如果父级有值说明子集全部一样，取父级
          if (item.discountRate != "" && item.discountRate != null && item.discountRate != 0) {
            payload.saveDetails.push({
              "categoryId": item.categoryId, //菜类id ,没有时就传空
              "comboId": "", //套餐id , 如果有套餐时就传，没有时就传空
              "discountRate": item.discountRate, //折扣率(0-100) ,
              "foodId": "", //菜品id ,
              "type": 1 //类型：1菜类2菜品3套餐类4套餐单品
            });
            // console.log(discountDetails)
          } else {
            // 如果父级没有值在循环子级看有没有值
            if (item.foods && item.foods != null && item.foods.length > 0) {
              item.foods.map(function (ele, key) {
                if (ele.discountRate != "" && ele.discountRate != null && ele.discountRate != 0) {
                  payload.saveDetails.push({
                    "categoryId": "", //菜类id
                    "comboId": "", //套餐id , 如果有套餐时就传，没有时就传空
                    "discountRate": ele.discountRate, //折扣率(0-100) ,
                    "foodId": ele.foodId, //菜品id ,
                    "type": 2 //类型：1菜类2菜品3套餐类4套餐单品
                  });
                  // console.log(discountDetails)
                }

              })
            }

          }
        } else {
          // 套餐有数据时
          // 如果父级有值说明子集全部一样，取父级
          if (item.discountRate != "" && item.discountRate != null && item.discountRate != 0) {
            payload.saveDetails.push({
              "categoryId": "", //菜类id ,没有时就传空
              "comboId": "", //套餐id , 如果有套餐时就传，没有时就传空
              "discountRate": item.discountRate, //折扣率(0-100) ,
              "foodId": "", //菜品id ,
              "type": 3 //类型：1菜类2菜品3套餐类4套餐单品
            });
            // console.log(discountDetails)
          } else {
            // 如果父级没有值在循环子级看有没有值
            if (item.foods && item.foods != "" && item.foods != null && item.foods.length > 0) {
              item.foods.map(function (ele, key) {
                if (ele.discountRate != "" && ele.discountRate != null && ele.discountRate != 0) {
                  payload.saveDetails.push({
                    "categoryId": "", //菜类id ,没有时就传空
                    "comboId": ele.foodId, //套餐id , 如果有套餐时就传，没有时就传空
                    "discountRate": ele.discountRate, //折扣率(0-100) ,
                    "foodId": "", //菜品id ,
                    "type": 4 //类型：1菜类2菜品3套餐类4套餐单品
                  });

                }

              })
            }
          }
        }
      })

      console.log(payload)

      // 执行请求添加接口保存修改或者新增折扣
      dispatch({
        type: 'zcglPageConfig/addDiscount',
        payload: payload
      });
    }
  }

  return (
    <Modal
      width="800px"
      visible={zcglPageConfig.visible}
      title={zcglPageConfig.way=="add" ? "新增折扣方式":"编辑折扣方式"}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className={styles.modalContent} >

        <Form>
          <Form.Item
            {...formItemLayout}
            label="折扣类型"
              >
            {getFieldDecorator('type', {
              initialValue: zcglPageConfig.actionData.type.toString(),
            })(
              <Select style={{ width: "100%" }} onChange={changeSelect}>
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
              initialValue: zcglPageConfig.actionData.name,
              rules: [{
                required: true, message: '请输入折扣名称！',
              },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <Input onChange={changeDiscountName} onBlur={checkNameQuery} />
            )}
          </Form.Item>

          {zcglPageConfig.actionData.type == 1 &&
            <Form.Item
              {...formItemLayout}
              label="折扣率"
                >
              {getFieldDecorator('discountRate', {
                initialValue: zcglPageConfig.actionData.wholeRate,
                rules: [
                  { required: true, message: "请输入折扣率！" },
                  { pattern: /^(0|[1-9]\d?|100)$/, message: "请输入0-100的整数！" }
                ],
              })(
                <Input style={{ width: "100%" }} addonAfter="%" type="number" placeholder="支持0-100的整数，输入80即为打8折" onChange={changeRate} />
              )}
            </Form.Item>
          }
          <FormItem
            {...formItemLayoutDataPicker}
            label="有效期"

          >
            {getFieldDecorator('range-time-picker', rangeConfig)(
              <RangePicker allowClear={false} showTime format="YYYY-MM-DD HH:mm:ss" onOk={sureChangeTime} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状态"
          >
            <Switch  checkedChildren="启用" unCheckedChildren="停用" checked={zcglPageConfig.actionData.status == 1 ? true : false} onChange={changeStatus} />
          </FormItem>

          <Row style={{ width: "70%", lineHeight: "40px", background: "red", margin: "0 auto", textAlign: "center", height: "40px", background: "#eee", fontSize: "14px", display: zcglPageConfig.actionData.type == 1 ? "none" : "block" }}>
            <Col span="10">菜品名称</Col>
            <Col span="8" offset="6">折扣比例</Col>
          </Row>

          {/* 折叠面板部分 */}
          <div className={styles.treeView} style={{ display: zcglPageConfig.actionData.type == 1 ? "none" : "block" }}>
            {
              // 当 way=add 并且zcglPageConfig.discountDetails 有数据时渲染
              zcglPageConfig.discountDetails != null && zcglPageConfig.discountDetails.length > 0 &&
              zcglPageConfig.discountDetails.map(function (item, indexFather) {
                return (
                  <div key={indexFather}>
                    <Row key={[indexFather]} style={{ lineHeight: "38px", borderBottom: "1px solid #fff", background: "#f5f5f5"}} >
                      {
                        item.foods != null && item.foods.length > 0 ?
                          <Col span="1" onClick={() => { togleShow(item.isCombo, indexFather) }}>
                            {item.display ? <Icon type="caret-down" /> : <Icon type="caret-right" />}
                          </Col>
                          :
                          <Col span="1">
                          </Col>
                      }
                      <Col span="14">{item.categoryName}</Col>
                      <Col span="9">
                        <Input style={{ lineHeight: "38px",marginBottom:"3px"}} value={item.discountRate} addonAfter="%" type="number" placeholder="支持0-100的整数" onChange={(e) => { changeFatherInput(indexFather, e) }} />
                      </Col>
                    </Row>
                    <div style={{ display: item.display ? "block" : "none" }}>
                      {item.foods && item.foods.map(function (ele, indexSon) {
                        return (
                          <Row key={[indexFather, indexSon]} style={{ borderBottom: "1px solid #f7f7f7", lineHeight: "38px"}}>
                            <Col span="13" offset="2" >{ele.foodName}</Col>
                            <Col span="9"> <Input value={ele.discountRate} type="number" addonAfter="%" placeholder="支持0-100的整数" onChange={(e) => { changeSonInput(indexFather, indexSon, e) }} style={{marginBottom:"3px"}}/></Col>
                          </Row>)
                      })}
                    </div>

                  </div>
                )
              })
            }
          </div>
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

export default Form.create()(Registration);



// 循环，如果返回的数据和页面显示的数据不一致的时候，比较两者的区别 都为大类的时候，如果key相同


