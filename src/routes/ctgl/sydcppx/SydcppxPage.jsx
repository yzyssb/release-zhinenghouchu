import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Spin from 'antd/lib/spin';

import styles from './SydcppxPage';


const SydcppxPage=({dispatch,sydcppxPageConfig})=>{

  const pagination={
    pageSize:sydcppxPageConfig.total,
    hideOnSinglePage:true
  }
  const sub_pagination={
    pageSize:sydcppxPageConfig.sub_total,
    hideOnSinglePage:true
  }

  const columns=[
    {
      title: '',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: '菜品分类',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render:(text,record,index)=>{
        var dataSource=sydcppxPageConfig.dataSource
        if(dataSource.length==1){
          return (
            <span key={index}>
              ----
            </span>
          )
        }else{
          if(index==0){
            return (
              <span key={index}>
                <a onClick={()=>{move(text,record,index,'self',2)}}>下移</a>
                <span className="ant-divider" />
                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
              </span>
            )
          }else if(index>0&&index<dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{move(text,record,index,'self',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{move(text,record,index,'self',1)}}>上移</a>
                <span className="ant-divider" />
                <a onClick={()=>{move(text,record,index,'self',2)}}>下移</a>
                <span className="ant-divider" />
                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
              </span>
            )
          }else if(index==dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{move(text,record,index,'self',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{move(text,record,index,'self',1)}}>上移</a>
                <span className="ant-divider" />
                <a onClick={()=>{showCates(text,record,index)}}>展开分类</a>
              </span>
            )
          }
        }
      }
    },
  ]

  function move(text,record,index,origin,type){
    dispatch({
      type:'sydcppxPageConfig/moveAndSort',
      payload:{type:type,categoryId:record.id}
    })
  }

  function subMove(text,record,index,origin,type){
    dispatch({
      type:'sydcppxPageConfig/subMoveAndSort',
      payload:{type:type,categoryId:sydcppxPageConfig.cpCateId,foodId:record.id}
    })
  }

  //modal columns
  const subColumns=[
    {
      title:'',
      dataIndex:'key',
      key:'key'
    },
    {
      title:'名称',
      dataIndex:'name',
      key:'name'
    },
    {
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record,index)=>{
        var dataSource=sydcppxPageConfig.subDataSource
        if(dataSource.length==1){
          return (
            <span key={index}>
              ----
            </span>
          )
        }else{
          if(index==0){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',2)}}>下移</a>
              </span>
            )
          }else if(index>0&&index<dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',1)}}>上移</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',2)}}>下移</a>
              </span>
            )
          }else if(index==dataSource.length-1){
            return (
              <span key={index}>
                <a onClick={()=>{subMove(text,record,index,'sub',3)}}>置顶</a>
                <span className="ant-divider" />
                <a onClick={()=>{subMove(text,record,index,'sub',1)}}>上移</a>
              </span>
            )
          }
        }
      }
    }
  ]
  
  //展开分类
  const confirm=Modal.confirm
  function showCates(text,record,index){
    dispatch({
      type: 'sydcppxPageConfig/showCates',
      payload: { categoryId:record.id }
    })
    dispatch({
      type: 'sydcppxPageConfig/updatePayload',
      payload: { cpCateId:record.id,title:record.name,visible:true }
    })
  }

  //modal 关闭
  function ModalHidden(){
    dispatch({
      type: 'sydcppxPageConfig/updatePayload',
      payload: { visible:false }
    })
  }

  //modal 确定
  function ModalConfirm(){
    dispatch({
      type: 'sydcppxPageConfig/updatePayload',
      payload: { visible:false }
    })
  }

  return(
    <span>
        <Spin spinning={sydcppxPageConfig.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
        <div>
          <Table
            dataSource={sydcppxPageConfig.dataSource} 
            columns={columns}
            pagination={pagination}
          />
          <Modal
              width="60%"
              visible={sydcppxPageConfig.visible}
              title={sydcppxPageConfig.title}
              onCancel={ModalHidden}
              footer={[
                  <Button key="submit" type="primary" onClick={ModalConfirm}>确认</Button>,
              ]}
          >
            <Table
              dataSource={sydcppxPageConfig.subDataSource} 
              columns={subColumns}
              pagination={sub_pagination}
            />
          </Modal>
        </div>
      </span>
  );

}


function mapStateToProps({ sydcppxPageConfig }) {
  return { sydcppxPageConfig};
}

export default connect(mapStateToProps)(SydcppxPage);