import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpdwAddModal.less';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
const CpdwAddModal = ({

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
    cpdw,
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

        dispatch({
            type: 'cpdw/addDW',
            payload:{
             code:getFieldsValue(['dwCode']).dwCode, 
             english:getFieldsValue(['dwEnglishName']).dwEnglishName,
             id:cpdw.id,
             name:getFieldsValue(['dwName']).dwName,
             remark:getFieldsValue(['dwComment']).dwComment,
             status:getFieldsValue(['dwChecked']).dwChecked,
            }
          });
    
        dispatch({
              type: 'cpdw/updatePayload',
              payload:{
                modalEditVisible:false,
              }
            });
       })
  
  
  }
  
  const modalOpts = {
    title:cpdw.isAdd?"新增菜品单位":"编辑菜品单位",
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


  return (
    <Modal {...modalOpts} key={cpdw.modalKey} afterClose={() => {
          
            dispatch({
                type: 'cpdw/updatePayload', payload: {
                    modalKey: Date.now(),
                    
                }
            });
        }}>
      

    <div className={styles.pay}>
      <Form horizontal className={styles.formwidth}>
          <FormItem
            {...formItemLayout}
            label="单位编码 "
            
          >
            {getFieldDecorator('dwCode', {
              initialValue:cpdw.code,
              rules: [
                {
                    validator: (rule, value, callback) => {
                        if (cpdw.id) {
                           dispatch({
                                type: 'cpdw/checkQuickCode',
                                payload: {"callback": callback, "value": value,"id":cpdw.id}
                            });
                        } else {
                            dispatch({
                                type: 'cpdw/checkQuickCode',
                                payload: { "callback": callback, "value": value }
                            });
                        }
                    }
                },
                { required: true, message: '请输入单位编码' },
                {pattern:/^[0-9]*$/, message: '请输入纯数字'}
              ]
            })(
                 <Input disabled={cpdw.manageType == 1} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="单位名称"
            
          >
            {getFieldDecorator('dwName', {
              initialValue:cpdw.name,
              rules: [
              {
                  validator: (rule, value, callback) => {
                      if (cpdw.id) {
                          dispatch({
                              type: 'cpdw/checkName',
                              payload: {"callback": callback, "value": value,"id":cpdw.id}
                          });
                      } else {
                          dispatch({
                              type: 'cpdw/checkName',
                              payload: { "callback": callback, "value": value }
                          });
                      }
                  }
              },
              {
                required: true, message: '请输入单位名称',
              }],
            })(
              <Input disabled={cpdw.manageType == 1} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="单位英文名称"
            
          >
            {getFieldDecorator('dwEnglishName', {
              initialValue:cpdw.english,
              rules: [{
                required: false, message: '请输入快递单号',
              }],
            })(
              <Input disabled={cpdw.manageType == 1} />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="是否启用"
            
          >
            {getFieldDecorator('dwChecked', {
              initialValue:cpdw.status,
              rules: [{
                required: true
              }],
            })(
              <RadioGroup disabled={cpdw.manageType == 1}>
                <Radio value={1}>启用</Radio>
                <Radio value={2}>停用</Radio>
             </RadioGroup>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="备注"
            
          >
            {getFieldDecorator('dwComment', {
              initialValue:cpdw.remark,
              rules: [{
                required: false, message: '请输入快递单号',
              }],
            })(
              <Input disabled={cpdw.manageType == 1} />
            )}
          </FormItem>
        </Form>

    </div>
    </Modal>
  );
};

CpdwAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(CpdwAddModal);
