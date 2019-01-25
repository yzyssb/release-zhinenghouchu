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

const Region_edit = ({ctaigl,dispatch,form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
}

                    }) => {
    const ReasonAddModalProps = {

        visible: ctaigl.modalRegionEditVisible,
        title:"编辑餐台区域",
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
                    type: 'ctaigl/updatePayload',
                    payload:{modalRegionEditVisible:false}
                });
                dispatch({
                    type: 'ctaigl/editRegion',
                    payload:{}
                });
            });

        },
        onCancel() {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload:{modalRegionEditVisible:false}
            });
        },
        ctaigl,
    };

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };
    function editRegionItem(e) {
        ctaigl.editRegionItem.regionName = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.editRegionItem}
        });
    };
    function editRemark(e) {
        ctaigl.editRegionItem.remark = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.editRegionItem}
        });
    };
    function setSeatNum(e) {
        ctaigl.editRegionItem.defaultSeatNum = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.editRegionItem}
        });
    };

    var cuisineOptionHtml=[];

    if(ctaigl.regionList){
        ctaigl.regionList.map((j) => {
            cuisineOptionHtml.push ( <Option key={j.id}>{j.regionName}</Option>)


        })
    }
    return(
        <Modal  {...ReasonAddModalProps}>
            <div className={styles.pay}>
                <Form className={styles.formwidth}   >
                    <FormItem
                        {...formItemLayout}
                        label="区域名称"
                        
                    >
                        <Input   placeholder ={'填写区域名称'}  value={ctaigl.editRegionItem.regionName}onChange={editRegionItem}  />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="座位数"
                        
                    >

                        <InputNumber className={styles.inputnumber} placeholder ={'填写座位数,必须是数字！'} value={ctaigl.editRegionItem.defaultSeatNum} onChange={setSeatNum} />
                    </FormItem>
                    {/*<FormItem  label="是否提成" {...formItemLayout}  >*/}
                        {/*<Checkbox > </Checkbox>*/}
                    {/*</FormItem>*/}

                    <FormItem
                        {...formItemLayout}
                        label="备注"
                        
                    >
                        <Input value={ ctaigl.editRegionItem.remark} onChange={editRemark}/>
                    </FormItem>
                </Form>

            </div>
        </Modal>
    );

};

export default Form.create()(Region_edit);