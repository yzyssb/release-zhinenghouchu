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


function ElmcpwhModal({ menu, dispatch, glwmcpConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };

  // 关闭modal,清空数据
  function handleCancel() {
    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: {
        elmModalFoodName: "", //清空食品名称
        elmVisible: false,//关闭modal
        elmSelectedRows: [], //modal中选中的菜
        elmCurrentElmFood: {}, //饿了么选中的菜品 
        erpFoodList: glwmcpConfig.erpInitFoodList //将modal列表中的数据重置回去
      }
    });
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: "index",
      width: 70,
      render: function (text, record, index) {
        return index + 1;
      }
    },
    {
      title: '菜品分类',
      dataIndex: 'categoryName',
      key: "categoryName",
      width: 300
    }, {
      title: '菜品名称',
      dataIndex: 'dishNameWithSpec',
      key: "dishNameWithSpec",
      width: 300
    }
  ];

  // 输入菜品名称
  function changeModalFoodName(e) {
    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: { elmModalFoodName: e.target.value.trim() }
    })
  }

  // 前端搜索过滤
  function search() {
    let erpInitFoodList = glwmcpConfig.erpInitFoodList;
    let result = erpInitFoodList.filter(function (item, index) {
      return item.dishNameWithSpec.indexOf(glwmcpConfig.elmModalFoodName) != -1;
    });
    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: { erpFoodList: result }
    });
  }

  // tab单选配置
  const rowSelection = {
    type: "radio", //标记为单选
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: "glwmcpConfig/updatePayload",
        payload: { elmSelectedRows: selectedRows }
      })
    }
  };

  // 保存
  function save() {
    // 检测有没有选择菜品
    if (glwmcpConfig.elmSelectedRows.length == 0) {
      message.error("请选择erp菜品");
      return
    }

    let foodRefVO = {};

    foodRefVO.itemId = glwmcpConfig.elmCurrentElmFood.itemId; // 外卖菜品ID,
    foodRefVO.itemName = glwmcpConfig.elmCurrentElmFood.name; // 外卖菜品名称（规格名称） ,
    foodRefVO.itemSpecId = glwmcpConfig.elmCurrentElmFood.specId; // 外卖规格ID,

    foodRefVO.eDishCode = glwmcpConfig.elmSelectedRows[0].eDishCode; // ERP端菜品ID,
    foodRefVO.name = glwmcpConfig.elmSelectedRows[0].dishNameWithSpec; // ERP端菜品名称(规格名称),
    foodRefVO.skuId = glwmcpConfig.elmSelectedRows[0].eDishSkuCode; // ERP端菜品规格ID

    dispatch({
      type: "glwmcpConfig/saveFoodErpToElm",
      payload: { platformType: 2, foodRefVO }
    });
  }


  return (
    <Modal
      title="关联菜品"
      visible={glwmcpConfig.elmVisible}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose={true}
    >
      <div>
        
        {/* 头部筛选条件 */}
        <Row style={{ lineHeight: "32px", padding: "15px 0" }}>
          <Col span="10">
            <Input placeholder="请输入菜品名称" value={glwmcpConfig.elmModalFoodName} onChange={changeModalFoodName} />
          </Col>
          <Col span="2" offset="1"><Button type="primary" onClick={search}>搜索</Button></Col>
        </Row>

        <div>请选择收银系统的菜品，以关联至饿了么外卖菜品：<span style={{ color: "red" }}>{glwmcpConfig.elmCurrentElmFood.name ? glwmcpConfig.elmCurrentElmFood.name : ""}</span></div>
        <Table
          size="middle"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={glwmcpConfig.erpFoodList}
          rowKey={record => record.dishNameWithSpec}
          bordered
          pagination={false} //不展示分页
          scroll={{ y: 240 }}
        />
        <Row style={{ marginTop: "30px" }}>
          <Col span="18">关联至：<span style={{ fontWeight: "700" }}>{(glwmcpConfig.elmSelectedRows.length > 0 && glwmcpConfig.elmSelectedRows[0].dishNameWithSpec) ? glwmcpConfig.elmSelectedRows[0].dishNameWithSpec : ""}</span> </Col>
          <Col span="6" style={{ textAlign: "right" }}><Button type="primary" onClick={save}>确定关联</Button></Col>
        </Row>
      </div>
    </Modal>
  );
}

ElmcpwhModal.propTypes = {
  menu: PropTypes.object,
};


function mapStateToProps({ menu, glwmcpConfig }) {
  return { menu, glwmcpConfig, menu };
}

export default connect(mapStateToProps)(ElmcpwhModal);

