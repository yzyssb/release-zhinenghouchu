import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Table from 'antd/lib/table';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import Tabs from 'antd/lib/tabs';
const TabPane = Tabs.TabPane;
import Modal from 'antd/lib/modal';

function CpbjPage({ menu, dispatch,cpbjPageConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };
  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key'
    }, 
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name'
    }, 
    {
      title: '活动开始时间',
      dataIndex: 'start_time',
      key: 'start_time'
    },
    {
      title: '活动结束时间',
      dataIndex: 'end_time',
      key: 'end_time'
    },
    {
      title: '活动描述',
      dataIndex: 'decription',
      key: 'decription'
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '操作',
      dataIndex: 'edit',
      key: 'edit',
      render: (text,record,index) => (
        <span key={index}>
          <a onClick={()=>{goEidtPage(text,record,index)}}>编辑</a>
          <span className="ant-divider" />
          <a onClick={()=>{del(text,record,index)}}>删除</a>
        </span>
      )
    }
  ];

  function goEidtPage(text,record,index){
    var queryIndex=cpbjPageConfig.queryIndex
    queryIndex=index
    dispatch({
      type: 'cpbjPageConfig/updatePayload',
      payload: { queryIndex: queryIndex }
    })
	  dispatch(
      routerRedux.push({
        pathname: '/cpbjedit',
        query: {index:index}
      })
    );
  }

  function goNewPage(){
    dispatch(
      routerRedux.push({
        pathname: '/cpbjnew',
        query: {}
      })
    );
  }

  const confirm=Modal.confirm
  function del(text,record,index){
    var resultIndex = index + 1;
    confirm({
      title: '温馨提示',
      content: '确定删除第' + resultIndex + '条数据吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
          var dataSource = cpbjPageConfig.dataSource;
          dataSource.splice(index, 1);
          dispatch({
              type: 'cpbjPageConfig/updatePayload',
              payload: { dataSource: dataSource }
          });
      },
      onCancel() {},
    });
  }

  function ModalHidden() {
    dispatch({
        type: 'cpbjPageConfig/updatePayload',
        payload: { visible: false }
    });
    }

  return(
    <Header {...HeaderProps}>
        <div>
          <Tabs type="card">
            <TabPane tab="时段菜价" key="1">
              	<Button icon="plus" size="large" type="primary" style={{marginBottom:20}} onClick={goNewPage}>添加菜品时段价格</Button>
              	<Table
	              	bordered 
	              	dataSource={cpbjPageConfig.dataSource} 
	              	columns={columns} 
              	/>
            </TabPane>
          </Tabs>

          <Modal
            visible={cpbjPageConfig.visible}
            title="Title"
            onCancel={ModalHidden}
            footer={[
                <Button key="back" onClick={ModalHidden}>取消</Button>,
                <Button key="submit" type="primary" loading={cpbjPageConfig.loading}>确认</Button>,
              ]}
          ></Modal>
        </div>
      </Header>
  );

}

CpbjPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu,cpbjPageConfig }) {
  return { menu,cpbjPageConfig };
}

export default connect(mapStateToProps)(CpbjPage);