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
  dispatch, lscpdw,
  pageNo,
  total,
  dataSource,

}) => {


  function goeditgoods(record) {


    var item;
    lscpdw.list.map((i, j) => {

      if (record.id == i.id) {
        item = i;
      }

    })

    dispatch({
      type: 'lscpdw/updatePayload',
      payload: {
        id: item.id,
        code: item.code,
        english: item.english,
        name: item.name,
        remark: item.remark,
        status: item.status,
        modalEditVisible: true,
        isAdd: false,
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
    visible: lscpdw.modalVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'lscpdw/updatePayload',
        payload: { modalVisible: false }
      });
    },
    lscpdw,
  };

  const CpdwEditModalProps = {
    visible: lscpdw.modalEditVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'lscpdw/updatePayload',
        payload: { modalEditVisible: false }
      });
    },
    lscpdw,
  };


  function onOperate(record) {

    dispatch({
      type: 'lscpdw/deleteDW',
      payload: { id: record.id }
    });

  }

  function managerHandle(record, index) {

    var handlebtn = [];

    handlebtn.push(<span key={index} ><a onClick={() => { goeditgoods(record) }}>编辑</a>
      <span className="ant-divider" />
      <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => onOperate(record)}>
        <a>删除</a>
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
    total: lscpdw.total,
    current: lscpdw.current,
    pageSize: lscpdw.size,
    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'lscpdw/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'lscpdw/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * lscpdw.size - lscpdw.size;
    dispatch({ type: 'lscpdw/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'lscpdw/query', payload: {} });


  }

  function addReasonClick() {

    dispatch({ type: 'lscpdw/updatePayload', payload: { modalVisible: true } });

  }

  function addCpdwClick() {

    dispatch({ type: 'lscpdw/updatePayload', payload: { modalVisible: true, code: "", name: "", english: "", status: 1, remark: "", isAdd: true } });

  }

  function onClear() {
    dispatch({ type: 'lscpdw/updatePayload', payload: { keyword: "" } });
  }

  function onKeywordChange(e) {
    dispatch({ type: 'lscpdw/updatePayload', payload: { keyword: e.target.value } });
  }

  function onSearch() {

    dispatch({ type: 'lscpdw/query', payload: { name: lscpdw.keyword } });
  }


  return (
    <div className={styles.search}>
      <Form className={styles.formwidth} >

        <div style={{ marginLeft: 20 }} > <span>菜品单位</span><Input style={{ marginLeft: 20, width: 220 }} value={lscpdw.keyword} onChange={onKeywordChange} onPressEnter={onSearch} />
          <Button type="primary" style={{ marginLeft: 40 }} onClick={onSearch}>搜索</Button>
          <Button style={{ marginLeft: 10, marginRight: 20 }} onClick={onClear}>重置</Button>
        </div>

      </Form>
      <Button style={{ marginLeft: 10, marginTop: 20 }} onClick={addCpdwClick}>新增菜品单位</Button>
      <Button style={{ display: 'none' }}>获取默认单位</Button>

      <Table className={styles.table}
        columns={columns}
        dataSource={lscpdw.list}
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