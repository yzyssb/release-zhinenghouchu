import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './CpdwPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import CpdwAddModal from './CpdwAddModal';
import CpdwEditModal from './CpdwEditModal';
import Popconfirm from 'antd/lib/popconfirm';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 12,
  },
};

const CpdwPage = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  dispatch, cpdw,
  pageNo,
  total,
  dataSource,

}) => {


  function goeditgoods(record) {


    var item;
    cpdw.list.map((i, j) => {

      if (record.id == i.id) {
        item = i;
      }

    })

    dispatch({
      type: 'cpdw/updatePayload',
      payload: {
        id: item.id,
        code: item.code,
        english: item.english,
        name: item.name,
        remark: item.remark,
        status: item.status,
        modalEditVisible: true,
        isAdd: false,
        issueId:item.issueId,
      }
    });

  }


  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    validateFields((errors) => {
      if (!!errors) {
        return;
      }
    });

    var data = { ...getFieldsValue() };

    //dispatch({type: 'orderlist/recoverOrderTime',payload:{}});

  }

  function onCuisineChange(value) {


  }

  const CpdwAddModalProps = {
    visible: cpdw.modalVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'cpdw/updatePayload',
        payload: { modalVisible: false }
      });
    },
    cpdw,
  };

  const CpdwEditModalProps = {
    visible: cpdw.modalEditVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'cpdw/updatePayload',
        payload: { modalEditVisible: false }
      });
    },
    cpdw,
  };


  function onOperate(record) {

    dispatch({
      type: 'cpdw/deleteDW',
      payload: { id: record.id }
    });

  }

  function managerHandle(record, index) {

    var handlebtn = [];

    handlebtn.push(<span key={index} ><a onClick={() => { goeditgoods(record) }}>编辑</a>
      <span className="ant-divider" />
      <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
        <a disabled={cpdw.manageType ==1?true:false}>删除</a>
      </Popconfirm>

    </span>)

    return handlebtn;
  }

  function managerStatus(record, index) {

    var text;

    if (record.status == 1) {

      text = "启用";
    } else {
      text = "停用";
    }

    return text;
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '单位编码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '单位名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => (
        managerStatus(record, index)
      ),
    }, {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (text, record, index) => (
        managerHandle(record, index)
      ),
    }
  ];

  const pagination = {
    total: cpdw.total,
    current: cpdw.current,
    pageSize: cpdw.size,
    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'cpdw/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'cpdw/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * cpdw.size - cpdw.size;
    dispatch({ type: 'cpdw/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'cpdw/query', payload: {} });


  }

  function addReasonClick() {

    dispatch({ type: 'cpdw/updatePayload', payload: { modalVisible: true } });

  }

  function addCpdwClick() {

    dispatch({ type: 'cpdw/updatePayload', payload: { modalVisible: true, code: "", name: "", english: "", status: 1, remark: "", isAdd: true } });

  }

  function onClear() {
    dispatch({ type: 'cpdw/updatePayload', payload: { keyword: "" } });
  }

  function onKeywordChange(e) {
    dispatch({ type: 'cpdw/updatePayload', payload: { keyword: e.target.value } });
  }

  function onSearch() {

    dispatch({ type: 'cpdw/query', payload: { name: cpdw.keyword } });
  }


  return (
    <div className={styles.search}>
      <Form className={styles.formwidth} >

        <div style={{ marginLeft: 20 }} > <span>菜品单位</span><Input style={{ marginLeft: 20, width: 220 }} value={cpdw.keyword} onChange={onKeywordChange} onPressEnter={onSearch} />
          <Button type="primary" style={{ marginLeft: 40 }} onClick={onSearch}>搜索</Button>
          <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={onClear}>重置</Button>
        </div>

      </Form>
      <Button disabled={cpdw.manageType ==1?true:false} style={{ marginLeft: 10, marginTop: 20 }} onClick={addCpdwClick}>新增菜品单位</Button>
      <Button style={{ display: 'none' }}>获取默认单位</Button>

      <Table className={styles.table}
        columns={columns}
        dataSource={cpdw.list}
        rowKey={record => record.id}
        pagination={pagination}
        bordered />

      <CpdwAddModal  {...CpdwAddModalProps} />
      <CpdwEditModal  {...CpdwEditModalProps} />
    </div>
  );
};


CpdwPage.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
};

export default Form.create()(CpdwPage);