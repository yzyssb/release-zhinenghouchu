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


const RadioGroup = Radio.Group;
const FormItem = Form.Item;


// form表单
const CmpglFormDetail = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  }, dispatch, cmpglPageConfig
}) => {

  // console.log(dispatch)

  // 每次重载页面时检测zfglPageConfig.isResetForm的值，如果为真就重置数据，一定要加延时
  if (cmpglPageConfig.isResetForm) {
    setTimeout(function () { resetFormTimeout(resetFields, dispatch) }, 20);
  }
  function resetFormTimeout(resetFields, dispatch) {
    if (resetFields) {
      resetFields();
    }
    if (dispatch) {
      dispatch({
        type: 'cmpglPageConfig/updatePayload',
        payload: { isResetForm: false }
      });
    }
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };


  // 点击提交表单
  function sureSubmit() {
    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      // 验证通过后执行的逻辑接着执行筛选的样式
      console.log("执行自己的逻辑")
      if (cmpglPageConfig.way == "add") {
        // console.log("新增")
        dispatch({
          type: 'cmpglPageConfig/addTouchList',
          payload: getFieldsValue()
        });
      }

      if (cmpglPageConfig.way == "edit") {
        // console.log("修改")
        dispatch({
          type: 'cmpglPageConfig/editCmpglList',
          payload: getFieldsValue()
        });
      }
    })
  }








  return (

    <Form style={{ lineHeight: "20px" }}>

      <Form.Item
        {...formItemLayout}
        label="触摸屏名称"
      >
        {getFieldDecorator('touchscreenName', {
          initialValue: cmpglPageConfig.editData.touchscreenName,
          rules: [{
            required: true, message: '必填信息',
          },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
        })(
          <input style={{ width: "100%" }} />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="IP地址"
      >
        {getFieldDecorator('touchscreenIp', {
          initialValue: cmpglPageConfig.editData.touchscreenIp,
          rules: [{
            required: true, message: '必填信息',
          },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
        })(
          <input style={{ width: "100%" }} />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="触摸屏类型"
      >
        {getFieldDecorator('touchscreenType', {
          initialValue: cmpglPageConfig.editData.touchscreenType,
          rules: [{
            required: true, message: '必填信息',
          }],
        })(
          <RadioGroup style={{ width: "100%" }}>

            <Radio value={1}>厨师端</Radio>
            <Radio value={2}>传菜端</Radio>
            <Radio value={3}>撤台端</Radio>
          </RadioGroup>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="是否打印小票"
      >
        {getFieldDecorator('isPrintReceipt', {
          initialValue: cmpglPageConfig.editData.isPrintReceipt,
          rules: [{
            required: true, message: '必填信息',
          }],
        })(
          <RadioGroup style={{ width: "100%" }}>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </RadioGroup>
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="对应打印机"
      >
        {getFieldDecorator('printerIp', {
          initialValue: cmpglPageConfig.editData.printerIp,
          rules: [{
            required: true, message: '必填信息',
          },
            { pattern: /^[^ ]+$/, message: "请勿输入空格！" }],
        })(
          <input style={{ width: "100%" }} />
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label="是否可用"
      >
        {getFieldDecorator('state', {
          initialValue: cmpglPageConfig.editData.state,
          rules: [{
            required: true, message: '必填信息',
          }],
        })(
          <RadioGroup style={{ width: "100%" }}>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
          </RadioGroup>
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
CmpglFormDetail.propTypes = {
  form: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
  onAdd: PropTypes.func,
  field: PropTypes.string,
  keyword: PropTypes.string,
};


const CmpglFormDetails = Form.create()(CmpglFormDetail);
// ========================================================================================================================


// 上面只是表单，把表单放到下面的页面中
function cmpglForm({ menu, dispatch, cmpglPageConfig }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  // 点击触摸屏管理去触摸屏管理页面
  function toCmpgl() {
    /*dispatch(routerRedux.push({
      pathname: "/cmpgl",
      query: {
        type: 'cmpgl',
      }
    }));*/
    window.history.go(-1)
  }

  return (
    <Header {...HeaderProps}>
      <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item style={{ cursor: "pointer" }} onClick={toCmpgl}>触摸屏管理</Breadcrumb.Item>
          {cmpglPageConfig.way == "add" ?
            <Breadcrumb.Item>新增触摸屏</Breadcrumb.Item> :
            <Breadcrumb.Item>修改触摸屏</Breadcrumb.Item>
          }

        </Breadcrumb>
      </div>
      <Row style={{ paddingTop: "50px" }}>
        <Col span="14" offset="5">
          <CmpglFormDetails dispatch={dispatch} cmpglPageConfig={cmpglPageConfig} />
        </Col>
      </Row>


    </Header>
  );
}

cmpglForm.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, cmpglPageConfig }) {
  return { menu, cmpglPageConfig };
}

export default connect(mapStateToProps)(cmpglForm);

