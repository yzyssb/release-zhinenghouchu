import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
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


const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import UploadCert from '../../../components/base/common/UploadCert';

// form表单
const Registration = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, lszfglConfig
}) => {

  // 每次重载页面时检测lszfglConfig.isResetForm的值，如果为真就重置数据，一定要加延时
  if (lszfglConfig.isResetForm) {
    setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
  }
  function resetFormTimeout(resetFields, dispatch) {
    if (resetFields) {
      resetFields();
    }
    if (dispatch) {
      dispatch({
        type: 'lszfglConfig/updatePayload',
        payload: { isResetForm: false }
      });
    }
  }

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  };



  // ===========================================================
  // 修改支付名称
  function payMethodNameChange(e) {
    let editData = lszfglConfig.editData
    editData.payMethodName = e.target.value;
    // payMethodName
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  //  是否可积分
  function isUsePointChange(e) {
    let editData = lszfglConfig.editData
    editData.isUsePoint = e.target.value;
    // payMethodName
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 修改备注内容
  function remarkChange(e) {

    let editData = lszfglConfig.editData
    editData.remark = e.target.value;
    // payMethodName
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 修改状态
  function stateChange(e) {
    let editData = lszfglConfig.editData
    editData.state = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 优惠券模式下券实收改变
  // function actualCouponValueChange(e) {
  //   let editData = lszfglConfig.editData
  //   editData.actualCouponValue = Number(e.target.value) * 100;
  //   dispatch({
  //     type: 'lszfglConfig/updatePayload',
  //     payload: { editData }
  //   });
  // }

  // 优惠券模式下面值改变
  // function couponValueChange(e) {
  //   console.log(typeof e.target.value)
  //   let editData = lszfglConfig.editData
  //   editData.couponValue = Number(e.target.value) * 100;
  //   dispatch({
  //     type: 'lszfglConfig/updatePayload',
  //     payload: { editData }
  //   });
  // }

  // 微信模式下渠道改变
  function channelChange(e) {
    let editData = lszfglConfig.editData
    editData.channel = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 微信模式下商户号改变
  function merchantNumberChange(e) {
    let editData = lszfglConfig.editData
    editData.merchantNumber = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 微信模式下apikey改变
  function apiKeyChange(e) {
    let editData = lszfglConfig.editData
    editData.apiKey = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 微信模式下appid改变
  function appidChange(e) {
    let editData = lszfglConfig.editData
    editData.appid = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 微信模式下secret改变
  function secretChange(e) {
    let editData = lszfglConfig.editData
    editData.secret = e.target.value;
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData }
    });
  }

  // 点击提交表单
  function sureSubmit() {
    validateFields((errors) => {
      console.log(errors)
      if (!!errors) {
        return false;
      }
      // // 检测支付名称是否出现过
      // if (lszfglConfig.checkName == 1) {
      //   message.error('同一支付类型下面不能有重复的支付名称')
      //   return
      // }
      // 添加优惠券，优惠券的面值只可以大于等于实收，不可以小于实收
      // if (lszfglConfig.editData.couponValue < lszfglConfig.editData.actualCouponValue) {
      //   message.error('优惠券的面值只可以大于等于实收!')
      //   return
      // }

      // 验证通过后执行的逻辑接着执行筛选的样式
      // console.log("开始执行自己的逻辑");
      let payload = {
        payMethodTypeName: lszfglConfig.editData.payMethodTypeName, //支付方式
        companyId: 0,    //'集团id,必须为数值0' 
        restaurantId: 0,   //'餐厅id，必须为数值0',
        payMethodType: lszfglConfig.editData.payMethodType,    //'1 现金 2 会员 3银行卡支付 4优惠券 5 第三方 6微信
        payMethodName: lszfglConfig.editData.payMethodName, // '支付名称',
        remark: lszfglConfig.editData.remark, // '备注',
        state: lszfglConfig.editData.state, // '状态  0 停用  1 启用',
        isUsePoint: lszfglConfig.editData.isUsePoint, // '是否使用积分 1启用  0不启用',
        // couponValue: lszfglConfig.editData.couponValue, // '劵面值'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
        // actualCouponValue: lszfglConfig.editData.actualCouponValue, // '劵实收'（只有优惠券时传值，注意是数值，其他方式下不传此字段）
         couponValue: 0, // '劵面值--后期李牧要求把form中的这个input隐藏不用,固定传值为0'
        actualCouponValue: 0, // '劵实收--后期李牧要求把form中的这个input隐藏不用,固定传值为0'
        channel: lszfglConfig.editData.channel,   // 渠道
        merchantNumber: lszfglConfig.editData.merchantNumber,// 商户号 
      };

      if (lszfglConfig.editData.channel == 1) {

         payload.apiKey = lszfglConfig.editData.apiKey; // 支付api key
         payload.appid = lszfglConfig.editData.appid; // 公众号appid
         payload.cert = lszfglConfig.editData.cert; // 公众号secret
      }
      if (lszfglConfig.way == "add") {
        dispatch({
          type: 'lszfglConfig/updatePayload',
          payload: {
            payload_yzy:payload
          }
        });
        dispatch({
          type: 'lszfglConfig/checkName',
          payload: {}
        });
      }else{
        payload.id = lszfglConfig.editData.id
        dispatch({
          type: 'lszfglConfig/editPayMethodDetail',
          payload: payload
        });
      }

      // 判断是新增还是修改
      // if (lszfglConfig.way == "add") {
     
      //   // 新增时不需要传id
      //   dispatch({
      //     type: 'lszfglConfig/addMethod',
      //     payload: payload
      //   });
      // } else {
      //   payload.id = lszfglConfig.editData.id
      //   console.log(payload)
      //   // editPayMethodDetail
      //   dispatch({
      //     type: 'lszfglConfig/editPayMethodDetail',
      //     payload: payload
      //   });
      // }
    })
  }

  // 验证支付名称是否存在
  function payMethodNameBlur() {
    // 调用接口
    // dispatch({
    //   type: 'lszfglConfig/checkName',
    //   payload: {}
    // });
  }

    function onImgChange(e){

    if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response){
           
            if (!(e.previewImage[0].response.code == 200)) {
              alert(e.previewImage[0].response.msg); 
            }else{
              message.success('导入成功');

             let editData = lszfglConfig.editData
              editData.cert = e.previewImage[0].response.data;
              dispatch({
                type: 'lszfglConfig/updatePayload',
                payload: { editData }
              });
            }
           
            
        }
   
        
  }

   function onImgRemove(e){


  }


  return (
    <Form style={{ lineHeight: "20px" }}>
      {/*0 现金支付 4会员卡支付 1银行卡支付  8第三方支付 =================================================================================================================*/}
      {
        lszfglConfig.editData.payMethodType != 2 && lszfglConfig.editData.payMethodType != 6 &&
        <div>
          <Form.Item
            {...formItemLayout}
            label="支付名称"
          >
            {getFieldDecorator('payMethodName', {
              initialValue: lszfglConfig.editData.payMethodName,
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <input style={{ width: "100%" }} onBlur={payMethodNameBlur} onChange={payMethodNameChange} disabled={lszfglConfig.way == "edit"} />
            )}
          </Form.Item>
        </div>
      }


      {/* 支付方式为2优惠券支付时展示的内容=================================================================================================== */}
      {
        lszfglConfig.editData.payMethodType == 2 &&
        <div>
          <Form.Item
            {...formItemLayout}
            label="支付名称"
          >
            {getFieldDecorator('yhPayName', {
              initialValue: lszfglConfig.editData.payMethodName,
              rules: [{
                required: true, message: '请输入支付名称',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <Input style={{ width: "100%" }} onChange={payMethodNameChange} onBlur={payMethodNameBlur} disabled={lszfglConfig.way == "edit"} />
            )}
          </Form.Item>
          {/* <Form.Item
            {...formItemLayout}
            label="券实收"
            extra="顾客使用该类型的券会将此金额记为实收，建议填写商户与第三方平台（如美团、大众点评）的券交易价"
          >
            {getFieldDecorator('yhTrueGet', {
              initialValue: lszfglConfig.editData.actualCouponValue > 0 ? lszfglConfig.editData.actualCouponValue / 100 : "",
              rules: [
                { required: true, message: '必填信息' },
                { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: "券实收必须是大于0的小数或整数！" }
              ],

            })(
              <input placeholder="请输入券实收金额，需小于等于面值" style={{ width: "100%" }} onChange={actualCouponValueChange} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="面值"
          >
            {getFieldDecorator('yhMianzhi', {
              initialValue: lszfglConfig.editData.couponValue > 0 ? lszfglConfig.editData.couponValue / 100 : "",
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: "面值必须是大于0的小数或整数！" }
              ],
            })(
              <input placeholder="请输入面值，且面值需大于等于券实收" style={{ width: "100%" }} onChange={couponValueChange} />
            )}
          </Form.Item> */}
        </div>
      }

      {/* 支付方式为6微信支付时展示的内容===============================================================================================*/}
      {
        lszfglConfig.editData.payMethodType == 6 &&
        <div >
          {/* <Form.Item
            {...formItemLayout}
            label="渠道"
          >
            {getFieldDecorator('wxQudao', {
              initialValue: lszfglConfig.editData.channel,
            })(
              <RadioGroup onChange={channelChange}>
                <Radio value={1}>微信商户收款（已自行申请过）</Radio>
                <Radio value={2}>微信商户收款（线下代理开通）</Radio>
              </RadioGroup>
            )}
          </Form.Item> */}
          <Form.Item
            {...formItemLayout}
            label="支付名称"
          >
            {getFieldDecorator('wxZhifumingcheng', {
              initialValue: lszfglConfig.editData.payMethodName,
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],

            })(
              <input style={{ width: "100%" }} onBlur={payMethodNameBlur} onChange={payMethodNameChange} disabled={lszfglConfig.way == "edit"} />
            )}
          </Form.Item>
          {/* <Form.Item
            {...formItemLayout}
            label="您的微信支付商户号"
          >
            {getFieldDecorator('wxShanghuhao', {
              initialValue: lszfglConfig.editData.merchantNumber,
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <input style={{ width: "100%" }} onChange={merchantNumberChange} />
            )}
          </Form.Item> */}


          {/* {lszfglConfig.editData.channel==1 && 
            <div>
 <Form.Item
            {...formItemLayout}
            label="您的支付api key"
          >
            {getFieldDecorator('wxKey', {
              initialValue: lszfglConfig.editData.apiKey,
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <input style={{ width: "100%" }} onChange={apiKeyChange} />
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="您的公众号appid"
          >
            {getFieldDecorator('wxAppid', {
              initialValue: lszfglConfig.editData.appid,
              rules: [{
                required: true, message: '必填信息',
              },
              { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
            })(
              <input style={{ width: "100%" }} onChange={appidChange} />
            )}
          </Form.Item>


          <Form.Item
            {...formItemLayout}
            label="上传退款证书"
          >
            {getFieldDecorator('cert', {
              initialValue: "",
              rules: [{
                required: false, message: '必填信息',
              }],
            })(

              <UploadCert  onChange= {(e)=>{onImgChange(e)}} onRemove = {(e)=>{onImgRemove(e)}} maxCount = {1} info={"添加文件"} > </UploadCert>
            )}
          </Form.Item>
          <Form.Item style = {{display:(lszfglConfig.editData.cert == '')?'none':'block'}}
            {...formItemLayout}
            label="退款证书"
          >
              <div>已上传</div>
          
          </Form.Item>

          

            </div>

      
          


          } */}
  
        </div>

      }



      {/* 是否使用积分状态和备注每个页面都是公共的 */}

      <Form.Item
        {...formItemLayout}
        label="是否返积分"
      >
        {getFieldDecorator('alowUseJifen', {
          initialValue: lszfglConfig.editData.isUsePoint,
        })(
          <RadioGroup onChange={isUsePointChange} style={{ width: "100%" }} >
            <Radio value={1}>启用</Radio>
            <Radio value={2}>不启用</Radio>
          </RadioGroup>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="状态"
      >
        {getFieldDecorator('publickStatus', {
          initialValue: lszfglConfig.editData.state,
        })(
          <RadioGroup onChange={stateChange} style={{ width: "100%" }}>
            <Radio value={1}>启用</Radio>
            <Radio value={2}>停用</Radio>
          </RadioGroup>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="备注"
      >
        {getFieldDecorator('publicBeizhu', {
          initialValue: lszfglConfig.editData.remark,
          rules: [
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }
          ]
        })(
          <textarea style={{ width: "100%", lineHeight: "26px" }} onChange={remarkChange} />
        )}
      </Form.Item>
      <FormItem >
        <Row>
          <Col span="5" offset="11">
            <Button type="primary" htmlType="submit" onClick={sureSubmit}>确定</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>);
}
Registration.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};

const FormDetail = Form.create()(Registration);
// ========================================================================================================================


// 上面只是表单，把表单放到下面的页面中
function LsZfglPageForm({ menu, dispatch, lszfglConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };

  // 点击支付管理跳转到支付管理页面
  function toZfgl() {
    dispatch(routerRedux.push({
      pathname: "/lszfgl",
      query: {
        type: 'zfgl',
      }
    }));
  }

  // 切换改变支付方式
  function changeRadio(e) {

    // 改变支付方式时重置表单所有数据
    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { isResetForm: true }
    });

    // 每次点击新增都要重置lszfglConfig中editData中的数据,并且把最新的支付方式更新
    let restoresData = lszfglConfig.restoresData();
    restoresData.payMethodType = e.target.value;

    dispatch({
      type: 'lszfglConfig/updatePayload',
      payload: { editData: restoresData }
    });

  }



  return (
    <Header {...HeaderProps}>
      <Breadcrumb>
        <Breadcrumb.Item onClick={toZfgl} style={{ cursor: "pointer" }}>支付管理</Breadcrumb.Item>
        <Breadcrumb.Item>添加支付类型</Breadcrumb.Item>
      </Breadcrumb>
      {/* 修改时不展示redio */}


      <Row >
        <Col span="10" offset="6" >
          <Row style={{ padding: "20px 0", background: "#fafafa", marginBottom: "20px" }}>
            <Col span="6" style={{ textAlign: "right" }}>支付类型 ：</Col>
            {lszfglConfig.way == "add" &&
              <Col span="14" >
                <RadioGroup onChange={changeRadio} value={lszfglConfig.editData.payMethodType}>
                  {/* <Radio value="1">现金支付</Radio>
                  <Radio value="2">会员卡支付</Radio>
                  <Radio value="3">银行卡支付</Radio>
                  <Radio value="4">优惠券支付</Radio>
                  <Radio value="5">第三方支付</Radio>
                  <Radio value="6">微信支付</Radio> */}

                  <Radio value="0">现金支付</Radio>
                  <Radio value="1">银行卡支付</Radio>
                  <Radio value="2">优惠券支付</Radio>
                  <Radio value="4">会员卡支付</Radio>
                  <Radio value="6">微信支付</Radio>
                  <Radio value="8">第三方支付</Radio>

                </RadioGroup>
              </Col>}
            {
              lszfglConfig.way == "edit" &&
              <Col span="14">{lszfglConfig.editData.payMethodTypeName}</Col>
            }
          </Row>
          <FormDetail dispatch={dispatch} lszfglConfig={lszfglConfig} />
        </Col>
      </Row>
    </Header>
  );
}

LsZfglPageForm.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, lszfglConfig }) {
  return { menu, lszfglConfig };
}

export default connect(mapStateToProps)(LsZfglPageForm);

