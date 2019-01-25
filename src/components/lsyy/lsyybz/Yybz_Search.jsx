import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './Yybz_Search.less';
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

const Yybz_Search=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,lsyybz
}) => {
	

	    function onKeywordChange(e){
	      dispatch({type: 'lsyybz/updatePayload',payload:{keyword:e.target.value}});
	    }

	    function onSearch(){
				dispatch({type: 'lsyybz/updatePayload',payload:{selectedRowKeys:[]}});
	     dispatch({type: 'lsyybz/query',payload:{comment:lsyybz.keyword}});
	    }


	return (
		 <div className={styles.search}>
		    
		        <label>备注名称</label>
		        
		        <Input type="text" size="default" style={{marginLeft:29, width: 150 }} value = {lsyybz.keyword} onChange = {onKeywordChange}/>

		      	<Button size="default" style={{marginLeft: '10px' , marginRight: '10px' }} type="primary" onClick = {onSearch}>搜索</Button>
	
		  </div>
	);
};

Yybz_Search.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(Yybz_Search);