import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
const FormItem=Form.Item
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Select from 'antd/lib/select';
const Option=Select.Option
import Modal from 'antd/lib/modal';
const confirm = Modal.confirm;
import Row from 'antd/lib/row';
import Col  from 'antd/lib/col';
import Spin from 'antd/lib/spin';
import { Transfer } from 'antd';
import message from 'antd/lib/message';
import Breadcrumb from 'antd/lib/breadcrumb';
import Popconfirm from 'antd/lib/popconfirm';


function SetRenwuPage({ menu, dispatch, setRenwu }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  const pagination = {
    total:setRenwu.total,
    current:setRenwu.current,
    pageSize: setRenwu.size,
    onChange: (pageNo) => {
        onPageChange(pageNo)
    },
    showSizeChanger:true,
    onShowSizeChange:SizeChange
  };

  function SizeChange(current, pageSize){
      dispatch({type: 'setRenwu/updatePayload',payload:{size:pageSize,current:1,offset:0}});
  }

  function onPageChange(pageNo){
      var offset = (pageNo-1)*setRenwu.size;
      dispatch({type: 'setRenwu/updatePayload',payload:{offset:offset,current:pageNo}});
  }

  const columns=[
    {title:'编号',dataIndex:'key',key:'key'},
    {title:'任务名称',dataIndex:'taskName',key:'taskName'},
    {title:'所属菜品',dataIndex:'goodsName',key:'goodsName',render:(text,record,index)=>(<span>{record.taskType==1?'— —':record.taskType==2?record.goodsName:''}</span>)},
    {title:'计件数',dataIndex:'taskReckonNum',key:'taskReckonNum'},
    {title:'操作',dataIndex:'action',key:'action',render:(text,record,index)=>(
      <Popconfirm title="确定要删除该任务?" onConfirm={()=>delRecord(record)} onCancel={()=>{}} okText="确定" cancelText="取消">
        <a>删除</a>
      </Popconfirm>
      
    )},
  ]

  function delRecord(record){
    let ids=[]
    ids.push(+record.id)
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        ids:ids
      }
    })
    dispatch({
      type:'setRenwu/deleteChoseProgrammeKitchen',
      payload:{}
    })
  }

  const rowSelection = {
    selectedRowKeys:setRenwu.selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type:'setRenwu/updatePayload',
        payload:{
          selectedRowKeys:selectedRowKeys
        }
      })
    }
  };

  function okAction(){
    if(setRenwu.targetKeys.length==0){
      message.error('请先选择任务')
      return
    }
    dispatch({
      type:'setRenwu/restaurantChoseChoseProgrammeKitchen',
      payload:{}
    })
  }

  function cancelAction(){
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        visible:false,
        targetKeys:setRenwu.static_targetKeys,
        taskIds:setRenwu.static_taskIds
      }
    })
  }

  function transferChange(targetKeys, direction, moveKeys){
    console.log(targetKeys, direction, moveKeys);
    let arr=[]
    
    if(targetKeys.length>0){
      targetKeys.map(v=>{
        if(setRenwu.mockData.length>0){
          setRenwu.mockData.map((vv,ii)=>{
            if(v==ii+1){
              arr.push(vv.id)
            }
          })
        }
      })
    }
    console.log(arr)
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        targetKeys:targetKeys,
        taskIds:arr
      }
    })
  }
  
  function renderItem(item){
    const customLabel = (
      <span className="custom-item">
      {item.taskName}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.id, // for title and filter matching
    };
  }

  function filterOption(inputValue, option){
    return option.taskName.indexOf(inputValue) > -1;
  }

  function delSome(){
    if(setRenwu.selectedRowKeys.length==0){
      message.error('请先勾选任务')
      return
    }

    let ids=[]
    if(setRenwu.selectedRowKeys.length>0){
      setRenwu.selectedRowKeys.map((v,i)=>{
        setRenwu.list.map((vv,ii)=>{
          if((v==ii+1)&&ids.indexOf(vv.id)==-1){
            ids.push(vv.id)
          }
        })
      })
    }

    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        ids:ids
      }
    })
    if(ids.length>0){
      dispatch({
        type:'setRenwu/deleteChoseProgrammeKitchen',
        payload:{}
      })
    }
  }

  function taskNameChange(e){
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        taskName:e.target.value
      }
    })
  }

  function foodChange(e){
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{
        foodId:e
      }
    })
  }

  function searchAction(){
    dispatch({
      type:'setRenwu/updatePayload',
      payload:{ current:1 }
    })
    dispatch({
      type:'setRenwu/selectProgrammeKitchenId',
      payload:{}
    })
  }

  function back(){
      window.history.go(-1)
  }

  return (
    <Header {...HeaderProps}>
      <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
        <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>厨房管理</Breadcrumb.Item>
            <Breadcrumb.Item>设置任务</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Spin spinning={setRenwu.loading} style={{position:'absolute',width:'calc(100% - 50px)',height:'calc(100% - 70px)',paddingTop:'300px',zIndex:'99'}} size="large" />
      <div style={{marginBottom:15,padding:'20px 10px',background:'#eee'}}>
        <span>任务名称</span>
        <Input style={{width:350,marginLeft:10}} value={setRenwu.taskName} onChange={taskNameChange} />
        <span style={{marginLeft:20}}>所属菜品</span>
        <Select defaultValue="-1" style={{width:200,marginLeft:10}} onChange={foodChange}>
          <Option key="-1">全部</Option>
          {setRenwu.foodList.length>0&&setRenwu.foodList.map((v,i)=>(
            <Option key={v.id}>{v.name}</Option>
          ))}
        </Select>
        <Button type="primary" style={{marginLeft:20}} onClick={searchAction}>开始查询</Button>
      </div>
      <div style={{marginBottom:15}}>
        <Button type="primary" onClick={()=>{
          dispatch({
            type:'setRenwu/updatePayload',
            payload:{
              visible:true
            }
          })
        }}>选择任务</Button>
      </div>

      <div style={{background:'#fafafa',padding:'10px 0'}}>
        <Button size="small" type="primary" onClick={delSome}>批量删除</Button>
      </div>
      <Table
        columns={columns}
        dataSource={setRenwu.list}
        pagination={pagination}
        bordered
        rowSelection={rowSelection}
      />
      <Modal
        width="800px"
        title="选择任务"
        visible={setRenwu.visible}
        onOk={okAction}
        onCancel={cancelAction}
      >
        <div style={{width:650,margin:'0 auto'}}>
          <Transfer
            dataSource={setRenwu.mockData}
            listStyle={{
              width: 300,
              height: 470,
              textAlign:'left'
            }}
            targetKeys={setRenwu.targetKeys}
            onChange={transferChange}
            render={renderItem}
            showSearch
            filterOption={filterOption}
          />
        </div>
      </Modal>

    </Header>
  );
}

SetRenwuPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu,setRenwu }) {
  return { menu,setRenwu };
}

export default connect(mapStateToProps)(SetRenwuPage);

