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
const ZfEditModal = ({

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
    gggl,
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
                type: 'gggl/updatePayload',
                payload:{

                    id:gggl.id,
                    name:getFieldsValue(['name']).name,
                    status:getFieldsValue(['status']).status,
                }
            });
            dispatch({
                type: 'gggl/querySpecEdit',
                payload:{
                }
            });

             dispatch({
                type: 'gggl/updatePayload',
                payload:{
                    modalEditVisible:false,
                }
             });
            })

   
  }
  
  const modalOpts = {
    title:"编辑规格",
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
      type: 'order/updatePayload',
      payload:{
       pay_way:e, 
      }
    });

  }



  return (
    <Modal {...modalOpts} key={gggl.modalKey} afterClose={() => {
          
            dispatch({
                type: 'gggl/updatePayload', payload: {
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
                    initialValue:gggl.name,
                    rules: [
                        {
                            validator: (rule, value, callback) => {
                                if (gggl.id) {
                                   dispatch({
                                        type: 'gggl/checkName',
                                        payload: {"callback": callback, "value": value,"id":gggl.id}
                                    });
                                } else {
                                    dispatch({
                                        type: 'gggl/checkName',
                                        payload: { "callback": callback, "value": value }
                                    });
                                }
                            }
                        },
                        { required: true, message: '请输入规格名称' }
                    ]
                })(
                    <Input disabled={gggl.manageType == 1} />
                )}
            </FormItem>
            <FormItem
                {...formItemLayout}
                label="状态"
                
            >
                {getFieldDecorator('status', {
                    initialValue: gggl.status,
                    rules: [{
                        required: true, message: '请选择状态',
                    }],
                })(
                    <RadioGroup disabled={gggl.manageType == 1} >
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

ZfEditModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ZfEditModal);
