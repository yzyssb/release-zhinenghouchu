import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpflAddModal.less';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
import InputNumber from 'antd/lib/input-number';
const RadioGroup = Radio.Group;
const ZfAddModal = ({

  visible,
  onOk,
  onCancel,
  currentItem,
  dispatch,
   form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
      resetFields,
      setFieldsValue,
    },
    cpfl,
}) => {
  
  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const Option = Select.Option;
  
  
 
  function handleOk() {

      validateFields((errors) => {
          if (!!errors) {
              return false;
          }

          var isChecked;
          if (getFieldsValue(['status']).status == '启用') {
              isChecked = 1;

          }

          if (cpfl.isAdd) {
              dispatch({
                  type: 'cpfl/addCPFL',
                  payload: {
                      code: getFieldsValue(['code']).code,
                      english: getFieldsValue(['english']).english,
                      id: '',
                      name: getFieldsValue(['name']).name,
                      remark: getFieldsValue(['remark']).remark,
                      status: getFieldsValue(['status']).status,
                  }
              });
          } else {
              dispatch({
                  type: 'cpfl/addCPFL',
                  payload: {
                      code: getFieldsValue(['code']).code,
                      english: getFieldsValue(['english']).english,
                      id: cpfl.id,
                      name: getFieldsValue(['name']).name,
                      remark: getFieldsValue(['remark']).remark,
                      status: getFieldsValue(['status']).status,
                  }
              });

          }

          dispatch({
              type: 'cpfl/updatePayload',
              payload: {
                  modalVisible: false
              }
          });
      })


}
  
  const modalOpts = {
    title:cpfl.isAdd?"新增菜品分类":"编辑菜品分类",
    visible,
    onOk:handleOk,
    onCancel,
    currentItem,
    okText:"确定",
    cancelText:"取消"

  };

  function changeemaildisabled() {
    
    document.getElementsByName('email')[0].disabled=false;
    
  }

  const dateFormat = 'YYYY-MM-DD';

  function ontimechange(date, dateString){
    dispatch({type: 'order/updateOrderTime',payload:{ordertime1:dateString[0],ordertime2:dateString[1]}});
  }

  function onChange(e) {
     
     dispatch({
      type: 'cpfl/updatePayload',
      payload:{
       status:e, 
      }
    });

  }

  return (
    <Modal {...modalOpts}>
      

    <div className={styles.pay}>
      <Form horizontal className={styles.formwidth} >
          <FormItem
            {...formItemLayout}
            label="菜类编码 "
            
          >
            {getFieldDecorator('code', {
              initialValue:cpfl.code,
              rules: [
                { required: true, message: '请输入菜类编码' },
                {pattern:/^[0-9]*$/, message: '请输入纯数字'}
              ]
            })(
                 <InputNumber  disabled={cpfl.manageType == 1} className={styles.inputnumber} min={0} max={Infinity}  />
            )}
          </FormItem>
          

          <FormItem
            {...formItemLayout}
            label="菜类名称"
            
          >
            {getFieldDecorator('name', {
              initialValue:cpfl.name,
              rules: [{
                required: true, message: '请输入菜类名称',
              }],
            })(
               <Input disabled={cpfl.manageType == 1}  />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="菜类英文名称"
            
          >
            {getFieldDecorator('english', {
              initialValue:cpfl.english,
              rules: [{
                required: false, message: '请输入菜类英文名称',
              }],
            })(
               <Input disabled={cpfl.manageType == 1}  />
            )}
          </FormItem>


          <FormItem
              {...formItemLayout}
              label="状态"
              
            >
              {getFieldDecorator('status', {
              initialValue: cpfl.status,
                rules: [{
                  required: true, message: '请选择状态',
                }],
              })(
               <RadioGroup disabled={cpfl.manageType == 1}>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>停用</Radio>
               </RadioGroup>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
            
          >
            {getFieldDecorator('remark', {
              initialValue:cpfl.remark,
              rules: [{
                required: false, message: '请输入备注',
              }],
            })(
              <Input disabled={cpfl.manageType == 1}/>
            )}
          </FormItem>

          
        </Form>
        
    </div>
    </Modal>
  );
};

ZfAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ZfAddModal);
