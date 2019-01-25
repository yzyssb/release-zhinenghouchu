import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './BindingCashier.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

const formItemLayout = {
	labelCol: {
		span: 6,
	},
	wrapperCol: {
		span: 14,
	},
};

const BindingCashier=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,
}) => {
	

	 function handleSubmit(e) {
	    if(e){
	    	e.preventDefault();
	    }

	   	validateFields((errors) => {
	      if (!!errors) {
	        return;
	      }
	    });

	    var data={...getFieldsValue()};
	   
			//dispatch({type: 'orderlist/recoverOrderTime',payload:{}});
 			 
       }

	return (
		 <div className={styles.search}>
		    <Form inline onSubmit={handleSubmit}>
		    
		      <Form.Item
		        label="备注名称" 
		        {...formItemLayout}
		      >
		        {getFieldDecorator('keyword')(
		          <Input type="text" size="default" style={{marginLeft:35, width: 150 }} />
		        )}
		      </Form.Item>
		      
		      <Form.Item
		      	{...formItemLayout}
		      >
		      	<Button size="default" style={{marginLeft: '10px' , marginRight: '10px' }} type="primary" htmlType="submit">搜索</Button>
		      </Form.Item>
		      
		    </Form>
		  </div>
	);
};

BindingCashier.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(BindingCashier);