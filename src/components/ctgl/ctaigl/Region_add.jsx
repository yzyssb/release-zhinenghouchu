import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import  DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import styles from '../yybz/ReasonAddModal.less';
import ReasonAddModal from '../yybz/ReasonAddModal.jsx';
import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
const FormItem = Form.Item;
import InputNumber from 'antd/lib/input-number';
const TabPane = Tabs.TabPane;

const Region_add = ({ctaigl,dispatch,form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
}

                    }) => {
    const ReasonAddModalProps = {

        visible: ctaigl.modalRegionAddVisible,
        title:"新增餐台区域",
        okText:"确定",
        cancelText:"取消",
        dispatch,
        onOk() {
            validateFields((errors, values) => {
                if (!!errors) {
                    console.log('Errors in form!!!');
                    return;
                }
                dispatch({
                    type: 'ctaigl/addRegion',
                    payload:{}
                });
                dispatch({
                    type: 'ctaigl/updatePayload',
                    payload:{modalRegionAddVisible:false}
                });
            });

        },
        onCancel() {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload:{modalRegionAddVisible:false}
            });
        },
        ctaigl,
    };
    if (ctaigl.isResetForm) {
        setTimeout(function () {
            resetFormTimeout(resetFields, dispatch)
        }, 20);
    }

    function resetFormTimeout(resetFields, dispatch) {
        if (resetFields) {
            resetFields();
        }
        if (dispatch) {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload: {isResetForm: false}
            });
        }
    }
    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    function addRegionItem(e) {
        ctaigl.addRegionItem.regionName = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.addRegionItem}
        });
    };
    function setSeatNum(e) {
            ctaigl.addRegionItem.seatNum = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.addRegionItem}
        });
    };
    function setPayDetail(e) {
        ctaigl.addRegionItem.payDetail = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.payDetail}
        });
    };

    function onChange1(e) {
        ctaigl.item.tableName = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChangeRemark(e) {
        ctaigl.item.remark = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };

    var cuisineOptionHtml=[];

    if(ctaigl.regionList){
        ctaigl.regionList.map((j) => {
            cuisineOptionHtml.push ( <Option key={j.id}>{j.regionName}</Option>)


        })
    }
    function managerRegion(e){

        var reValue ;
        if(ctaigl.regionList){
            ctaigl.regionList.map((j) => {
                if(j.id==e.regionId)
                {
                    reValue =  j.regionName;
                }
            })
        }
        return reValue;
    }
    return(
        <Modal  {...ReasonAddModalProps}key={ctaigl.modalKey} afterClose={() => {

            dispatch({
                type:'ctaigl/updatePayload', payload: {
                    modalKey: Date.now(),

                }
            });
        }}>
            <div className={styles.pay}>
                <Form className={styles.formwidth}   >
                    <FormItem
                        {...formItemLayout}
                        label="区域名称"
                        
                    >
                        {getFieldDecorator('ctaino', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入区域名称',
                            }],
                        })(
                            <Input   placeholder ={'填写区域名称'}  onChange={addRegionItem}  />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="座位数"
                        
                        required
                    >
                        {getFieldDecorator('ctainame', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入座位数!',
                            }],
                        })(
                            <InputNumber className={styles.inputnumber} placeholder ={'填写座位数,必须是数字！'}  onChange={setSeatNum} />
                        )}


                    </FormItem>
                    {/*<FormItem  label="是否提成" {...formItemLayout}  >*/}
                        {/*<Checkbox onChange={onChange1}> </Checkbox>*/}
                    {/*</FormItem>*/}

                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        
                    >
                        {getFieldDecorator('ctairemark', {
                        })(
                        <Input onChange={onChangeRemark}/>
                        )}
                    </FormItem>
                </Form>

            </div>
        </Modal>
    );

};

export default Form.create()(Region_add);