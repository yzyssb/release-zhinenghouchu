import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpAddModal.less';
const FormItem = Form.Item;
import Steps from 'antd/lib/steps';
const Step = Steps.Step;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Checkbox from 'antd/lib/checkbox';
import UploadFile from '../../../../components/base/common/UploadFile';
import Rate  from 'antd/lib/rate';
import message from 'antd/lib/message';

const CpAddModal = ({
  dispatch,
  lscpxx,
 
}) => {
  
 const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    };
 
  function handleOk() {
      
    dispatch({type: 'lscpxx/updatePayload',payload:{importModalVisible:false}});
  
  }

  function cancel(){
    dispatch({type: 'lscpxx/updatePayload',payload:{importModalVisible:false}});
  }



  function onImgChange(e){

    if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response){
           
            if (!(e.previewImage[0].response.code == 200)) {
              alert(e.previewImage[0].response.data); 
            }else{
              alert('导入成功');
              dispatch({type: 'lscpxx/query',payload:{}});
            }
           
            
        }
   
        
  }


  function onImgRemove(e){


  }

  
  const modalOpts = {
    title:"菜品导入",
    visible:lscpxx.importModalVisible,
    onOk:handleOk,
    onCancel:cancel,
    okText:"确定",
    cancelText:"取消"
  };


       

  return (
    <Modal {...modalOpts} >
      

    <div className={styles.pay}>
        <UploadFile  onChange= {(e)=>{onImgChange(e)}} maxCount = {1} info={"添加文件"} onRemove = {(e)=>{onImgRemove(e)}} > </UploadFile>

        <a href = 'http://27aichi-saas.oss-cn-beijing.aliyuncs.com/foodTemplate.xls' >请选择相应的下载模板</a>

        <div> 导入后将新增菜品，新增菜品编码、名称不可与现有菜品重复!!!</div>

       
    </div>
    </Modal>
  );
};



export default Form.create()(CpAddModal);
