import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import  DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import InputNumber from 'antd/lib/input-number';
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

const Ctaigl_Child = ({
    ctaigl,dispatch

}) => {
    const ReasonAddModalProps = {

        visible: ctaigl.modalVisible,
        title:"编辑餐台",
        okText:"确定",
        cancelText:"取消",
        dispatch,
        onOk() {
            dispatch({
                type: 'ctaigl/updateTable',
                payload:{modalVisible:false}
            });
            dispatch({
                type: 'ctaigl/updatePayload',
                payload:{modalVisible:false}
            });
        },
        onCancel() {
            dispatch({
                type: 'ctaigl/updatePayload',
                payload:{modalVisible:false}
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

    function onChangeTableNum(e) {
         ctaigl.item.tableCode = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChangeTableName(e) {
        ctaigl.item.tableName = e.target.value;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChangeRegion(e) {
        ctaigl.item.regionId = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChangeSeatNum(e) {
        ctaigl.item.seatNum = e;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChangeWaiter(e) {
        ctaigl.item.waiterId =e ;
        dispatch({
            type: 'ctaigl/updatePayload',
            payload:{item:ctaigl.item}
        });
    };
    function onChange1(e) {
        ctaigl.item.isEatInRestaurant = e.target.checked;
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
    var waitersListHtml=[<Option key={-1} value={-1} >{"请选择"}</Option>];

    if(ctaigl.waiters){
        ctaigl.waiters.map((j) => {
            waitersListHtml.push ( <Select.Option key={j.id} value={j.id}>{j.name}</Select.Option>)


        })
    }
    return(
         <Modal  {...ReasonAddModalProps}>
             <div className={styles.pay}>
                 <Form horizontal className={styles.formwidth}    >
                     <FormItem
                         {...formItemLayout}
                         label="餐台编号"
                         required
                         initialValue={ctaigl.item.tableCode}
                     >
                         <InputNumber  className={styles.inputnumber} placeholder ={ctaigl.item.tableCode} value={ctaigl.item.tableCode} onChange={onChangeTableNum}  />
                     </FormItem>
                     <FormItem
                         {...formItemLayout}
                         label="餐台名称"
                         
                         required
                         initialValue={ctaigl.item.tableName}
                     >
                         <Input placeholder ={ctaigl.item.tableName} value={ctaigl.item.tableName} onChange={onChangeTableName} />
                     </FormItem>
                     <FormItem
                         {...formItemLayout}
                         label="所属区域"
                         
                         required
                         initialValue={ctaigl.item.regionNameString}
                     >
                         <Select  value={ctaigl.item.regionNameString}  onChange={onChangeRegion}>
                             { cuisineOptionHtml}
                         </Select>
                     </FormItem>
                     <FormItem
                         {...formItemLayout}
                         label="座位数"
                         
                         required
                         initialValue={ctaigl.item.seatNum}
                     >
                         <InputNumber className={styles.inputnumber} placeholder ={ctaigl.item.seatNum} value={ctaigl.item.seatNum} onChange={onChangeSeatNum} />
                     </FormItem>
                     <FormItem
                         {...formItemLayout}
                         label="服务员"
                     >
                         <div>
                             <Select  value={ctaigl.item.waiterId != 0?ctaigl.item.waiterId:-1} onChange={onChangeWaiter} >
                                 { waitersListHtml }
                             </Select>
                         </div>
                     </FormItem>
                     <FormItem  label="是否堂食台" {...formItemLayout }   >
                         <Checkbox checked={ctaigl.item.isEatInRestaurant}  onChange={onChange1}> </Checkbox>
                     </FormItem>

                 </Form>

             </div>
         </Modal>
    );

};

export default Ctaigl_Child;