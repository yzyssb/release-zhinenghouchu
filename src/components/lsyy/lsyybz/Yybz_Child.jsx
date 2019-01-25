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
import styles from './Yybz_Child.less';
import Yybz_Search from './Yybz_Search';
import Popconfirm from 'antd/lib/popconfirm';
import message from 'antd/lib/message';


const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Yybz_Child = ({
    pageNo,
    total,
    current,
    dispatch,
    lsyybz,
  
}) => {

    function goeditgoods(record){


      var item;
      lsyybz.list.map((i,j)=>{

          if(record.id == i.id){
             item = i;
          }

      })
        dispatch({
                type: 'lsyybz/updatePayload',
                payload:{
                          id:item.id,
                          comment:item.content,
                          commentType:item.commentType,
                          modalVisible:true,
                          isAdd:false,
                        }
              });

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
            type:'lsyybz/deleteAction',
            payload:{id:lsyybz.list[index].id}
        })
    }

    function managerCommentType(record,index){
   
        var commentText = '';
        lsyybz.commentTypes.map((i,j)=>{

            if(record.commentType == i.value){

              commentText = i.key;
            }

        })

        return commentText;

    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        },{
            title: '备注名称',
            dataIndex: 'content',
            key: 'content',
        },{
            title: '备注分类',
            dataIndex: 'commentType',
            key: 'commentType',
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
        total: lsyybz.total,
        current:lsyybz.current,
        pageSize:lsyybz.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){


        dispatch({type: 'lsyybz/updatePayload',payload:{size:pageSize,current:1,offset:0,selectedRowKeys:[]}});
        dispatch({type: 'lsyybz/query',payload:{}}); 


    }

    function onPageChange(pageNo){
        
        var offset = pageNo*lsyybz.size-lsyybz.size;
        dispatch({type: 'lsyybz/updatePayload',payload:{offset:offset,current:pageNo,selectedRowKeys:[]}});
        dispatch({type: 'lsyybz/query',payload:{}}); 


    }


    function addReasonClick(){

        dispatch({type: 'lsyybz/updatePayload',payload:{modalVisible:true,isAdd:true,comment:'',commentType:lsyybz.commentTypes[0].value}});

    }


    const OrderSearchProps = {
        dispatch,
        lsyybz
    };

    function allotComments(){
        if(lsyybz.selectedRowKeys.length==0){
            message.error('请至少选择一个原因备注')
            return
        }
        var arr=[]
        for(var i=0;i<lsyybz.selectedRows.length;i++){
            arr.push(lsyybz.list[lsyybz.selectedRows[i].key-1].content)
        }
        dispatch({
            type:'lsyybz/updatePayload',
            payload:{
                allotModal_key1:arr.join(','),
                allotModal_key2:'',
                allotModal_key3:'1',
                checkedList:[],
                checkAll:false,
                allotModalVisible:true
            }
        })
    }

    const rowSelection={
        selectedRowKeys:lsyybz.selectedRowKeys,
        onChange:selectedRowKeysChange
    }

    function selectedRowKeysChange(key1,key2){
        dispatch({
            type:'lsyybz/updatePayload',
            payload:{
                selectedRowKeys:key1,
                selectedRows:key2
            }
        })
    }

    return ( 
        <div>
            <Yybz_Search {...OrderSearchProps}/>
            <Button type="primary"  onClick = {addReasonClick}>新增备注</Button>
            <Button style={{marginLeft:20}}  onClick = {allotComments}>快速分配至门店</Button>
            <Table className={styles.table}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={lsyybz.list}
            rowKey={record => record.id}
            pagination={pagination}
            bordered/>
        </div>
    );

};

export default Yybz_Child;  