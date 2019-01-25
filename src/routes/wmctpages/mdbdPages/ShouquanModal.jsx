import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Table from 'antd/lib/table';
import Radio from 'antd/lib/radio';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Form from 'antd/lib/form';
import Icon from 'antd/lib/icon';
import Input from 'antd/lib/input';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { Select, DatePicker, Modal } from 'antd';
import moment from 'moment';
import message from 'antd/lib/message';


// const dateFormat = 'YYYY-MM-DD';


const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


const RadioGroup = Radio.Group;
const FormItem = Form.Item;


// form表单
const shouquanModal
    = ({
        form: {
            getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        }, dispatch, mdbdConfig
    }) => {


        // modal点击取消,清空版本列表
        function modalCancel(e) {
            dispatch({
                type: "mdbdConfig/updatePayload",
                payload: {
                    shouquanModalVisible: false, shouquanPageUrl: "", //重置iframe中美团页面请求地址
                }
            });

            // 重新调取门店状态
            dispatch({
                type: 'mdbdConfig/getMenDianStatus',
                payload: {}
            });


        }


        return (
            <Modal
                title="绑定"
                visible={mdbdConfig.shouquanModalVisible}
                onCancel={modalCancel}
                onOk={modalCancel}
                width={1200}
                footer={null}
            >
                {mdbdConfig.shouquanPageUrl != "" &&
                    <iframe id="child" frameBorder={0} width="100%" height="420px" scrolling="yes" src={mdbdConfig.shouquanPageUrl}></iframe>}
            </Modal>

        );

    }

shouquanModal
    .propTypes = {
        form: PropTypes.object.isRequired,
        onSearch: PropTypes.func,
        onAdd: PropTypes.func,
        field: PropTypes.string,
        keyword: PropTypes.string,
    };


export default Form.create()(shouquanModal
);
