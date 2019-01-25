import React, { PropTypes } from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './LabelAddModal.less';
import Popconfirm from 'antd/lib/popconfirm';

const FormItem = Form.Item;

import LabelDetailAddModal from './LabelDetailAddModal';
const RangePicker = DatePicker.RangePicker;
import moment from 'moment';
import Radio from 'antd/lib/radio';

import Table from 'antd/lib/table';
const RadioGroup = Radio.Group;
const CpdwAddModal = ({

  visible,
  onOk,
  onCancel,
  currentItem,
  dispatch, lslabel,
}) => {


    function managerHandle(record, index) {

        var handlebtn = [];

        handlebtn.push(<span key={index} ><a onClick={() => {
            dispatch({
                type: 'lslabel/updatePayload',
                payload:{
                    modalDetailVisible:true,
                    detailName:record.name,
                    detailId:record.id,
                    isDetailAdd:false,
                }
            });
        }}>编辑</a>
          <span className="ant-divider" />
          <Popconfirm okText="确定" cancelText="取消" title="确定要删除吗？" onConfirm={() => {
              dispatch({
                  type: 'lslabel/deleteLabelDetail',
                  payload:{
                      id:record.id,
                  }
              });
          }}>
        <a>删除</a>
      </Popconfirm>
             <span className="ant-divider" />
          <Popconfirm okText="确定" cancelText="取消" title="确定要设置为默认吗？" onConfirm={() => {

              dispatch({
                  type: 'lslabel/detailIsDefault',
                  payload:{
                      id:record.id,
                  }
              });
          }}>
        <a>设为默认</a>
      </Popconfirm>

    </span>)

        return handlebtn;
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
            title: '标签名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '是否默认',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: (text, record, index) => {

                let isDefaultText = '是';
                if (record.isDefault == 0){
                    isDefaultText = '否';
                }
                return isDefaultText
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

    function addSubLabelClick() {

        dispatch({ type: 'lslabel/updatePayload', payload: { modalDetailVisible: true, detailId:'',detailName: '',isDetailAdd:true}});

    }

    const LabelDetailAddModalProps = {
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

    return (

      <div className={styles.search}>
          <Form className={styles.formwidth} >

          </Form>
          <Button type = 'primary' disabled = {lslabel.detailList.length >=3?true:false} style={{ marginLeft: 10, marginTop: 20,marginBottom:20 }} onClick={addSubLabelClick}>新建标签</Button>
          <Button type = 'primary' style={{float:'right', marginRight: 10, marginTop: 20,marginBottom:20 }} onClick={()=>{
              window.history.back();
          }}>返回</Button>
          <Table className={styles.table}
                 columns={columns}
                 dataSource={lslabel.detailList}
                 rowKey={record => record.id}
                 pagination={false}
                 bordered />

          <LabelDetailAddModal  {...LabelDetailAddModalProps} />
      </div>

  );
};

CpdwAddModal.propTypes = {
  visible: PropTypes.any,
  item: PropTypes.object,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default Form.create()(CpdwAddModal);
