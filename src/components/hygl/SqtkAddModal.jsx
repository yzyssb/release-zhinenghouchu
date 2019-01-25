import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './JfgzAddModal.less';
import { config } from '../../services/HttpService';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import UpLoadImage from "../base/common/UpLoadImage";
import jfgz from "../../models/hygl/hyandhyksz/jfgz/jfgz";
import {getUserToken} from "../../services/CommonService";

const SqtkAddModal = ({
                          sqtkVisible,
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
                      }) => {


    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };




    function handCancel() {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {
                sqtkVisible:false
            }
        });

    }

    function handleOk() {
        dispatch({
            type: 'jfgz/updatePayload',
            payload: {
                sqtkVisible:false
            }
        });
        dispatch({
            type: 'jfgz/applyBackCard',
            payload: {fileInfo:jfgz.fileInfo
            }
        });

    }
    const modalOpts = {
        title: "上传审核资料",
        visible:sqtkVisible,
        onOk: handleOk,
        onCancel,
        currentItem,

    };
    function onImgRemove(e) {
        dispatch({type: 'jfgz/updatePayload',payload:{fileInfo:''}});
    };

    function onImgChange(e) {
        console.log(e)
        if(e.previewImage &&e.previewImage.length>0 && e.previewImage[0].response && e.previewImage[0].response.data){
            console.log(e.previewImage[0].response.data)
            dispatch({type:'jfgz/updatePayload',payload:{fileInfo:e.previewImage[0].response.data}});
        }
    };
    return (
        <Modal
            {...modalOpts}visible={sqtkVisible}  onCancel={handCancel} afterClose={() => {
            resetFields()
        }}
               footer={[
                   <Button key="back" onClick={handCancel}>取消</Button>,
                   <Button key="submit" type="primary" onClick={handleOk}>提交退卡审核</Button>
               ]} >
            <div className={styles.outside}>
                <div className={styles.sendImg}>
                    <UpLoadImage  action={config.uploadUrl+getUserToken()} maxCount = {1} onChange= {(e)=>{onImgChange(e)}} info={"请选择小于2MB的照片"} onRemove = {(e)=>{onImgRemove(e)}}> </UpLoadImage>
                </div>
            </div>
        </Modal>
    )
        ;
};

SqtkAddModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(SqtkAddModal);
