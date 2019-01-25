import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import Spin from 'antd/lib/spin';
import {Popconfirm} from 'antd/lib';
import Modal from 'antd/lib/modal';

const confirm = Modal.confirm;

import styles from './CfgllbPage.less'



const CfgllbPage=({dispatch,cfgllb})=>{


  const pagination = {
        total: cfgllb.total,
        current:cfgllb.current,
    pageSize: cfgllb.size,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'cfgllb/updatePayload',payload:{size:pageSize,current:1,offset:0}});
        dispatch({
          type:'cfgllb/query',
          payload:{}
        })
    }

    function onPageChange(pageNo){
        var offset = pageNo*cfgllb.size-cfgllb.size;
        dispatch({type: 'cfgllb/updatePayload',payload:{offset:offset,current:pageNo}});
        dispatch({
          type:'cfgllb/query',
          payload:{}
        })
    }

  const columns=[
    {
      title:'序号',
      dataIndex:'key',
      key:'key',
      render:(text,record,index)=>(
        cfgllb.size*(cfgllb.current-1)+index+1
      ),
      width:'5%'
    },
    {
      title:'厨房名称',
      dataIndex:'kitchenName',
      key:'kitchenName',
      width:'20%'
    },
    {
      title:'打印机名称',
      dataIndex:'printerName',
      key:'printerName',
      width:'20%'
    },
    {
      title:'备注',
      dataIndex:'comment',
      key:'comment',
      width:'20%'
    },
    {
      title:'操作',
      dataIndex:'key4',
      key:'key4',
      render:(text,record,index)=>(
        <span className={index}>
          <a onClick={()=>addClick('edit',record)}>编辑</a>
          <span className="ant-divider" />
          <a onClick={()=>setProducts(record)}>设置生产产品</a>
          <span className="ant-divider" />
          <a onClick={()=>setRenwu(record)}>设置任务</a>
          <span className="ant-divider" />
          <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => deleteAction(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
      width:'35%'
    }
  ]

  function setProducts(record){
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{
        kitchen_id:record.id,
        comment:record.comment,
        kitchenName:record.kitchenName,
        printerName:record.printerName
      }
    })
    dispatch(
      routerRedux.push({
        pathname: "/productsSet",
        query: {}
      })
    );
  }

  function setRenwu(record){
    console.log(record)
    dispatch(
      routerRedux.push({
        pathname: "/setRenwu",
        query: {
          kitchen_id:+record.id,
          name:record.kitchenName
        }
      })
    );
  }


  function deleteAction(id){
    dispatch({
      type:'cfgllb/deleteInList',
      payload:{id:id}
    })
  }

  function addClick(type,record){
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{
        baseInfoFormRest:1,
        kitchen_id:type=='edit'?record.id:'',
        comment:type=='edit'?record.comment:'',
        kitchenName:type=='edit'?record.kitchenName:'',
        printerName:type=='edit'?record.printerName:'',
        touchscreenId:type=='edit'?cfgllb.touchscreenId:[]
      }
    })
    dispatch(
      routerRedux.push({
        pathname: "/kitchenNew",
        query: {type:type}
      })
    );
  }
  return (
    <div>
      <Spin spinning={cfgllb.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
      <div>
        <div className={styles.headerBtn}>
          <Button type="primary" onClick={()=>addClick('add')}>添加厨房</Button>
        </div>
        <Table 
          bordered
          columns={columns}
          dataSource={cfgllb.list}
          pagination={pagination}
        />
      </div>
    </div>
  );
}

function mapStateToProps({ cfgllb }) {
  return { cfgllb };
}

export default connect(mapStateToProps)(CfgllbPage);

