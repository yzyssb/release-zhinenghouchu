import React, { PropTypes } from 'react';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import styles from './KsqdPage.less';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm';
import KsqdAddModal from './KsqdAddModal';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 12,
  },
};

const KsqdPage = ({
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
  dispatch, ksqd, ctglBaseSetting,
  pageNo,
  total,
  current,
  dataSource,

}) => {




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


  function goeditgoods(record) {


    var item = {};
    ksqd.list.map((i) => {

      if (record.id == i.id) {
        item = record;

      }


    })

    dispatch({
      type: 'ksqd/updatePayload',
      payload: {

        modalVisible: true,
        isAdd: false,
        id: item.id,
        timeName: item.timeName,
        startHour: addZero(item.startHour + ''),
        startMin: addZero(item.startMin + ''),
        endHour: addZero(item.endHour + ''),
        endMin: addZero(item.endMin + ''),
        week: item.week,

      }
    });


    dispatch({
      type: 'ksqd/querySellFoodDetail',
      payload: { id: record.id, }
    });

    dispatch({
      type: 'ksqd/querySellFoodComboDetail',
      payload: { id: record.id, }
    });




  }

  function onOperate(record) {

    dispatch({
      type: 'ksqd/deleteKsqd',
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

  function addZero(text) {
    var newText = '';
    if (text.length < 2) {
      newText = '0' + text;
    } else {
      newText = text;
    }
    return newText;
  }


  function managerStatus(record, index) {

    var text;


    // week是一个数组
    // var week = convert(record.week);

    let newWeek=record.week.sort();

    if (record.week.length > 0) {
     newWeek.map(function (item, index) {
        // text = (text ? text : "") + convert(item) + '(' + addZero(record.startHour + '') + ':' + addZero(record.startMin + '') + '-' + addZero(record.endHour + '') + ':' + addZero(record.endMin + '') + ')';


        text = (text ? text : "") + convert(item) + '(' + addZero(record.startHour + '') + ':' + addZero(record.startMin + '') + '-' + addZero(record.endHour + '') + ':' + addZero(record.endMin + '') + ')' ;

      })
    }


    // text = week + '(' + addZero(record.startHour + '') + ':' + addZero(record.startMin + '') + '-' + addZero(record.endHour + '') + ':' + addZero(record.endMin + '') + ')';


    return text;
  }

  function convert(week) {
    var str;
    if (week == 1) {
      str = '周日';
    } else if (week == 2) {
      str = '周一';
    } else if (week == 3) {
      str = '周二';
    } else if (week == 4) {
      str = '周三';
    } else if (week == 5) {
      str = '周四';
    } else if (week == 6) {
      str = '周五';
    } else if (week == 7) {
      str = '周六';
    }

    return str;

  }



  const columns = [
    {
      title: '时段名称',
      dataIndex: 'timeName',
      key: 'timeName',
    }, {
      title: '时段',
      dataIndex: 'week',
      key: 'week',
      width: 130,
      render: (text, record, index) => (
        managerStatus(record, index)
      ),
    },
    {
      title: '提示',
      dataIndex: 'isVaild',
      key: 'isVaild',
      render: function (text, record, index) {
        if (record.isVaild == 0) {
          return "该时段已经不存在，如需更改请重新编辑"
        }
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
    total: ksqd.total,
    current: ksqd.current,
    pageSize: ksqd.size,
    onChange: (pageNo) => {
      onPageChange(pageNo)
    },
    showSizeChanger: true,
    onShowSizeChange: SizeChange,
    showTotal: (total) => { return `共 ${total} 条` },
  };

  function SizeChange(current, pageSize) {


    dispatch({ type: 'ksqd/updatePayload', payload: { size: pageSize, current: 1, offset: 0 } });
    dispatch({ type: 'ksqd/query', payload: {} });


  }

  function onPageChange(pageNo) {

    var offset = pageNo * ksqd.size - ksqd.size;
    dispatch({ type: 'ksqd/updatePayload', payload: { offset: offset, current: pageNo } });
    dispatch({ type: 'ksqd/query', payload: {} });


  }


  function addClick() {

    dispatch({
      type: 'ksqd/updatePayload', payload: {
        modalVisible: true, 
        id: 0,
        week: [],
        startHour: '',
        startMin: '',
        endHour: '',
        endMin: '',
        selectFoodDetail: [],
        selectComboDetail: [],
        _checkedFoodKeys: [],
        _checkedFoodComboKeys: [],
        timeName: '',
        isAdd: true,
      }
    });

  }



  const KsqdAddModalProps = {
    visible: ksqd.modalVisible,
    dispatch,
    onOk() {
    },
    onCancel() {
      dispatch({
        type: 'ksqd/updatePayload',
        payload: { modalVisible: false,errorMsg:"" }
      });
    },
    ksqd, ctglBaseSetting,
  };

  return (
    <div className={styles.search}>




      <Button style={{ marginLeft: 10, marginTop: 20 }} onClick={addClick}>新增可售清单</Button>

      <Table className={styles.table}
      size="middle"
        columns={columns}
        dataSource={ksqd.list}
        rowKey={record => record.id}
        pagination={pagination}
        bordered />
      <KsqdAddModal  {...KsqdAddModalProps} />
    </div>
  );
};


KsqdPage.propTypes = {
  visible: PropTypes.any,
  form: PropTypes.object,
  item: PropTypes.object,
};

export default Form.create()(KsqdPage);