import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './LabelPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import LabelAddModal from './LabelAddModal';
import Popconfirm from 'antd/lib/popconfirm';
import {routerRedux} from "dva/router";

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
  dispatch, lslabel,
  pageNo,
  total,
  dataSource,

}) => {


  function goeditgoods(record) {


    var item;
    lslabel.list.map((i, j) => {

      if (record.id == i.id) {
        item = i;
      }

    })

    dispatch({
      type: 'lslabel/updatePayload',
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

  const LabelAddModalProps = {
    visible: lslabel.modalVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'lslabel/updatePayload',
        payload: { modalVisible: false }
      });
    },
    lslabel,
  };

  const LabelDetailModalProps = {
    visible: lslabel.modalDetailVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'lslabel/updatePayload',
        payload: { modalDetailVisible: false }
      });
    },
    lslabel,
  };

  function managerHandle(record, index) {

    var handlebtn = [];

    handlebtn.push(<span key={index} ><a onClick={() => {


        dispatch({
            type: 'lslabel/updatePayload',
            payload: { id: record.id }
        });

        dispatch({
            type: 'lslabel/queryDetail',
            payload: { id: record.id }
        });

        dispatch(routerRedux.push({
            pathname: "/lslabeldetail",
            query: {}
        }));

    }}>标签详情</a>
      <span className="ant-divider" /><a onClick={() => {
            dispatch({
                type: 'lslabel/updatePayload',
                payload:{
                    modalVisible:true,
                    name:record.name,
                    id:record.id,
                    isAdd:false,
                }
            });
        }}>编辑</a>
      <span className="ant-divider" />
      <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={ ()=>{

          dispatch({
              type: 'lslabel/deleteLabel',
              payload: { id: record.id }
          });
      }


      }>
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
      render: (text, record, index) => {
        return index + 1;
      }
    },{
      title: '主类名称',
      dataIndex: 'name',
      key: 'name',
    },{
          title: '关联菜品',
          key: 'foodList',
          dataIndex: 'foodList',
          render: (text, record, index) => {

            let foodNames = [];

              record.foodList&&record.foodList.map((i)=>{
              foodNames.push(i.foodName);
            })

            return foodNames.join('、');


          }
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
    total: lslabel.total,
    current: lslabel.current,
    pageSize: lslabel.size,
    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'lslabel/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'lslabel/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * lslabel.size - lslabel.size;
    dispatch({ type: 'lslabel/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'lslabel/query', payload: {} });


  }


  function addCpdwClick() {

    dispatch({ type: 'lslabel/updatePayload', payload: { modalVisible: true, id: '', name: '', detailId: '',detailName: '',isAdd: true } });

  }


  return (
    <div className={styles.search}>
      <Form className={styles.formwidth} >

      </Form>
      <Button type = 'primary' style={{ marginLeft: 10, marginTop: 20 }} onClick={addCpdwClick}>新建主类</Button>

      <Table className={styles.table}
        columns={columns}
        dataSource={lslabel.list}
        rowKey={record => record.id}
        pagination={pagination}
        bordered />

      <LabelAddModal  {...LabelAddModalProps} />
    </div>
  );
};


CpdwPage.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
};

export default Form.create()(CpdwPage);