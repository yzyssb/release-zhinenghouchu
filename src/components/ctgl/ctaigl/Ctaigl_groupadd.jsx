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

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
import Col from 'antd/lib/col';

const Ctaigl_groupadd = ({ctaigl,dispatch,form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
}

                    }) => {
    const ReasonAddModalProps = {

        visible: ctaigl.modalGroupAddVisiable,
        title:"批量新增餐台",
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
                    type: 'ctaigl/addGroupTable',
                    payload:{}
                });
                dispatch({
                    type: 'ctaigl/updatePayload',
                    payload:{modalGroupAddVisiable:false}
                });
            });

        },
        onCancel() {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload:{modalGroupAddVisiable:false}
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
    function onChangeTableStartCode(e) {
        ctaigl.groupItem.startCode = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChangeTableEndCode(e) {
        ctaigl.groupItem.endCode = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChangeTableName(e) {
        ctaigl.groupItem.tableNamePrefix = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChangeSeatNum(e) {
        ctaigl.groupItem.seatNum = e.target.value==undefined?"":e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChangeWaiter(e) {
        ctaigl.groupItem.waiterId = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChangeEatInRestaurant(e) {
        ctaigl.groupItem.eatInRestaurant = e.target.checked;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };
    function onChange1(e) {
        ctaigl.groupItem.delete4713 = e.target.checked;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.groupItem}
        });
    };

    var cuisineOptionHtml=[];

    if(ctaigl.regionList){
        ctaigl.regionList.map((j) => {
            cuisineOptionHtml.push ( <Select.Option key={j.id}>{j.regionName}</Select.Option>)


        })
    }
    var waitersListHtml=[];

    if(ctaigl.waiters){
        ctaigl.waiters.map((j) => {
            waitersListHtml.push ( <Select.Option key={j.id}>{j.name}</Select.Option>)


        })
    }
    function onChangeRegion(e) {
        ctaigl.item.regionId = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };


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
                        label="餐台编号"
                        
                    >

                            <Col span="11">
                        {getFieldDecorator('ctaistartno', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入起始编号',
                            }],
                        })(
                            <Input   placeholder ={'起始编号'}  onChange={onChangeTableStartCode}  />
                        )}
                            </Col>
                            <Col span="2"><span>至</span></Col>

                            <Col span="11">
                        {getFieldDecorator('ctaiendno', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入结束编号',
                            }],
                        })(
                            <Input   placeholder ={'结束编号'}  onChange={onChangeTableEndCode}  />
                        )}
                            </Col>


                        <Checkbox onChange={onChange1}>删除数字4、7、13 </Checkbox>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="餐台名前缀"
                        
                        required
                    >
                        {getFieldDecorator('ctaiareaName', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入餐台名前缀',
                            }],
                        })
                        (
                        <Input placeholder ={'格式名称为"餐台前缀名"+"餐台编号"'}  onChange={onChangeTableName} />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属区域"
                        
                        required
                    >
                        {getFieldDecorator('ctaiarea', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入区域名称',
                            }],
                        })(
                            <Select   placeholder={managerRegion}
                                      onChange={onChangeRegion}>
                                { cuisineOptionHtml}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="座位数"
                        
                        required
                    >
                        {getFieldDecorator('ctaiseat', {
                            initialValue:'',
                            rules: [{
                                required: true, message: '请输入座位数',
                            }],
                        })(
                            <Input placeholder ={'可容纳人数'} onChange={onChangeSeatNum} />
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="服务员"
                        
                    >
                        {getFieldDecorator('ctaiareaWaiter', {})
                        (
                        <Select  onChange={onChangeWaiter}>
                            { waitersListHtml}
                        </Select>
                        )}
                    </FormItem>
                    <FormItem  label="是否堂食台" {...formItemLayout }  >
                        {getFieldDecorator('ctaiareaWaiter1', {})
                        (
                        <Checkbox  onChange={onChangeEatInRestaurant}> </Checkbox>
                        )}
                    </FormItem>

                </Form>

            </div>
        </Modal>
    );

};

export default Form.create()(Ctaigl_groupadd);