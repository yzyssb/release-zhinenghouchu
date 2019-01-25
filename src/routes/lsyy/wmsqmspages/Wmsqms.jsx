import React, { PropTypes } from 'react';
import Header from '../../../components/Header';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import TreeSelect from "antd/lib/tree-select"
import Switch from "antd/lib/switch";

import Select from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import Transfer from 'antd/lib/transfer';
import Checkbox from 'antd/lib/checkbox';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';

import moment from 'moment';
import message from 'antd/lib/message';


const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm; //确认对话框
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { Option, OptGroup } = Select;


// form表单   
const FormDetail = ({
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    }, dispatch, wmsqmsConfig, reset
}) => {



    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 8 },
    };


    // 改变状态请求接口
    function changeSwitch(e) {
        dispatch({
            type: "wmsqmsConfig/changeChecked",
            payload: { state: e ? 0 : 1 }
        })
    }


    return (
        <div>
            <div><span>*手动授权请将需开通的门店资料提交给美团人员，由美团人员办理开通；自助授权可在本系统中直接完成授权；</span></div>             
            <Form style={{ padding: "20px" }} id="cjzhForm">

                <Form.Item  {...formItemLayout} label="美团外卖授权模式">
                    <Switch checked={wmsqmsConfig.checked} checkedChildren="手动" unCheckedChildren="线上" onChange={changeSwitch} />
                </Form.Item>
            </Form>


        </div>


    );

}

FormDetail.propTypes = {
    form: PropTypes.object.isRequired,
    onSearch: PropTypes.func,
    onAdd: PropTypes.func,
    field: PropTypes.string,
    keyword: PropTypes.string,
};


const FormDetailContainer = Form.create()(FormDetail);


// ========================================================以上是表单部分==========================================================

function FormPage({ menu, dispatch, wmsqmsConfig }) {
    const HeaderProps = {
        menu,
        dispatch,
    };

    return (
        <Header {...HeaderProps}>
            <FormDetailContainer dispatch={dispatch} wmsqmsConfig={wmsqmsConfig} />
        </Header>
    );
}

FormPage.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({ menu, wmsqmsConfig }) {
    return { menu, wmsqmsConfig };
}

export default connect(mapStateToProps)(FormPage);

