import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Table from 'antd/lib/table';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './JfgzAddModal.less';

const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

const XfjlAddModal = ({
                          xfjlVisible,
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
                          jfgz,
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

    function handleOk() {
        dispatch({
            type: 'jfgz/updatePayload',
            payload:{xfjlVisible:false}
        });
    }
    const columns = [
        {
            title: '时间',
            dataIndex: 'createtime',
            key: 'createtime',

        }, {
            title: '消费',
            dataIndex: 'cash',
            key: 'cash',
        }, {
            title: ' 记录',
            dataIndex: 'desc',
            key: 'desc',
        }


    ];
const {xfjlData}=jfgz
    const modalOpts = {
        title: "消费记录",
        visible:xfjlVisible,
        onOk: handleOk,
        onCancel,
        currentItem,
        okText:"确定",
        cancelText:"取消"

    };

    return (
        <Modal {...modalOpts} visible={xfjlVisible}  onCancel={handleOk} afterClose={() => {
        }}
               footer={[
                   <Button key="back" onClick={handleOk}>取消</Button>,
                   <Button key="submit" type="primary" onClick={handleOk}>确认</Button>
               ]}>

            <div className={styles.pay}>
                <Table
                    columns={columns}
                    dataSource={xfjlData}
                    bordered/>
            </div>
        </Modal>
    )
        ;
};

XfjlAddModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};

export default Form.create()(XfjlAddModal);
