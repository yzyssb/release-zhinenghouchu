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
import ElmcpwhModal from "./ElmcpwhModal";
import styles from "./Elmcpwh.less";
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;

function Elmcpwh({ menu, dispatch, glwmcpConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };


  // 动态得到已关联的数量是一个对象
  let associatedCount = glwmcpConfig.elmDataSource.filter(function (item, index) {
    return item.foodVO
  });


  // 筛选----切换选择关联状态
  function changeFilterState(e) {
    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: { elmFilterState: e }
    })
  }

  // 筛选----输入菜品名称
  function changeFilterFoodName(e) {
    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: { elmFilterFoodName: e.target.value.trim() }
    })
  }


  const columns = [
    {
      title: '序号',
      dataIndex: 'xuhao',
      key: 'xuhao',
      width: 80,
      render: function (text, record, index) {
        return index + 1
      }
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: "categoryName",
      width: 300
    },

    {
      title: '饿了么菜品名称',
      dataIndex: 'name',
      key: "name",
      width: 300
    }, {
      title: '关联状态',
      dataIndex: 'isRef',
      key: "isRef",
      width: 100,
      render: function (text, record, index) {
        return record.isRef == 0 ? "未关联" : "已关联"
      }
    }
    ,
    {
      title: (<span>收银菜品 (已关联 <i style={{ color: "red" }}>{associatedCount.length}</i> /{glwmcpConfig.elmDataSource.length} )</span>),
      dataIndex: 'action',
      key: "action",
      width: 400,
      render: function (text, record, index) {
        return (
          <div>
            {record.foodVO &&
              <Row>
                <Col span="8" style={{ textAlign: "center" }}> {record.foodVO ? record.foodVO.name : ""}</Col>
                <Col span="8" style={{ color: "red", textAlign: "center" }}>
                  <Popconfirm title="确定删除关联关系吗？" onConfirm={() => delLink(record)}
                    okText="确定" cancelText="取消">
                    <a href="javascript:;" style={{ color: "red", textDecoration: "none" }} >删除关联</a>
                  </Popconfirm>
                </Col>
                <Col span="8" style={{ color: "#0F8FEA", textAlign: "center" }}>
                  <a href="javascript:;" onClick={() => reLink(record)} >重新关联</a>
                </Col>
              </Row>}
            {!record.foodVO &&
              <Row>
                <Col span="8" offset="8" style={{ color: "#0F8FEA", textAlign: "center" }}>
                  <a href="javascript:;" style={{ textDecoration: "none" }} onClick={() => reLink(record)} >选择关联菜品</a>
                </Col>
              </Row>}

          </div>
        )
      }
    }];

  // 删除关联菜品
  function delLink(record) {
    dispatch({
      type: "glwmcpConfig/delFoodErpToElm",
      payload: {
        platformType: glwmcpConfig.targetTab,
        itemSpecId: {
          itemId: record.itemId,
          specId: record.specId
        }
      }
    })
  }

  // 选择关联菜品|重新关联--展示modal,记录当前选中的饿了么菜品
  function reLink(record) {
    // 筛选饿了么菜品的前两个字
    let erpFoodList = glwmcpConfig.erpInitFoodList.filter(function (item, index) {
      return item.dishNameWithSpec.indexOf(record.name.substr(0, 2)) != -1;
    })

    dispatch({
      type: "glwmcpConfig/updatePayload",
      payload: { elmVisible: true, elmCurrentElmFood: record, erpFoodList, elmModalFoodName: record.name.substr(0, 2) }
    });

  }

  // 点击搜索，过滤elmInitialDataSource，将过滤后的数据放到elmDataSource
  function search() {
    let elmInitialDataSource = glwmcpConfig.elmInitialDataSource;
    if (glwmcpConfig.elmFilterState.length == 0) {
      // 情形1，用户没有勾选已关联和未关联，不用管有没有输入菜名直接返回[]
      dispatch({
        type: "glwmcpConfig/updatePayload",
        payload: { elmDataSource: [] }
      });

    } else if (glwmcpConfig.elmFilterState.length == 1) {
      // 情形2，用户只勾选已关联|未关联
      let result = elmInitialDataSource.filter(function (item, index) {
        return item.isRef == glwmcpConfig.elmFilterState[0]
      })

      if (glwmcpConfig.elmFilterFoodName == "") {
        dispatch({
          type: "glwmcpConfig/updatePayload",
          payload: { elmDataSource: result }
        });
      } else {
        let newResult = result.filter(function (item, index) {
          return item.name.indexOf(glwmcpConfig.elmFilterFoodName) != -1;
        });
        dispatch({
          type: "glwmcpConfig/updatePayload",
          payload: { elmDataSource: newResult }
        });
      }
    } else if (glwmcpConfig.elmFilterState.length == 2) {
      // 情形3，用户全选 已关联未关联
      if (glwmcpConfig.elmFilterFoodName == "") {
        dispatch({
          type: "glwmcpConfig/updatePayload",
          payload: { elmDataSource: elmInitialDataSource }
        });
      } else {
        let result = elmInitialDataSource.filter(function (item, index) {
          return item.name.indexOf(glwmcpConfig.elmFilterFoodName) != -1;
        });
        dispatch({
          type: "glwmcpConfig/updatePayload",
          payload: { elmDataSource: result }
        });
      }

    }
  }

  // 取窗口可视范围的高度
  function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
      var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    else {
      var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
    }
    return clientHeight;
  }

  let _clienHeight = getClientHeight();




  return (
    <div>
      {/* 头部筛选条件 */}
      <Row style={{ lineHeight: "32px", padding: "10px 0" }}>
        <Col span="4" >
          <CheckboxGroup options={glwmcpConfig.elmFilterStateOptions} value={glwmcpConfig.elmFilterState} onChange={changeFilterState} />
        </Col>
        <Col span="5">
          <Input placeholder="请输入菜品名称" onChange={changeFilterFoodName} value={glwmcpConfig.elmFilterFoodName} />
        </Col>
        <Col span="2" offset="1"><Button type="primary" onClick={search}>搜索</Button></Col>
      </Row>

      <Row>
        <Col span="20">
          其中<span style={{ fontSize: "18px", color: "red" }}>{glwmcpConfig.elmNotAssociated}</span>个外卖菜品未关联至收银系统，请进行关联并映射至收银系统 <span style={{ color: "red" }}>未关联的外卖菜品将无法打印和核销</span>
        </Col>
        <Col span="4">
          <div style={{ textAlign: "right" }}> <a href="https://melody.shop.ele.me" title="脚本之家" target="_blank">去维护外卖菜品</a></div>
        </Col>
      </Row>

      <Table
        size="middle"
        className={styles.elmTab}
        columns={columns}
        dataSource={glwmcpConfig.elmDataSource}
        rowKey={record => record.name}
        bordered
        pagination={false} //不展示分页
        scroll={{ y: _clienHeight ? _clienHeight - 330 : 400 }}
      />
      <ElmcpwhModal dispatch={dispatch} glwmcpConfig={glwmcpConfig} />
    </div>
  );
}

Elmcpwh.propTypes = {
  menu: PropTypes.object,
};


function mapStateToProps({ menu, glwmcpConfig }) {
  return { menu, glwmcpConfig, menu };
}

export default connect(mapStateToProps)(Elmcpwh);

