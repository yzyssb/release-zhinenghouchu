import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { Popconfirm } from 'antd/lib';



// 上面只是表单，把表单放到下面的页面中
function SetStaffList({ menu, dispatch, cmpglPageStaffConfig }) {
  const HeaderProps = {
    menu,
    dispatch,
  };


  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: function (text, record, index) {
        return <span key={record.id}>{index + 1}</span>
      }
    }, {
      title: '店员姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      // render: function (text, record, index) {
      //   return (<span>
      //     <a href="javascript:;" onClick={() => { delStaff(text, record, index) }}>删除</a>
      //   </span>
      //   )
      // }
      render: (text, record, index) => (
        managerHandle(record, index)
      ),
    }
  ];

  // 点击触摸屏管理去触摸屏管理页面
  function toCmpgl() {
    /*dispatch(routerRedux.push({
      pathname: "/cmpgl",
      query: {
        type: 'cmpgl',
      }
    }));*/
    window.history.go(-1)
  }

  // 新确认删除
  function managerHandle(record, index) {
    let handlebtn = [];
    handlebtn.push(
      <span key={index}>
        <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
          <a>删除</a>
        </Popconfirm>
      </span>);

    return handlebtn;
  }

  // 执行删除
  function onOperate(record) {
    dispatch({
      type: 'cmpglPageStaffConfig/delStaff',
      payload: { id: record.id,touchscreenId:cmpglPageStaffConfig.query.id}
    });
  }

  // 删除触摸屏下的员工
  // function delStaff(text, record, index) {
  //   dispatch({
  //     type: 'cmpglPageStaffConfig/delStaff',
  //     payload: { id: record.id }
  //   });

  // }


  // 点击设置店员展示Modal并请求数据

  function showModal() {
    dispatch({
      type: 'cmpglPageStaffConfig/updatePayload',
      payload: { visible: true, selectedRows: [], selectedRowKeys: [] }
    });

    // 每次点击选择店员都执行列表中的数据和modal中的数据去重

    // 把现有列表中的数据和modal列表中请求到的所有数据进行对比去重
    let dataSource = cmpglPageStaffConfig.dataSource;

    let linshiModalData = cmpglPageStaffConfig.modalData; // 请求到的modal列表数据

    let result = [];
    // 执行去重
    for (var i = 0; i < linshiModalData.length; i++) {
      var obj = linshiModalData[i];
      var num = obj.id;
      var isExist = false;
      for (var j = 0; j < dataSource.length; j++) {
        var aj = dataSource[j];
        var n = aj.id;
        if (n == num) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        result.push(obj);
      }
    }

    // 更新modal列表中的数据
    dispatch({
      type: 'cmpglPageStaffConfig/updatePayload',
      payload: { resultData: result }
    });

  }

  // 点击取消关闭modal
  function handleCancel() {
    dispatch({
      type: 'cmpglPageStaffConfig/updatePayload',
      payload: { visible: false, selectedRows: [], selectedRowKeys: [] }
    });
  }

  // 点击确定执行后面的逻辑
  function handleOk() {
    console.log("点击了确定");
    dispatch({
      type: 'cmpglPageStaffConfig/updatePayload',
      payload: { visible: false }
    });

    console.log(cmpglPageStaffConfig.selectedRows)
    // 
    let payload = {};
    payload.userIdList = [];
    payload.touchscreenId = cmpglPageStaffConfig.query.id;
    // 循环拿到选中项的id
    cmpglPageStaffConfig.selectedRows.map(function (item, index) {
      payload.userIdList.push(item.id)
    });

    // 调用请求接口
    dispatch({
      type: 'cmpglPageStaffConfig/addStaffs',
      payload: payload
    });




  }


  // 以下是modal部分
  const modalColumns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: function (text, record, index) {
        return <span key={record.id}>{index + 1}</span>
      }
    },
    {
      title: '店员姓名',
      dataIndex: 'realName',
      key: 'realName',
    }, {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',

    }];

  const rowSelection = {
    selectedRowKeys: cmpglPageStaffConfig.selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      dispatch({
        type: 'cmpglPageStaffConfig/updatePayload',
        payload: { selectedRows, selectedRowKeys }
      });
    },
    getCheckboxProps: record => ({

      name: record.name,
    }),
  };

  // 切换分页时把选中的项在视觉上清空
  function changeTable() {
    console.log("changeTable");
    dispatch({
      type: 'cmpglPageStaffConfig/updatePayload',
      payload: { selectedRows: [], selectedRowKeys: [] }
    });
  }



  return (
    <Header {...HeaderProps}>
      <div style={{background:'#eee',padding:'10px 20px',marginBottom:15}}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item style={{ cursor: "pointer" }} onClick={toCmpgl}>触摸屏管理</Breadcrumb.Item>
          <Breadcrumb.Item >设置店员</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div style={{ display: "flex" }}>
        <span style={{ lineHeight: "68px", flex: "1", fontSize: "16px" }}>触摸屏名称：{cmpglPageStaffConfig.query.touchscreenName}</span>
        <Button type="primary" style={{ margin: "20px 0" }} onClick={showModal}>选择店员</Button>
      </div>

      <Table
        pagination={true}
        columns={columns}
        rowKey={record => record.id}
        dataSource={cmpglPageStaffConfig.dataSource}
        bordered
      />
      <Modal
        title="选择店员"
        visible={cmpglPageStaffConfig.visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table rowKey={record => record.id} onChange={changeTable} rowSelection={rowSelection} columns={modalColumns} dataSource={cmpglPageStaffConfig.resultData} pagination={false}
        style={{height:500,overflowY:'auto'}}/>
      </Modal>

    </Header>
  );
}

SetStaffList.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, cmpglPageStaffConfig }) {
  return { menu, cmpglPageStaffConfig };
}

export default connect(mapStateToProps)(SetStaffList);

