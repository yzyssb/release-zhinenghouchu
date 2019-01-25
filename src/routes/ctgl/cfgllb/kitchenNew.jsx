import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
const FormItem=Form.Item
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Select from 'antd/lib/select';
const Option=Select.Option
import Modal from 'antd/lib/modal';
const confirm = Modal.confirm;
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import Breadcrumb from 'antd/lib/breadcrumb';
import styles from './kitchenNew.less'


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 8 },
}
const checkboxLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}  

const Registration = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch,
    cfgllb,
    baseInfoFormRest,
}) => {
  function resetFormTimeout(resetFields,dispatch){
    if(resetFields){
      resetFields();
    }
    if(dispatch){
      dispatch({
        type: 'cfgllb/updatePayload',
        payload: {
            baseInfoFormRest:0,
        },
      });
    }
  }

  if(baseInfoFormRest){
    setTimeout(function(){resetFormTimeout(resetFields,dispatch)},20);
  }


  function confirmAction(){
    const value=getFieldsValue()
    validateFields((errors) => {
      if (!!errors) {
        return false;
      }
      dispatch({
        type:'cfgllb/updatePayload',
        payload:{
          kitchenName:getFieldsValue().kitchenName,
          comment:getFieldsValue().comment,
          printerName:getFieldsValue().printerName,
          touchscreenId:getFieldsValue().touchscreenId
        }
      })
      if(String(cfgllb.kitchen_id).length>0){
        dispatch({
          type:'cfgllb/update',
          payload:{}
        })
      }else{
        dispatch({
          type:'cfgllb/addKitchen',
          payload:{}
        })
      }
    });
  }

  function onChange(key){
    console.log(key)
  }

  function cancelAction(){
    history.go(-1)
  }

  console.log(cfgllb.touchscreenId)
  return( 
      <Form style={{margin:50,border:'1px solid #ddd',padding:'30px 0'}}>
        <FormItem {...formItemLayout} key="1" label="厨房名称：">
          {getFieldDecorator('kitchenName', {
            initialValue: cfgllb.kitchenName,
            rules: [
              {required: true, message: '请输入厨房名称'},
              {pattern: /^[^ ]+$/, message: "请勿输入空格！"}
            ]
          })(
              <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="备注：">
          {getFieldDecorator('comment', {
            initialValue: cfgllb.comment,
            rules: [
              {required: true, message: '请输入备注'},
              {pattern: /^[^ ]+$/, message: "请勿输入空格！"}
            ]
          })(
              <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="打印机：">
          {getFieldDecorator('printerName', {
            initialValue: cfgllb.printerName,
            rules: [
              {required: true, message: '请输入打印机名称'},
              {pattern: /^[^ ]+$/, message: "请勿输入空格！"}
            ]
          })(
              <Input />
          )}
        </FormItem>
        <FormItem {...checkboxLayout} label="选择触摸屏：">
          {getFieldDecorator('touchscreenId', {
            initialValue: cfgllb.touchscreenId,
            rules: [{
                required: false, message: '请选择触摸屏',
            }]
          })(
              <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                <Row>
                  {cfgllb.touchscreen.map((value,index)=>(
                    <Col span={8} key={String(index)}><Checkbox value={String(value.id)}>{value.touchscreenName}</Checkbox></Col>
                  ))}
                  
                </Row>
              </Checkbox.Group>
          )}
          
        </FormItem>
        <Button type="primary" style={{marginLeft:'25%',marginRight:20}} onClick={confirmAction}>确定</Button>
        <Button onClick={cancelAction}>取消</Button>
      </Form>
  )
  
}
Registration.propTypes = {
    form: PropTypes.object.isRequired
};

const RegistrationForm = Form.create()(Registration);



function kitchenNew({ menu, dispatch, cfgllb }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  const {baseInfoFormRest}=cfgllb

  const ttProps={
    cfgllb,
    baseInfoFormRest,
    dispatch
  }

  function back(){
      window.history.go(-1)
  }

  return (
    <Header {...HeaderProps}>
      <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
        <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>厨房管理</Breadcrumb.Item>
            <Breadcrumb.Item>新增/修改厨房</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Spin spinning={cfgllb.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
      <RegistrationForm {...ttProps} />
    </Header>
  );
}

kitchenNew.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu,cfgllb }) {
  return { menu,cfgllb };
}

export default connect(mapStateToProps)(kitchenNew);

