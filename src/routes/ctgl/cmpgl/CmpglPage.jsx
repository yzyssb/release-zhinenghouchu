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
import { Popconfirm } from 'antd/lib';

import Modal from 'antd/lib/modal';

const confirm = Modal.confirm;




const CmpglPage=({ dispatch, cmpglPageConfig })=>{

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: function (text, record, index) {
        return <span key={record.id}>{index + 1}</span>
      }
    },

    {
      title: '触摸屏名称',
      dataIndex: 'touchscreenName',
      key: 'touchscreenName',
    },

    {
      title: 'ip地址',
      dataIndex: 'touchscreenIp',
      key: 'touchscreenIp',
    },
    {
      title: '传菜触摸屏',
      dataIndex: 'touchscreenType',
      key: 'touchscreenType',
      render: function (text, record, index) {
        return (
          <span>

            {record.touchscreenType == 1 && "厨师端"}
            {record.touchscreenType == 2 && "传菜端"}
            {record.touchscreenType == 3 && "撤台端"}
          </span>
        )
      }
    },

    {
      title: '是否打印小票',
      dataIndex: 'isPrintReceipt',
      key: 'isPrintReceipt',


      render: function (text, record, index) {
        return (
          <span>
            {record.isPrintReceipt == 1 ? "打印" : "不打印"}
          </span>
        )
      }
    },
    {
      title: '对应打印机',
      dataIndex: 'printerIp',
      key: 'printerIp',
    },
    {
      title: '是否可用',
      dataIndex: 'state',
      key: 'state',

      render: function (text, record, index) {
        return (
          <span>
            {record.state == 1 ? "可用" : "不可用"}
          </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      // render: function (text, record, index) {
      //   return (<span key={record.id}>
      //     <a href="javascript:;" onClick={() => { clickEdit(text, record, index) }}>修改</a>
      //     <span className="ant-divider" />
      //     <a href="javascript:;" onClick={() => { showDeleteConfirm(text, record, index) }}>删除</a>
      //     <span className="ant-divider" />
      //     <a href="javascript:;" onClick={() => { setStaff(text, record, index) }}>设置店员</a>
      //   </span>
      //   )
      // }
      render: (text, record, index) => (
        managerHandle(record, index)
      ),
    }
  ];



  // 点击新增去新增去触摸屏页面
  function toCmpglForm() {

    // 重置editData数据
    let defaultEditData = cmpglPageConfig.defaultEditData();

    // 标记是新增端口进入的下一个页面,给一个标识重置表单
    dispatch({
      type: 'cmpglPageConfig/updatePayload',
      payload: { way: "add", editData: defaultEditData, isResetForm: true }
    });

    // 然后跳转页面
    dispatch(routerRedux.push({
      pathname: "/cmpglForm",
      query: {}
    }));
  }


  // 点击设置店员跳转到触摸屏管理设置店员页面
  // function setStaff(text, record, index) {
  //   // 把触摸屏名称和id带过去新的页面
  //   dispatch(routerRedux.push({
  //     pathname: "/setStaff",
  //     query: { touchscreenName: record.touchscreenName, id: record.id }
  //   }));
  // }

  // 点击分页时请求数据pageNumber代表点击的数字
  function onChangeShowPage(pageNumber) {
    let pageForm = cmpglPageConfig.pageForm;
    pageForm.offset = (pageNumber - 1) * 10;
    dispatch({
      type: 'cmpglPageConfig/updatePayload',
      payload: { pageForm, current: pageNumber }
    });

    dispatch({
      type: 'cmpglPageConfig/query',
      payload: {}
    });
  }


  // 点击列表中的修改按钮
  // function clickEdit(text, record, index) {
  //   // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
  //   // let restoresData = zfglPageConfig.restoresData();

  //   dispatch({
  //     type: 'cmpglPageConfig/updatePayload',
  //     payload: { editData: record, way: "edit" }
  //   });

  //   // 然后再跳转页面
  //   dispatch(routerRedux.push({
  //     pathname: "/cmpglForm",
  //     query: {
  //       type: 'cmpglForm',
  //     }
  //   }));
  // }

  // // 点击删除按钮删除对应的列表数据
  // function showDeleteConfirm(text, record, index) {
  //   var resultIndex = index + 1;
  //   confirm({
  //     title: '确定删除第' + resultIndex + '条数据吗?',
  //     content: '',
  //     okText: 'Yes',
  //     okType: 'danger',
  //     cancelText: 'No',
  //     onOk() {
  //       //发送删除请求 
  //       dispatch({
  //         type: 'cmpglPageConfig/delCmpglList',
  //         payload: { id: record.id }
  //       });
  //     },
  //     onCancel() {
  //       // 点击了取消
  //     },
  //   });
  // }



  // 确认用户选择的是编辑还是删除
  function managerHandle(record, index) {
    let handlebtn = [];
    handlebtn.push(
      <span key={index}>
        <a onClick={() => {
          edit(record)
        }}>编辑</a>
        <span className="ant-divider" />
        <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
          <a>删除</a>
        </Popconfirm>
        <span className="ant-divider" />
        <a onClick={() => {
          setStaff(record)
        }}>设置店员</a>

      </span>);

    return handlebtn;
  }

  // 执行删除
  function onOperate(record) {
    //发送删除请求 
    dispatch({
      type: 'cmpglPageConfig/delCmpglList',
      payload: { id: record.id }
    });
  }

  // 执行编辑
  const edit = (record) => {
    // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
    // let restoresData = zfglPageConfig.restoresData();

    dispatch({
      type: 'cmpglPageConfig/updatePayload',
      payload: { editData: record, way: "edit" }
    });

    // 然后再跳转页面
    dispatch(routerRedux.push({
      pathname: "/cmpglForm",
      query: {
        type: 'cmpglForm',
      }
    }));
  };

  // 执行设置店员
  const setStaff = (record) => {
    // 把触摸屏名称和id带过去新的页面
    dispatch(routerRedux.push({
      pathname: "/setStaff",
      query: { touchscreenName: record.touchscreenName, id: record.id }
    }));
  };





  return (
      <div>
        <Button type="primary" style={{ marginBottom:20 }} onClick={toCmpglForm}>新增</Button>
        <Table
          columns={columns}
          pagination={false}
          rowKey={record => record.id}
          dataSource={cmpglPageConfig.dataSource}
          bordered
        />
        <Pagination current={cmpglPageConfig.current} style={{ float: "right", paddingTop: "20px" }} showQuickJumper defaultCurrent={1} total={cmpglPageConfig.totalCount} onChange={onChangeShowPage} />
      </div>
  );
}


function mapStateToProps({ cmpglPageConfig }) {
  return { cmpglPageConfig };
}

export default connect(mapStateToProps)(CmpglPage);

