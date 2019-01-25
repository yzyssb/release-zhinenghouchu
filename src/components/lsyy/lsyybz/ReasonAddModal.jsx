import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './ReasonAddModal.less';
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

const ReasonAddModal = ({

  visible,
  onOk,
  onCancel,
  currentItem,
  dispatch,
  form: {
      getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue,
    },
  lsyybz,
}) => {


  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const Option = Select.Option;

  const children = [];

  lsyybz.commentTypes.map((i, j) => {

    children.push(
      <Option value={i.value} key={i.value}>{i.key}</Option>
    )

  })


  function handleOk() {
    dispatch({
      type: 'lsyybz/commentCheckName',
      payload: {}
    });
    // if (lsyybz.isAdd) {
    //   dispatch({
    //     type: 'lsyybz/addComment',
    //     payload: {

    //     }
    //   });

    // } else {
    //   dispatch({
    //     type: 'lsyybz/updateComment',
    //     payload: {

    //     }
    //   });

    // }

    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        modalVisible: false
      }
    });

  }

  const modalOpts = {
    title: lsyybz.isAdd ? "新增原因备注" : "编辑原因备注",
    visible,
    onOk: handleOk,
    onCancel,
    currentItem,
    okText: "确定",
    cancelText: "取消",
    destroyOnClose: true,

  };

  function changeemaildisabled() {

    document.getElementsByName('email')[0].disabled = false;

  }

  const dateFormat = 'YYYY-MM-DD';

  function ontimechange(date, dateString) {
    dispatch({ type: 'order/updateOrderTime', payload: { ordertime1: dateString[0], ordertime2: dateString[0] } });
  }

  function onInputChange(e) {

    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        comment: e.target.value,
      }
    });

  }

  function onSelectChange(e) {

    dispatch({
      type: 'lsyybz/updatePayload',
      payload: {
        commentType: e,
      }
    });

  }

  return (
    <Modal {...modalOpts} >


      <div className={styles.pay}>
        <Form className={styles.formwidth} >
          <FormItem
            {...formItemLayout}
            label="备注"

          >
            {getFieldDecorator('express', {
              initialValue: lsyybz.commentType,
              rules: [
                { required: false, message: '请选择分类' }
              ]
            })(
              <Select placeholder="请选择" onChange={onSelectChange} >
                {children}
              </Select>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注原因"

          >
            {getFieldDecorator('express_number', {
              initialValue: lsyybz.comment,
              rules: [{
                required: true, message: '请输入备注名称',
              }],
            })(
              <Input onChange={onInputChange} />
              )}
          </FormItem>
        </Form>

      </div>
    </Modal>
  );
};

ReasonAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(ReasonAddModal);
