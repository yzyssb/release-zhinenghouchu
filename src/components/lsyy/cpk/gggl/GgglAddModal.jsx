import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './GgglAddModal.less';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
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
    lsgggl,
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
              type: 'lsgggl/updatePayload',
              payload:{
                  id:'',
                  nameAdd:getFieldsValue(['name']).name,
                  statusAdd:getFieldsValue(['status']).status,
              }
          });
          dispatch({
              type: 'lsgggl/querySpecAdd',
              payload:{ }
          });

           dispatch({
              type: 'lsgggl/updatePayload',
              payload:{
                modalVisible:false,
              }
           });
          
          })
   
  }
  
  const modalOpts = {
    title:"新增规格",
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
    <Modal {...modalOpts} key={lsgggl.modalKey} afterClose={() => {
          
            dispatch({
                type: 'lsgggl/updatePayload', payload: {
                    modalKey: Date.now(),
                    
                }
            });
        }}>
      

    <div className={styles.pay}>
        <Form horizontal className={styles.formwidth} >
            <FormItem
                {...formItemLayout}
                label="规格名称 "
                
            >
                {getFieldDecorator('name', {
                    initialValue:"",
                    rules: [
                        {
                            validator: (rule, value, callback) => {
                                if (lsgggl.id) {
                                   dispatch({
                                        type: 'lsgggl/checkName',
                                        payload: {"callback": callback, "value": value,"id":lsgggl.id}
                                    });
                                } else {
                                    dispatch({
                                        type: 'lsgggl/checkName',
                                        payload: { "callback": callback, "value": value }
                                    });
                                }
                            }
                        },
                        { required: true, message: '请输入规格名称' }
                    ]
                })(
                    <Input  />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="状态"
                
            >
                {getFieldDecorator('status', {
                    initialValue: 1,
                    rules: [{
                        required: true, message: '请选择状态',
                    }],
                })(
                     <RadioGroup>
                        <Radio value={1}>启用</Radio>
                        <Radio value={2}>停用</Radio>
                     </RadioGroup>
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
