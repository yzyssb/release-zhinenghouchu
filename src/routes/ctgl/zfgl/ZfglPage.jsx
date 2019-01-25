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
import styles from "./ZfglPage.less";
import Modal from 'antd/lib/modal';
import { Popconfirm } from 'antd/lib';

const confirm = Modal.confirm;





function ZfglPage({ menu, dispatch, zfglPageConfig }) {

  const HeaderProps = {
    menu,
    dispatch,
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '支付类型',
      dataIndex: 'payMethodTypeName',
      key: 'payMethodTypeName',
    }, {
      title: '支付名称',
      dataIndex: 'payMethodName',
      key: 'payMethodName',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: function (text, record, index) {
        return (
          <span>
            {record.state == 2 ? "停用" : "启用"}
          </span>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
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
      //   </span>
      //   )
      // }
      render: (text, record, index) => (
        managerHandle(record, index)
      ),
    }
  ];

  // 点击分页时请求数据pageNumber代表点击的数字
  function onChangeShowPage(pageNumber) {
    let pageForm = zfglPageConfig.pageForm;
    pageForm.offset = (pageNumber - 1) * 10;
    dispatch({
      type: 'zfglPageConfig/updatePayload',
      payload: { pageForm, current: pageNumber }
    });

    dispatch({
      type: 'zfglPageConfig/query',
      payload: {}
    });
  }

  // 点击新增跳转到ZfglPageForm.jsx页面
  function toZfglForm() {
    dispatch(routerRedux.push({
      pathname: "/zfglForm",
      query: { type: "zfglForm" }
    }));
    // 每次点击新增都要重置zfglPageConfig中editData中的数据
    let restoresData = zfglPageConfig.restoresData();
    dispatch({
      type: 'zfglPageConfig/updatePayload',
      payload: { editData: restoresData, way: "add", checkName: 0 }
    });
  }

  // 点击列表中的修改按钮
  // function clickEdit(text, record, index) {
  //   // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
  //   let restoresData = zfglPageConfig.restoresData();
  //   dispatch({
  //     type: 'zfglPageConfig/updatePayload',
  //     payload: { editData: record, way: "edit", checkName: 0 }
  //   });

  //   // 然后再跳转页面
  //   dispatch(routerRedux.push({
  //     pathname: "/zfglForm",
  //     query: {
  //       type: 'zfglForm',
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
  //         type: 'zfglPageConfig/delPayMethod',
  //         payload: { id: record.id }
  //       });
  //     },
  //     onCancel() {
  //       // 点击了取消
  //     },
  //   });
  // }

  // 新删除和新修改样式

  // 确认用户选择的是编辑还是删除
  function managerHandle(record, index) {
    let handlebtn = [];
    handlebtn.push(
      <span key={index}>
        {record.payMethodType==6?(
          <a onClick={() => {
            edit(record)
          }}>编辑</a>
        ):(
          <span style={{color:'#ccc'}}>编辑</span>
        )}
        <span className="ant-divider" />
        {/* <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
          <a>删除</a>
        </Popconfirm> */}
        <span style={{color:'#ccc'}}>删除</span>
      </span>);

    return handlebtn;
  }

  // 执行删除
  function onOperate(record) {
    // 删除指定的数据，然后更新
    //发送删除请求 
    dispatch({
      type: 'zfglPageConfig/delPayMethod',
      payload: { id: record.id }
    });
  }

  // 执行编辑
  const edit = (record) => {
    // 每次点击修改把当前的数据直接付给editData,并标记从哪个入口进入的
    // let restoresData = zfglPageConfig.restoresData();

    // 通过id去请求详情

    // dispatch({
    //   type: 'zfglPageConfig/updatePayload',
    //   payload: { editData: record, way: "edit", checkName: 0 }
    // });

    dispatch({
      type: 'zfglPageConfig/updatePayload',
      payload: { way: "edit", checkName: 0 }
    });

    dispatch({
      type: 'zfglPageConfig/getDetail',
      payload: { id: record.id }
    });

    // 然后再跳转页面
    dispatch(routerRedux.push({
      pathname: "/zfglForm",
      query: {
        type: 'zfglForm',
      }
    }));
  };

  const pagination = {
    total: zfglPageConfig.total,
    current: zfglPageConfig.current,
    pageSize: zfglPageConfig.size,

    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'zfglPageConfig/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'zfglPageConfig/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * zfglPageConfig.size - zfglPageConfig.size;
    dispatch({ type: 'zfglPageConfig/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'zfglPageConfig/query', payload: {} });


  }

  return (
    <Header {...HeaderProps}>
      <div>
        <Button type="primary" className={styles.buttonMargin} onClick={toZfglForm} disabled>新增</Button>
        <Table
          columns={columns}
          pagination={pagination}
          rowKey={record => record.id}
          dataSource={zfglPageConfig.dataSource}
          bordered
        />

      </div>
    </Header>
  );
}

ZfglPage.propTypes = {
  menu: PropTypes.object,
};

function mapStateToProps({ menu, zfglPageConfig }) {
  return { menu, zfglPageConfig };
}

export default connect(mapStateToProps)(ZfglPage);
