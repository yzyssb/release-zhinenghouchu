import React, {PropTypes} from 'react';

import Modal from 'antd/lib/modal';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import Select from 'antd/lib/select';
import Checkbox from 'antd/lib/checkbox';
import Button from 'antd/lib/button';
import DatePicker from 'antd/lib/date-picker';
import styles from './JfgzAddModal.less';
import Radio from 'antd/lib/radio';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const RangePicker = DatePicker.RangePicker;
import moment from 'moment';

const czgzAddModal = ({

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
                          czgz,
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

    czgz.commentTypes.map((i, j) => {

        children.push(
            <Option key={i.value}>{i.key}</Option>
        )

    })


    function handleOk() {

        if (czgz.isAdd) {
            dispatch({
                type: 'czgz/addComment',
                payload: {}
            });

        } else {
            dispatch({
                type: 'czgz/updateComment',
                payload: {}
            });

        }

        dispatch({
            type: 'czgz/updatePayload',
            payload: {
                modalVisible: false
            }
        });

    }

    const modalOpts = {
        title: "充值规则",
        visible,
        onOk: handleOk,
        onCancel,
        currentItem,
        okText:"确定",
        cancelText:"取消"

    };
    function radioChange(item){

    }
    function changeemaildisabled() {

        document.getElementsByName('email')[0].disabled = false;

    }

    const dateFormat = 'YYYY-MM-DD';

    function ontimechange(date, dateString) {
        dispatch({type: 'order/updateOrderTime', payload: {ordertime1: dateString[0], ordertime2: dateString[1]}});
    }

    function onInputChange(e) {

        dispatch({
            type: 'czgz/updatePayload',
            payload: {
                comment: e.target.value,
            }
        });

    }

    function onSelectChange(e) {

        dispatch({
            type: 'czgz/updatePayload',
            payload: {
                commentType: e,
            }
        });

    }

    var comment = '';
    czgz.commentTypes.map((i, j) => {

        if (czgz.commentType == i.value) {
            comment = i.key;
        }

    })

    return (
        <Modal {...modalOpts} >


            <div className={styles.pay}>

                <form>
                    <FormItem>
                        <span style={{marginRight: 20, marginLeft: 20}}>充值规则</span>
                        <Button type="primary"  >添加规则</Button>
                    </FormItem>
                    <FormItem>
                        <span style={{marginRight: 5, marginLeft: 20}}>充值</span>
                        <Input style = {{marginLeft:5, width:50}} />
                        <span >送</span>
                        <Input style = {{marginLeft:20, width:50}} />
                        <span>元</span>
                    </FormItem>
                    <FormItem>
                        <span style={{marginRight: 20, marginLeft: 20}}>储值使用规则</span>
                        <RadioGroup value="1" onChange={radioChange} >
                            <Radio value="1">先本金</Radio>
                            <Radio value="2">先赠送</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <Checkbox>
                        </Checkbox>
                        <span>【消费按照储值来扣费[消费金额*(充值金额/总金额)+消费金额*](赠送金额/总金额)】</span>
                    </FormItem>
                </form>
            </div>
        </Modal>
    )
        ;
};

czgzAddModal.propTypes = {
    visible: PropTypes.any,
    item: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
};


export default Form.create()(czgzAddModal);
