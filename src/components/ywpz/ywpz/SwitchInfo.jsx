import React, { PropTypes } from 'react';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Rate from 'antd/lib/rate';
import InputNumber from 'antd/lib/input-number';
import DatePicker from 'antd/lib/date-picker';
import Table from 'antd/lib/table';
import styles from './SwitchInfo.less';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

import UpLoadImage from '../../../components/base/common/UpLoadImage';
import UploadMorePicture from '../../../components/base/common/UpLoadMorePicture';


import Radio from "antd/lib/radio";
const RadioGroup = Radio.Group;
import message from 'antd/lib/message';

import Form from 'antd/lib/form';
const FormItem=Form.Item;
import Switch from 'antd/lib/switch';
import WaimaiModal from './WaimaiModal';
import {config} from "../../../services/HttpService";
import {getRestaurantId,getCompanyId,getWxToken,getWxState} from '../../../services/CommonService';
const SystemInfo=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,ywpz
}) => {

    const WaimaiModalProps = {
        dispatch,
        ywpz
    };





	return (
		 <div >
             <div style={{ width: "100%", height:40,background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>

                 <div style={{float:'left',marginLeft:10}}>自营外卖</div>
                 <Switch style={{float:'left',marginTop:10,marginLeft:30}} checkedChildren="开" unCheckedChildren="关" checked = {ywpz.homeTakeoutState == 1} onChange = {(checked)=>{

                     if (checked){

                         dispatch({type: 'ywpz/updatePayload', payload: {homeTakeoutState:1}});
                         dispatch({type: 'ywpz/setHomeTakeoutState', payload: {}});
                     }else {

                         dispatch({type: 'ywpz/updatePayload', payload: {homeTakeoutState:2}});
                         dispatch({type: 'ywpz/setHomeTakeoutState', payload: {}});
                     }

                 }}/>

                 <a style={{float:'right',marginRight:30}} onClick={()=>{

                     dispatch({type: 'ywpz/updatePayload', payload: {modalVisible:true}});
                     dispatch({type: 'ywpz/zyTakeoutQueryConfig', payload: {}});



                 }}>编辑</a>

                 <a download style={{float:'right',display:ywpz.homeTakeoutState == 1?'block':'none'}} onClick={()=>{


                     var prefixUrl;

                     const host = window.location.protocol + '//' + window.location.host;

                     if (host == 'http://localhost:8989') {

                         prefixUrl = "http://dev.saas.27aichi.cn/";

                     } else {

                         prefixUrl = window.location.protocol + '//' + window.location.host + '/';

                     }
                     if (getWxState() == 1){

                         window.location = prefixUrl + 'open/weixin/order-zycompany.jpg' + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}&t=${getWxToken()}`;

                     } else{
                         message.warning('公众号未授权')
                     }


                 }}>下载外卖二维码</a>
             </div>

             <div style={{ width: "100%", height:40,background: "#eee", lineHeight: "40px", fontWeight: "700", textIndent: "10px", marginBottom: "40px" }}>

                 <div style={{float:'left',marginLeft:10}}>打包外带</div>
                 <Switch style={{float:'left',marginTop:10,marginLeft:30}} checkedChildren="开" unCheckedChildren="关" checked = {ywpz.packageTakeoutState == 1} onChange = {(checked)=>{

                     if (checked){

                         dispatch({type: 'ywpz/updatePayload', payload: {packageTakeoutState:1}});
                         dispatch({type: 'ywpz/setPackageTakeoutState', payload: {}});
                     }else {

                         dispatch({type: 'ywpz/updatePayload', payload: {packageTakeoutState:2}});
                         dispatch({type: 'ywpz/setPackageTakeoutState', payload: {}});
                     }

                 }}/>

                 <a style={{float:'right',display:ywpz.packageTakeoutState == 1?'block':'none',marginRight:68}} onClick={()=>{

                     var prefixUrl;

                     const host = window.location.protocol + '//' + window.location.host;

                     if (host == 'http://localhost:8989') {

                         prefixUrl = "http://dev.saas.27aichi.cn/";

                     } else {

                         prefixUrl = window.location.protocol + '//' + window.location.host + '/';

                     }
                     if (getWxState() == 1){

                         window.location = prefixUrl + 'open/weixin/takeout.jpg' + `?companyId=${getCompanyId()}&restaurantId=${getRestaurantId()}&t=${getWxToken()}`;

                     } else{
                         message.warning('公众号未授权')
                     }



                 }}>下载外带二维码</a>
             </div>

             <WaimaiModal {...WaimaiModalProps}/>

		  </div>
	);
};


		      
		      
SystemInfo.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(SystemInfo);