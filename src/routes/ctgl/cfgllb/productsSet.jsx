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
import {Popconfirm} from 'antd/lib';
import styles from './CfgllbPage.less';
import Breadcrumb from 'antd/lib/breadcrumb';


function productsSet({ menu, dispatch, cfgllb }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  const columns=[
    {
      title:'序号',
      dataIndex:'key',
      key:'key',
      render:(index)=>(
        index
      )
    },
    {
      title:'产品名称',
      dataIndex:'name',
      key:'name'
    },
    {
      title:'产品编号',
      dataIndex:'code',
      key:'code'
    },
    {
      title:'类型',
      dataIndex:'type',
      key:'type',
      render:(text,record,index)=>(
        record.type==1?'单品':record.type==2?'套餐':''
      )
    },
    {
      title:'状态',
      dataIndex:'status',
      key:'status',
      render:(text,record,index)=>(
        record.status==1?'启用':'停售'
      )
    },
    {
      title:'分类',
      dataIndex:'categoryName',
      key:'categoryName'
    },
    {
      title:'操作',
      dataIndex:'key6',
      key:'key6',
      render:(text,record,index)=>(
        <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => deleteAction(record)}>
            <a>删除</a>
        </Popconfirm>     
      )
    }
  ]

  function deleteAction(record){
    dispatch({
      type:'cfgllb/deleteFood',
      payload:{foodId:record.id}
    })
  }


  const pagination = {
        total: cfgllb.total1,
        current:cfgllb.current1,
    pageSize: cfgllb.size1,      
        
        onChange: (pageNo) => {
            onPageChange(pageNo)
        },
        showSizeChanger:true,
        onShowSizeChange:SizeChange,
    };

    function SizeChange(current, pageSize){
        dispatch({type: 'cfgllb/updatePayload',payload:{size1:pageSize,current1:1,offset1:0}});
        
    }

    function onPageChange(pageNo){
        var offset = pageNo*cfgllb.size1-cfgllb.size1;
        dispatch({type: 'cfgllb/updatePayload',payload:{offset1:offset,current1:pageNo}});
        
    }

  function chooseProduct(){
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{visible:true}
    })
  }

  function ModalHidden(){
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{choosedFood:cfgllb.tempChoosedFood,allFood:cfgllb.tempAllFood,visible:false}
    })
  }



  function leftClick(item){
    var choosedFood=cfgllb.choosedFood,food=cfgllb.food
    for(var i=0;i<choosedFood.length;i++){
      if(choosedFood[i].id==item.val.id){
        return false;
      }
    }
    for(var i=0;i<food.length;i++){
      if(food[i].id==item.val.id){
        food.splice(i,1)
      }
    }
    choosedFood.push(item.val)
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{choosedFood:choosedFood,food:food}
    })
  }
  function rightClick(item){
    var choosedFood=cfgllb.choosedFood,food=cfgllb.food
    choosedFood.map((value,index)=>{
      if(value.id==item.val.id){
        choosedFood.splice(index,1)
      }
    })
    food.push(item.val)
    dispatch({
      type:'cfgllb/updatePayload',
      payload:{choosedFood:choosedFood,food:food}
    })
  }
  function saveAction(){
    dispatch({
      type:'cfgllb/addKitchenFood',
      payload:{}
    })
  }

  const columns1=[
    {
      title:"",
      dataIndex:'key',
      key:'key',
    },
    {
      title:"名称",
      dataIndex:'name',
      key:'name',
    }
  ]

  const rowSelection={
    selectedRowKeys:cfgllb.choosedIndex,
    onChange:(item)=>{
      dispatch({
        type:'cfgllb/updatePayload',
        payload:{choosedIndex:item}
      })
    }
  }

  function back(){
      window.history.go(-1)
  }

  return (
    <Header {...HeaderProps}>
      <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
        <Breadcrumb separator=">">
            <Breadcrumb.Item onClick={back} style={{cursor:'pointer'}}>厨房管理</Breadcrumb.Item>
            <Breadcrumb.Item>设置生产产品</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Spin spinning={cfgllb.loading} style={{position:'absolute',left:'50%',marginTop:'200px',zIndex:'99'}} size="large" />
      <div className={styles.headerBtn} style={{marginBottom:15}}>
        <span className={styles.headertxt}>厨房名称：{cfgllb.kitchenName}</span>
        <Button type="primary" style={{float:'right'}} onClick={chooseProduct}>选择商品</Button>
        <div style={{clear:'both'}}></div>
      </div>
      <Table
        bordered
        columns={columns}
        dataSource={cfgllb.list1}
        pagination={pagination}
      />
      <Modal
        visible={cfgllb.visible}
        title="选择菜品"
        onCancel={ModalHidden}
        width='70%'
        footer={[
          <Button key="submit" type="primary" onClick={saveAction}>保存</Button>
        ]}
      > 
        <div className={styles.innerModal}>
          <div className={styles.innerBox}>
            <div className={styles.Box}>
              {cfgllb.food.map((val,idx)=>(<p className={styles.cateItem} key={idx} onClick={()=>leftClick({val})}>{val.name}</p>))}
            </div>
          </div>
          <div className={styles.arrow}>⇋</div>
          <div className={styles.innerBox}>
            <div className={styles.Box}>
              {cfgllb.choosedFood.map((val,index)=>(
                <p key={index} className={styles.cateItem} onClick={()=>rightClick({val})}>{val.name}</p>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </Header>
  );
}

productsSet.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, cfgllb }) {
  return { menu, cfgllb };
}

export default connect(mapStateToProps)(productsSet);

