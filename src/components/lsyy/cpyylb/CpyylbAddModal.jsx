import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpyylbAddModal.less';
const FormItem = Form.Item;
import Table from 'antd/lib/table';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Pagination from 'antd/lib/pagination';

const ReasonAddModal = ({

  visible,
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
    cpyylb,
}) => {


    const Option = Select.Option;

    const children = [];

    if (cpyylb.all && cpyylb.all.length > 0){
        cpyylb.all.map((i, j) => {

            children.push(
                <Option key={i.key} value={i.key}>{i.value}</Option>
            )

        });
    }
 
  function handleOk() {

        dispatch({
            type: 'cpyylb/updatePayload',
            payload:{
                modalVisible:false,

            }
          });

        let selectFoodList = [];
        let selectFoodName =[];
        cpyylb._selectedRowKeys.map((i)=>{

            cpyylb.foodList.map((j)=>{

                let object = {};
                if (i == j.foodId){
                    object.foodId = j.foodId;
                    object.foodName = j.foodName;
                    selectFoodList.push(object);
                    selectFoodName.push(j.foodName);
                }
            })
        })

      dispatch({
          type: 'cpyylb/updatePayload',
          payload:{
              listFoods:selectFoodList,
              selectFoodName:selectFoodName,
          }
      });

  
  }

  function cancel(){
      dispatch({
          type: 'cpyylb/updatePayload',
          payload:{
              modalVisible:false,
              _selectedRowKeys:[],
          }
      });


  }

  function onSearch(){
      dispatch({
          type: 'cpyylb/queryFoodList',
          payload:{
              name:cpyylb.searchKey,
              categoryId:cpyylb.categoryId,

          }
      });

  }

    const columns = [
        {
            title: '编号',
            dataIndex: 'foodId',
            key: 'foodId',
        },{
            title: '名称',
            dataIndex: 'foodName',
            key: 'foodName',
        },{
            title: '分类',
            dataIndex: 'categoryName',
            key: 'categoryName',

        }
    ];


  const modalOpts = {
    title:'选择菜品',
    visible,
    onOk:handleOk,
    onCancel:cancel,
    currentItem,
    okText:"确定",
    cancelText:"取消",
      width:'50%',
   
  };

    //点击表格选择框
    const rowSelection = {
        selectedRowKeys: cpyylb._selectedRowKeys,
        onChange: (selectedRowKeys) => {
            dispatch({type: 'cpyylb/updatePayload', payload: {_selectedRowKeys: selectedRowKeys}});
        }
    }

  return (
    <Modal {...modalOpts} >

    <div className={styles.pay}>

        <div>

            <span>菜品分类</span>
            <Select style = {{marginLeft:10,width:200}} placeholder="请选择" onChange = {(e)=>{

                dispatch({type: 'cpyylb/updatePayload', payload: {categoryId: e}});
            }}>
                {children}
            </Select>

        </div>

        <div style={{marginTop:20,marginBottom:20}}>

            <span>菜品名称</span><Input style = {{marginLeft:10,width:200}} value = {cpyylb.searchKey} onChange = {(e)=>{

                 dispatch({type: 'cpyylb/updatePayload', payload: {searchKey: e.target.value}});

          }}></Input> <Button type='primary' onClick={onSearch} style = {{marginLeft:10}}>查询</Button>

        </div>

        <Table style={{height:'480px',overflowY:'auto'}}
               selectedRowKeys = {cpyylb._selectedRowKeys}
               rowSelection={rowSelection}
               columns={columns}
               dataSource={cpyylb.foodList}
               rowKey={record => record.foodId}
               pagination={false}
               bordered/>
    </div>
    </Modal>
  );
};

ReasonAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ReasonAddModal);
