import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from '../cdgl/cpxx/CpAddModal.less';
const FormItem = Form.Item;
import Steps from 'antd/lib/steps';
const Step = Steps.Step;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
import Checkbox from 'antd/lib/checkbox';
import UploadFile from '../../../components/base/common/UploadFile';
import Rate  from 'antd/lib/rate';
import message from 'antd/lib/message';

const CtaiImportModal = ({
  dispatch,
                             ctaigl,
 
}) => {
  
 const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    };
 
  function handleOk() {
      
    dispatch({type: 'ctaigl/updatePayload',payload:{importModalVisible:false}});
  
  }

  function cancel(){
    dispatch({type: 'ctaigl/updatePayload',payload:{importModalVisible:false}});
  }

  function onImgChange(e){

    console.log(e)

    if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response){
            message.success(e.previewImage[0].response.msg);   
        }
   
        
  }

  function onImgRemove(e){


  }

  
  const modalOpts = {
    title:"菜品导入",
    visible:ctaigl.importModalVisible,
    onOk:handleOk,
    onCancel:cancel,
    okText:"确定",
    cancelText:"取消"
  };


       

  return (
    <Modal {...modalOpts} >
      

    <div className={styles.pay}>
        <UploadFile  onChange= {(e)=>{onImgChange(e)}} maxCount = {1} info={"添加文件"} onRemove = {(e)=>{onImgRemove(e)}} > </UploadFile>

        <a href = 'https://gds.27aichi.com/foodImportFile/foodTemplate.xls' >请选择相应的下载模板</a>

        <div> 导入后将新增菜品，新增菜品编码、名称不可与现有菜品重复!!!</div>

       
    </div>
    </Modal>
  );
};



export default Form.create()(CtaiImportModal);
