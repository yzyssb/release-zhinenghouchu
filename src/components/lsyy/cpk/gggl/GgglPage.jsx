import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './GgglPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import GgglAddModal from './GgglAddModal';
import GgglEditModal from './GgglEditModal';
import Popconfirm from 'antd/lib/popconfirm';

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 12,
	},
};

const GgglPage=({
	form: {
	    getFieldDecorator,
	    validateFields,
	    getFieldsValue,
	    resetFields,
	  },
  dispatch,lsgggl,
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
      lsgggl.list.map((i,j)=>{

          if(record.id == i.id){
             item = i;
          }

      })


        dispatch({
                type: 'lsgggl/updatePayload',
                payload:{
                          id:item.id,
                          code:item.code, 
                          english:item.english,
                          name:item.name,
                          remark:item.remark,
                          status:item.status,
                          modalEditVisible:true,
                          isAdd:false,
                        }
              });

      }

  
  function onOperate(record){

          dispatch({
            type: 'lsgggl/deleteSpec',
            payload:{id:record.id}
          });

  }


  function managerHandle(record,index){
   
          var handlebtn=[];
       
          handlebtn.push(<span key={index} ><a onClick={()=>{goeditgoods(record)}}>编辑</a>
             <span className="ant-divider" />
             <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() =>onOperate(record)}>
                  <a>删除</a>
             </Popconfirm>
          </span>)
     
        return handlebtn;
  }

    function managerStatus(record,index){
       
        var text;

        if(record.status == 1){

          text = "启用";
        }else{
          text = "停用";
        }
     
        return text;
  }

    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '规格名称',
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
            title: '关联菜品数量',
            dataIndex: 'foodCount',
            key: 'foodCount',
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
        total: lsgggl.total,
        current:lsgggl.current,
        pageSize: lsgggl.size,
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
        showTotal:(total)=>{return `共 ${total} 条`},
    };

    function SizeChange(current, pageSize){


        dispatch({type: 'lsgggl/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({type: 'lsgggl/query',payload:{}});


    }

    function onPageChange(pageNo){
       
        var offset = pageNo*lsgggl.size-lsgggl.size;
        dispatch({type: 'lsgggl/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({type: 'lsgggl/query',payload:{}});


    }


    function addReasonClick(){

        dispatch({type: 'lsgggl/updatePayload',payload:{modalVisible:true}});

    }

     function addCpdwClick(){

        dispatch({type: 'lsgggl/updatePayload',payload:{modalVisible:true}});

    }

    const lsggglAddModalProps = {
        visible: lsgggl.modalVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
          dispatch({
            type: 'lsgggl/updatePayload',
            payload:{modalVisible:false}
          });
        },
        lsgggl,
      };
    const lsggglAddModalProps1 = {
        visible: lsgggl.modalEditVisible,
        dispatch,
        onOk() {
        },
        onCancel() {
            dispatch({
                type: 'lsgggl/updatePayload',
                payload:{modalEditVisible:false}
            });
        },
        lsgggl,
    };

    function onClear(){
      dispatch({type: 'lsgggl/updatePayload',payload:{keyword:""}});
    }
    function onSearch() {
        dispatch({type: 'lsgggl/query',payload:{}});
    }
    function onKeywordChange(e){
      dispatch({type: 'lsgggl/updatePayload',payload:{keyword:e.target.value}});
    }

     function onSearch(){

     dispatch({type: 'lsgggl/query',payload:{name:lsgggl.keyword}});
    }

	return (
		 <div className={styles.search}>
		
	      <div style = {{marginLeft:20}} > <span>规格名称</span><Input style = {{marginLeft:20, width:220}} onChange = {onKeywordChange} value = {lsgggl.keyword} onPressEnter = {onSearch}/>
            <Button type="primary" style = {{marginLeft:40}} onClick = {onSearch}>搜索</Button>
            <Button style = {{marginLeft:10,marginRight:20}} onClick = {onClear}>重置</Button>
        </div>
      
        <Button style = {{marginLeft:10,marginTop:20}} onClick = {addCpdwClick}>新增规格</Button>
        
         <Table className={styles.table}
            columns={columns}
            dataSource={lsgggl.list}
            rowKey={record => record.id}
            pagination={pagination}
            bordered/>

         <GgglAddModal  {...lsggglAddModalProps} />
         <GgglEditModal  {...lsggglAddModalProps1} />
		 </div>
	);
};

   
GgglPage.propTypes = {
	visible: PropTypes.any,
	form: PropTypes.object,
	item: PropTypes.object,
};

export default Form.create()(GgglPage);