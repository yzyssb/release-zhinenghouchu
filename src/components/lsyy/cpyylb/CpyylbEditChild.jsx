import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Modal from 'antd/lib/modal';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import  DatePicker from 'antd/lib/date-picker';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
import Tabs from 'antd/lib/tabs';
import Button from 'antd/lib/button';
import Popconfirm from 'antd/lib/popconfirm';
import Popover from 'antd/lib/popover';

import styles from './CpyylbEditChild.less';
import {routerRedux} from "dva/router";
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

import EditableTagGroup from './EditableTagGroup.jsx'
import CpyylbAddModal from '../../../components/lsyy/cpyylb/CpyylbAddModal';

import {config} from '../../../services/HttpService';
import Input from 'antd/lib/input';
import Form from 'antd/lib/form';

const FormItem = Form.Item;

const Cpyylb_Child = ({
    pageNo,
    total,
    current,
    dispatch,
    cpyylb,
  
}) => {

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 19 },
    };

    function addReasonClick(){

        dispatch(routerRedux.push({
            pathname: "/cpyylbadd",
            query: {}
        }));

    }


    const CpyylbAddModalProps = {
        visible: cpyylb.modalVisible,
        dispatch,
        cpyylb,
    };

    //修改自定义标签
    function onEditableTagGroupChange(tags) {


        let selectFoodName = tags;

        let newListFoods = [];

        let _selectedRowKeys = [];

        selectFoodName.map((i)=>{
            
            cpyylb.listFoods.map((j)=>{

                let foods = {};
                if (j.foodName == i){

                    foods.foodId = j.foodId;
                    foods.foodName = j.foodName;
                    newListFoods.push(foods);
                    _selectedRowKeys.push(j.foodId);
                }

            })
            
        })

        dispatch({
            type: 'cpyylb/updatePayload',
            payload: {selectFoodName: selectFoodName,listFoods:newListFoods,_selectedRowKeys:_selectedRowKeys},
        });
    }

    return ( 
        <div style={{marginTop:50}}>
            <CpyylbAddModal  {...CpyylbAddModalProps} />

            <Form >
                <FormItem
                    {...formItemLayout}
                    label="类别名称"
                    extra="20个字符以内"
                >
                    <div>
                        <Input style={{width:400,marginRight:25}} value = {cpyylb.name} onChange = {(e)=>{

                            dispatch({
                                type: 'cpyylb/updatePayload',
                                payload:{name:e.target.value}
                            });
                        }}>

                        </Input>

                        <Button type='primary' onClick={()=>{
                            dispatch({type: 'cpyylb/updatePayload',payload:{modalVisible:true,searchKey:''}});

                            dispatch({
                                type: 'cpyylb/queryAll',
                                payload: {},
                            });

                            dispatch({
                                type: 'cpyylb/queryFoodList',
                                payload: {},
                            });
                        }}>添加菜品</Button>
                    </div>

                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label=""
                >

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="已选菜品"
                >
                    <div className={styles.editabletaggroup}>
                        <EditableTagGroup tags={cpyylb.selectFoodName} onChange={onEditableTagGroupChange}/>
                    </div>
                </FormItem>

            </Form>
            <div style={{marginTop:100}}>


                <Button type = 'primary' style={{width:120,marginLeft:'25%'}} onClick = {()=>{

                    window.history.back();

                }}>取消</Button>

                <Button type = 'primary' style = {{width:120,marginLeft:60}} onClick = {()=>{
                    dispatch({type: 'cpyylb/operateCategoryAddOrEdit', payload: {}});

                }}>保存</Button>

            </div>
        </div>
    );

};

export default Cpyylb_Child;  