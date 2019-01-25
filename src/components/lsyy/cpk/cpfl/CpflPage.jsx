import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpflPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import CpflAddModal from './CpflAddModal';
import CpflEditModal from './CpflEditModal';
import Modal from 'antd/lib/modal';
import Popconfirm from 'antd/lib/popconfirm';
const confirm = Modal.confirm;

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 12,
	},
};

const CpflPage=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,lscpfl,
   pageNo,
    total,
    current,
    dataSource,
    
}) => {
	

  

	 function handleSubmit(e) {
	    if(e){
	    	e.preventDefault();
	    }

	   	validateFields((errors) => {
	      if (!!errors) {
	        return;
	      }
	    });

	    var data={...getFieldsValue()};
	   
			//dispatch({type: 'orderlist/recoverOrderTime',payload:{}});
 			 
       }

        function onCuisineChange(value){

   
    }

    function goeditgoods(record){


      var item;
      lscpfl.list.map((i,j)=>{

          if(record.id == i.id){
             item = i;
          }

      })


        dispatch({
                type: 'lscpfl/updatePayload',
                payload:{
                          id:item.id,
                          code:item.code, 
                          english:item.english,
                          name:item.name,
                          remark:item.remark,
                          status:item.status,
                          modalVisible:true,
                          isAdd:false,
                        }
              });

      }

  


    function managerHandle(record,index){
        var handlebtn=[];

        handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>onDelete(record)}>
                <a>删除</a>
            </Popconfirm>
            
        </span>)

        return handlebtn;
    }

    function onDelete(record){
        dispatch({type: 'lscpfl/updatePayload',payload:{id:record.id}});
        dispatch({type: 'lscpfl/deleteCPFL',payload:{}});
    }

  function managerStatus(record,index){
       
        var text;

        if(record.status == 2){

          text = "停用";
        }else{
          text = "启用";
        }
     
        return text;
  }

    const columns = [
        {
            title: '菜类编码',
            dataIndex: 'code',
            key: 'code',      
        },{
            title: '菜类名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record,index) => ( 
              managerStatus(record,index)
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
        total: lscpfl.total,
        current:lscpfl.current,
        pageSize: lscpfl.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize){

        
        dispatch({type: 'lscpfl/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'lscpfl/query',payload:{}});


    }

    function onPageChange(pageNo){
        
        var offset = pageNo*lscpfl.size-lscpfl.size;
        dispatch({type: 'lscpfl/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'lscpfl/query',payload:{}});


    }


    function addReasonClick(){

        dispatch({type: 'lscpfl/updatePayload',payload:{modalVisible:true}});

    }

     function addCpdwClick(){
        dispatch({type: 'lscpfl/updatePayload',payload:{modalVisible:true,isAdd:true,code:"",name:"",english:"",status:1,remark:"",modalKey: Date.now(),}});

    }

     const CpflAddModalProps = {
        visible: lscpfl.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
          dispatch({
            type: 'lscpfl/updatePayload',
            payload:{modalVisible:false}
          });
        },
        lscpfl,
      };

    const CpflEditModalProps = {
        visible: lscpfl.modalEditVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'lscpfl/updatePayload',
                payload:{modalEditVisible:false}
            });
        },
        lscpfl,
    };


    function onClear(){
      dispatch({type: 'lscpfl/updatePayload',payload:{keyword:""}});
    }

    function onKeywordChange(e){
      dispatch({type: 'lscpfl/updatePayload',payload:{keyword:e.target.value}});
    }

    function onSearch(){

     dispatch({type: 'lscpfl/query',payload:{name:lscpfl.keyword}});
    }


	return (
		 <div className={styles.search}>
		
	      <div style = {{marginLeft:20}} > <span>分类名称</span><Input style = {{marginLeft:20, width:220}} value = {lscpfl.keyword} onChange = {onKeywordChange} onPressEnter = {onSearch}/>
            <Button type="primary" style = {{marginLeft:40}} onClick = {onSearch}>搜索</Button>
            <Button style = {{marginLeft:10,marginRight:20}} onClick = {onClear}>重置</Button>
        </div>

      
        <Button style = {{marginLeft:10,marginTop:20}} onClick = {addCpdwClick}>新增菜品分类</Button>
      
         <Table className={styles.table}
            columns={columns}
            dataSource={lscpfl.list}
            rowKey={record => record.id}
            pagination={pagination}
            bordered/>

         <CpflAddModal  {...CpflAddModalProps} />
         <CpflEditModal  {...CpflEditModalProps} />

		 </div>
	);
};

   
CpflPage.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(CpflPage);