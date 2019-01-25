import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './LabelAddModal.less';
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
    lslabel,
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

            if (lslabel.isAdd){

                dispatch({
                    type: 'lslabel/addLabel',
                    payload:{
                        id:'',
                        name:getFieldsValue(['name']).name,
                    }
                });

            }else{
                dispatch({
                    type: 'lslabel/addLabel',
                    payload:{
                        id:lslabel.id,
                        name:getFieldsValue(['name']).name,
                    }
                });
            }
    

          dispatch({
                type: 'lslabel/updatePayload',
                payload:{
                  modalVisible:false,
                }
              });
         
         }
     )}
  
  const modalOpts = {
    title:lslabel.isAdd?"新增菜品单位":"编辑菜品单位",
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
    <Modal {...modalOpts} key={lslabel.modalKey} afterClose={() => {
          
            dispatch({
                type: 'lslabel/updatePayload', payload: {
                    modalKey: Date.now(),
                    
                }
            });
        }}>
      

    <div className={styles.pay}>
      <Form className={styles.formwidth}>

          <FormItem
            {...formItemLayout}
            label="主类名称"
            extra="最长不能超过6个字"
          >
            {getFieldDecorator('name', {
              initialValue:lslabel.name,
              rules: [
              {
                  validator: (rule, value, callback) => {
                      if (lslabel.id) {
                          dispatch({
                              type: 'lslabel/checkName',
                              payload: {"callback": callback, "value": value,"id":lslabel.id}
                          });
                      } else {
                          dispatch({
                              type: 'lslabel/checkName',
                              payload: { "callback": callback, "value": value }
                          });
                      }
                  }
              },
              {
                required: true, message: '请输入主类名称',
              }],
            })(
              <Input maxLength={6}/>
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
