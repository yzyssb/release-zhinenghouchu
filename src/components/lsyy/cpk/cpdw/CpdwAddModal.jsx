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
    lscpdw,
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
            type: 'lscpdw/addDW',
            payload:{
             code:getFieldsValue(['dwCode']).dwCode, 
             english:getFieldsValue(['dwEnglishName']).dwEnglishName,
             id:'',
             name:getFieldsValue(['dwName']).dwName,
             remark:getFieldsValue(['dwComment']).dwComment,
             status:getFieldsValue(['dwChecked']).dwChecked,
            }
          });

          dispatch({
                type: 'lscpdw/updatePayload',
                payload:{
                  modalVisible:false,
                }
              });
         
         }
     )}
  
  const modalOpts = {
    title:lscpdw.isAdd?"新增菜品单位":"编辑菜品单位",
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
    <Modal {...modalOpts} key={lscpdw.modalKey} afterClose={() => {
          
            dispatch({
                type: 'lscpdw/updatePayload', payload: {
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
              initialValue:lscpdw.code,
              rules: [
                {
                    validator: (rule, value, callback) => {
                        if (lscpdw.id) {
                           dispatch({
                                type: 'lscpdw/checkQuickCode',
                                payload: {"callback": callback, "value": value,"id":lscpdw.id}
                            });
                        } else {
                            dispatch({
                                type: 'lscpdw/checkQuickCode',
                                payload: { "callback": callback, "value": value }
                            });
                        }
                    }
                },
                { required: true, message: '请输入单位编码' },
                {pattern:/^[0-9]*$/, message: '请输入纯数字'}
              ]
            })(
                 <Input  />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="单位名称"
            
          >
            {getFieldDecorator('dwName', {
              initialValue:lscpdw.name,
              rules: [
              {
                  validator: (rule, value, callback) => {
                      if (lscpdw.id) {
                          dispatch({
                              type: 'lscpdw/checkName',
                              payload: {"callback": callback, "value": value,"id":lscpdw.id}
                          });
                      } else {
                          dispatch({
                              type: 'lscpdw/checkName',
                              payload: { "callback": callback, "value": value }
                          });
                      }
                  }
              },
              {
                required: true, message: '请输入单位名称',
              }],
            })(
              <Input  />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="单位英文名称"
            
          >
            {getFieldDecorator('dwEnglishName', {
              initialValue:lscpdw.english,
              rules: [{
                required: false, message: '请输入快递单号',
              }],
            })(
              <Input  />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="是否启用"
            
          >
            {getFieldDecorator('dwChecked', {
              initialValue:lscpdw.status,
              rules: [{
                required: true
              }],
            })(
              <RadioGroup>
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
              initialValue:lscpdw.remark,
              rules: [{
                required: false, message: '请输入快递单号',
              }],
            })(
              <Input  />
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
