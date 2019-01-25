import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import moment from 'moment';

import TreeSelect from 'antd/lib/tree-select';
import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import Transfer from 'antd/lib/transfer';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';


const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm; //确认对话框
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option } = Select;
import Cascader from 'antd/lib/cascader';
import TimePicker from 'antd/lib/time-picker';

// form表单
const YhqhdFormDetail = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, yhqhdConfig, reset
}) => {

  // 判断resetForm是否需要重置form
  if (yhqhdConfig.resetForm) {
    resetFields(); //重置所有表单
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        resetForm: false,
        isPushExpire: [], //初始化-微信提醒
        couponType: 1, //初始化-表单中优惠券类型,默认为1select模式
        couponMold: 1, //初始化-表单中切换优惠券种类radio模式
        periodValidityType: 1, //初始化-表单中有效日期类型select模式
        isDeductAll: 1, //初始化-菜品券模式下优惠金额radio发生改变模式,是否全部抵扣,1是0否
        periodValidityFinish: "",  //初始化-有效期结束时间 ,
        periodValidityStart: "", //初始化-有效期开始时间 ,
      }
    })
  }

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  };


  // 点击取消回到列表页面
  function quxiao() {
    dispatch(routerRedux.push({
      pathname: "/yhqhdlist",
      query: {}
    }));
  }

  // // 优惠券名称失去焦点时调用接口验证名字是否重复
  // function checkName() {

  //   // console.log(getFieldsValue()["name"])
  //   let name = getFieldsValue()["name"];


  //   if (name.trim().length <= 0) {
  //     console.log(name.trim().length)
  //     return
  //   }

  //   console.log(name)
  //   dispatch({
  //     type: "yhqhdConfig/checkNameIsRepeat",
  //     payload: { name, id: 0 }
  //   })
  // }

  // 修改优惠券类型select下拉
  function changeCouponType(e) {
    resetFields("couponMold");
    // 如果优惠券类型为2代金券,那么需要把优惠券种类默认值改为1
    if (e == 1) {
      dispatch({
        type: "yhqhdConfig/updatePayload",
        payload: {
          couponType: e,
          couponMold: 1  //代金券时优惠券种类展示满减券
        }
      })
    } else if (e == 2) {
      dispatch({
        type: "yhqhdConfig/updatePayload",
        payload: {
          couponType: e,
          couponMold: 2 //代金券时优惠券种类展示直抵券

        }
      })
    }


  }
  // 切换优惠券种类radio选择
  function changeCouponMold(e) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        couponMold: e.target.value
      }
    })
  }

  // 修改有效日期形式radio,原型为select,我觉得改为radio更合理
  function changeperiodValidityType(e) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        periodValidityType: e.target.value
      }
    })
  }


  // 改变日期,只能选择日期,不能选择具体时间,应产品要求
  function changeDate(date, dateString) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        periodValidityFinish: new Date(dateString[1]).getTime(), // 有效期结束时间 ,
        periodValidityStart: new Date(dateString[0]).getTime()  //有效期开始时间 ,
      }
    })
  }

  // 时间戳点击确定
  function rangePickerOk(value) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        periodValidityFinish: new Date(value[1].format("YYYY-MM-DD HH:mm:ss")).getTime(), // 有效期结束时间 ,
        periodValidityStart: new Date(value[0].format("YYYY-MM-DD HH:mm:ss")).getTime()  //有效期开始时间 ,
      }
    })

  }



  // 优惠券类型为菜品券时,优惠金额方式发生改变radio形式
  function changeisDeductAll(e) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        isDeductAll: e.target.value
      }
    })
  }

  // 到期提醒发生改变,
  function changeisPushExpire(e) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        isPushExpire: e
      }
    })
  }


  //餐厅相关逻辑================================================================
  const tPropsRestaurantData = {
    treeData: yhqhdConfig.restaurantData,
    onChange: changeRestaurantValue,
    treeCheckable: true,
    searchPlaceholder: '请选择餐厅',
    dropdownStyle: {
      height: "300px",
      overflowY: "scroll"
    }
  };

  // 改变选中的餐厅数据
  function changeRestaurantValue(value) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        restaurantValue: value
      }
    })
  }

  // 多选不适用菜品数据============================================================================
  const tPropsFoodData = {
    filterTreeNode: false,
    treeData: yhqhdConfig.foodData,
    onChange: changeFoodValue,
    treeCheckable: true,  //支持多选
    searchPlaceholder: '请选择不适用菜品',
    dropdownStyle: {
      height: "300px",
      overflowY: "scroll"
    }
  };

  // 多选不适用菜品改变选中的餐厅数据
  function changeFoodValue(value) {
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        foodValue: value
      }
    })
  }

  // 单选可用菜品================================================================================
  // 菜品券选项下选择可用菜品
  function onChangeSelect(value) {
    // console.log(value)
    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        radioFood: value
      }
    })

  }

  // Just show the latest item.
  function displayRender(label) {
    return label[label.length - 1];
  }

  // 点击保存提交表单================================================
  function saveInfo() {

    validateFields((errors) => {
      if (!!errors) {
        return false;
      }


      //限制固定日期模式下开始时间和结束时间不能是同一天
      if (getFieldsValue()["periodValidityType"] == 1) {
        if (yhqhdConfig.periodValidityFinish - yhqhdConfig.periodValidityStart == 0) {
          message.error("日期范围的开始日期和结束日期不能是同一天!")
          return
        }
      }

      // 校验如果开通了微信到期提醒,检测优惠券到期提醒前的日期数据是否符合要求
      if (getFieldsValue()["isPushExpire"].indexOf(1) != -1) {
        // 如果是固定有效期下检查到期提醒不能大于固定有效期时间差
        if (getFieldsValue()["periodValidityType"] == 1) {
          if (Number(getFieldsValue()["pushExpireDays"]) > ((yhqhdConfig.periodValidityFinish - yhqhdConfig.periodValidityStart) / 1000 / 60 / 60 / 24)) {
            message.error("优惠到期前提醒天数不能大于有效日期范围时间差!")
            return
          }

        } else if (getFieldsValue()["periodValidityType"] == 2) {
          // 如果是相对有效期下检查到期提醒不能大于相对有效期天数
          if (Number(getFieldsValue()["pushExpireDays"]) > Number(getFieldsValue()["periodValidityDays"])) {
            message.error("优惠到期前提醒天数不能大于相对有效期天数!")
            return
          }
        }
      }

      // 校验通过后弹出确认提示框是否保存
      confirm({
        title: '确认提示',
        okText: "确认保存",
        content: '新增的优惠券被使用后将不能修改优惠券内容,请仔细核对',
        onOk() {
          // 整理请求参数
          let payload = {};
          payload.couponDesc = getFieldsValue()["couponDesc"]; //优惠券说明,
          payload.couponMold = getFieldsValue()["couponMold"]; //优惠券种类：1满减券，2直抵券，3折扣券,
          payload.couponType = getFieldsValue()["couponType"]; //优惠券类型：1代金券，2菜品,

          // 可使用餐厅数据
          payload.applicableRestaurants = [];
          yhqhdConfig.restaurantValue.map(function (item, index) {
            let newItem = item.split("-");
            payload.applicableRestaurants.push({
              brandId: Number(newItem[0]), //品牌Id
              restaurantId: Number(newItem[1]) //门店Id
            });
          })


          // 代金券模式下
          if (getFieldsValue()["couponType"] == 1) {
            // payload.unapplicableFoods = yhqhdConfig.unapplicableFoods; //不适用菜品集合
            payload.unapplicableFoods = []; //不适用菜品集合
            if (yhqhdConfig.foodValue.length > 0) {
              yhqhdConfig.foodValue.map(function (item, index) {
                let newItem = item.split("-");
                payload.unapplicableFoods.push({
                  brandId: Number(newItem[0]),
                  foodCategoryId: Number(newItem[1]),
                  foodId: Number(newItem[2]),
                  foodType: Number(newItem[3])
                })
              })
            }

            if (getFieldsValue()["couponMold"] == 1) {
              // 优惠券种类为满减券
              payload.value = Number(getFieldsValue()["value"]) * 100; //优惠券面值
              payload.minMoney = Number(getFieldsValue()["minMoney"]) * 100; //最低消费

              if (payload.value > payload.minMoney) {
                message.error("优惠券面值不能大于最低消费!")
                return
              }


            } else if (getFieldsValue()["couponMold"] == 2) {
              // 优惠券种类为直抵券
              payload.value = Number(getFieldsValue()["value"]) * 100; //优惠券面值
            } else if (getFieldsValue()["couponMold"] == 3) {
              // 优惠券种类为折扣券
              payload.discountRate = Number(getFieldsValue()["discountRate"]); //优惠券折扣
            }
          } else if (getFieldsValue()["couponType"] == 2) {
            payload.minMoney = Number(getFieldsValue()["minMoney"]) * 100; //最低消费
            // 菜品券模式下--适用菜品
            payload.foodBrandId = Number(yhqhdConfig.radioFood[2].split("-")[0]); //品牌Id
            payload.foodCategoryId = Number(yhqhdConfig.radioFood[2].split("-")[1]); //分类Id
            payload.foodId = Number(yhqhdConfig.radioFood[2].split("-")[2]); //菜品Id,需要把radioFood切割开;
            payload.foodType = Number(yhqhdConfig.radioFood[2].split("-")[3]); //菜品类型,单品还是套餐

            if (getFieldsValue()["couponMold"] == 2) {
              // 直抵券
              payload.isDeductAll = getFieldsValue()["isDeductAll"]; //是否抵扣全部：1是0否, 
              // 如果是部分抵扣则需要传入抵扣金额
              if (getFieldsValue()["isDeductAll"] == 0) {
                payload.deductMoney = Number(getFieldsValue()["deductMoney"]) * 100; //部分抵扣金额
              }
            } else if (getFieldsValue()["couponMold"] == 3) {
              // 折扣券
              payload.discountRate = Number(getFieldsValue()["discountRate"]); //优惠券折扣
            }
          }

          // 有效时间
          payload.periodValidityType = getFieldsValue()["periodValidityType"]; //有效期类型：1固定，2相对有效
          if (getFieldsValue()["periodValidityType"] == 1) {
            // 固定有效期需要传起始时间的时间戳
            payload.periodValidityFinish = yhqhdConfig.periodValidityFinish; //有效期结束时间,
            payload.periodValidityStart = yhqhdConfig.periodValidityStart; //有效期开始时间,
          } else if (getFieldsValue()["periodValidityType"] == 2) {
            // 相对有效期传相对有效天数
            payload.periodValidityDays = Number(getFieldsValue()["periodValidityDays"]); //有效期类型：1固定，2相对有效
          }

          // 如果勾选了微信提醒
          if (getFieldsValue()["isPushExpire"].length > 0) {
            payload.isPushExpire = 1; //是否推送过期提醒：1是0否,   11111
            payload.pushExpireDays = Number(getFieldsValue()["pushExpireDays"]); //过期前几天提醒,
          } else {
            // 如果没有勾选微信提醒
            payload.isPushExpire = 0;
          }

          payload.name = getFieldsValue()["name"]; //优惠券名称,
          payload.usageScenes = getFieldsValue()["usageScenes"]; //适用场景，使用位运算。微信端1,

          // payload.minMoney = Number(getFieldsValue()["minMoney"]) * 100; //最低消费

          let couponUseTimes = [];

          if (yhqhdConfig.checkIndex[1] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[1] == 2 ? yhqhdConfig.timeArray[1] : [],
              timeType: "1",
              week: "1",
              weekType: yhqhdConfig.index[1],
            })
          }

          if (yhqhdConfig.checkIndex[2] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[2] == 2 ? yhqhdConfig.timeArray[2] : [],
              timeType: "1",
              week: "2",
              weekType: yhqhdConfig.index[2],
            })
          }

          if (yhqhdConfig.checkIndex[3] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[3] == 2 ? yhqhdConfig.timeArray[3] : [],
              timeType: "1",
              week: "3",
              weekType: yhqhdConfig.index[3],
            })
          }

          if (yhqhdConfig.checkIndex[4] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[4] == 2 ? yhqhdConfig.timeArray[4] : [],
              timeType: "1",
              week: "4",
              weekType: yhqhdConfig.index[4],
            })
          }

          if (yhqhdConfig.checkIndex[5] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[5] == 2 ? yhqhdConfig.timeArray[5] : [],
              timeType: "1",
              week: "5",
              weekType: yhqhdConfig.index[5],
            })
          }

          if (yhqhdConfig.checkIndex[6] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[6] == 2 ? yhqhdConfig.timeArray[6] : [],
              timeType: "1",
              week: "6",
              weekType: yhqhdConfig.index[6],
            })
          }

          if (yhqhdConfig.checkIndex[0] == 1) {

            couponUseTimes.push({
              applicableUseTimes: yhqhdConfig.index[0] == 2 ? yhqhdConfig.timeArray[0] : [],
              timeType: "1",
              week: "0",
              weekType: yhqhdConfig.index[0],
            })
          }

          if (couponUseTimes.length == 0) {
            message.error("请选择可用时段")
            return;
          }

          payload.couponUseTimes = couponUseTimes;

          // 把保存接口需要的请求数据保存起来

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: { savePayloadData: payload }
          })

          console.log(payload)

          // 调用验证名字的接口,保存接口在验证名字成功后内部调用保存
          let name = getFieldsValue()["name"];
          dispatch({
            type: "yhqhdConfig/checkNameIsRepeat",
            payload: { name, id: 0 }
          })
        },
        onCancel() {
        },
      });
    })
  }
  const format = 'HH:mm';
  var timeChildren0 = [];
  yhqhdConfig.timeArray[0] && yhqhdConfig.timeArray[0].length > 0 && yhqhdConfig.timeArray[0].map((i, j) => {

    timeChildren0.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[0];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[0] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[0];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[0] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[0];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[0] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })

  var timeChildren1 = [];
  yhqhdConfig.timeArray[1] && yhqhdConfig.timeArray[1].length > 0 && yhqhdConfig.timeArray[1].map((i, j) => {

    timeChildren1.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[1];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[1] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[1];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[1] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[1];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[1] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  var timeChildren2 = [];
  yhqhdConfig.timeArray[2] && yhqhdConfig.timeArray[2].length > 0 && yhqhdConfig.timeArray[2].map((i, j) => {

    timeChildren2.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[2];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[2] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[2];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[2] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[2];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[2] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  var timeChildren3 = [];
  yhqhdConfig.timeArray[3] && yhqhdConfig.timeArray[3].length > 0 && yhqhdConfig.timeArray[3].map((i, j) => {

    timeChildren3.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[3];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[3] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[3];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[3] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[3];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[3] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  var timeChildren4 = [];
  yhqhdConfig.timeArray[4] && yhqhdConfig.timeArray[4].length > 0 && yhqhdConfig.timeArray[4].map((i, j) => {

    timeChildren4.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[4];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[4] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[4];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[4] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[4];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[4] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  var timeChildren5 = [];
  yhqhdConfig.timeArray[5] && yhqhdConfig.timeArray[5].length > 0 && yhqhdConfig.timeArray[5].map((i, j) => {

    timeChildren5.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[5];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[5] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[5];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[5] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[5];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[5] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  var timeChildren6 = [];
  yhqhdConfig.timeArray[6] && yhqhdConfig.timeArray[6].length > 0 && yhqhdConfig.timeArray[6].map((i, j) => {

    timeChildren6.push(

      <div key={j}>
        <TimePicker value={moment(i.startTime, format)} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[6];
          newTimeArray[j].startTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[6] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })

        }} format={format} />
        <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
        <TimePicker value={moment(i.endTime, format)} format={format} onChange={(time, timeString) => {

          let newTimeArray = yhqhdConfig.timeArray[6];
          newTimeArray[j].endTime = timeString;

          let _newTimeArray = yhqhdConfig.timeArray;
          _newTimeArray[6] = newTimeArray;
          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })
        }} />

        <Button type='primary' size='small' style={{ marginLeft: 10 }} onClick={() => {

          let newTimeArray = yhqhdConfig.timeArray[6];

          newTimeArray.splice(j, 1);

          let _newTimeArray = yhqhdConfig.timeArray;

          _newTimeArray[6] = newTimeArray;

          dispatch({
            type: "yhqhdConfig/updatePayload",
            payload: {
              timeArray: _newTimeArray,
            }
          })


        }}>删除</Button>
      </div>
    );
  })


  function onAdd(index) {

    var item = { startTime: '00:00', endTime: '00:00' };

    var newTimeArray = yhqhdConfig.timeArray;

    newTimeArray[index].push(item);

    dispatch({
      type: "yhqhdConfig/updatePayload",
      payload: {
        timeArray: newTimeArray,
      }
    })




  }


  return (
    <div>
      <Form style={{ padding: "20px" }} id="cjzhForm">
        <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>基本信息</div>

        <Form.Item  {...formItemLayout} label="优惠券名称"  >
          {getFieldDecorator('name', {
            initialValue: "",
            rules: [{
              required: true, message: '请输入优惠券名称',
            },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
          })(
            <Input style={{ height: "32px", width: "100%" }} maxLength="20" />
          )}
        </Form.Item>

        <Form.Item  {...formItemLayout} label="优惠券类型"  >
          {getFieldDecorator('couponType', {
            initialValue: yhqhdConfig.couponType,
            rules: [{
              required: true, message: '请选择优惠券类型',
            }]
          })(
            <Select onChange={changeCouponType}>
              <Option value={1}>代金券</Option>
              <Option value={2}>菜品券</Option>
            </Select>
          )}
        </Form.Item>

        {/*如果优惠券类型为代金券时展示如下表单===============================================================================================================*/}
        {
          yhqhdConfig.couponType == 1 &&
          <div>
            <Form.Item  {...formItemLayout} label="优惠券种类"  >
              {getFieldDecorator('couponMold', {
                initialValue: yhqhdConfig.couponMold,
                rules: [{
                  required: true, message: '请选择优惠券种类',
                }]
              })(
                <RadioGroup onChange={changeCouponMold}>
                  <Radio value={1}>满减券</Radio>
                  <Radio value={2}>直抵券</Radio>
                  <Radio value={3}>折扣券</Radio>
                </RadioGroup>
              )}
            </Form.Item>

            {/*优惠券种类radio为满减券时展示如下内容*/}
            {yhqhdConfig.couponMold == 1 &&
              <div>
                <Form.Item  {...formItemLayout} label="优惠券面值"  >
                  {getFieldDecorator('value', {
                    initialValue: "",
                    rules: [{
                      required: true, message: '请输入优惠券面值',
                    },
                    { pattern: /^0\.\d{2}$|^[1-9]\d{0,3}\.\d{2}$|^[1-9]\d{0,3}$/, message: "优惠券面值区间为0.01~9999.99,如非整数请保留两位小数！" }],
                  })(
                    <Input addonAfter="元" style={{ height: "32px", width: "100%" }} />
                  )}
                </Form.Item>
              </div>
            }


            {/*优惠券种类radio为直抵券时展示如下内容*/}
            {yhqhdConfig.couponMold == 2 &&
              <div>
                <Form.Item  {...formItemLayout} label="优惠券面值"  >
                  {getFieldDecorator('value', {
                    initialValue: "",
                    rules: [{
                      required: true, message: '请输入优惠券面值',
                    },
                    { pattern: /^0\.\d{2}$|^[1-9]\d{0,3}\.\d{2}$|^[1-9]\d{0,3}$/, message: "优惠券面值区间为0.01~9999.99,如非整数请保留两位小数！" }],
                  })(
                    <Input addonAfter="元" style={{ height: "32px", width: "100%" }} />
                  )}
                </Form.Item>
              </div>
            }

            {/*优惠券种类radio为折扣券时展示如下内容*/}
            {yhqhdConfig.couponMold == 3 &&
              <div>
                <Form.Item  {...formItemLayout} label="优惠券折扣" extra="注：折扣比例范围1-100之间并且限制整数,如85即为8.5折">
                  {getFieldDecorator('discountRate', {
                    initialValue: "",
                    rules: [{
                      required: true, message: '请输入折扣比例',
                    },
                    { pattern: /^([1-9][0-9]{0,1}|100)$/, message: "请输入正确的折扣比例！" }],
                  })(
                    <Input addonAfter="%" style={{ height: "32px", width: "100%" }} />
                  )}
                </Form.Item>
              </div>
            }
          </div>
        }

        {/*如果优惠券类型为菜品券时展示如下表单===============================================================================================================*/}
        {
          yhqhdConfig.couponType == 2 &&
          <div>
            <Form.Item  {...formItemLayout} label="优惠券种类"  >
              {getFieldDecorator('couponMold', {
                initialValue: yhqhdConfig.couponMold,
                rules: [{
                  required: true, message: '请选择优惠券种类',
                }]
              })(
                <RadioGroup onChange={changeCouponMold}>
                  <Radio value={2}>直抵券</Radio>
                  <Radio value={3}>折扣券</Radio>
                </RadioGroup>
              )}
            </Form.Item>

            {/*优惠券种类radio为折扣券时展示如下内容*/}

            {yhqhdConfig.couponMold == 2 &&
              <div>
                {/*之地全下才展示优惠金额*/}
                <Form.Item  {...formItemLayout} label="优惠金额"  >
                  {getFieldDecorator('isDeductAll', {
                    initialValue: yhqhdConfig.isDeductAll,
                  })(
                    <RadioGroup onChange={changeisDeductAll}>
                      <Radio value={1}>全部抵扣</Radio>
                      <Radio value={0}>部分抵扣</Radio>
                    </RadioGroup>
                  )}
                </Form.Item>

                {/*优惠金额radio如果为部分抵扣时展示部分抵扣金额*/}
                {yhqhdConfig.isDeductAll == 0 &&
                  <Form.Item  {...formItemLayout} label="部分抵扣金额"  >
                    {getFieldDecorator('deductMoney', {
                      initialValue: "",
                      rules: [{ required: true, message: "请输入部分抵扣金额" },
                      { pattern: /^(([1-9][0-9]*)|(([0]\.\d{2}|[1-9][0-9]*\.\d{2})))$/, message: "部分抵扣金额必须大于0,若非整数请保留两位小数" }]

                    })(
                      <Input addonAfter="元" />
                    )}
                  </Form.Item>
                }
              </div>
            }
            {yhqhdConfig.couponMold == 3 &&
              <div>
                <Form.Item  {...formItemLayout} label="优惠券折扣" extra="注：折扣比例范围1-100之间并且限制整数,如85即为8.5折">
                  {getFieldDecorator('discountRate', {
                    initialValue: "",
                    rules: [{
                      required: true, message: '请输入折扣比例',
                    },
                    { pattern: /^([1-9][0-9]{0,1}|100)$/, message: "请输入正确的折扣比例！" }],
                  })(
                    <Input addonAfter="%" style={{ height: "32px", width: "100%" }} />
                  )}
                </Form.Item>
              </div>
            }

          </div>
        }

        {/*最低消费代金券的满减券 ||  菜品券是共有的*/}


        {(yhqhdConfig.couponType == 1 && yhqhdConfig.couponMold == 1) &&
          <Form.Item  {...formItemLayout} label="最低消费" extra="满足多少消费金额可用" >
            {getFieldDecorator('minMoney', {
              initialValue: "",
              rules: [{
                required: true, message: '请输入最低消费',
              },
              { pattern: /^(([1-9][0-9]*)|(([0]\.\d{2}|[1-9][0-9]*\.\d{2})))$/, message: "最低消费金额必须大于0,如非整数请保留两位小数！" }
              ],
            })(
              <Input addonAfter="元" style={{ height: "32px", width: "100%" }} />
            )}
          </Form.Item>
        }

        {
          yhqhdConfig.couponType == 2 &&
          <Form.Item  {...formItemLayout} label="最低消费" extra="满足多少消费金额可用" >
            {getFieldDecorator('minMoney', {
              initialValue: "",
              rules: [{
                required: true, message: '请输入最低消费',
              },
              { pattern: /^(([1-9][0-9]*)|(([0]\.\d{2}|[1-9][0-9]*\.\d{2})))$/, message: "最低消费金额必须大于0,如非整数请保留两位小数！" }
              ],
            })(
              <Input addonAfter="元" style={{ height: "32px", width: "100%" }} />
            )}
          </Form.Item>
        }




        {/*有效日期是共有的*/}
        <Form.Item  {...formItemLayout} label="有效日期"  >
          {getFieldDecorator('periodValidityType', {
            initialValue: yhqhdConfig.periodValidityType,
            rules: [{
              required: true, message: '请选择有效日期类型',
            }]
          })(
            <RadioGroup onChange={changeperiodValidityType}>
              <Radio value={1}>固定有效期</Radio>
              <Radio value={2}>相对有效期</Radio>
            </RadioGroup>
          )}
        </Form.Item>

        {/*periodValidityType="相对有效期时展示"*/}
        {yhqhdConfig.periodValidityType == 1 ?
          <Form.Item  {...formItemLayout} label="日期范围"  >
            {getFieldDecorator('dateRanger', {
              initialValue: "",
              rules: [{
                required: true, message: '请选择日期范围',
              }],
            })(
              // <RangePicker onChange={changeDate} showTime format="YYYY-MM-DD HH:mm:ss" onOk={rangePickerOk} />
              <RangePicker onChange={changeDate} format="YYYY-MM-DD 00:00:00" onOk={rangePickerOk} />
            )}
          </Form.Item>
          :
          <Form.Item  {...formItemLayout} label="自发券之日起" extra="注：发券当天开始计算至第几天有效">
            {getFieldDecorator('periodValidityDays', {
              initialValue: "",
              rules: [{
                required: true, message: '请输入天数',
              },
              { pattern: /^[1-9]\d*$/, message: "请输入正整数！" }],
            })(
              <Input addonAfter="天内有效" />
            )}
          </Form.Item>
        }

        <Form.Item  {...formItemLayout} label="可用时段"  >

          <div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[1] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[1] = 1;
                  } else {
                    newCheckIndex[1] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周一</Checkbox>

                <RadioGroup value={yhqhdConfig.index[1]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[1] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[1] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(1)}>新增时段</Button>
                  {timeChildren1}
                </div>
              </div>

            </div>

            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[2] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[2] = 1;
                  } else {
                    newCheckIndex[2] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周二</Checkbox>

                <RadioGroup value={yhqhdConfig.index[2]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[2] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[2] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(2)}>新增时段</Button>
                  {timeChildren2}
                </div>
              </div>

            </div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[3] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[3] = 1;
                  } else {
                    newCheckIndex[3] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周三</Checkbox>

                <RadioGroup value={yhqhdConfig.index[3]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[3] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[3] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(3)}>新增时段</Button>
                  {timeChildren3}
                </div>
              </div>

            </div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[4] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[4] = 1;
                  } else {
                    newCheckIndex[4] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周四</Checkbox>

                <RadioGroup value={yhqhdConfig.index[4]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[4] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[4] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(4)}>新增时段</Button>
                  {timeChildren4}
                </div>
              </div>

            </div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[5] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[5] = 1;
                  } else {
                    newCheckIndex[5] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周五</Checkbox>

                <RadioGroup value={yhqhdConfig.index[5]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[5] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[5] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(5)}>新增时段</Button>
                  {timeChildren5}
                </div>
              </div>

            </div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[6] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[6] = 1;
                  } else {
                    newCheckIndex[6] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周六</Checkbox>

                <RadioGroup value={yhqhdConfig.index[6]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[6] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[6] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(6)}>新增时段</Button>
                  {timeChildren6}
                </div>
              </div>

            </div>
            <div>

              <div>
                <Checkbox style={{ marginRight: "40px" }} checked={yhqhdConfig.checkIndex[0] == 1} onChange={(e) => {

                  let newCheckIndex = yhqhdConfig.checkIndex;

                  if (e.target.checked) {
                    newCheckIndex[0] = 1;
                  } else {
                    newCheckIndex[0] = 0;
                  }

                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { checkIndex: newCheckIndex }
                  })

                }}>周日</Checkbox>

                <RadioGroup value={yhqhdConfig.index[0]} onChange={(e) => {

                  let newIndex = yhqhdConfig.index;
                  newIndex[0] = e.target.value;
                  dispatch({
                    type: "yhqhdConfig/updatePayload",
                    payload: { index: newIndex }
                  })
                }}>
                  <Radio value={1}>全天</Radio>
                  <Radio value={2}>选择时段</Radio>
                </RadioGroup>
              </div>

              <div style={{ display: yhqhdConfig.index[0] == 2 ? 'block' : 'none' }}>

                <div>
                  <Button type={"primary"} size='small' onClick={() => onAdd(0)}>新增时段</Button>
                  {timeChildren0}
                </div>
              </div>

            </div>
          </div>

        </Form.Item>

        {/*下半部分*/}
        <div style={{ width: "100%", background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>优惠券设置</div>
        <Form.Item  {...formItemLayout} label="适用场景"  >
          {getFieldDecorator('usageScenes', {
            initialValue: [1, 2, 4],
            rules: [{
              required: true, message: '请选择适用场景',
            }]
          })(
            <CheckboxGroup options={[
              { label: "堂食", value: 1 },
              { label: "外带", value: 2 },
              { label: "自营外卖", value: 4 },

            ]} />
          )}
        </Form.Item>

        {/* 餐软1.2新增选择可使用餐厅============================================================================ */}

        <Form.Item  {...formItemLayout} label="可使用餐厅"  >
          {getFieldDecorator('Restaurant', {
            initialValue: yhqhdConfig.restaurantValue,
            rules: [{
              required: true, message: '请选择可使用餐厅',
            }]
          })(
            <TreeSelect style={{ width: "100%" }} {...tPropsRestaurantData} />
          )}
        </Form.Item>


        {/*代金券:可多选不适用菜品;菜品券:只能单选单个可用菜品*/}
        {yhqhdConfig.couponType == 1 ?
          <Form.Item  {...formItemLayout} label="不适用菜品"  >
            {getFieldDecorator('notSuitableProducts', {
              initialValue: yhqhdConfig.foodValue,
              // rules: [{
              //   required: true, message: '请选择日期范围',
              // }],
            })(
              <TreeSelect style={{ width: "100%" }} {...tPropsFoodData} />
            )}
          </Form.Item>
          :
          <Form.Item  {...formItemLayout} label="可用菜品"  >
            {getFieldDecorator('foodId', {
              initialValue: yhqhdConfig.radioFood,
              rules: [{
                required: true, message: '请选择可用菜品',
              }],
            })(


              <Cascader
                options={yhqhdConfig.foodData}
                expandTrigger="hover"
                displayRender={displayRender}
                onChange={onChangeSelect}
              />
            )}
          </Form.Item>

        }
        <Form.Item  {...formItemLayout} label="到期提醒"  >
          {getFieldDecorator('isPushExpire', {
            initialValue: yhqhdConfig.isPushExpire,
          })(
            <CheckboxGroup onChange={changeisPushExpire} options={[
              { label: '微信推送', value: 1 },
            ]} />
          )}
        </Form.Item>

        {/*如果到期提醒有微信*/}
        {
          yhqhdConfig.isPushExpire.indexOf(1) != -1 &&

          <div>
            <Form.Item  {...formItemLayout} label="优惠到期前"  >
              {getFieldDecorator('pushExpireDays', {
                initialValue: "",
                rules: [{
                  required: true, message: '请输入到期提醒日期',
                },
                { pattern: /^[1-9]\d*$/, message: "请输入正整数！" }],
              })(
                <Input addonAfter="天提醒" style={{ height: "32px", width: "100%" }} />
              )}
            </Form.Item>
            <Row style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
              <Col span="8" style={{ textAlign: "right", paddingRight: '8px' }}>提醒内容模版:</Col>
              <Col span="8">【路上】您参与的注册赠优惠券活动，获得的优惠券**月**日即将到期，快去使用吧！查看优惠券</Col>
            </Row>
          </div>
        }


        <Form.Item  {...formItemLayout} label="优惠券说明" extra="最多输入200个字">
          {getFieldDecorator('couponDesc', {
            initialValue: "",
            rules: [{
              required: true, message: '请输入优惠券说明',
            },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
          })(
            <TextArea placeholder="请输入优惠券说明" autosize={{ minRows: 2 }} maxLength={200} />

          )}
        </Form.Item>

        <hr style={{ margin: "20px 0" }} />

        <Row>
          <Col span="3" offset="10">
            <FormItem >
              <Button type="primary" onClick={saveInfo}>保存</Button>
            </FormItem>
          </Col>
          <Col span="3">
            <FormItem >
              <Button type="default" onClick={quxiao}>取消</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );

}

YhqhdFormDetail.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};


const YhqhdForm = Form.create()(YhqhdFormDetail);


// ========================================================以上是表单部分==========================================================

function YhqhdFormPage({ menu, dispatch, yhqhdConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };

  return (
    <Header {...HeaderProps}>
      <YhqhdForm dispatch={dispatch} yhqhdConfig={yhqhdConfig} />

    </Header>
  );
}

YhqhdFormPage.propTypes = {
  menu: PropTypes.object,
};


function mapStateToProps({ menu, yhqhdConfig }) {
  return { menu, yhqhdConfig };
}

export default connect(mapStateToProps)(YhqhdFormPage);

