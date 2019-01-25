import React, { PropTypes } from 'react';

import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table } from 'antd';
import { Modal, Button, Row, Col, Pagination } from 'antd';
import moment from "moment";
import Tabs from 'antd/lib/tabs';
import Checkbox from 'antd/lib/checkbox';
import Popconfirm from "antd/lib/popconfirm";
import Input from 'antd/lib/input';
import message from "antd/lib/message";
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;


function BdElmMenDianModal({ menu, dispatch, mdbdConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };


  // 关闭modal,清空数据
  function handleCancel() {
    dispatch({
      type: "mdbdConfig/updatePayload",
      payload: {
        elmBdStoreVisible: false, //控制饿了么选择门店modal的展示
        elmModalStoreInfo: {}, //饿了么可选门店列表modal中可选项列表
        elmBdStoreSelectedRows: [], //饿了么授权成功之后modal中已经选中的门店
      }
    });
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: "index",
      width: 100,
      render: function (text, record, index) {
        return index + 1;
      }
    },
    {
      title: '饿了么门店ID',
      dataIndex: 'shopId',
      key: "shopId",
      width: 300,
    }, {
      title: '饿了么门店名称',
      dataIndex: 'shopName',
      key: "shopName",
      width: 300
    }
  ];



  // tab单选配置
  const rowSelection = {
    type: "radio", //标记为单选
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: "mdbdConfig/updatePayload",
        payload: { elmBdStoreSelectedRows: selectedRows }
      })
    }
  };

  // 保存
  function save() {
    if (mdbdConfig.elmBdStoreSelectedRows.length == 0) {
      message.error("请选择门店");
      return;
    }
    dispatch({
      type: "mdbdConfig/saveLinkStore",
      payload: mdbdConfig.elmBdStoreSelectedRows[0]
    });
  }

  // 重新授权,重新调接口获取饿了么授权地址，关闭选店的modal,开启iframe的modal
  function reauthorization() {
    dispatch({
      type: "mdbdConfig/getIframeStoreMap",
      payload: { platformType: 2 }
    })
    dispatch({
      type: "mdbdConfig/updatePayload",
      payload: {
        shouquanModalVisible: false,//关闭授权modal
        elmBdStoreVisible: false, //控制饿了么选择门店modal的展示
        elmModalStoreInfo: {}, //饿了么可选门店列表modal中可选项列表        
        elmBdStoreSelectedRows: [], //饿了么授权成功之后modal中已经选中的门店
      }
    })

    dispatch({
      type: "mdbdConfig/updatePayload",
      payload: {
        shouquanModalVisible: true,//重启授权modal
      }
    })
  }


  return (
    <Modal
      title="绑定饿了么门店"
      visible={mdbdConfig.elmBdStoreVisible}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose={true}
    >
      <div>
        <div style={{ marginBottom: "20px" }}>即将为
         <span style={{ color: "red" }}>{mdbdConfig.elmModalStoreInfo.restaurantName && mdbdConfig.elmModalStoreInfo.restaurantName} </span>绑定饿了么账户
         <span style={{ fontWeight: 700 }}>{mdbdConfig.elmModalStoreInfo.username && mdbdConfig.elmModalStoreInfo.username}</span>下的门店</div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mdbdConfig.elmModalStoreInfo.authorizedShopVOS}
          rowKey={record => record.shopId}
          bordered
          pagination={false} //不展示分页
          scroll={{ y: 240 }}
        />
        <div style={{ color: "#999", lineHeight: "26px", marginTop: "20px" }}>
          <div>如果没找到对应的饿了么门店，请检查：</div>
          <div>1、该门店是否已绑定了会员宝其他门店？ 如果是：请先解绑，然后重新关联；</div>
          <div>2、您在饿了么是否存在多个账号，点击<a onClick={reauthorization} href="javascript:;" style={{ textDecoration: "none" }}>重新授权</a>新商户，获取该账号下门店</div>
        </div>
        <div style={{ textAlign: "center" }}> <Button type="primary" onClick={save}>确定</Button>        </div>
      </div>
    </Modal>
  );
}

BdElmMenDianModal.propTypes = {
  menu: PropTypes.object,
};


function mapStateToProps({ menu, mdbdConfig }) {
  return { menu, mdbdConfig, menu };
}

export default connect(mapStateToProps)(BdElmMenDianModal);

