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

import styles from './Cpyylb_Child.less';
import {routerRedux} from "dva/router";
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

import {config} from '../../../services/HttpService';

const Cpyylb_Child = ({
    pageNo,
    total,
    current,
    dispatch,
    cpyylb,
  
}) => {

    function goeditgoods(record){

        let selectFoodName = [];
        let _selectedRowKeys = [];

        if (record.listFoods && record.listFoods.length > 0 ){
            record.listFoods.map((i,j)=>{


                selectFoodName.push(i.foodName);
                _selectedRowKeys.push(i.foodId);
            })
        }


        dispatch({
            type: 'cpyylb/updatePayload',
            payload:{
                id:record.id,
                name:record.name,
                listFoods:record.listFoods,
                num:record.num,
                selectFoodName:selectFoodName,
                _selectedRowKeys:_selectedRowKeys,

            }
        });


        dispatch(routerRedux.push({
            pathname: "/cpyylbedit",
            query: {}
        }));

      }

    function managerHandle(record,index){

        var handlebtn=[];

        handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>onOperate(record,index)}>
                <a>删除</a>
            </Popconfirm>

            </span>)

        return handlebtn;
    }

    function onOperate(record,index){
        var resultIndex = index + 1;
        dispatch({
            type:'cpyylb/deleteAction',
            payload:{id:cpyylb.list[index].id}
        })
    }

    function managerCommentType(record,index){
   
        // var commentText = '';
        // cpyylb.commentTypes.map((i,j)=>{
        //
        //     if(record.commentType == i.value){
        //
        //       commentText = i.key;
        //     }
        //
        // })

        let newListFoods = record.listFoods;

        let foods = [];

        let allFoods = [];

        let tags = '';

        let alltags = '';

        newListFoods&&newListFoods.map((i,j)=>{

            if (foods.length <= 5){

                foods.push(i.foodName);

            }

            allFoods.push(i.foodName);

        })

        tags = foods.join('、');

        alltags = allFoods.join('、');

        let content = (<div style = {{maxWidth:500}}>{alltags}</div>)

        let children = [];
        children.push(<Popover  key={index} placement="top" content={content} ><span>{tags}</span></Popover>)
        return children;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '类别名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '菜品数量',
            dataIndex: 'num',
            key: 'num',
        },{
            title: '详情',
            dataIndex: 'detail',
            key: 'detail',
            render: (text, record,index) => ( 
              managerCommentType(record,index)
          ),
        },{
          title: '操作',
          key: 'operation',
          dataIndex: 'operation',
          render: (text, record,index) => ( 
              managerHandle(record,index)
          ),
      }
    ];

    const pagination = {
        total: cpyylb.total,
        current:cpyylb.current,
        pageSize:cpyylb.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){


        dispatch({type: 'cpyylb/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'cpyylb/query',payload:{}}); 


    }

    function onPageChange(pageNo){
        
        var offset = pageNo*cpyylb.size-cpyylb.size;
        dispatch({type: 'cpyylb/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'cpyylb/query',payload:{}}); 


    }


    function addReasonClick(){

        dispatch({
            type: 'cpyylb/updatePayload',
            payload:{id:0,selectFoodName:[],_selectedRowKeys:[],listFoods:[],name:''}
        });

        dispatch(routerRedux.push({
            pathname: "/cpyylbadd",
            query: {}
        }));

    }


    const OrderSearchProps = {
        dispatch,
        cpyylb
       };

    const CpyylbAddModalProps = {
        visible: cpyylb.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'cpyylb/updatePayload',
                payload:{modalVisible:false}
            });
        },
        cpyylb,
    };


    return ( 
        <div>

            <Button type="primary" style={{marginLeft:20}}  onClick = {addReasonClick}>新增</Button>
            <Table className={styles.table}
            columns={columns}
            dataSource={cpyylb.list}
            rowKey={record => record.id}
            pagination={pagination}
            bordered/>
        </div>
    );

};

export default Cpyylb_Child;  